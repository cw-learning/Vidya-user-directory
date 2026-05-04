import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import { fetchUserDirectoryUsers } from "./userService";

vi.stubGlobal("fetch", vi.fn());
const mockFetch = vi.mocked(fetch);

const createJsonResponse = (body: unknown, init?: ResponseInit): Response => {
	return new Response(JSON.stringify(body), {
		headers: {
			"Content-Type": "application/json",
		},
		status: 200,
		...init,
	});
};

describe("userService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("fetchUserDirectoryUsers - URL Construction", () => {
		it("should request the users API endpoint", async () => {
			mockFetch.mockResolvedValue(createJsonResponse([]));
			await fetchUserDirectoryUsers();
			expect(mockFetch).toHaveBeenCalledWith(
				API_ENDPOINTS.USERS,
				expect.anything(),
			);
		});
	});

	describe("fetchUserDirectoryUsers - Mapping & Logic", () => {
		it("should split name into first and last correctly", async () => {
			const mockRawData = [
				{
					id: 1,
					name: "John Doe",
					email: "john@example.com",
					address: { city: "London" },
				},
			];
			mockFetch.mockResolvedValue(createJsonResponse(mockRawData));
			const result = await fetchUserDirectoryUsers();
			const [firstUser] = result;

			if (!firstUser) {
				throw new Error("Expected at least one user");
			}

			expect(firstUser.name).toEqual({
				first: "John",
				last: "Doe",
			});
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
			mockFetch.mockResolvedValue(createJsonResponse(mockRawData));
			const result = await fetchUserDirectoryUsers();
			const [firstUser] = result;

			if (!firstUser) {
				throw new Error("Expected at least one user");
			}

			expect(firstUser.name).toEqual({
				first: "Prince",
				last: "User",
			});
		});

		it("should map missing optional fields to safe fallback values", async () => {
			const mockRawData = [
				{
					id: 1,
				},
			];
			mockFetch.mockResolvedValue(createJsonResponse(mockRawData));
			const result = await fetchUserDirectoryUsers();
			const [firstUser] = result;

			if (!firstUser) {
				throw new Error("Expected at least one user");
			}

			expect(firstUser.name).toEqual({
				first: "Unknown",
				last: "User",
			});
			expect(firstUser.email).toBe("unknown@example.com");
			expect(firstUser.city).toBe("Unknown");
		});
	});

	describe("fetchUserDirectoryUsers - Error Handling", () => {
		it("should throw an error on 500 server error", async () => {
			mockFetch.mockResolvedValue(createJsonResponse(null, { status: 500 }));

			await expect(fetchUserDirectoryUsers()).rejects.toThrow(
				"API request failed with status 500",
			);
		});

		it("should throw validation errors for bad API data", async () => {
			mockFetch.mockResolvedValue(createJsonResponse([{ id: "not-a-number" }]));

			await expect(fetchUserDirectoryUsers()).rejects.toThrow(
				"Invalid API response",
			);
		});
	});
});
