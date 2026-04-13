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
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
	clearFilters,
	loadUsers,
	selectError,
	selectFilteredUsers,
	selectFilters,
	selectLoading,
	setGender,
	setRole,
	setSearch,
	setStatus,
	toggleUserStatus,
} from "../../store/userSlice";
import type { UserDirectoryFiltersType } from "../../types/userDirectoryFilters.types";
import { UserGenderType, type UserType } from "../../types/user.types";
import { UserListView } from "../presentational/UserListView";
import { UserSkeletonGrid } from "../presentational/UserSkeletonGrid";

const UserListContent: FC = () => {
	const { showBoundary } = useErrorBoundary();
	const dispatch = useAppDispatch();

	const users = useAppSelector(selectFilteredUsers);
	const loading = useAppSelector(selectLoading);
	const error = useAppSelector(selectError);
	const filters = useAppSelector(selectFilters);
	type FilterFieldKey = keyof UserDirectoryFiltersType;

	useEffect(() => {
		let isMounted = true;

		const loadData = async () => {
			const resultAction = await dispatch(loadUsers());

			if (!isMounted) {
				return;
			}

			if (
				loadUsers.rejected.match(resultAction) &&
				!resultAction.meta.condition &&
				!resultAction.meta.aborted &&
				resultAction.payload === undefined
			) {
				showBoundary(resultAction.error);
			}
		};

		void loadData();

		return () => {
			isMounted = false;
		};
	}, [dispatch, showBoundary]);

	const handleFilterChange = useCallback(
		(field: FilterFieldKey, value: string) => {
			switch (field) {
				case "search":
					dispatch(setSearch(value));
					break;
				case "role":
					dispatch(setRole(value));
					break;
				case "status":
					dispatch(setStatus(value));
					break;
				case "gender":
					dispatch(setGender(value));
					break;
			}
		},
		[dispatch],
	);

	const handleSearchChange = useCallback(
		(searchText: string) => {
			handleFilterChange("search", searchText);
		},
		[handleFilterChange],
	);

	const handleRoleChange = useCallback(
		(nextRole: UserDirectoryFiltersType["role"]) => {
			handleFilterChange("role", nextRole);
		},
		[handleFilterChange],
	);

	const handleStatusChange = useCallback(
		(nextStatus: UserDirectoryFiltersType["status"]) => {
			handleFilterChange("status", nextStatus);
		},
		[handleFilterChange],
	);

	const handleGenderChange = useCallback(
		(nextGender: UserDirectoryFiltersType["gender"]) => {
			handleFilterChange("gender", nextGender);
		},
		[handleFilterChange],
	);

	const handleClearFilters = useCallback(() => {
		dispatch(clearFilters());
	}, [dispatch]);

	const handleToggleUserStatus = useCallback(
		(userId: UserType["id"]) => {
			dispatch(toggleUserStatus(userId));
		},
		[dispatch],
	);

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
			users={users}
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
