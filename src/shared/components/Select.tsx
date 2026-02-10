import type { ChangeEvent, FC } from "react";

interface SelectProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
}

export const Select: FC<SelectProps> = ({
	label,
	value,
	onChange,
	options,
}) => {
	const handleOnChangeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
		onChange(event.target.value);
	};

	return (
		<div className="mb-4">
			<label
				htmlFor={label}
				className="block text-sm font-medium text-gray-700 mb-2"
			>
				{label}
			</label>
			<select
				id={label}
				value={value}
				onChange={handleOnChangeSelect}
				className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
};
