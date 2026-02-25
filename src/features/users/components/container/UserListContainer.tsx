import type { FC } from "react";
import { useCallback, useMemo } from "react";

import type { UserRoleType } from "../../../../constants/userRoles";
import { getRoleOptions } from "../../../../constants/userRoles";
import type { UserStatusType } from "../../../../constants/userStatus";
import { USER_STATUS } from "../../../../constants/userStatus";
import { useUserDirectory } from "../../hooks/useUserDirectory";
import type { UserGenderType } from "../../types/user.types";
import { UserListView } from "../presentational/UserListView";

export const UserListContainer: FC = () => {
	const {
		users,
		loading,
		error,
		filters,
		setSearchFilter,
		setRoleFilter,
		setStatusFilter,
		setGenderFilter,
		clearFilters,
		toggleUserStatus,
	} = useUserDirectory();

	const handleRoleChange = useCallback(
		(value: string) => setRoleFilter(value as UserRoleType | ""),
		[setRoleFilter],
	);

	const handleStatusChange = useCallback(
		(value: string) => setStatusFilter(value as UserStatusType | ""),
		[setStatusFilter],
	);

	const handleGenderChange = useCallback(
		(value: string) => setGenderFilter(value as UserGenderType | ""),
		[setGenderFilter],
	);

	const roleOptions = useMemo(
		() => [{ value: "", label: "All Roles" }, ...getRoleOptions()],
		[],
	);

	const statusOptions = useMemo(
		() => [
			{ value: "", label: "All Statuses" },
			{ value: USER_STATUS.ACTIVE, label: "Active" },
			{ value: USER_STATUS.INACTIVE, label: "Inactive" },
			{ value: USER_STATUS.PENDING, label: "Pending" },
		],
		[],
	);

	const genderOptions = useMemo(
		() => [
			{ value: "", label: "All Genders" },
			{ value: "male", label: "Male" },
			{ value: "female", label: "Female" },
		],
		[],
	);

	return (
		<UserListView
			filters={filters}
			roleOptions={roleOptions}
			statusOptions={statusOptions}
			genderOptions={genderOptions}
			users={users}
			loading={loading}
			error={error}
			onSearchChange={setSearchFilter}
			onRoleChange={handleRoleChange}
			onStatusChange={handleStatusChange}
			onGenderChange={handleGenderChange}
			onClearFilters={clearFilters}
			onToggleStatus={toggleUserStatus}
		/>
	);
};
