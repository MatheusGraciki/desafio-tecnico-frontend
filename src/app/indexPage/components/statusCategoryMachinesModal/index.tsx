import type { Machine, MachineStatusCategory } from "@/services/machines/type";
import { ModalDefault } from "@/components/modalDefault";
import { AnalysisMachineRow } from "../analysisMachineRow";
import { statusCategoryToRowVariant } from "../analysisMachineRow/categoryVariant";

export type StatusCategoryMachinesModalProps = {
	isOpen: boolean;
	title: string;
	category: MachineStatusCategory | null;
	machines: Machine[];
	onClose: () => void;
	onSelectMachine: (machine: Machine) => void;
};

export function StatusCategoryMachinesModal({
	isOpen,
	title,
	category,
	machines,
	onClose,
	onSelectMachine,
}: StatusCategoryMachinesModalProps) {
	const variant = category ? statusCategoryToRowVariant(category) : "neutral";

	return (
		<ModalDefault
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			className="analysis-sidebar-list-modal-dialog"
			contentClassName="analysis-sidebar-list-modal-content"
		>
			{machines.length === 0 ? (
				<p className="text-secondary small mb-0">
					Nenhuma máquina nesta categoria com os filtros atuais.
				</p>
			) : (
				<div className="analysis-sidebar-list-modal-body">
					<div className="analysis-sidebar-row-group">
						{machines.map((machine) => (
							<AnalysisMachineRow
								key={machine.id}
								machine={machine}
								variant={variant}
								onSelect={onSelectMachine}
							/>
						))}
					</div>
				</div>
			)}
		</ModalDefault>
	);
}
