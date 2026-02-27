import type { FC } from "react";
import type { FallbackProps } from "react-error-boundary";

import { Button } from "./Button";
import { Card } from "./Card";

export interface ErrorFallbackProps extends FallbackProps {
	title?: string;
	description?: string;
}

const errorCardClassName = "bg-red-50/80 border-red-200 p-6";
const errorTitleClassName = "text-xl font-semibold text-red-800 mb-2";
const errorDescriptionClassName = "text-sm text-red-700 mb-4";
const errorMessageClassName =
	"text-xs text-red-600 mb-4 bg-red-100 p-3 rounded overflow-auto max-h-32";
const retryButtonClassName = "px-4 py-2";

const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === "string") {
		return error;
	}
	return "Unknown error";
};

export const ErrorFallback: FC<ErrorFallbackProps> = ({
	error,
	resetErrorBoundary,
	title = "Something went wrong",
	description = "A runtime error occurred in this section. Click retry to recover.",
}) => {
	const errorMessage = getErrorMessage(error);

	return (
		<Card className={errorCardClassName} role="alert">
			<h2 className={errorTitleClassName}>{title}</h2>
			<p className={errorDescriptionClassName}>{description}</p>
			{errorMessage && (
				<pre className={errorMessageClassName}>{errorMessage}</pre>
			)}
			<Button
				onClick={resetErrorBoundary}
				variant="secondary"
				className={retryButtonClassName}
			>
				Retry
			</Button>
		</Card>
	);
};
