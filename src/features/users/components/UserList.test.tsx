import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { USER_ROLES } from "../../../constants/userRoles";
import { USER_STATUS } from "../../../constants/userStatus";
import { type AppStore, createAppStore } from "../../../store/store";
import { fetchUserDirectoryUsers } from "../services/userService";
import { mockUsers } from "../testing/fixtures/user.fixture";
import { UserGenderType } from "../types/user.types";
import { UserList } from "./UserList";

vi.mock("../services/userService", () => ({
	fetchUserDirectoryUsers: vi.fn(),
}));

let user: ReturnType<typeof userEvent.setup>;
let store: AppStore;
let queryClient: QueryClient;

const createTestQueryClient = (): QueryClient =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

const renderUserList = ({
	strictMode = false,
}: {
	strictMode?: boolean;
} = {}) => {
	const content = (
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<UserList />
			</Provider>
		</QueryClientProvider>
	);

	return render(strictMode ? <StrictMode>{content}</StrictMode> : content);
};

describe("UserList Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		store = createAppStore();
		queryClient = createTestQueryClient();
		user = userEvent.setup();
	});

	it("should show the loading spinner when the component first mounts", () => {
		vi.mocked(fetchUserDirectoryUsers).mockReturnValue(new Promise(() => {}));
		renderUserList();
		expect(screen.getByText(/loading users.../i)).toBeInTheDocument();
		expect(screen.queryByText(/david george/i)).not.toBeInTheDocument();
	});

	it("should display the list of users after a successful fetch", async () => {
		vi.mocked(fetchUserDirectoryUsers).mockResolvedValue(mockUsers);
		renderUserList();
		await waitFor(() => {
			expect(screen.getByText(/david george/i)).toBeInTheDocument();
			expect(screen.getByText(/sara nate/i)).toBeInTheDocument();
		});
		expect(screen.getByText(/2 users found/i)).toBeInTheDocument();
		expect(
			screen.getByRole("list", { name: /user results/i }),
		).toBeInTheDocument();
	});

	it("should display the error alert when the service fails", async () => {
		const errorMessage = "API is currently down";
		vi.mocked(fetchUserDirectoryUsers).mockRejectedValue(
			new Error(errorMessage),
		);
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
		vi.mocked(fetchUserDirectoryUsers).mockResolvedValue(mockUsers);
		renderUserList();
		const searchInput = await screen.findByLabelText(/search users/i);
		await user.type(searchInput, "NonExistentUser");
		await waitFor(() => {
			expect(screen.getByText(/no users found/i)).toBeInTheDocument();
			expect(screen.getByText(/0 users found/i)).toBeInTheDocument();
		});
	});

	it("should clear filters and reset the list when 'Clear Filters' is clicked", async () => {
		vi.mocked(fetchUserDirectoryUsers).mockResolvedValue(mockUsers);
		renderUserList();
		const searchInput = await screen.findByLabelText(/search users/i);
		await user.type(searchInput, "David");
		await waitFor(() => {
			expect(screen.queryByText(/sara nate/i)).not.toBeInTheDocument();
		});
		const clearBtn = screen.getByRole("button", { name: /clear filters/i });
		await user.click(clearBtn);
		await waitFor(() => {
			expect(searchInput).toHaveValue("");
			expect(screen.getByText(/sara nate/i)).toBeInTheDocument();
		});
	});

	it("should apply role, status, and gender filters through their select controls", async () => {
		vi.mocked(fetchUserDirectoryUsers).mockResolvedValue(mockUsers);
		renderUserList();

		await screen.findByText(/david george/i);

		const roleSelect = screen.getByLabelText(/filter by role/i);
		const statusSelect = screen.getByLabelText(/filter by status/i);
		const genderSelect = screen.getByLabelText(/filter by gender/i);
		const clearBtn = screen.getByRole("button", { name: /clear filters/i });

		await user.selectOptions(roleSelect, USER_ROLES.ANALYST);
		await waitFor(() => {
			expect(screen.getByText(/sara nate/i)).toBeInTheDocument();
			expect(screen.queryByText(/david george/i)).not.toBeInTheDocument();
		});

		await user.click(clearBtn);
		await waitFor(() => {
			expect(screen.getByText(/david george/i)).toBeInTheDocument();
			expect(screen.getByText(/sara nate/i)).toBeInTheDocument();
		});

		await user.selectOptions(statusSelect, USER_STATUS.ACTIVE);
		await waitFor(() => {
			expect(screen.getByText(/david george/i)).toBeInTheDocument();
			expect(screen.queryByText(/sara nate/i)).not.toBeInTheDocument();
		});

		await user.click(clearBtn);
		await waitFor(() => {
			expect(screen.getByText(/david george/i)).toBeInTheDocument();
			expect(screen.getByText(/sara nate/i)).toBeInTheDocument();
		});

		await user.selectOptions(genderSelect, UserGenderType.FEMALE);
		await waitFor(() => {
			expect(screen.getByText(/sara nate/i)).toBeInTheDocument();
			expect(screen.queryByText(/david george/i)).not.toBeInTheDocument();
		});
	});

	it("should show validation for keyboard submit and clear stale debounce states", async () => {
		vi.mocked(fetchUserDirectoryUsers).mockResolvedValue(mockUsers);
		renderUserList();

		const searchInput = await screen.findByLabelText(/search users/i);

		await user.type(searchInput, "D{Enter}");
		expect(
			screen.getByText(/enter at least 2 characters to search/i),
		).toBeInTheDocument();

		await user.clear(searchInput);
		await user.type(searchInput, "David");

		await waitFor(() => {
			expect(screen.queryByText(/sara nate/i)).not.toBeInTheDocument();
		});

		await user.clear(searchInput);
		await user.type(searchInput, "D");
		await user.tab();

		expect(
			screen.getByText(/enter at least 2 characters to search/i),
		).toBeInTheDocument();

		await waitFor(() => {
			expect(screen.getByText(/david george/i)).toBeInTheDocument();
			expect(screen.getByText(/sara nate/i)).toBeInTheDocument();
		});

		await user.clear(searchInput);
		await user.type(searchInput, "Da");
		const clearBtn = screen.getByRole("button", { name: /clear filters/i });
		await user.click(clearBtn);
		expect(searchInput).toHaveValue("");

		await waitFor(() => {
			expect(screen.getByText(/david george/i)).toBeInTheDocument();
			expect(screen.getByText(/sara nate/i)).toBeInTheDocument();
		});
	});

	it("should group filter controls inside a fieldset", async () => {
		vi.mocked(fetchUserDirectoryUsers).mockResolvedValue(mockUsers);
		renderUserList();
		await screen.findByLabelText(/search users/i);
		expect(
			screen.getByRole("group", { name: /filter the user directory/i }),
		).toBeInTheDocument();
	});

	it("should update a user card's status locally when the toggle button is clicked", async () => {
		vi.mocked(fetchUserDirectoryUsers).mockResolvedValue(mockUsers);
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

	it("should de-duplicate strict mode user queries", async () => {
		vi.mocked(fetchUserDirectoryUsers).mockResolvedValue(mockUsers);
		renderUserList({ strictMode: true });
		await screen.findByText(/david george/i);
		expect(fetchUserDirectoryUsers).toHaveBeenCalledTimes(1);
		expect(
			screen.queryByText(/runtime error occurred/i),
		).not.toBeInTheDocument();
	});

	it("should retry the users query when the retry button is clicked", async () => {
		vi.mocked(fetchUserDirectoryUsers)
			.mockRejectedValueOnce(new Error("Network failure"))
			.mockResolvedValueOnce(mockUsers);

		renderUserList();

		await user.click(await screen.findByRole("button", { name: /retry/i }));

		expect(await screen.findByText(/david george/i)).toBeInTheDocument();
		expect(fetchUserDirectoryUsers).toHaveBeenCalledTimes(2);
	});
});
