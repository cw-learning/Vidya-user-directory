import { useCallback, useEffect, useState } from "react";
import { getRoleOptions } from "../../../constants/userRoles";
import { USER_STATUS } from "../../../constants/userStatus";
import { Button } from "../../../shared/components/Button";
import { Input } from "../../../shared/components/Input";
import { Select } from "../../../shared/components/Select";
import { fetchUsers } from "../services/userService";
import type { UserType } from "../types/user.types";
import { UserCard } from "./UserCard";

export const UserList: React.FC = () => {
	const [users, setUsers] = useState<UserType[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [search, setSearch] = useState<string>("");
	const [role, setRole] = useState<string>("");
	const [status, setStatus] = useState<string>("");
	const [gender, setGender] = useState<string>("");

	/**
	 * Fetches users data with current filter state
	 * Handles loading states and error conditions
	 */
	const fetchUsersData = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const result = await fetchUsers({ search, role, status, gender });

			if ("error" in result) {
				setError(result.error);
				setUsers([]);
			} else {
				setUsers(result.users);
			}
		} catch (error) {
			setError(`Failed to fetch users, ${String(error)}`);
			setUsers([]);
		} finally {
			setLoading(false);
		}
	}, [search, role, status, gender]);

	useEffect(() => {
		let isMounted = true;

		const loadData = async () => {
			try {
				await fetchUsersData();
			} catch (error) {
				if (isMounted) {
					setError(`Failed to fetch users, ${String(error)}`);
					setUsers([]);
					setLoading(false);
				}
			}
		};

		loadData();

		return () => {
			isMounted = false;
		};
	}, [fetchUsersData]);

	/**
	 * Toggles the status of a user between active and inactive
	 * @param id - The user ID to toggle status for
	 */
	const handleClickToggleStatus = (id: string) => {
		setUsers((prev) =>
			prev.map((user) =>
				user.id === id
					? {
							...user,
							status:
								user.status === USER_STATUS.ACTIVE
									? USER_STATUS.INACTIVE
									: USER_STATUS.ACTIVE,
						}
					: user,
			),
		);
	};

	/**
	 * Clears all filter values and resets the form
	 */
	const handleClickClearFilters = () => {
		setSearch("");
		setRole("");
		setStatus("");
		setGender("");
	};

	const roleOptions = [{ value: "", label: "All Roles" }, ...getRoleOptions()];

	const statusOptions = [
		{ value: "", label: "All Statuses" },
		{ value: USER_STATUS.ACTIVE, label: "Active" },
		{ value: USER_STATUS.INACTIVE, label: "Inactive" },
		{ value: USER_STATUS.PENDING, label: "Pending" },
	];

	const genderOptions = [
		{ value: "", label: "All Genders" },
		{ value: "male", label: "Male" },
		{ value: "female", label: "Female" },
	];

	const sectionClassName = "max-w-7xl mx-auto";
	const filtersSectionClassName =
		"bg-white/75 p-8 rounded-2xl shadow-sm border border-blue-100 mb-8";
	const filtersHeaderClassName = "flex items-center gap-4 mb-4";
	const filtersIconClassName = "p-4 bg-blue-100 rounded-lg";
	const filtersTitleClassName = "text-xl font-semibold text-gray-800";
	const filtersDescriptionClassName = "text-sm text-gray-600";
	const formClassName =
		"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4";
	const searchInputClassName = "lg:col-span-1";
	const roleSelectClassName = "lg:col-span-1";
	const statusSelectClassName = "lg:col-span-1";
	const genderSelectClassName = "lg:col-span-1";
	const buttonsContainerClassName = "lg:col-span-1 flex items-center gap-2";
	const searchButtonClassName =
		"flex-1 py-4 bg-indigo-400 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200";
	const clearButtonClassName =
		"px-4 py-4 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200";
	const resultsSectionClassName = "aria-labelledby=results-heading";
	const resultsHeaderClassName = "flex justify-between items-center mb-4";
	const resultsTitleClassName = "text-2xl font-bold text-gray-900";
	const resultsCountClassName = "text-gray-200 mt-1";
	const resultsStatusClassName =
		"flex items-center gap-2 text-sm text-gray-200";
	const statusIndicatorClassName = "w-2 h-2 bg-green-500 rounded-full";
	const errorAlertClassName =
		"bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-4";
	const errorIconClassName = "text-red-500 text-xl";
	const errorTitleClassName = "font-semibold";
	const errorMessageClassName = "text-sm";
	const loadingSpinnerClassName =
		"inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4";
	const loadingTextClassName = "text-gray-600 font-medium";
	const loadingSubtextClassName = "text-gray-400 text-sm mt-4";
	const emptyStateClassName =
		"text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200";
	const emptyStateIconClassName = "text-6xl mb-4";
	const emptyStateTitleClassName = "text-gray-500 text-xl font-medium";
	const emptyStateMessageClassName = "text-gray-400 text-sm mt-4";
	const usersGridClassName =
		"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";

	return (
		<section className={sectionClassName} aria-labelledby="user-list-heading">
			<section
				className={filtersSectionClassName}
				aria-labelledby="filters-heading"
			>
				<div className={filtersHeaderClassName}>
					<div className={filtersIconClassName}>
						<span className="text-blue-600 text-xl">🔍</span>
					</div>
					<div>
						<h3 id="filters-heading" className={filtersTitleClassName}>
							Filter & Search
						</h3>
						<p className={filtersDescriptionClassName}>
							Find users by name, role, status, or gender
						</p>
					</div>
				</div>

				<form className={formClassName}>
					<div className={searchInputClassName}>
						<Input
							label="Search Users"
							value={search}
							onChange={setSearch}
							placeholder="Name or email..."
							type="search"
						/>
					</div>

					<div className={roleSelectClassName}>
						<Select
							label="Role"
							value={role}
							onChange={setRole}
							options={roleOptions}
						/>
					</div>

					<div className={statusSelectClassName}>
						<Select
							label="Status"
							value={status}
							onChange={setStatus}
							options={statusOptions}
						/>
					</div>

					<div className={genderSelectClassName}>
						<Select
							label="Gender"
							value={gender}
							onChange={setGender}
							options={genderOptions}
						/>
					</div>

					<div className={buttonsContainerClassName}>
						<Button
							onClick={fetchUsersData}
							loading={loading}
							className={searchButtonClassName}
						>
							<span className="flex items-center justify-center gap-2">
								🔍 Search
							</span>
						</Button>
						<Button
							onClick={handleClickClearFilters}
							variant="secondary"
							className={clearButtonClassName}
						>
							Clear
						</Button>
					</div>
				</form>
			</section>

			<section className={resultsSectionClassName}>
				<header className={resultsHeaderClassName}>
					<div>
						<h3 id="results-heading" className={resultsTitleClassName}>
							Users
						</h3>
						<p className={resultsCountClassName}>
							{users.length} {users.length === 1 ? "user" : "users"} found
						</p>
					</div>
					{!loading && !error && users.length > 0 && (
						<div className={resultsStatusClassName}>
							<span className={statusIndicatorClassName}></span>
							Updated just now
						</div>
					)}
				</header>

				{error && (
					<div role="alert" className={errorAlertClassName}>
						<span className={errorIconClassName}>⚠️</span>
						<div>
							<p className={errorTitleClassName}>Error loading users</p>
							<p className={errorMessageClassName}>{error}</p>
						</div>
					</div>
				)}

				{loading && (
					<div aria-live="polite" className="text-center py-16">
						<div className={loadingSpinnerClassName}></div>
						<p className={loadingTextClassName}>Loading users...</p>
						<p className={loadingSubtextClassName}>Fetching data from server</p>
					</div>
				)}

				{!loading && !error && users.length === 0 && (
					<div className={emptyStateClassName}>
						<div className={emptyStateIconClassName}>👤</div>
						<p className={emptyStateTitleClassName}>No users found</p>
						<p className={emptyStateMessageClassName}>
							Try adjusting your filters or search terms
						</p>
					</div>
				)}

				{!loading && !error && users.length > 0 && (
					<div className={usersGridClassName}>
						{users.map((user) => (
							<UserCard
								key={user.id}
								user={user}
								onToggleStatus={handleClickToggleStatus}
							/>
						))}
					</div>
				)}
			</section>
		</section>
	);
};
