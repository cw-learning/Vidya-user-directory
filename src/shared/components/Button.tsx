import clsx from "clsx";

type ButtonVariantType = "primary" | "secondary";

type ButtonType = "button" | "submit";

interface ButtonProps {
	variant?: ButtonVariantType;
	disabled?: boolean;
	loading?: boolean;
	children: React.ReactNode;
	onClick?: () => void;
	type?: ButtonType;
	className?: string;
}

const baseClassName = "px-4 py-2 rounded font-medium transition-colors";
const primaryClassName =
	"bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600";
const secondaryClassName =
	"bg-gray-500 text-white hover:bg-gray-600 focus:bg-gray-600";
const disabledClassName = "opacity-50 cursor-not-allowed";
const loadingClassName = "cursor-wait";

const getButtonClasses = (
	variant: ButtonVariantType,
	disabled: boolean,
	loading: boolean,
): string => {
	return clsx(
		baseClassName,
		variant === "primary" && primaryClassName,
		variant === "secondary" && secondaryClassName,
		(disabled || loading) && disabledClassName,
		loading && loadingClassName,
	);
};

export const Button: React.FC<ButtonProps> = ({
	variant = "primary",
	disabled = false,
	loading = false,
	children,
	onClick,
	type = "button",
	className,
}) => {
	const buttonClassName = clsx(
		getButtonClasses(variant, disabled, loading),
		className,
	);

	return (
		<button
			className={buttonClassName}
			disabled={disabled || loading}
			onClick={onClick}
			type={type}
		>
			{loading ? "Loading..." : children}
		</button>
	);
};
