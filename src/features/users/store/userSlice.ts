import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../store/store";
import type { UserDirectoryFiltersType } from "../types/userDirectoryFilters.types";

const getInitialFilters = (): UserDirectoryFiltersType => ({
	search: "",
	role: "",
	status: "",
	gender: "",
});

export type UsersState = {
	filters: UserDirectoryFiltersType;
};

const createInitialState = (): UsersState => ({
	filters: getInitialFilters(),
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
		resetUsersState: () => createInitialState(),
	},
});

export const {
	setSearch,
	setRole,
	setStatus,
	setGender,
	clearFilters,
	resetUsersState,
} = usersSlice.actions;

const selectUsersState = (state: RootState) => state.users;

export const selectFilters = (state: RootState) =>
	selectUsersState(state).filters;

export default usersSlice.reducer;
