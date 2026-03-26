import type { ChangeEvent, FC } from "react";
import { useId } from "react";

export interface InputProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	type?: string;
	placeholder?: string;
	id?: string;
	error?: string;
	autoComplete?: string;
}

export const Input: FC<InputProps> = ({
	label,
	value,
	onChange,
	type = "text",
	placeholder,
	id,
	error,
	autoComplete,
}) => {
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const handleOnChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.value);
	};

	return (
		<div className="mb-4">
			<label
				htmlFor={inputId}
				className="block text-sm font-medium text-gray-700 mb-1"
			>
				{label}
			</label>
			<input
				id={inputId}
				aria-invalid={!!error}
				aria-describedby={error ? `${inputId}-error` : undefined}
				type={type}
				value={value}
				onChange={handleOnChangeInput}
				placeholder={placeholder}
				autoComplete={autoComplete}
				className={`min-h-11 w-full rounded-md border px-4 py-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ${
					error
						? "border-red-600 focus-visible:ring-red-300"
						: "border-gray-400 focus-visible:ring-blue-300"
				}`}
			/>
			{error && (
				<p
					id={`${inputId}-error`}
					role="alert"
					className="mt-1 text-sm text-red-500"
				>
					{error}{" "}
				</p>
			)}{" "}
		</div>
	);
};
