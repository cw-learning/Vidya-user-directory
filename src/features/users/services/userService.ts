import { API_CONFIG, API_ENDPOINTS } from "../../../constants/apiEndpoints";
import type { UserRoleType } from "../../../constants/userRoles";
import { USER_ROLES } from "../../../constants/userRoles";
import { USER_STATUS } from "../../../constants/userStatus";
import type { UserType } from "../types/user.types";
import type {
	RandomUserApiResponseType,
	RandomUserResultType,
	UserFiltersType,
} from "./userService.types";

const AVAILABLE_ROLES: UserRoleType[] = Object.values(USER_ROLES);

const AVAILABLE_STATUSES: (typeof USER_STATUS)[keyof typeof USER_STATUS][] =
	Object.values(USER_STATUS);

const getRandomItem = <T>(items: readonly T[]): T => {
	if (items.length === 0) {
		throw new Error("Cannot get random item from empty array");
	}
	const randomIndex = Math.floor(Math.random() * items.length);
	const item = items[randomIndex];
	if (item === undefined) {
		throw new Error("Unexpected undefined item in array");
	}
	return item;
};

/**
 * Maps a Random User API result to our internal User type
 * @param user - The raw user data from Random User API
 * @returns Mapped User object with our internal structure
 */
const mapRandomUserToUser = (user: RandomUserResultType): UserType => {
	return {
		id: user.login.uuid,
		name: user.name,
		email: user.email,
		gender: user.gender,
		location: { city: user.location.city, country: user.location.country },
		picture: { thumbnail: user.picture.thumbnail },
		role: getRandomItem(AVAILABLE_ROLES),
		status: getRandomItem(AVAILABLE_STATUSES),
		registered: user.registered,
	};
};

/**
 * Validates that the API response has the expected structure
 * @param data - The raw API response data
 * @returns True if valid, throws error if invalid
 */
const validateApiResponse = (
	data: unknown,
): data is RandomUserApiResponseType => {
	if (!data || typeof data !== "object") {
		throw new Error("Invalid API response: not an object");
	}

	const response = data as Record<string, unknown>;

	if (!Array.isArray(response.results)) {
		throw new Error("Invalid API response: results is not an array");
	}

	// Validate first result structure if array is not empty
	if (response.results.length > 0) {
		const firstResult = response.results[0];
		if (!firstResult || typeof firstResult !== "object") {
			throw new Error("Invalid API response: result items are not objects");
		}

		const result = firstResult as Record<string, unknown>;
		if (!result.login || !result.name || !result.email) {
			throw new Error("Invalid API response: missing required user fields");
		}
	}

	return true;
};

/**
 * Fetches users from the Random User API
 * @returns Promise resolving to array of User objects
 * @throws Error if API request fails, times out, or returns invalid data
 */
const fetchUsersFromApi = async (): Promise<UserType[]> => {
	const response = await fetch(
		`${API_ENDPOINTS.RANDOM_USER}?results=${API_CONFIG.ATHLETES_FETCH_COUNT}`,
		{
			signal: AbortSignal.timeout(API_CONFIG.REQUEST_TIMEOUT),
		},
	);

	if (!response.ok) {
		throw new Error(`API request failed with status ${response.status}`);
	}

	const data: unknown = await response.json();

	if (!validateApiResponse(data)) {
		throw new Error("API response validation failed");
	}

	return data.results.map(mapRandomUserToUser);
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
