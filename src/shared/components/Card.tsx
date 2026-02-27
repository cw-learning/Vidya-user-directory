import clsx from "clsx";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export type CardProps<T extends ElementType = "div"> = {
	as?: T;
	children: ReactNode;
	className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const baseClassName = "bg-white rounded-2xl border border-gray-200 shadow-sm";

export const Card = <T extends ElementType = "div">({
	as,
	children,
	className,
	...props
}: CardProps<T>) => {
	const Component = as ?? "div";
	return (
		<Component className={clsx(baseClassName, className)} {...props}>
			{children}
		</Component>
	);
};
