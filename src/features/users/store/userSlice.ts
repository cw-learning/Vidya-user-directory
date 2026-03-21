import {
	createAsyncThunk,
	createSelector,
	createSlice,
	type PayloadAction,
} from "@reduxjs/toolkit";
import { USER_STATUS } from "../../../constants/userStatus";
import type { RootState } from "../../../store/store";
import { fetchUsers } from "../services/userService";
import type { UserType } from "../types/user.types";
import type { UserDirectoryFiltersType } from "../types/userDirectoryFilters.types";

const getInitialFilters = (): UserDirectoryFiltersType => ({
	search: "",
	role: "",
	status: "",
	gender: "",
});

export type UsersState = {
	users: UserType[];
	loading: boolean;
	error: string | null;
	filters: UserDirectoryFiltersType;
};

const createInitialState = (): UsersState => ({
	users: [],
	loading: true,
	error: null,
	filters: getInitialFilters(),
});

export const filterUsers = (
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

export const loadUsers = createAsyncThunk<
	UserType[],
	void,
	{ rejectValue: string }
>("users/load", async (_, { rejectWithValue }) => {
	const result = await fetchUsers({});

	if ("error" in result) {
		return rejectWithValue(result.error);
	}

	return result.users;
});

const usersSlice = createSlice({
	name: "users",
	initialState: createInitialState(),
	reducers: {
		setSearch: (state, action: PayloadAction<string>) => {
			state.filters.search = action.payload;
		},
		setRole: (
			state,
			action: PayloadAction<UserDirectoryFiltersType["role"]>,
		) => {
			state.filters.role = action.payload;
		},
		setStatus: (
			state,
			action: PayloadAction<UserDirectoryFiltersType["status"]>,
		) => {
			state.filters.status = action.payload;
		},
		setGender: (
			state,
			action: PayloadAction<UserDirectoryFiltersType["gender"]>,
		) => {
			state.filters.gender = action.payload;
		},
		clearFilters: (state) => {
			state.filters = getInitialFilters();
		},
		toggleUserStatus: (state, action: PayloadAction<string>) => {
			state.users = state.users.map((user) =>
				user.id === action.payload
					? {
							...user,
							status:
								user.status === USER_STATUS.ACTIVE
									? USER_STATUS.INACTIVE
									: USER_STATUS.ACTIVE,
						}
					: user,
			);
		},
		resetUsersState: () => createInitialState(),
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadUsers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loadUsers.fulfilled, (state, action) => {
				state.users = action.payload;
				state.error = null;
				state.loading = false;
			})
			.addCase(loadUsers.rejected, (state, action) => {
				state.users = [];
				state.loading = false;
				state.error =
					action.payload ?? action.error.message ?? "Failed to load users";
			});
	},
});

export const {
	setSearch,
	setRole,
	setStatus,
	setGender,
	clearFilters,
	toggleUserStatus,
	resetUsersState,
} = usersSlice.actions;

const selectUsersState = (state: RootState) => state.users;

export const selectUsers = (state: RootState) => selectUsersState(state).users;
export const selectLoading = (state: RootState) =>
	selectUsersState(state).loading;
export const selectError = (state: RootState) => selectUsersState(state).error;
export const selectFilters = (state: RootState) =>
	selectUsersState(state).filters;
export const selectFilteredUsers = createSelector(
	[selectUsers, selectFilters],
	filterUsers,
);

export default usersSlice.reducer;
