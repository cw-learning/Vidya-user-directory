import { memo, useEffect, useId, useMemo, useState } from "react";

import { Button } from "../../../../shared/components/Button";
import { Card } from "../../../../shared/components/Card";
import { Input } from "../../../../shared/components/Input";
import { Select } from "../../../../shared/components/Select";
import type { UserDirectoryFiltersType } from "../../types/userDirectoryFilters.types";

export type SelectOptionType<T extends string = string> = {
	value: T;
	label: string;
};

export type UserFiltersProps = {
	filters: UserDirectoryFiltersType;
	roleOptions: SelectOptionType<UserDirectoryFiltersType["role"]>[];
	statusOptions: SelectOptionType<UserDirectoryFiltersType["status"]>[];
	genderOptions: SelectOptionType<UserDirectoryFiltersType["gender"]>[];
	onSearchChange: (value: string) => void;
	onRoleChange: (value: UserDirectoryFiltersType["role"]) => void;
	onStatusChange: (value: UserDirectoryFiltersType["status"]) => void;
	onGenderChange: (value: UserDirectoryFiltersType["gender"]) => void;
	onClearFilters: () => void;
};

const filterCardClassName = "bg-white/75 p-8 border border-blue-100 mb-8";
const filterIconContainerClassName = "p-4 bg-blue-100 rounded-lg";
const filterHeadingClassName = "text-2xl font-semibold text-gray-900";
const filterDescriptionClassName = "text-sm text-gray-700";
const filterFieldsetClassName =
	"grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5";
const clearButtonClassName =
	"rounded-lg border border-gray-300 bg-white px-4 py-4 text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-300";
const searchValidationMinChars = 2;
const searchDebounceMs = 400;

const getSearchError = (searchValue: string): string => {
	if (searchValue.trim().length === 0) {
		return "";
	}

	if (searchValue.trim().length < searchValidationMinChars) {
		return `Enter at least ${searchValidationMinChars} characters to search`;
	}

	return "";
};

export const UserFilters = memo(
	({
		filters,
		roleOptions,
		statusOptions,
		genderOptions,
		onSearchChange,
		onRoleChange,
		onStatusChange,
		onGenderChange,
		onClearFilters,
	}: UserFiltersProps) => {
		const headingId = useId();
		const [searchValue, setSearchValue] = useState<string>(filters.search);
		const [searchTouched, setSearchTouched] = useState<boolean>(false);

		useEffect(() => {
			setSearchValue(filters.search);

			if (filters.search.length === 0) {
				setSearchTouched(false);
			}
		}, [filters.search]);

		const searchError = useMemo(
			() => getSearchError(searchValue),
			[searchValue],
		);

		useEffect(() => {
			if (searchError || searchValue === filters.search) {
				return;
			}

			const debounceTimer = window.setTimeout(() => {
				onSearchChange(searchValue);
			}, searchDebounceMs);

			return () => {
				window.clearTimeout(debounceTimer);
			};
		}, [filters.search, onSearchChange, searchError, searchValue]);

		const handleSearchInputChange = (value: string) => {
			setSearchValue(value);
		};

		const handleSearchInputBlur = () => {
			setSearchTouched(true);
		};

		return (
			<Card className={filterCardClassName} aria-labelledby={headingId}>
				<div className="flex items-center gap-4 mb-4">
					<div className={filterIconContainerClassName}>
						<span className="text-blue-600 text-xl" aria-hidden="true">
							🔍
						</span>
					</div>
					<div>
						<h2 id={headingId} className={filterHeadingClassName}>
							Filter & Search
						</h2>
						<p className={filterDescriptionClassName}>
							Find users by name, role, status, or gender
						</p>
					</div>
				</div>

				<form onSubmit={(submitEvent) => submitEvent.preventDefault()}>
					<fieldset className={filterFieldsetClassName}>
						<legend className="sr-only">Filter the user directory</legend>
						<div className="lg:col-span-1">
							<Input
								label="Search users"
								value={searchValue}
								onChange={handleSearchInputChange}
								onBlur={handleSearchInputBlur}
								error={searchTouched ? searchError : undefined}
								placeholder="Name or email..."
								type="search"
								autoComplete="off"
							/>
						</div>

						<div className="lg:col-span-1">
							<Select
								label="Filter by role"
								value={filters.role}
								onChange={onRoleChange}
								options={roleOptions}
							/>
						</div>

						<div className="lg:col-span-1">
							<Select
								label="Filter by status"
								value={filters.status}
								onChange={onStatusChange}
								options={statusOptions}
							/>
						</div>

						<div className="lg:col-span-1">
							<Select
								label="Filter by gender"
								value={filters.gender}
								onChange={onGenderChange}
								options={genderOptions}
							/>
						</div>

						<div className="lg:col-span-1 flex items-center gap-2">
							<Button
								onClick={onClearFilters}
								variant="secondary"
								className={clearButtonClassName}
							>
								Clear filters
							</Button>
						</div>
					</fieldset>
				</form>
			</Card>
		);
	},
);

UserFilters.displayName = "UserFilters";
