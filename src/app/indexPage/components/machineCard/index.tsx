import { memo, type MouseEvent, type ReactNode } from "react";
import { FaRegEdit } from "react-icons/fa";
import {
	FaBolt,
	FaCircleExclamation,
	FaCirclePause,
	FaDroplet,
	FaGaugeHigh,
	FaGear,
	FaIndustry,
	FaTemperatureThreeQuarters,
	FaTriangleExclamation,
	FaWaveSquare,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import type { Machine, MachineStatusCategory } from "@/services/machines/type";
import { Card } from "@/components/card";
import { formatPotenciaW, formatRpm, formatTemperatura } from "@/app/indexPage/utils/format";
import { getLastMachineData, getStatusInfo } from "../../utils/machine";
import type { MachineCardProps } from "./type";
import "./styles.scss";

const FOOTER_ICONS: Record<MachineStatusCategory, IconType> = {
	operando: FaBolt,
	alerta: FaCircleExclamation,
	atencao: FaTriangleExclamation,
	parada: FaCirclePause,
};

function displayMachineName(machine: Machine): string {
	const nome = machine.nome?.trim();
	return nome || machine.codigo;
}

function resolveFooterLabel(machine: Machine, category: MachineStatusCategory): string {
	if (category === "operando") return "Operando";
	if (machine.alertas?.length) return machine.alertas[0];
	return machine.status;
}

function MachineMetric({
	label,
	icon,
	value,
}: {
	label: string;
	icon: ReactNode;
	value: ReactNode;
}) {
	return (
		<div className="machine-card-metric">
			<span className="machine-card-metric-gutter" aria-hidden />
			<small className="machine-card-metric-label text-secondary">{label}</small>
			{icon}
			<div className="machine-card-metric-value fw-semibold">{value}</div>
		</div>
	);
}

export const MachineCard = memo(function MachineCard({ machine, onSelect, onEditRequest }: MachineCardProps) {
	const statusInfo = getStatusInfo(machine.status);
	const lastData = getLastMachineData(machine);
	const footerLabel = resolveFooterLabel(machine, statusInfo.category);
	const FooterIcon = FOOTER_ICONS[statusInfo.category];

	function handleEditClick(e: MouseEvent) {
		e.stopPropagation();
		onEditRequest?.(machine);
	}

	return (
		<Card onClick={() => onSelect?.(machine)} styles={{ cursor: "pointer" }}>
			<div className="d-flex flex-column machine-card h-100">
				<div className="machine-card-header">
					<div className="machine-card-title-row d-flex justify-content-between align-items-start gap-2">
						<h6 className="machine-card-title mb-0 fw-semibold">{displayMachineName(machine)}</h6>
						<span className="machine-card-type-icons text-secondary d-inline-flex flex-shrink-0 gap-1 align-items-start">
							
							<button
								type="button"
								className="machine-card-edit-btn btn btn-link p-0 border-0"
								aria-label={`Editar ${machine.codigo}`}
								onClick={handleEditClick}
							>
								<FaRegEdit size={18} className="text-secondary mb-2" />
							</button>
						</span>
					</div>
				</div>

				<hr className="machine-card-rule" />

				<div className="machine-card-body-metrics">
					<div className="machine-card-metrics-left">
						<MachineMetric
							label="RPM"
							icon={<FaGaugeHigh className="machine-card-metric-icon text-primary" />}
							value={formatRpm(lastData?.rpm)}
						/>
						<MachineMetric
							label="Temp"
							icon={<FaTemperatureThreeQuarters className="machine-card-metric-icon text-warning" />}
							value={formatTemperatura(lastData?.temperatura)}
						/>
					</div>

					<div className="machine-card-metrics-right">
						<MachineMetric
							label="Potência"
							icon={<FaBolt className="machine-card-metric-icon text-secondary" />}
							value={formatPotenciaW(lastData?.potencia)}
						/>
					</div>
				</div>

				<hr className="machine-card-rule" />

				<div className={`machine-card-footer-bar ${statusInfo.chipColor}`}>
					<FooterIcon size={16} className="machine-card-footer-icon flex-shrink-0" />
					<span className="machine-card-footer-text text-truncate">{footerLabel}</span>
				</div>
			</div>
		</Card>
	);
});
