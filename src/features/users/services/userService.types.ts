import type { UserRoleType } from "../../../constants/userRoles";
import type { UserStatusType } from "../../../constants/userStatus";
import type { UserGenderType } from "../types/user.types";

export type JsonPlaceholderAddressType = {
	street: string;
	suite: string;
	city: string;
	zipcode: string;
	geo: {
		lat: string;
		lng: string;
	};
};

export type JsonPlaceholderCompanyType = {
	name: string;
	catchPhrase: string;
	bs: string;
};

export type JsonPlaceholderUserType = {
	id: number;
	name: string;
	username: string;
	email: string;
	address: JsonPlaceholderAddressType;
	phone: string;
	website: string;
	company: JsonPlaceholderCompanyType;
};

export type JsonPlaceholderApiResponseType = JsonPlaceholderUserType[];

export type UserFiltersType = {
	search?: string;
	role?: UserRoleType | "";
	status?: UserStatusType | "";
	gender?: UserGenderType | "";
};
