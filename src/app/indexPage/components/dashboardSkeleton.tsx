export function DashboardSkeleton() {
	return (
		<div className="index-page-skeleton">
			<div className="index-page-skeleton-top">
				{Array.from({ length: 4 }).map((_, index) => (
					<div
						key={index}
						className="bg-body-secondary rounded index-page-skeleton-card"
					/>
				))}
			</div>
			<div className="index-page-skeleton-bottom">
				<div className="bg-body-secondary rounded index-page-skeleton-main" />
				<div className="bg-body-secondary rounded index-page-skeleton-side" />
			</div>
		</div>
	);
}
