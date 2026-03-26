import type { ChangeEvent } from "react";
import { useId } from "react";

export interface SelectProps<T extends string = string> {
	label: string;
	value: T;
	onChange: (value: T) => void;
	options: { value: T; label: string }[];
	id?: string;
	error?: string;
}

export const Select = <T extends string = string>({
	label,
	value,
	onChange,
	options,
	id,
	error,
}: SelectProps<T>) => {
	const generatedId = useId();
	const selectId = id ?? generatedId;
	const errorId = `${selectId}-error`;

	const handleOnChangeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
		const nextOption = options.find(
			(option) => option.value === event.currentTarget.value,
		);

		if (nextOption) {
			onChange(nextOption.value);
		}
	};

	return (
		<div className="mb-4">
			<label
				htmlFor={selectId}
				className="block text-sm font-medium text-gray-700 mb-2"
			>
				{label}
			</label>
			<select
				id={selectId}
				value={value}
				onChange={handleOnChangeSelect}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				className={`min-h-11 w-full rounded-md border px-4 py-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ${
					error
						? "border-red-600 focus-visible:ring-red-300"
						: "border-gray-400 focus-visible:ring-blue-300"
				}`}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>

			{error && (
				<p id={errorId} role="alert" className="mt-1 text-sm text-red-500">
					{error}
				</p>
			)}
		</div>
	);
};
