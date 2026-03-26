import clsx from "clsx";
import type { ButtonHTMLAttributes, FC, ReactNode } from "react";

type ButtonVariantType = "primary" | "secondary";

type ButtonType = "button" | "submit";

export interface ButtonProps
	extends Omit<
		ButtonHTMLAttributes<HTMLButtonElement>,
		"children" | "className" | "disabled" | "onClick" | "type"
	> {
	variant?: ButtonVariantType;
	disabled?: boolean;
	loading?: boolean;
	children: ReactNode;
	onClick?: () => void;
	type?: ButtonType;
	className?: string;
}

const baseClassName =
	"min-h-11 px-4 py-2 rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2";
const primaryClassName =
	"bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700 focus-visible:ring-blue-300";
const secondaryClassName =
	"bg-gray-700 text-white hover:bg-gray-800 focus:bg-gray-800 focus-visible:ring-gray-300";
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

export const Button: FC<ButtonProps> = ({
	variant = "primary",
	disabled = false,
	loading = false,
	children,
	onClick,
	type = "button",
	className,
	...props
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
			aria-busy={loading}
			aria-live="polite"
			{...props}
		>
			{loading ? "Loading..." : children}
		</button>
	);
};
