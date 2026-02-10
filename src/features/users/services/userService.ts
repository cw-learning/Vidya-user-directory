import { API_CONFIG, API_ENDPOINTS } from "../../../constants/apiEndpoints";
import type { UserRoleType } from "../../../constants/userRoles";
import { USER_ROLES } from "../../../constants/userRoles";
import type { UserStatusType } from "../../../constants/userStatus";
import { USER_STATUS } from "../../../constants/userStatus";
import { UserGenderType, type UserType } from "../types/user.types";
import type {
	JsonPlaceholderApiResponseType,
	JsonPlaceholderUserType,
	UserFiltersType,
} from "./userService.types";

const AVAILABLE_ROLES: UserRoleType[] = Object.values(USER_ROLES);

const AVAILABLE_STATUSES: UserStatusType[] = Object.values(USER_STATUS);

/**
 * Generates a deterministic index based on UUID
 * @param uuid - The user's UUID
 * @param length - The length of the array to choose from
 * @returns A deterministic index
 */
const getDeterministicIndex = (uuid: string, length: number): number => {
	let hash = 0;
	for (let i = 0; i < uuid.length; i++) {
		const char = uuid.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return Math.abs(hash) % length;
};

/**
 * Maps a JSON Placeholder user to our internal User type
 * @param user - The raw user data from JSON Placeholder API
 * @returns Mapped User object with our internal structure
 */
const mapJsonPlaceholderUserToUser = (
	user: JsonPlaceholderUserType,
): UserType => {
	const nameParts = user.name.split(" ");
	const first = nameParts[0] || "Unknown";
	const last = nameParts.slice(1).join(" ") || "User";

	const role =
		AVAILABLE_ROLES[
			getDeterministicIndex(user.id.toString(), AVAILABLE_ROLES.length)
		] ?? USER_ROLES.ADMIN;

	const status =
		AVAILABLE_STATUSES[
			getDeterministicIndex(`${user.id}status`, AVAILABLE_STATUSES.length)
		] ?? USER_STATUS.ACTIVE;

	const gender =
		getDeterministicIndex(`${user.id}gender`, 2) === 0
			? UserGenderType.MALE
			: UserGenderType.FEMALE;
	return {
		id: user.id.toString(),
		name: { first, last },
		email: user.email,
		gender: gender,
		location: { city: user.address.city, country: "Unknown" },
		role: role,
		status: status,
	};
};

/**
 * Validates that the API response has the expected structure
 * @param data - The raw API response data
 * @returns True if valid, throws error if invalid
 */
const validateApiResponse = (
	data: unknown,
): data is JsonPlaceholderApiResponseType => {
	if (!Array.isArray(data)) {
		throw new Error("Invalid API response: not an array");
	}

	for (const user of data) {
		if (!user || typeof user !== "object") {
			throw new Error("Invalid API response: user items are not objects");
		}

		const u = user as Record<string, unknown>;
		if (typeof u.id !== "number") {
			throw new Error("Invalid API response: missing or invalid id");
		}

		if (typeof u.name !== "string") {
			throw new Error("Invalid API response: missing or invalid name");
		}

		if (typeof u.email !== "string") {
			throw new Error("Invalid API response: missing or invalid email");
		}

		if (!u.address || typeof u.address !== "object") {
			throw new Error("Invalid API response: missing or invalid address");
		}
		const address = u.address as Record<string, unknown>;
		if (typeof address.city !== "string") {
			throw new Error("Invalid API response: missing or invalid address.city");
		}
	}

	return true;
};

/**
 * Fetches users from the JSON Placeholder API
 * @returns Promise resolving to array of User objects
 * @throws Error if API request fails, times out, or returns invalid data
 */
const fetchUsersFromApi = async (): Promise<UserType[]> => {
	const response = await fetch(API_ENDPOINTS.USERS, {
		signal: AbortSignal.timeout(API_CONFIG.REQUEST_TIMEOUT),
	});

	if (!response.ok) {
		throw new Error(`API request failed with status ${response.status}`);
	}

	const data: unknown = await response.json();

	if (!validateApiResponse(data)) {
		throw new Error("API response validation failed");
	}

	return data.map(mapJsonPlaceholderUserToUser);
};

const applyFilters = (
	users: UserType[],
	filters: UserFiltersType,
): UserType[] => {
	let filtered = users;

	const { search, role, status, gender } = filters;

	if (search) {
		const searchLower = search.toLowerCase();
		filtered = filtered.filter(
			(user) =>
				user.name.first.toLowerCase().includes(searchLower) ||
				user.name.last.toLowerCase().includes(searchLower) ||
				user.email.toLowerCase().includes(searchLower),
		);
	}

	if (role) {
		filtered = filtered.filter((user) => user.role === role);
	}

	if (status) {
		filtered = filtered.filter((user) => user.status === status);
	}

	if (gender) {
		filtered = filtered.filter((user) => user.gender === gender);
	}

	return filtered;
};

/**
 * Fetches and filters users based on provided criteria
 * @param filters - Optional filters for search, role, status, and gender
 * @returns Promise resolving to either { users: UserType[] } on success or { error: string } on failure
 */
export const fetchUsers = async (
	filters: UserFiltersType,
): Promise<{ users: UserType[] } | { error: string }> => {
	try {
		const users = await fetchUsersFromApi();
		const filteredUsers = applyFilters(users, filters);
		return { users: filteredUsers };
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Failed to fetch users";
		return { error: errorMessage };
	}
};
