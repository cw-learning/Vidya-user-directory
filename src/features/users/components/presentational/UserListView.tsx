import { memo } from "react";

import type { UserDirectoryFiltersType } from "../../types/userDirectoryFilters.types";
import type { UserType } from "../../types/user.types";
import type { SelectOptionType } from "./UserFilters";
import { UserFilters } from "./UserFilters";
import { UserResults } from "./UserResults";

export type UserListViewProps = {
	filters: UserDirectoryFiltersType;
	roleOptions: SelectOptionType[];
	statusOptions: SelectOptionType[];
	genderOptions: SelectOptionType[];
	users: UserType[];
	error: string | null;
	onSearchChange: (value: string) => void;
	onRoleChange: (value: string) => void;
	onStatusChange: (value: string) => void;
	onGenderChange: (value: string) => void;
	onClearFilters: () => void;
	onToggleStatus: (id: string) => void;
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
		onSearchChange,
		onRoleChange,
		onStatusChange,
		onGenderChange,
		onClearFilters,
		onToggleStatus,
	}: UserListViewProps) => {
		return (
			<section
				className={userListSectionClassName}
				aria-labelledby="user-list-heading"
			>
				<UserFilters
					filters={filters}
					roleOptions={roleOptions}
					statusOptions={statusOptions}
					genderOptions={genderOptions}
					onSearchChange={onSearchChange}
					onRoleChange={onRoleChange}
					onStatusChange={onStatusChange}
					onGenderChange={onGenderChange}
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
