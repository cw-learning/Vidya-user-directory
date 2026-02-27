import { memo } from "react";

import { Button } from "../../../../shared/components/Button";
import { Card } from "../../../../shared/components/Card";
import { Input } from "../../../../shared/components/Input";
import { Select } from "../../../../shared/components/Select";
import type { UserDirectoryFiltersType } from "../../types/userDirectoryFilters.types";

export type SelectOptionType = { value: string; label: string };

export type UserFiltersProps = {
	filters: UserDirectoryFiltersType;
	roleOptions: SelectOptionType[];
	statusOptions: SelectOptionType[];
	genderOptions: SelectOptionType[];
	onSearchChange: (value: string) => void;
	onRoleChange: (value: string) => void;
	onStatusChange: (value: string) => void;
	onGenderChange: (value: string) => void;
	onClearFilters: () => void;
};

const filterCardClassName = "bg-white/75 p-8 border border-blue-100 mb-8";
const filterIconContainerClassName = "p-4 bg-blue-100 rounded-lg";
const filterHeadingClassName = "text-xl font-semibold text-gray-800";
const filterDescriptionClassName = "text-sm text-gray-600";
const filterFormClassName =
	"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4";
const clearButtonClassName =
	"px-4 py-4 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200";

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
		return (
			<Card className={filterCardClassName} aria-labelledby="filters-heading">
				<div className="flex items-center gap-4 mb-4">
					<div className={filterIconContainerClassName}>
						<span className="text-blue-600 text-xl">🔍</span>
					</div>
					<div>
						<h3 id="filters-heading" className={filterHeadingClassName}>
							Filter & Search
						</h3>
						<p className={filterDescriptionClassName}>
							Find users by name, role, status, or gender
						</p>
					</div>
				</div>

				<form
					className={filterFormClassName}
					onSubmit={(event) => event.preventDefault()}
				>
					<div className="lg:col-span-1">
						<Input
							label="Search Users"
							value={filters.search}
							onChange={onSearchChange}
							placeholder="Name or email..."
							type="search"
						/>
					</div>

					<div className="lg:col-span-1">
						<Select
							label="Role"
							value={filters.role}
							onChange={onRoleChange}
							options={roleOptions}
						/>
					</div>

					<div className="lg:col-span-1">
						<Select
							label="Status"
							value={filters.status}
							onChange={onStatusChange}
							options={statusOptions}
						/>
					</div>

					<div className="lg:col-span-1">
						<Select
							label="Gender"
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
							Clear Filters
						</Button>
					</div>
				</form>
			</Card>
		);
	},
);

UserFilters.displayName = "UserFilters";
