import clsx from "clsx";
import type { ComponentPropsWithoutRef, FC, ReactNode } from "react";

export interface CardProps extends ComponentPropsWithoutRef<"div"> {
	children: ReactNode;
}

const baseClassName = "bg-white rounded-2xl border border-gray-200 shadow-sm";

export const Card: FC<CardProps> = ({ children, className, ...props }) => {
	return (
		<div className={clsx(baseClassName, className)} {...props}>
			{children}
		</div>
	);
};
