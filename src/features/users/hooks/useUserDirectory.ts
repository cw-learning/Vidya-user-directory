import { useCallback, useEffect, useMemo, useState } from "react";
import type { UserRoleType } from "../../../constants/userRoles";
import type { UserStatusType } from "../../../constants/userStatus";
import { USER_STATUS } from "../../../constants/userStatus";
import { fetchUsers } from "../services/userService";
import type { UserGenderType, UserType } from "../types/user.types";

export type UserDirectoryFiltersType = {
    search: string;
    role: UserRoleType | "";
    status: UserStatusType | "";
    gender: UserGenderType | "";
};

const initialFilters: UserDirectoryFiltersType = {
    search: "",
    role: "",
    status: "",
    gender: "",
};

export const useUserDirectory = () => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<UserDirectoryFiltersType>(initialFilters);

    const fetchAllUsersData = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchUsers({});

            if ("error" in result) {
                setUsers([]);
                setError(result.error);
            } else {
                setUsers(result.users);
            }
        } catch (fetchError) {
            setUsers([]);
            setError(`Failed to fetch users, ${String(fetchError)}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllUsersData();
    }, [fetchAllUsersData]);

    const filteredUsers = useMemo(() => {
        let filtered = users;

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(
                (user) =>
                    user.name.first.toLowerCase().includes(searchLower) ||
                    user.name.last.toLowerCase().includes(searchLower) ||
                    user.email.toLowerCase().includes(searchLower),
            );
        }

        if (filters.role) {
            filtered = filtered.filter((user) => user.role === filters.role);
        }

        if (filters.status) {
            filtered = filtered.filter((user) => user.status === filters.status);
        }

        if (filters.gender) {
            filtered = filtered.filter((user) => user.gender === filters.gender);
        }

        return filtered;
    }, [users, filters]);

    const setSearchFilter = useCallback((value: string) => {
        setFilters((prev) => ({ ...prev, search: value }));
    }, []);

    const setRoleFilter = useCallback((value: UserRoleType | "") => {
        setFilters((prev) => ({ ...prev, role: value }));
    }, []);

    const setStatusFilter = useCallback((value: UserStatusType | "") => {
        setFilters((prev) => ({ ...prev, status: value }));
    }, []);

    const setGenderFilter = useCallback((value: UserGenderType | "") => {
        setFilters((prev) => ({ ...prev, gender: value }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters(initialFilters);
    }, []);

    const toggleUserStatus = useCallback((id: string) => {
        setUsers((prev) =>
            prev.map((user) =>
                user.id === id
                    ? {
                        ...user,
                        status:
                            user.status === USER_STATUS.ACTIVE
                                ? USER_STATUS.INACTIVE
                                : USER_STATUS.ACTIVE,
                    }
                    : user,
            ),
        );
    }, []);

    return {
        users: filteredUsers,
        loading,
        error,
        filters,
        setSearchFilter,
        setRoleFilter,
        setStatusFilter,
        setGenderFilter,
        clearFilters,
        toggleUserStatus,
        retryFetch: fetchAllUsersData,
    };
};
