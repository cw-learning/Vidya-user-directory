import { memo } from "react";

import type { UserType } from "../../types/user.types";
import { UserCard } from "../UserCard";

interface UserResultsProps {
	users: UserType[];
	loading: boolean;
	error: string | null;
	onToggleStatus: (id: string) => void;
}

export const UserResults = memo(
	({ users, loading, error, onToggleStatus }: UserResultsProps) => {
		return (
			<section aria-labelledby="results-heading">
				<header className="flex justify-between items-center mb-4">
					<div>
						<h3
							id="results-heading"
							className="text-2xl font-bold text-gray-900"
						>
							Users
						</h3>
						<p className="text-gray-200 mt-1">
							{users.length} {users.length === 1 ? "user" : "users"} found
						</p>
					</div>
					{!loading && !error && users.length > 0 && (
						<div className="flex items-center gap-2 text-sm text-gray-200">
							<span className="w-2 h-2 bg-green-500 rounded-full"></span>
							Updated just now
						</div>
					)}
				</header>

				{loading && (
					<div aria-live="polite" className="text-center py-16">
						<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
						<p className="text-gray-600 font-medium">Loading users...</p>
						<p className="text-gray-400 text-sm mt-4">
							Fetching data from server
						</p>
					</div>
				)}

				{!loading && error && (
					<div
						role="alert"
						className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-4"
					>
						<span className="text-red-500 text-xl">⚠️</span>
						<div>
							<p className="font-semibold">Error loading users</p>
							<p className="text-sm">{error}</p>
						</div>
					</div>
				)}

				{!loading && !error && users.length === 0 && (
					<div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
						<div className="text-6xl mb-4">👤</div>
						<p className="text-gray-500 text-xl font-medium">No users found</p>
						<p className="text-gray-400 text-sm mt-4">
							Try adjusting your filters or search terms
						</p>
					</div>
				)}

				{!loading && !error && users.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
