import type { ChangeEvent, FC } from "react";
import { useId } from "react";

interface InputProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	type?: string;
	placeholder?: string;
	id?: string;
}

export const Input: FC<InputProps> = ({
	label,
	value,
	onChange,
	type = "text",
	placeholder,
	id,
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
				type={type}
				value={value}
				onChange={handleOnChangeInput}
				placeholder={placeholder}
				className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
	);
};
