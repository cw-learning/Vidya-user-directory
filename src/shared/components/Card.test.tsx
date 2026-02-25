import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card } from "./Card";

const renderCard = (content: string, className?: string) => {
	return render(<Card className={className}>{content}</Card>);
};

describe("Card Component", () => {
	it("should render children", () => {
		renderCard("Card Content");

		expect(screen.getByText(/card content/i)).toBeInTheDocument();
	});
});
