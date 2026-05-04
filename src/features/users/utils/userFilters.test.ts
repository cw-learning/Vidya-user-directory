import { describe, expect, it } from "vitest";

import { USER_ROLES } from "../../../constants/userRoles";
import { USER_STATUS } from "../../../constants/userStatus";
import { mockUsers } from "../testing/fixtures/user.fixture";
import { UserGenderType } from "../types/user.types";
import { filterUsers, getToggledUserStatus } from "./userFilters";

describe("userFilters", () => {
	it("filters users by search, role, status, and gender", () => {
		const result = filterUsers(mockUsers, {
			search: "sara",
			role: USER_ROLES.ANALYST,
			status: USER_STATUS.INACTIVE,
			gender: UserGenderType.FEMALE,
		});

		expect(result).toHaveLength(1);
		expect(result[0]?.id).toBe("2");
	});

	it("returns the next local status for a toggle action", () => {
		expect(getToggledUserStatus(USER_STATUS.ACTIVE)).toBe(USER_STATUS.INACTIVE);
		expect(getToggledUserStatus(USER_STATUS.INACTIVE)).toBe(USER_STATUS.ACTIVE);
	});
});
