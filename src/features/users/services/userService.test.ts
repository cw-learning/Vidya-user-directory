import { beforeEach, describe, expect, it, vi } from "vitest";
import { USER_ROLES } from "../../../constants/userRoles";
import { USER_STATUS } from "../../../constants/userStatus";
import { fetchUsers } from "./userService";

vi.stubGlobal("fetch", vi.fn());
const mockFetch = vi.mocked(fetch);

describe("userService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("fetchUsers - URL Construction", () => {
		it("should append the search term to the API URL", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => [],
			} as Response);
			await fetchUsers({ search: "george" });
			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining("q=george"),
				expect.anything(),
			);
		});
	});

	describe("fetchUsers - Mapping & Logic", () => {
		it("should split name into first and last correctly", async () => {
			const mockRawData = [
				{
					id: 1,
					name: "John Doe",
					email: "john@example.com",
					address: { city: "London" },
				},
			];
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockRawData,
			} as Response);
			const result = await fetchUsers({});
			if ("users" in result) {
				const [firstUser] = result.users;
				if (!firstUser) {
					throw new Error("Expected at least one user");
				}
				expect(firstUser.name).toEqual({
					first: "John",
					last: "Doe",
				});
			}
		});

		it("should use fallback values for single-word names", async () => {
			const mockRawData = [
				{
					id: 1,
					name: "Prince",
					email: "p@example.com",
					address: { city: "London" },
				},
			];
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockRawData,
			} as Response);
			const result = await fetchUsers({});
			if ("users" in result) {
				const [firstUser] = result.users;
				if (!firstUser) {
					throw new Error("Expected at least one user");
				}
				expect(firstUser.name).toEqual({
					first: "Prince",
					last: "User",
				});
			}
		});
	});

	describe("fetchUsers - Filtering logic", () => {
		it("should filter the API results by role locally", async () => {
			const mockRawData = [
				{ id: 1, name: "User One", email: "1@a.com", address: { city: "C1" } },
				{ id: 2, name: "User Two", email: "2@a.com", address: { city: "C2" } },
			];
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockRawData,
			} as Response);
			const result = await fetchUsers({ role: USER_ROLES.ADMIN });
			if ("users" in result) {
				const allAreAdmins = result.users.every(
					(u) => u.role === USER_ROLES.ADMIN,
				);
				expect(allAreAdmins).toBe(true);
			}
		});

		it("should filter the API results by status locally", async () => {
			const mockRawData = [
				{
					id: 1,
					name: "User One",
					email: "1@a.com",
					address: { city: "C1" },
					status: USER_STATUS.ACTIVE,
				},
				{
					id: 2,
					name: "User Two",
					email: "2@a.com",
					address: { city: "C2" },
					status: USER_STATUS.INACTIVE,
				},
			];
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => mockRawData,
			} as Response);
			const result = await fetchUsers({ status: USER_STATUS.ACTIVE });
			if ("users" in result) {
				const allAreActive = result.users.every(
					(u) => u.status === USER_STATUS.ACTIVE,
				);
				expect(allAreActive).toBe(true);
			}
		});
	});

	describe("fetchUsers - Error Handling", () => {
		it("should return error message on 500 server error", async () => {
			mockFetch.mockResolvedValue({
				ok: false,
				status: 500,
			} as Response);
			const result = await fetchUsers({});
			expect(result).toHaveProperty("error");
			expect(result).toEqual({ error: "API request failed with status 500" });
		});

		it("should handle validation errors (bad API data)", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => [{ id: "not-a-number" }],
			} as Response);
			const result = await fetchUsers({});
			if ("error" in result) {
				expect(result.error).toContain("Invalid API response");
			}
		});
	});
});
