import { useState } from "react";
import { FaBolt } from "react-icons/fa6";
import { ModalDefault } from "@/components/common/modalDefault";
import type { Machine } from "@/services/machines/type";
import { usePrevisoes } from "./hooks/usePrevisoes";
import { PrevisoesList } from "./PrevisoesList";

type PrevisoesTabProps = {
	machines: Machine[];
};

export function PrevisoesTab({ machines }: PrevisoesTabProps) {
	const [showModal, setShowModal] = useState(false);
	const MAX_PREVIEW = 8;
	const previsoes = usePrevisoes(machines);
	const previewPrevisoes = previsoes.slice(0, MAX_PREVIEW);
	const hasMore = previsoes.length > MAX_PREVIEW;

	return (
		<div className="analysis-sidebar-content">
			<section className="analysis-sidebar-section">
				<h3 className="analysis-sidebar-section-title">
					<FaBolt className="analysis-sidebar-section-title-icon" size={12} aria-hidden />
					Previsões
				</h3>
				{previsoes.length ? (
					<>
						<PrevisoesList items={previewPrevisoes} />
						{hasMore && (
							<button
								type="button"
								className="btn btn-primary btn-sm w-100 mt-2"
								onClick={() => setShowModal(true)}
							>
								Ver todos ({previsoes.length})
							</button>
						)}
						<ModalDefault
							isOpen={showModal}
							onClose={() => setShowModal(false)}
							title={
								<>
									Previsões
									<span className="text-secondary fw-normal ms-1">
										({previsoes.length})
									</span>
								</>
							}
							className="analysis-sidebar-list-modal-dialog"
							contentClassName="analysis-sidebar-list-modal-content"
						>
							<PrevisoesList items={previsoes} />
						</ModalDefault>
					</>
				) : (
					<small className="text-secondary">Sem previsões.</small>
				)}
			</section>
		</div>
	);
}
