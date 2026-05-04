import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { userQueryKeys } from "../queryKeys";
import { fetchUserDirectoryUsers } from "../services/userService";
import type { UserType } from "../types/user.types";

export function useUsersQuery(): UseQueryResult<UserType[], Error> {
	return useQuery({
		queryKey: userQueryKeys.list(),
		queryFn: fetchUserDirectoryUsers,
	});
}
