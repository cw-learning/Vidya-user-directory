import { API_CONFIG, API_ENDPOINTS } from "../../../constants/apiEndpoints";
import type { UserRoleType } from "../../../constants/userRoles";
import { USER_ROLES } from "../../../constants/userRoles";
import type { UserStatusType } from "../../../constants/userStatus";
import { USER_STATUS } from "../../../constants/userStatus";
import type { UserType } from "../types/user.types";
import type {
	RandomUserApiResponseType,
	RandomUserResultType,
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
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash) % length;
};

/**
 * Maps a Random User API result to our internal User type
 * @param user - The raw user data from Random User API
 * @returns Mapped User object with our internal structure
 */
const mapRandomUserToUser = (user: RandomUserResultType): UserType => {
	const role =
		AVAILABLE_ROLES[
		getDeterministicIndex(user.login.uuid, AVAILABLE_ROLES.length)
		] ?? USER_ROLES.ADMIN;

	const status =
		AVAILABLE_STATUSES[
		getDeterministicIndex(
			`${user.login.uuid}status`,
			AVAILABLE_STATUSES.length,
		)
		] ?? USER_STATUS.ACTIVE;
	return {
		id: user.login.uuid,
		name: user.name,
		email: user.email,
		gender: user.gender,
		location: { city: user.location.city, country: user.location.country },
		picture: { thumbnail: user.picture.thumbnail },
		role: role,
		status: status,
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

	for (const result of response.results) {
		if (!result || typeof result !== "object") {
			throw new Error("Invalid API response: result items are not objects");
		}

		const user = result as Record<string, unknown>;
		if (!user.login || typeof user.login !== "object") {
			throw new Error("Invalid API response: missing or invalid login field");
		}
		const login = user.login as Record<string, unknown>;
		if (!login.uuid || typeof login.uuid !== "string") {
			throw new Error("Invalid API response: missing or invalid login.uuid");
		}

		if (!user.name || typeof user.name !== "object") {
			throw new Error("Invalid API response: missing or invalid name field");
		}
		const name = user.name as Record<string, unknown>;
		if (
			!name.first ||
			typeof name.first !== "string" ||
			!name.last ||
			typeof name.last !== "string"
		) {
			throw new Error(
				"Invalid API response: missing or invalid name.first or name.last",
			);
		}

		if (typeof user.email !== "string") {
			throw new Error("Invalid API response: missing or invalid email");
		}

		if (typeof user.gender !== "string") {
			throw new Error("Invalid API response: missing or invalid gender");
		}

		if (!user.location || typeof user.location !== "object") {
			throw new Error(
				"Invalid API response: missing or invalid location field",
			);
		}
		const location = user.location as Record<string, unknown>;
		if (
			!location.city ||
			typeof location.city !== "string" ||
			!location.country ||
			typeof location.country !== "string"
		) {
			throw new Error(
				"Invalid API response: missing or invalid location.city or location.country",
			);
		}

		if (!user.picture || typeof user.picture !== "object") {
			throw new Error("Invalid API response: missing or invalid picture field");
		}
		const picture = user.picture as Record<string, unknown>;
		if (!picture.thumbnail || typeof picture.thumbnail !== "string") {
			throw new Error(
				"Invalid API response: missing or invalid picture.thumbnail",
			);
		}

		if (!user.registered || typeof user.registered !== "object") {
			throw new Error(
				"Invalid API response: missing or invalid registered field",
			);
		}
		const registered = user.registered as Record<string, unknown>;
		if (
			!registered.date ||
			typeof registered.date !== "string" ||
			typeof registered.age !== "number"
		) {
			throw new Error(
				"Invalid API response: missing or invalid registered.date or registered.age",
			);
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
