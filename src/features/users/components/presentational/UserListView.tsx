import { memo } from "react";
import type { UserType } from "../../types/user.types";
import type { UserDirectoryFiltersType } from "../../types/userDirectoryFilters.types";
import type { SelectOptionType } from "./UserFilters";
import { UserFilters } from "./UserFilters";
import { UserResults } from "./UserResults";

export type UserListViewProps = {
	filters: UserDirectoryFiltersType;
	roleOptions: SelectOptionType<UserDirectoryFiltersType["role"]>[];
	statusOptions: SelectOptionType<UserDirectoryFiltersType["status"]>[];
	genderOptions: SelectOptionType<UserDirectoryFiltersType["gender"]>[];
	users: UserType[];
	error: string | null;
	onFilterChange: <K extends keyof UserDirectoryFiltersType>(
		field: K,
		value: UserDirectoryFiltersType[K],
	) => void;
	onClearFilters: () => void;
	onToggleStatus: (id: UserType["id"]) => void;
};

const userListSectionClassName = "max-w-7xl mx-auto";

export const UserListView = memo(
	({
		filters,
		roleOptions,
		statusOptions,
		genderOptions,
		users,
		error,
		onFilterChange,
		onClearFilters,
		onToggleStatus,
	}: UserListViewProps) => {
		return (
			<section className={userListSectionClassName} aria-label="User directory">
				<UserFilters
					filters={filters}
					roleOptions={roleOptions}
					statusOptions={statusOptions}
					genderOptions={genderOptions}
					onFilterChange={onFilterChange}
					onClearFilters={onClearFilters}
				/>
				<UserResults
					users={users}
					error={error}
					onToggleStatus={onToggleStatus}
				/>
			</section>
		);
	},
);

UserListView.displayName = "UserListView";
