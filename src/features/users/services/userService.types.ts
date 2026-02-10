import type { UserGenderType } from "../types/user.types";

export type RandomUserNameType = {
	first: string;
	last: string;
};

export type RandomUserLocationType = {
	city: string;
	country: string;
};

export type RandomUserPictureType = {
	thumbnail: string;
	medium: string;
};

export type RandomUserRegisteredType = {
	date: string;
	age: number;
};

export type RandomUserResultType = {
	login: {
		uuid: string;
	};
	name: RandomUserNameType;
	email: string;
	gender: UserGenderType;
	location: RandomUserLocationType;
	picture: RandomUserPictureType;
	registered: RandomUserRegisteredType;
};

export type RandomUserApiResponseType = {
	results: RandomUserResultType[];
};

export type UserFiltersType = {
	search?: string;
	role?: string;
	status?: string;
	gender?: string;
};
