import {
	type ErrorInfo,
	type FC,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

import { getRoleOptions } from "../../../../constants/userRoles";
import { USER_STATUS } from "../../../../constants/userStatus";
import { ErrorFallback } from "../../../../shared/components/ErrorFallback";
import { fetchUsers } from "../../services/userService";
import type { UserType } from "../../types/user.types";
import { UserGenderType } from "../../types/user.types";
import type { UserDirectoryFiltersType } from "../../types/userDirectoryFilters.types";
import { UserListView } from "../presentational/UserListView";
import { UserSkeletonGrid } from "../presentational/UserSkeletonGrid";

const initialFilters: UserDirectoryFiltersType = {
	search: "",
	role: "",
	status: "",
	gender: "",
};

const UserListContent: FC = () => {
	const { showBoundary } = useErrorBoundary();

	const [users, setUsers] = useState<UserType[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] =
		useState<UserDirectoryFiltersType>(initialFilters);

	useEffect(() => {
		const loadUsers = async () => {
			setLoading(true);
			setError(null);

			try {
				const result = await fetchUsers({});

				if ("error" in result) {
					setUsers([]);
					setError(result.error);
				} else {
					setUsers(result.users);
				}
			} catch (fetchError) {
				showBoundary(fetchError);
			} finally {
				setLoading(false);
			}
		};

		loadUsers();
	}, [showBoundary]);

	const filteredUsers = useMemo(() => {
		let filtered = users;

		if (filters.search) {
			const searchLower = filters.search.toLowerCase();
			filtered = filtered.filter(
				(user) =>
					user.name.first.toLowerCase().includes(searchLower) ||
					user.name.last.toLowerCase().includes(searchLower) ||
					user.email.toLowerCase().includes(searchLower),
			);
		}

		if (filters.role) {
			filtered = filtered.filter((user) => user.role === filters.role);
		}

		if (filters.status) {
			filtered = filtered.filter((user) => user.status === filters.status);
		}

		if (filters.gender) {
			filtered = filtered.filter((user) => user.gender === filters.gender);
		}

		return filtered;
	}, [users, filters]);

	const handleSearchChange = useCallback((searchText: string) => {
		setFilters((previousFilters) => ({
			...previousFilters,
			search: searchText,
		}));
	}, []);

	const handleRoleChange = useCallback(
		(nextRole: UserDirectoryFiltersType["role"]) => {
			setFilters((previousFilters) => ({
				...previousFilters,
				role: nextRole,
			}));
		},
		[],
	);

	const handleStatusChange = useCallback(
		(nextStatus: UserDirectoryFiltersType["status"]) => {
			setFilters((previousFilters) => ({
				...previousFilters,
				status: nextStatus,
			}));
		},
		[],
	);

	const handleGenderChange = useCallback(
		(nextGender: UserDirectoryFiltersType["gender"]) => {
			setFilters((previousFilters) => ({
				...previousFilters,
				gender: nextGender,
			}));
		},
		[],
	);

	const handleClearFilters = useCallback(() => {
		setFilters(initialFilters);
	}, []);

	const handleToggleUserStatus = useCallback((userId: string) => {
		setUsers((currentUsers) =>
			currentUsers.map((user) =>
				user.id === userId
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
	}, []);

	const roleOptions = useMemo(
		() => [{ value: "" as const, label: "All Roles" }, ...getRoleOptions()],
		[],
	);

	const statusOptions = useMemo(
		() => [
			{ value: "" as const, label: "All Statuses" },
			{ value: USER_STATUS.ACTIVE, label: "Active" },
			{ value: USER_STATUS.INACTIVE, label: "Inactive" },
			{ value: USER_STATUS.PENDING, label: "Pending" },
		],
		[],
	);

	const genderOptions = useMemo(
		() => [
			{ value: "" as const, label: "All Genders" },
			{ value: UserGenderType.MALE, label: "Male" },
			{ value: UserGenderType.FEMALE, label: "Female" },
		],
		[],
	);

	if (loading) {
		return <UserSkeletonGrid />;
	}

	return (
		<UserListView
			filters={filters}
			roleOptions={roleOptions}
			statusOptions={statusOptions}
			genderOptions={genderOptions}
			users={filteredUsers}
			error={error}
			onSearchChange={handleSearchChange}
			onRoleChange={handleRoleChange}
			onStatusChange={handleStatusChange}
			onGenderChange={handleGenderChange}
			onClearFilters={handleClearFilters}
			onToggleStatus={handleToggleUserStatus}
		/>
	);
};

const handleBoundaryError = (error: unknown, errorInfo: ErrorInfo) => {
	console.error("[ErrorBoundary] Caught error:", error);
	console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
};

export const UserListContainer: FC = () => {
	const [retryKey, setRetryKey] = useState<number>(0);

	const handleReset = useCallback(() => {
		setRetryKey((previousKey) => previousKey + 1);
	}, []);

	return (
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onReset={handleReset}
			resetKeys={[retryKey]}
			onError={handleBoundaryError}
		>
			<UserListContent key={retryKey} />
		</ErrorBoundary>
	);
};
