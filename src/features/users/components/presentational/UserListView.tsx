import { memo } from "react";

import type { UserDirectoryFiltersType } from "../../hooks/useUserDirectory";
import type { UserType } from "../../types/user.types";
import { UserFilters } from "./UserFilters";
import { UserResults } from "./UserResults";

type SelectOptionType = { value: string; label: string };

interface UserListViewProps {
	filters: UserDirectoryFiltersType;
	roleOptions: SelectOptionType[];
	statusOptions: SelectOptionType[];
	genderOptions: SelectOptionType[];
	users: UserType[];
	loading: boolean;
	error: string | null;
	onSearchChange: (value: string) => void;
	onRoleChange: (value: string) => void;
	onStatusChange: (value: string) => void;
	onGenderChange: (value: string) => void;
	onClearFilters: () => void;
	onToggleStatus: (id: string) => void;
}

export const UserListView = memo(
	({
		filters,
		roleOptions,
		statusOptions,
		genderOptions,
		users,
		loading,
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
				className="max-w-7xl mx-auto"
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
					loading={loading}
					error={error}
					onToggleStatus={onToggleStatus}
				/>
			</section>
		);
	},
);

UserListView.displayName = "UserListView";
