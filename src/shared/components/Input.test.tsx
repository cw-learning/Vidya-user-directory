import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Input, type InputProps } from "./Input";

let user: ReturnType<typeof userEvent.setup>;

let currentValue = "Test Value";
const handleChange = vi.fn((newValue: string) => {
	currentValue = newValue;
});

const renderComponent = (props: Partial<InputProps> = {}) => {
	const defaultProps: InputProps = {
		label: "Test Label",
		value: currentValue,
		onChange: handleChange,
		...props,
	};
	return render(<Input {...defaultProps} />);
};

describe("Input Component", () => {
	beforeEach(() => {
		handleChange.mockClear();
		user = userEvent.setup();
		currentValue = "Test Value";
	});

	it("should render the input component with the correct label and value", () => {
		renderComponent();
		expect(screen.getByLabelText(/test label/i)).toBeInTheDocument();
		expect(screen.getByDisplayValue(/test value/i)).toBeInTheDocument();
	});

	it("should apply the correct type attribute", () => {
		renderComponent({ type: "password" });
		expect(screen.getByLabelText(/test label/i)).toHaveAttribute(
			"type",
			"password",
		);
	});

	it("should call the onChange handler when the input value changes", async () => {
		renderComponent({ value: "" });
		screen.getByLabelText(/test label/i).focus();
		await user.paste("New Value");
		expect(handleChange).toHaveBeenCalledWith("New Value");
	});

	it("should use the id and label correctly", () => {
		renderComponent({ id: "custom-input-id" });
		expect(screen.getByLabelText(/test label/i).getAttribute("id")).toBe(
			"custom-input-id",
		);
		expect(screen.getByText(/test label/i).getAttribute("for")).toBe(
			"custom-input-id",
		);
	});

	it("should render the placeholder text when provided", () => {
		renderComponent({ placeholder: "Enter your username" });
		expect(
			screen.getByPlaceholderText("Enter your username"),
		).toBeInTheDocument();
	});

	it("should link input and label when id is auto generated and not provided", () => {
		renderComponent();
		expect(screen.getByText(/test label/i).getAttribute("for")).toBe(
			screen.getByLabelText(/test label/i).getAttribute("id"),
		);
	});

	it("should display error message and link it to input via aria-describedby", () => {
		renderComponent({ error: "Invalid email address" });
		const input = screen.getByLabelText(/test label/i);
		const errorMessage = screen.getByText("Invalid email address");
		expect(input).toHaveAttribute("aria-invalid", "true");
		expect(input).toHaveAttribute("aria-describedby", errorMessage.id);
		expect(errorMessage).toHaveAttribute("role", "alert");
	});
});
