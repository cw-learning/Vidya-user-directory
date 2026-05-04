import { describe, expect, it } from "vitest";
import { createAppStore } from "../../../store/store";
import { clearFilters, resetUsersState, setSearch } from "./userSlice";

describe("userSlice", () => {
	it("stores filter state independently from remote user data", () => {
		const store = createAppStore();

		store.dispatch(setSearch("David"));

		expect(store.getState().users.filters.search).toBe("David");
	});

	it("clears filters back to the initial filter state", () => {
		const store = createAppStore();

		store.dispatch(setSearch("David"));
		store.dispatch(clearFilters());

		expect(store.getState().users.filters.search).toBe("");
	});

	it("resets all users ui state", () => {
		const store = createAppStore();

		store.dispatch(setSearch("David"));
		store.dispatch(resetUsersState());

		expect(store.getState().users.filters.search).toBe("");
	});
});
