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
}

export const Input: FC<InputProps> = ({
	label,
	value,
	onChange,
	type = "text",
	placeholder,
	id,
	error,
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
				className={`border px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 ${
					error
						? "border-red-500 focus:ring-red-500"
						: "border-gray-300 focus:ring-blue-500"
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
