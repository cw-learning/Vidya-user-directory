import { beforeEach, describe, expect, it, vi } from "vitest";
import { USER_ROLES } from "../../../constants/userRoles";
import { USER_STATUS } from "../../../constants/userStatus";
import { createAppStore } from "../../../store/store";
import { fetchUsers } from "../services/userService";
import { UserGenderType } from "../types/user.types";
import { loadUsers } from "./userSlice";

vi.mock("../services/userService", () => ({
	fetchUsers: vi.fn(),
}));

const mockUsers = [
	{
		id: "1",
		name: { first: "David", last: "George" },
		email: "david@example.com",
		gender: UserGenderType.MALE,
		role: USER_ROLES.ADMIN,
		status: USER_STATUS.ACTIVE,
		city: "Delhi",
	},
];

describe("userSlice", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("prevents concurrent loadUsers dispatches", async () => {
		let resolveRequest: ((value: { users: typeof mockUsers }) => void) | null =
			null;

		vi.mocked(fetchUsers).mockImplementation(
			() =>
				new Promise((resolve) => {
					resolveRequest = resolve;
				}),
		);

		const store = createAppStore();
		const firstRequest = store.dispatch(loadUsers());
		const secondResult = await store.dispatch(loadUsers());

		expect(fetchUsers).toHaveBeenCalledTimes(1);
		expect(loadUsers.rejected.match(secondResult)).toBe(true);
		expect(secondResult.meta.condition).toBe(true);
		expect(store.getState().users.loading).toBe(true);

		resolveRequest?.({ users: mockUsers });
		await firstRequest;

		expect(store.getState().users.users).toEqual(mockUsers);
		expect(store.getState().users.currentRequestId).toBeNull();
		expect(store.getState().users.loading).toBe(false);
	});

	it("ignores fulfilled actions from stale request ids", () => {
		const store = createAppStore();

		store.dispatch(loadUsers.pending("active-request", undefined));
		store.dispatch(loadUsers.fulfilled([], "stale-request", undefined));

		expect(store.getState().users.loading).toBe(true);
		expect(store.getState().users.users).toEqual([]);
		expect(store.getState().users.currentRequestId).toBe("active-request");

		store.dispatch(
			loadUsers.fulfilled(mockUsers, "active-request", undefined),
		);

		expect(store.getState().users.users).toEqual(mockUsers);
		expect(store.getState().users.loading).toBe(false);
		expect(store.getState().users.currentRequestId).toBeNull();
	});
});
