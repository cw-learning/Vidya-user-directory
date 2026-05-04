import { USER_STATUS } from "../../../constants/userStatus";
import type { UserType } from "../types/user.types";
import type { UserDirectoryFiltersType } from "../types/userDirectoryFilters.types";

export function filterUsers(
	users: UserType[],
	filters: Partial<UserDirectoryFiltersType>,
): UserType[] {
	let filteredUsers = users;
	const searchTerm = filters.search?.trim().toLowerCase() ?? "";

	if (searchTerm) {
		filteredUsers = filteredUsers.filter(
			(user) =>
				user.name.first.toLowerCase().includes(searchTerm) ||
				user.name.last.toLowerCase().includes(searchTerm) ||
				user.email.toLowerCase().includes(searchTerm),
		);
	}

	if (filters.role) {
		filteredUsers = filteredUsers.filter((user) => user.role === filters.role);
	}

	if (filters.status) {
		filteredUsers = filteredUsers.filter(
			(user) => user.status === filters.status,
		);
	}

	if (filters.gender) {
		filteredUsers = filteredUsers.filter(
			(user) => user.gender === filters.gender,
		);
	}

	return filteredUsers;
}

export function getToggledUserStatus(
	currentStatus: UserType["status"],
): UserType["status"] {
	return currentStatus === USER_STATUS.ACTIVE
		? USER_STATUS.INACTIVE
		: USER_STATUS.ACTIVE;
}
