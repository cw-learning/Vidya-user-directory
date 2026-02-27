import type { UserRoleType } from "../../../constants/userRoles";
import type { UserStatusType } from "../../../constants/userStatus";
import type { UserGenderType } from "./user.types";

export type UserDirectoryFiltersType = {
	search: string;
	role: UserRoleType | "";
	status: UserStatusType | "";
	gender: UserGenderType | "";
};