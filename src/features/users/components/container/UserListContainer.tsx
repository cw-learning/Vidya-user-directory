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
import { filterUsers, useUserStore } from "../../hooks/useUserStore";
import { UserGenderType } from "../../types/user.types";
import { UserListView } from "../presentational/UserListView";
import { UserSkeletonGrid } from "../presentational/UserSkeletonGrid";

const UserListContent: FC = () => {
	const { showBoundary } = useErrorBoundary();

	const users = useUserStore((state) => state.users);
	const loading = useUserStore((state) => state.loading);
	const error = useUserStore((state) => state.error);
	const filters = useUserStore((state) => state.filters);
	const loadUsers = useUserStore((state) => state.loadUsers);
	const setSearch = useUserStore((state) => state.setSearch);
	const setRole = useUserStore((state) => state.setRole);
	const setStatus = useUserStore((state) => state.setStatus);
	const setGender = useUserStore((state) => state.setGender);
	const clearFilters = useUserStore((state) => state.clearFilters);
	const toggleUserStatus = useUserStore((state) => state.toggleUserStatus);

	useEffect(() => {
		loadUsers().catch(showBoundary);
	}, [loadUsers, showBoundary]);
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

	const filteredUsers = useMemo(
		() => filterUsers(users, filters),
		[users, filters],
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
			onSearchChange={setSearch}
			onRoleChange={setRole}
			onStatusChange={setStatus}
			onGenderChange={setGender}
			onClearFilters={clearFilters}
			onToggleStatus={toggleUserStatus}
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
