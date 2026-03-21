import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../features/users/store/userSlice";

export const createAppStore = () => {
	return configureStore({
		reducer: {
			users: usersReducer,
		},
	});
};

export const store = createAppStore();

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
