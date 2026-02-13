import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Select, type SelectProps } from "./Select";

let user: ReturnType<typeof userEvent.setup>;

const mockOptions = [
	{ value: "apple", label: "Apple" },
	{ value: "banana", label: "Banana" },
	{ value: "orange", label: "Orange" },
];

let currentValue = "apple";
const handleChange = vi.fn((newValue: string) => {
	currentValue = newValue;
});

const renderComponent = (props: Partial<SelectProps> = {}) => {
	const defaultProps: SelectProps = {
		label: "Choose a fruit",
		value: currentValue,
		onChange: handleChange,
		options: mockOptions,
		...props,
	};
	return render(<Select {...defaultProps} />);
};

describe("Select Component", () => {
	beforeEach(() => {
		handleChange.mockClear();
		user = userEvent.setup();
		currentValue = "apple";
	});

	it("should render the select component with the correct label and options", () => {
		renderComponent();
		expect(screen.getByLabelText(/choose a fruit/i)).toBeInTheDocument();
		mockOptions.forEach((option) => {
			expect(
				screen.getByRole("option", { name: option.label }),
			).toBeInTheDocument();
		});
	});

	it("should have the correct initial value selected", () => {
		renderComponent({ value: "banana" });
		expect(
			(screen.getByLabelText(/choose a fruit/i) as HTMLSelectElement).value,
		).toBe("banana");
	});

	it("should call onChange when a new option is selected", async () => {
		renderComponent();
		const select = screen.getByLabelText(
			/choose a fruit/i,
		) as HTMLSelectElement;
		await user.selectOptions(select, "orange");
		expect(handleChange).toHaveBeenCalledWith("orange");
	});

	it("should link label and select when id is auto-generated", () => {
		renderComponent();
		const select = screen.getByLabelText(
			/choose a fruit/i,
		) as HTMLSelectElement;
		expect(screen.getByText(/choose a fruit/i).getAttribute("for")).toBe(
			select.getAttribute("id"),
		);
		expect(select.getAttribute("id")).toBeTruthy();
	});

	it("should use the custom id when provided", () => {
		const customId = "my-custom-select";
		renderComponent({ id: customId });
		expect(screen.getByLabelText(/choose a fruit/i)).toHaveAttribute(
			"id",
			customId,
		);
		expect(screen.getByText(/choose a fruit/i)).toHaveAttribute(
			"for",
			customId,
		);
	});

	it("should render the correct number of options", () => {
		renderComponent();
		const options = screen.getAllByRole("option");
		expect(options).toHaveLength(mockOptions.length);
	});

	it("should display error message", () => {
		renderComponent({ error: "You must select a fruit" });
		const errorElement = screen.getByText("You must select a fruit");
		const select = screen.getByLabelText(/choose a fruit/i);
		expect(errorElement).toBeInTheDocument();
		expect(select).toHaveAttribute("aria-invalid", "true");
		expect(select).toHaveAttribute("aria-describedby", errorElement.id);
		expect(errorElement).toHaveAttribute("role", "alert");
	});
});
