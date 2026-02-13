import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { USER_ROLES } from "../../../constants/userRoles";
import { USER_STATUS } from "../../../constants/userStatus";
import { UserGenderType, type UserType } from "../types/user.types";
import { UserCard } from "./UserCard";

let user: ReturnType<typeof userEvent.setup>;

const mockUser: UserType = {
	id: "user-123",
	name: { first: "David", last: "George" },
	email: "david@example.com",
	gender: UserGenderType.MALE,
	role: USER_ROLES.ADMIN,
	status: USER_STATUS.ACTIVE,
	city: "Delhi",
};

const mockOnToggleStatus = vi.fn();

const renderComponent = (
	props: Partial<{ user: UserType; onToggleStatus: (id: string) => void }> = {},
) => {
	const defaultProps = {
		user: mockUser,
		onToggleStatus: mockOnToggleStatus,
		...props,
	};
	return render(<UserCard {...defaultProps} />);
};

describe("UserCard Component", () => {
	beforeEach(() => {
		mockOnToggleStatus.mockClear();
		user = userEvent.setup();
	});

	it("should render user's full name, email, and location", () => {
		renderComponent();
		const nameHeading = screen.getByRole("heading", {
			name: /david george/i,
			level: 3,
		});
		expect(nameHeading).toBeInTheDocument();
		expect(screen.getByText(/david@example.com/i)).toBeInTheDocument();
		expect(screen.getByText(/Delhi/i)).toBeInTheDocument();
	});

	it("should display the correct initials in the profile placeholder", () => {
		renderComponent();
		expect(screen.getByText("DG")).toBeInTheDocument();
	});

	it("should show the correct gender icon for male", () => {
		renderComponent();
		const genderIcon = screen.getByLabelText(/gender: male/i);
		expect(genderIcon).toBeInTheDocument();
	});

	it("should show the correct gender icon for female", () => {
		const femaleUser = { ...mockUser, gender: UserGenderType.FEMALE };
		renderComponent({ user: femaleUser });
		const genderIcon = screen.getByLabelText(/gender: female/i);
		expect(genderIcon).toBeInTheDocument();
	});

	it("should show 'Deactivate User' button and green icon when user is ACTIVE", () => {
		renderComponent();
		expect(screen.getByLabelText(/active/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /deactivate user/i }),
		).toBeInTheDocument();
	});

	it("should show 'Activate User' button and red icon when user is INACTIVE", () => {
		const inactiveUser = { ...mockUser, status: USER_STATUS.INACTIVE };
		renderComponent({ user: inactiveUser });
		expect(screen.getByLabelText(/inactive/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /activate user/i }),
		).toBeInTheDocument();
	});

	it("should show yellow icon when user status is PENDING", () => {
		const pendingUser = { ...mockUser, status: USER_STATUS.PENDING };
		renderComponent({ user: pendingUser });
		expect(screen.getByLabelText(/pending/i)).toBeInTheDocument();
	});

	it("should call onToggleStatus with the correct user ID when button is clicked", async () => {
		renderComponent();
		const toggleButton = screen.getByRole("button");
		await user.click(toggleButton);
		expect(mockOnToggleStatus).toHaveBeenCalledWith("user-123");
	});

	it("should have a comprehensive aria-label on the article for screen readers", () => {
		renderComponent();
		const article = screen.getByRole("article");
		const expectedLabel = `User David George, role Admin, status ${USER_STATUS.ACTIVE}, email david@example.com`;
		expect(article).toHaveAttribute("aria-label", expectedLabel);
	});

	it("should change the button purpose based on user status", () => {
		const { rerender } = renderComponent({
			user: { ...mockUser, status: USER_STATUS.ACTIVE },
		});
		expect(
			screen.getByRole("button", { name: /deactivate/i }),
		).toBeInTheDocument();
		rerender(
			<UserCard
				user={{ ...mockUser, status: USER_STATUS.INACTIVE }}
				onToggleStatus={mockOnToggleStatus}
			/>,
		);
		expect(
			screen.getByRole("button", { name: /activate/i }),
		).toBeInTheDocument();
	});
});
