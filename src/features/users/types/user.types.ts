import type { UserRoleType } from "../../../constants/userRoles";
import type { UserStatusType } from "../../../constants/userStatus";

export type UserNameType = {
	first: string;
	last: string;
};

export type UserLocationType = {
	city: string;
	country: string;
};

export type UserPictureType = {
	thumbnail: string;
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
	location: UserLocationType;
	picture: UserPictureType;
	role: UserRoleType;
	status: UserStatusType;
	registered: {
		date: string;
		age: number;
	};
};
