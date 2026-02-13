import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ButtonProps } from "./Button";
import { Button } from "./Button";

const mockHandleClick = vi.fn();
let user: ReturnType<typeof userEvent.setup>;

const renderComponent = (props: Partial<ButtonProps> = {}) => {
	const defaultProps: ButtonProps = {
		children: "Click Me",
		...props,
	};
	render(<Button {...defaultProps} />);
};

describe("Button Component", () => {
	beforeEach(() => {
		mockHandleClick.mockClear();
		user = userEvent.setup();
	});

	it("renders with default button", () => {
		renderComponent();
		expect(
			screen.getByRole("button", { name: /click me/i }),
		).toBeInTheDocument();
	});

	it("renders with custom children", () => {
		renderComponent({ children: "Submit" });
		expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
	});

	it("calls onClick handler when clicked", async () => {
		renderComponent({ onClick: mockHandleClick });
		await user.click(screen.getByRole("button", { name: /click me/i }));
		expect(mockHandleClick).toHaveBeenCalled();
	});

	it("is disabled when disabled is true", () => {
		renderComponent({ disabled: true });
		expect(screen.getByRole("button", { name: /click me/i })).toBeDisabled();
	});

	it("shows loading state when loading is true", () => {
		renderComponent({ loading: true });
		expect(screen.getByRole("button", { name: /loading.../i })).toBeDisabled();
	});

	it("should have the correct type attribute", () => {
		renderComponent({ type: "submit" });
		expect(screen.getByRole("button", { name: /click me/i })).toHaveAttribute(
			"type",
			"submit",
		);
	});

	it("should not display children when loading is true", () => {
		renderComponent({ loading: true, children: "Submit Form" });
		expect(screen.queryByText(/submit form/i)).not.toBeInTheDocument();
		expect(screen.getByText(/loading.../i)).toBeInTheDocument();
	});

	it("should not call onClick when button is loading", async () => {
		renderComponent({ loading: true, onClick: mockHandleClick });
		await user.click(screen.getByRole("button", { name: /loading.../i }));
		expect(mockHandleClick).not.toHaveBeenCalled();
	});

	it("should have aria-busy and aria-live attributes when loading", () => {
		renderComponent({ loading: true });
		const button = screen.getByRole("button");
		expect(button).toHaveAttribute("aria-busy", "true");
		expect(button).toHaveAttribute("aria-live", "polite");
	});
});
