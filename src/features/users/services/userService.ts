import { z } from "zod";

import { API_CONFIG, API_ENDPOINTS } from "../../../constants/apiEndpoints";
import type { UserRoleType } from "../../../constants/userRoles";
import { USER_ROLES } from "../../../constants/userRoles";
import type { UserStatusType } from "../../../constants/userStatus";
import { USER_STATUS } from "../../../constants/userStatus";
import { UserGenderType, type UserType } from "../types/user.types";

const AVAILABLE_ROLES: UserRoleType[] = Object.values(USER_ROLES);

const AVAILABLE_STATUSES: UserStatusType[] = Object.values(USER_STATUS);

const UNKNOWN_USER_FIRST_NAME = "Unknown";
const UNKNOWN_USER_LAST_NAME = "User";
const UNKNOWN_USER_EMAIL = "unknown@example.com";
const UNKNOWN_USER_CITY = "Unknown";

const jsonPlaceholderUserSchema = z
	.object({
		id: z.number(),
		name: z.string().optional(),
		email: z.string().optional(),
		address: z
			.object({
				city: z.string().optional(),
			})
			.optional(),
	})
	.passthrough();

const jsonPlaceholderApiResponseSchema = z.array(jsonPlaceholderUserSchema);

type JsonPlaceholderUserResponseType = z.infer<
	typeof jsonPlaceholderUserSchema
>;

const getDeterministicIndex = (uuid: string, length: number): number => {
	let hash = 0;
	for (let i = 0; i < uuid.length; i++) {
		const char = uuid.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return Math.abs(hash) % length;
};

const mapJsonPlaceholderUserToUser = (
	user: JsonPlaceholderUserResponseType,
): UserType => {
	const nameParts = user.name?.trim().split(" ") ?? [];
	const first = nameParts[0] || UNKNOWN_USER_FIRST_NAME;
	const last = nameParts.slice(1).join(" ") || UNKNOWN_USER_LAST_NAME;

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
		email: user.email ?? UNKNOWN_USER_EMAIL,
		gender: gender,
		city: user.address?.city ?? UNKNOWN_USER_CITY,
		role: role,
		status: status,
	};
};

const parseJsonPlaceholderUsers = (
	data: unknown,
): JsonPlaceholderUserResponseType[] => {
	const parseResult = jsonPlaceholderApiResponseSchema.safeParse(data);

	if (!parseResult.success) {
		const firstIssue = parseResult.error.issues[0]?.message ?? "unknown issue";
		throw new Error(`Invalid API response: ${firstIssue}`);
	}

	return parseResult.data;
};

const fetchUsersFromApi = async (): Promise<UserType[]> => {
	const url = new URL(API_ENDPOINTS.USERS);

	const response = await fetch(url.toString(), {
		signal: AbortSignal.timeout(API_CONFIG.REQUEST_TIMEOUT),
	});

	if (!response.ok) {
		throw new Error(`API request failed with status ${response.status}`);
	}

	const data: unknown = await response.json();
	const parsedUsers = parseJsonPlaceholderUsers(data);

	return parsedUsers.map(mapJsonPlaceholderUserToUser);
};

export const fetchUserDirectoryUsers = async (): Promise<UserType[]> => {
	return fetchUsersFromApi();
};
