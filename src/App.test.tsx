import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { fetchUserDirectoryUsers } from "./features/users/services/userService";
import { mockSingleUser } from "./features/users/testing/fixtures/user.fixture";
import { type AppStore, createAppStore } from "./store/store";

vi.mock("./features/users/services/userService", () => ({
	fetchUserDirectoryUsers: vi.fn(),
}));

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

const renderApp = () => {
	return render(
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<App />
			</Provider>
		</QueryClientProvider>,
	);
};

describe("App async users integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		store = createAppStore();
		queryClient = createTestQueryClient();
	});

	it("shows the users error state when the query fails", async () => {
		vi.mocked(fetchUserDirectoryUsers).mockRejectedValue(
			new Error("Network failure"),
		);

		renderApp();

		expect(await screen.findByRole("alert")).toBeInTheDocument();
	});

	it("recovers when retry button is clicked after a query error", async () => {
		const user = userEvent.setup();

		vi.mocked(fetchUserDirectoryUsers)
			.mockRejectedValueOnce(new Error("Network failure"))
			.mockResolvedValueOnce(mockSingleUser);

		renderApp();

		await user.click(await screen.findByRole("button", { name: /retry/i }));
		await screen.findByText(/david george/i);
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});

	it("renders a skip link to the main content", () => {
		vi.mocked(fetchUserDirectoryUsers).mockResolvedValue([]);

		renderApp();

		expect(
			screen.getByRole("link", { name: /skip to main content/i }),
		).toHaveAttribute("href", "#main-content");
	});
});
