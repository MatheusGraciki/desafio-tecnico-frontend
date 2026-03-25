import { useState } from "react";
import { FaBolt } from "react-icons/fa6";
import { ModalDefault } from "@/components/modalDefault";
import { MachineChart } from "../../../machineChart";
import { AnalysisMachineRow } from "@/app/indexPage/components/analysisMachineRow";
import type { Machine } from "@/services/machines/type";

type AnalysisSidebarAnaliseTabProps = {
	criticalMachines: Machine[];
	warningMachines: Machine[];
	machines: Machine[];
	onMachineSelect?: (machine: Machine) => void;
};

const SIDEBAR_LIST_PREVIEW = 6;

type ModalType = "critical" | "warning" | null;

export function AnalysTab({
	criticalMachines,
	warningMachines,
	machines,
	onMachineSelect,
}: AnalysisSidebarAnaliseTabProps) {
	const [listModal, setListModal] = useState<ModalType>(null);

	const closeModal = () => setListModal(null);

	function handleRowSelect(machine: Machine) {
		onMachineSelect?.(machine);
		closeModal();
	}
	const modalMachines =
		listModal === "critical"
			? criticalMachines
			: listModal === "warning"
				? warningMachines
				: [];
	const modalTitle = listModal === "critical" ? "Críticos" : "Atenção";

	return (
		<div className="analysis-sidebar-content">
			<section className="analysis-sidebar-section">
				<h3 className="analysis-sidebar-section-title">
					<FaBolt
						className="analysis-sidebar-section-title-icon"
						size={12}
						aria-hidden
					/>
					Críticos
					{criticalMachines.length > 0 ? (
						<span className="analysis-sidebar-section-count text-secondary fw-normal">
							({criticalMachines.length})
						</span>
					) : null}
				</h3>
				{criticalMachines.length ? (
					<>
						<div className="analysis-sidebar-row-group">
							{criticalMachines
								.slice(0, SIDEBAR_LIST_PREVIEW)
								.map((machine) => (
									<AnalysisMachineRow
										key={machine.id}
										machine={machine}
										variant="critical"
										onSelect={onMachineSelect}
									/>
								))}
						</div>
						{criticalMachines.length > SIDEBAR_LIST_PREVIEW ? (
							<button
								type="button"
								className="btn btn-primary btn-sm w-100 mt-2"
								onClick={() => setListModal("critical")}
							>
								Ver todos ({criticalMachines.length})
							</button>
						) : null}
					</>
				) : (
					<small className="text-secondary">Sem críticos.</small>
				)}
			</section>

			<section className="analysis-sidebar-section">
				<h3 className="analysis-sidebar-section-title">
					<FaBolt
						className="analysis-sidebar-section-title-icon"
						size={12}
						aria-hidden
					/>
					Atenção
					{warningMachines.length > 0 ? (
						<span className="analysis-sidebar-section-count text-secondary fw-normal">
							({warningMachines.length})
						</span>
					) : null}
				</h3>
				{warningMachines.length ? (
					<>
						<div className="analysis-sidebar-row-group">
							{warningMachines.slice(0, SIDEBAR_LIST_PREVIEW).map((machine) => (
								<AnalysisMachineRow
									key={machine.id}
									machine={machine}
									variant="warning"
									onSelect={onMachineSelect}
								/>
							))}
						</div>
						{warningMachines.length > SIDEBAR_LIST_PREVIEW ? (
							<button
								type="button"
								className="btn btn-primary btn-sm w-100 mt-2"
								onClick={() => setListModal("warning")}
							>
								Ver todos ({warningMachines.length})
							</button>
						) : null}
					</>
				) : (
					<small className="text-secondary">Sem itens de atenção.</small>
				)}
			</section>

			<section className="analysis-sidebar-section">
				<MachineChart machines={machines} />
			</section>

			<ModalDefault
				isOpen={listModal !== null}
				onClose={closeModal}
				title={
					<>
						{modalTitle}
						{modalMachines.length > 0 ? (
							<span className="text-secondary fw-normal ms-1">
								({modalMachines.length})
							</span>
						) : null}
					</>
				}
				className="analysis-sidebar-list-modal-dialog"
				contentClassName="analysis-sidebar-list-modal-content"
			>
				<div className="analysis-sidebar-row-group">
					{modalMachines.map((machine) => (
						<AnalysisMachineRow
							key={machine.id}
							machine={machine}
							variant={listModal === "critical" ? "critical" : "warning"}
							onSelect={handleRowSelect}
						/>
					))}
				</div>
			</ModalDefault>
		</div>
	);
}
