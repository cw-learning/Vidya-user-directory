export enum USER_ROLES {
	ADMIN = "Admin",
	MANAGER = "Manager",
	DEVELOPER = "Developer",
	DESIGNER = "Designer",
	ANALYST = "Analyst",
}

export type UserRoleType = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const getRoleOptions = () => {
	return Object.values(USER_ROLES).map((role) => ({
		value: role,
		label: role,
	}));
};
