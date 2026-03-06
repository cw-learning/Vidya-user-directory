import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { USER_STATUS } from "../../../constants/userStatus";
import { fetchUsers } from "../services/userService";
import type { UserType } from "../types/user.types";
import type { UserDirectoryFiltersType } from "../types/userDirectoryFilters.types";

const getInitialFilters = (): UserDirectoryFiltersType => ({
    search: "",
    role: "",
    status: "",
    gender: "",
});

type UserStoreState = {
    users: UserType[];
    loading: boolean;
    error: string | null;
    filters: UserDirectoryFiltersType;
};

type UserStoreActions = {
    loadUsers: () => Promise<void>;
    setSearch: (search: string) => void;
    setRole: (role: UserDirectoryFiltersType["role"]) => void;
    setStatus: (status: UserDirectoryFiltersType["status"]) => void;
    setGender: (gender: UserDirectoryFiltersType["gender"]) => void;
    clearFilters: () => void;
    toggleUserStatus: (id: string) => void;
};

type UserStore = UserStoreState & UserStoreActions;

const createInitialState = (): UserStoreState => ({
    users: [],
    loading: true,
    error: null,
    filters: getInitialFilters(),
});

const applyFilters = (
    users: UserType[],
    filters: UserDirectoryFiltersType,
): UserType[] => {
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
};

export const filterUsers = (
    users: UserType[],
    filters: UserDirectoryFiltersType,
): UserType[] => {
    return applyFilters(users, filters);
};

export const useUserStore = create<UserStore>()(
    devtools((set) => ({
        ...createInitialState(),
        loadUsers: async () => {
            set({ loading: true, error: null }, false, "users/load/start");

            try {
                const result = await fetchUsers({});

                if ("error" in result) {
                    set({ users: [], error: result.error }, false, "users/load/error");
                } else {
                    set(
                        { users: result.users, error: null },
                        false,
                        "users/load/success",
                    );
                }
            } catch (e) {
                set({ users: [], error: e instanceof Error ? e.message : String(e) }, false, "users/load/exception");
            } finally {
                set({ loading: false }, false, "users/load/finish");
            }
        },
        setSearch: (search) =>
            set(
                (state) => ({
                    filters: { ...state.filters, search },
                }),
                false,
                "users/filters/search",
            ),
        setRole: (role) =>
            set(
                (state) => ({
                    filters: { ...state.filters, role },
                }),
                false,
                "users/filters/role",
            ),
        setStatus: (status) =>
            set(
                (state) => ({
                    filters: { ...state.filters, status },
                }),
                false,
                "users/filters/status",
            ),
        setGender: (gender) =>
            set(
                (state) => ({
                    filters: { ...state.filters, gender },
                }),
                false,
                "users/filters/gender",
            ),
        clearFilters: () =>
            set(
                () => ({
                    filters: getInitialFilters(),
                }),
                false,
                "users/filters/clear",
            ),
        toggleUserStatus: (id) =>
            set(
                (state) => ({
                    users: state.users.map((user) =>
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
                }),
                false,
                "users/status/toggle",
            ),
    })),
);

export const resetUserStore = () => {
    useUserStore.setState(createInitialState());
};
