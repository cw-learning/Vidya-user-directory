export enum USER_STATUS {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
	PENDING = "PENDING",
}

export type UserStatusType = (typeof USER_STATUS)[keyof typeof USER_STATUS];
