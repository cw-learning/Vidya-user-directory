import type { ChangeEvent, FC } from "react";

interface InputProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	type?: string;
	placeholder?: string;
}

export const Input: FC<InputProps> = ({
	label,
	value,
	onChange,
	type = "text",
	placeholder,
}) => {
	const handleOnChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.value);
	};

	return (
		<div className="mb-4">
			<label
				htmlFor={label}
				className="block text-sm font-medium text-gray-700 mb-1"
			>
				{label}
			</label>
			<input
				id={label}
				type={type}
				value={value}
				onChange={handleOnChangeInput}
				placeholder={placeholder}
				className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>
	);
};
