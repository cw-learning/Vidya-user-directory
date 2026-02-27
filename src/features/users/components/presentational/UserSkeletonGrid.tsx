import { memo } from "react";

import { Card } from "../../../../shared/components/Card";

const skeletonItems = Array.from(
	{ length: 8 },
	(_, index) => `skeleton-${index}`,
);

const skeletonContainerClassName = "text-center py-16";
const skeletonTitleClassName = "text-gray-600 font-medium mb-4";
const skeletonDescriptionClassName = "text-gray-400 text-sm mb-8";
const skeletonGridClassName =
	"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
const skeletonCardClassName =
	"bg-white/75 p-6 animate-pulse border border-gray-100";
const skeletonAvatarClassName =
	"h-16 w-16 rounded-full bg-gray-200 mx-auto mb-4";
const skeletonNameClassName = "h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2";
const skeletonEmailClassName = "h-3 bg-gray-200 rounded w-2/3 mx-auto mb-4";
const skeletonButtonClassName = "h-9 bg-gray-200 rounded w-full";

export const UserSkeletonGrid = memo(() => {
	return (
		<div aria-live="polite" className={skeletonContainerClassName}>
			<p className={skeletonTitleClassName}>Loading users...</p>
			<p className={skeletonDescriptionClassName}>Fetching data from server</p>
			<div className={skeletonGridClassName}>
				{skeletonItems.map((itemKey) => (
					<Card key={itemKey} className={skeletonCardClassName}>
						<div className={skeletonAvatarClassName} />
						<div className={skeletonNameClassName} />
						<div className={skeletonEmailClassName} />
						<div className={skeletonButtonClassName} />
					</Card>
				))}
			</div>
		</div>
	);
});

UserSkeletonGrid.displayName = "UserSkeletonGrid";
