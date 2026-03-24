import type { Machine } from "@/services/machines/type";

type PrevTabProps = {
	machines: Machine[];
};

export function PrevTab({ machines }: PrevTabProps) {
	return (
		<div className="analysis-sidebar-content">
			<section className="analysis-sidebar-section">
				<small className="text-secondary">Implementação futura</small>
			</section>
		</div>
	);
}
