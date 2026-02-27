import { memo } from "react";

import type { UserType } from "../../types/user.types";
import { UserCard } from "../UserCard";

export type UserResultsProps = {
	users: UserType[];
	error: string | null;
	onToggleStatus: (id: string) => void;
};

const resultsHeadingClassName = "text-2xl font-bold text-gray-900";
const resultsCountClassName = "text-gray-200 mt-1";
const liveIndicatorClassName = "flex items-center gap-2 text-sm text-gray-200";
const liveIndicatorDotClassName = "w-2 h-2 bg-green-500 rounded-full";
const errorAlertClassName =
	"bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-4";
const emptyStateContainerClassName =
	"text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200";
const emptyStateIconClassName = "text-6xl mb-4";
const emptyStateTitleClassName = "text-gray-500 text-xl font-medium";
const emptyStateDescriptionClassName = "text-gray-400 text-sm mt-4";
const userGridClassName =
	"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";

export const UserResults = memo(
	({ users, error, onToggleStatus }: UserResultsProps) => {
		return (
			<section aria-labelledby="results-heading">
				<header className="flex justify-between items-center mb-4">
					<div>
						<h3 id="results-heading" className={resultsHeadingClassName}>
							Users
						</h3>
						<p className={resultsCountClassName}>
							{users.length} {users.length === 1 ? "user" : "users"} found
						</p>
					</div>
					{!error && users.length > 0 && (
						<div className={liveIndicatorClassName}>
							<span className={liveIndicatorDotClassName} />
							Updated just now
						</div>
					)}
				</header>

				{error && (
					<div role="alert" className={errorAlertClassName}>
						<span className="text-red-500 text-xl">⚠️</span>
						<div>
							<p className="font-semibold">Error loading users</p>
							<p className="text-sm">{error}</p>
						</div>
					</div>
				)}

				{!error && users.length === 0 && (
					<div className={emptyStateContainerClassName}>
						<div className={emptyStateIconClassName}>👤</div>
						<p className={emptyStateTitleClassName}>No users found</p>
						<p className={emptyStateDescriptionClassName}>
							Try adjusting your filters or search terms
						</p>
					</div>
				)}

				{!error && users.length > 0 && (
					<div className={userGridClassName}>
						{users.map((user) => (
							<UserCard
								key={user.id}
								user={user}
								onToggleStatus={onToggleStatus}
							/>
						))}
					</div>
				)}
			</section>
		);
	},
);

UserResults.displayName = "UserResults";
