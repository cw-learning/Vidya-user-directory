import { StrictMode } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { USER_ROLES } from "../../../constants/userRoles";
import { USER_STATUS } from "../../../constants/userStatus";
import { createAppStore, type AppStore } from "../../../store/store";
import { fetchUsers } from "../services/userService";
import { UserGenderType } from "../types/user.types";
import { UserList } from "./UserList";

vi.mock("../services/userService", () => ({
	fetchUsers: vi.fn(),
}));

let user: ReturnType<typeof userEvent.setup>;
let store: AppStore;

const renderUserList = ({ strictMode = false }: { strictMode?: boolean } = {}) => {
	const content = (
		<Provider store={store}>
			<UserList />
		</Provider>
	);

	return render(
		strictMode ? <StrictMode>{content}</StrictMode> : content,
	);
};

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
	{
		id: "2",
		name: { first: "Sara", last: "nate" },
		email: "sara@example.com",
		gender: UserGenderType.FEMALE,
		role: USER_ROLES.ANALYST,
		status: USER_STATUS.INACTIVE,
		city: "Mumbai",
	},
];

describe("UserList Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		store = createAppStore();
		user = userEvent.setup();
	});

	it("should show the loading spinner when the component first mounts", () => {
		vi.mocked(fetchUsers).mockReturnValue(new Promise(() => {}));
		renderUserList();
		expect(screen.getByText(/loading users.../i)).toBeInTheDocument();
		expect(screen.queryByText(/david george/i)).not.toBeInTheDocument();
	});

	it("should display the list of users after a successful fetch", async () => {
		vi.mocked(fetchUsers).mockResolvedValue({ users: mockUsers });
		renderUserList();
		await waitFor(() => {
			expect(screen.getByText(/david george/i)).toBeInTheDocument();
			expect(screen.getByText(/sara nate/i)).toBeInTheDocument();
		});
		expect(screen.getByText(/2 users found/i)).toBeInTheDocument();
	});

	it("should display the error alert when the service fails", async () => {
		const errorMessage = "API is currently down";
		vi.mocked(fetchUsers).mockResolvedValue({ error: errorMessage });
		renderUserList();
		await waitFor(() => {
			const errorAlert = screen.getByRole("alert");
			expect(errorAlert).toBeInTheDocument();
			expect(
				within(errorAlert).getByText(
					/unable to load users\. please try again later\./i,
				),
			).toBeInTheDocument();
		});
	});

	it("should show the empty state when no users match the filter", async () => {
		vi.mocked(fetchUsers).mockResolvedValue({ users: mockUsers });
		renderUserList();
		const searchInput = await screen.findByLabelText(/search users/i);
		await user.type(searchInput, "NonExistentUser");
		expect(screen.getByText(/no users found/i)).toBeInTheDocument();
		expect(screen.getByText(/0 users found/i)).toBeInTheDocument();
	});

	it("should clear filters and reset the list when 'Clear Filters' is clicked", async () => {
		vi.mocked(fetchUsers).mockResolvedValue({ users: mockUsers });
		renderUserList();
		const searchInput = await screen.findByLabelText(/search users/i);
		await user.type(searchInput, "David");
		expect(screen.queryByText(/sara nate/i)).not.toBeInTheDocument();
		const clearBtn = screen.getByRole("button", { name: /clear filters/i });
		await user.click(clearBtn);
		expect(searchInput).toHaveValue("");
		expect(screen.getByText(/sara nate/i)).toBeInTheDocument();
	});

	it("should update a user card's status locally when the toggle button is clicked", async () => {
		vi.mocked(fetchUsers).mockResolvedValue({ users: mockUsers });
		renderUserList();
		const davidCard = await screen.findByLabelText(/User David George/i);
		const deactivateBtn = within(davidCard).getByRole("button", {
			name: /deactivate/i,
		});
		await user.click(deactivateBtn);
		expect(
			within(davidCard).getByRole("button", { name: /activate/i }),
		).toBeInTheDocument();
	});

	it("should ignore the strict mode duplicate load dispatch", async () => {
		vi.mocked(fetchUsers).mockResolvedValue({ users: mockUsers });
		renderUserList({ strictMode: true });
		await screen.findByText(/david george/i);
		expect(fetchUsers).toHaveBeenCalledTimes(1);
		expect(screen.queryByText(/runtime error occurred/i)).not.toBeInTheDocument();
	});
});
