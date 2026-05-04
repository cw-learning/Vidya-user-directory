import { USER_ROLES } from "../../../../constants/userRoles";
import { USER_STATUS } from "../../../../constants/userStatus";
import { UserGenderType, type UserType } from "../../types/user.types";

const SINGLE_USER_FIXTURE_COUNT = 1;

export const mockUsers: UserType[] = [
	{
		id: "1",
		name: { first: "David", last: "George" },
		email: "david@example.com",
		gender: UserGenderType.MALE,
		role: USER_ROLES.ADMIN,
		status: USER_STATUS.ACTIVE,
		city: "Delhi",
	},
	{
		id: "2",
		name: { first: "Sara", last: "nate" },
		email: "sara@example.com",
		gender: UserGenderType.FEMALE,
		role: USER_ROLES.ANALYST,
		status: USER_STATUS.INACTIVE,
		city: "Mumbai",
	},
];

export const mockSingleUser: UserType[] = mockUsers.slice(
	0,
	SINGLE_USER_FIXTURE_COUNT,
);
