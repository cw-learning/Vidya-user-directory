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
		onChange(event.target.value as T);
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
				className={`border px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 ${
					error
						? "border-red-500 focus:ring-red-500"
						: "border-gray-300 focus:ring-blue-500"
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
