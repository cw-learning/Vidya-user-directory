import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { USER_ROLES } from "./constants/userRoles";
import { USER_STATUS } from "./constants/userStatus";
import { resetUserStore } from "./features/users/hooks/useUserStore";
import { fetchUsers } from "./features/users/services/userService";
import { UserGenderType } from "./features/users/types/user.types";

vi.mock("./features/users/services/userService", () => ({
	fetchUsers: vi.fn(),
}));

const renderApp = () => {
	return render(<App />);
};

describe("App error boundary integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		resetUserStore();
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("shows error fallback when fetch throws an unexpected error", async () => {
		vi.mocked(fetchUsers).mockRejectedValue(new Error("Network failure"));

		renderApp();

		const errorAlert = await screen.findByRole("alert");
		expect(errorAlert).toBeInTheDocument();
		expect(screen.getByText(/runtime error occurred/i)).toBeInTheDocument();
	});

	it("recovers when retry button is clicked after fetch error", async () => {
		const user = userEvent.setup();

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

		vi.mocked(fetchUsers)
			.mockRejectedValueOnce(new Error("Network failure"))
			.mockResolvedValueOnce({ users: mockUsers });

		renderApp();

		const errorAlert = await screen.findByRole("alert");
		expect(errorAlert).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: /retry/i }));
		await screen.findByText(/david george/i);
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});
});
