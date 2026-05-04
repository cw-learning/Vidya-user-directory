import { useQueryClient } from "@tanstack/react-query";
import { type FC, useCallback, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { getRoleOptions } from "../../../../constants/userRoles";
import { USER_STATUS } from "../../../../constants/userStatus";
import { ErrorFallback } from "../../../../shared/components/ErrorFallback";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { useUsersQuery } from "../../hooks/useUsersQuery";
import { userQueryKeys } from "../../queryKeys";
import {
	clearFilters,
	selectFilters,
	setGender,
	setRole,
	setSearch,
	setStatus,
} from "../../store/userSlice";
import { UserGenderType, type UserType } from "../../types/user.types";
import type { UserDirectoryFiltersType } from "../../types/userDirectoryFilters.types";
import { filterUsers, getToggledUserStatus } from "../../utils/userFilters";
import { UserListView } from "../presentational/UserListView";
import { UserSkeletonGrid } from "../presentational/UserSkeletonGrid";

type FilterFieldKey = keyof UserDirectoryFiltersType;
type FilterActionCreator<K extends FilterFieldKey> = (
	value: UserDirectoryFiltersType[K],
) => {
	type: string;
	payload: UserDirectoryFiltersType[K];
};

const filterActionByField: {
	[K in FilterFieldKey]: FilterActionCreator<K>;
} = {
	search: setSearch,
	role: setRole,
	status: setStatus,
	gender: setGender,
};

const UserListContent: FC = () => {
	const dispatch = useAppDispatch();
	const queryClient = useQueryClient();
	const {
		data: queriedUsers = [],
		error: usersQueryError,
		isError: isUsersQueryError,
		isPending: isUsersQueryPending,
		refetch,
	} = useUsersQuery();

	const filters = useAppSelector(selectFilters);

	const users = useMemo(
		() => filterUsers(queriedUsers, filters),
		[queriedUsers, filters],
	);

	const handleFilterChange = useCallback(
		<K extends FilterFieldKey>(
			field: K,
			value: UserDirectoryFiltersType[K],
		) => {
			dispatch(filterActionByField[field](value));
		},
		[dispatch],
	);

	const handleClearFilters = useCallback(() => {
		dispatch(clearFilters());
	}, [dispatch]);

	const handleToggleUserStatus = useCallback(
		(userId: UserType["id"]) => {
			queryClient.setQueryData<UserType[]>(
				userQueryKeys.list(),
				(currentUsers = []) =>
					currentUsers.map((user) =>
						user.id === userId
							? {
									...user,
									status: getToggledUserStatus(user.status),
								}
							: user,
					),
			);
		},
		[queryClient],
	);

	const handleRetryUsers = useCallback(() => {
		void refetch();
	}, [refetch]);

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

	if (isUsersQueryPending) {
		return <UserSkeletonGrid />;
	}

	return (
		<UserListView
			filters={filters}
			roleOptions={roleOptions}
			statusOptions={statusOptions}
			genderOptions={genderOptions}
			users={users}
			error={isUsersQueryError ? usersQueryError.message : null}
			onFilterChange={handleFilterChange}
			onClearFilters={handleClearFilters}
			onToggleStatus={handleToggleUserStatus}
			onRetryUsers={handleRetryUsers}
		/>
	);
};

export const UserListContainer: FC = () => {
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<UserListContent />
		</ErrorBoundary>
	);
};
