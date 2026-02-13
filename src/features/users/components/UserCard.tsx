import type { FC } from "react";

import { USER_STATUS } from "../../../constants/userStatus";
import { Button } from "../../../shared/components/Button";
import type { UserType } from "../types/user.types";

interface UserCardProps {
	user: UserType;
	onToggleStatus: (id: string) => void;
}

export const UserCard: FC<UserCardProps> = ({ user, onToggleStatus }) => {
	const handleClickToggleStatus = () => onToggleStatus(user.id);

	const fullName = `${user.name.first} ${user.name.last}`;
	const cardAriaLabel = `User ${fullName}, role ${user.role}, status ${user.status}, email ${user.email}`;

	const getStatusColor = (status: string) => {
		switch (status) {
			case USER_STATUS.ACTIVE:
				return "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100";
			case USER_STATUS.INACTIVE:
				return "bg-red-50 text-red-700 border-red-200 shadow-red-100";
			case USER_STATUS.PENDING:
				return "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100";
			default:
				return "bg-gray-50 text-gray-700 border-gray-200 shadow-gray-100";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case USER_STATUS.ACTIVE:
				return "🟢";
			case USER_STATUS.INACTIVE:
				return "🔴";
			case USER_STATUS.PENDING:
				return "🟡";
			default:
				return "⚪";
		}
	};

	const getGenderIcon = (gender: string) => {
		return gender === "male" ? "👨" : "👩";
	};

	const cardClassName =
		"group relative bg-white/75 border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1";
	const statusBadgeClassName = `flex items-center gap-1 px-4 py-4 rounded-full text-xs font-semibold border shadow-sm ${getStatusColor(user.status)}`;
	const profileImageClassName =
		"w-20 h-20 rounded-full border-4 border-white shadow-lg";
	const genderBadgeClassName =
		"absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md";
	const roleBadgeClassName =
		"inline-flex items-center gap-2 px-8 py-4 bg-blue-50 text-blue-700 rounded-full text-sm font-medium";
	const locationCardClassName =
		"flex items-center gap-4 p-4 bg-gray-50 rounded-lg";
	const toggleButtonClassName =
		"w-full py-4 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105";
	const overlayClassName =
		"absolute inset-0 bg-linear-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/20 group-hover:to-purple-50/20 transition-all duration-300 pointer-events-none rounded-2xl";

	return (
		<article className={cardClassName} aria-label={cardAriaLabel}>
			<div className="absolute top-4 right-4 z-10">
				<div className={statusBadgeClassName}>
					<span className="text-sm">{getStatusIcon(user.status)}</span>
					{user.status}
				</div>
			</div>

			<header className="pt-8 pb-4 px-8 text-center">
				<div className="relative inline-block mb-4">
					<div
						className={`${profileImageClassName} bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl`}
					>
						{user.name.first[0]}
						{user.name.last[0]}
					</div>
					<div className={genderBadgeClassName}>
						<span
							className="text-xl"
							role="img"
							aria-label={`Gender: ${user.gender}`}
						>
							{getGenderIcon(user.gender)}
						</span>
					</div>
				</div>
				<div>
					<h3 className="text-xl font-bold text-gray-900 mb-1">{fullName}</h3>
					<p className="text-sm text-gray-600 mb-2">{user.email}</p>
					<div className={roleBadgeClassName}>
						<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
						{user.role}
					</div>
				</div>
			</header>

			<section className="px-8 pb-4">
				<dl className="grid grid-cols-1 gap-3 text-sm">
					<div className={locationCardClassName}>
						<span className="text-gray-400">📍</span>
						<div>
							<dt className="font-medium text-gray-500 text-xs uppercase tracking-wide">
								Location
							</dt>
							<dd className="text-gray-900 font-medium" title={`${user.city}`}>
								{user.city}
							</dd>
						</div>
					</div>
				</dl>
			</section>

			<footer className="px-8 pb-6">
				<Button
					onClick={handleClickToggleStatus}
					variant={user.status === USER_STATUS.ACTIVE ? "secondary" : "primary"}
					className={toggleButtonClassName}
				>
					{user.status === USER_STATUS.ACTIVE
						? "Deactivate User"
						: "Activate User"}
				</Button>
			</footer>

			<div className={overlayClassName}></div>
		</article>
	);
};
