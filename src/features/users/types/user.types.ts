import type { UserRoleType } from "../../../constants/userRoles";
import type { UserStatusType } from "../../../constants/userStatus";

export type UserNameType = {
	first: string;
	last: string;
};

export enum UserGenderType {
	MALE = "male",
	FEMALE = "female",
}

export type UserType = {
	id: string;
	name: UserNameType;
	email: string;
	gender: UserGenderType;
	city: string;
	role: UserRoleType;
	status: UserStatusType;
};
