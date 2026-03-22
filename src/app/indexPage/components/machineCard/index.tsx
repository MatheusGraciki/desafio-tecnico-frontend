import { memo } from "react";
import { Badge } from "reactstrap";
import {
	FaBolt,
	FaCircleCheck,
	FaCircleExclamation,
	FaCirclePause,
	FaGaugeHigh,
	FaTemperatureThreeQuarters,
	FaTriangleExclamation,
} from "react-icons/fa6";
import { Card } from "@/components/common/card";
import { getLastMachineData, getStatusInfo } from "../../utils/machine";
import type { MachineCardProps } from "./type";
import "./styles.scss";

const statusIconMap = {
	operando: FaCircleCheck,
	alerta: FaCircleExclamation,
	atencao: FaTriangleExclamation,
	parada: FaCirclePause,
};

export const MachineCard = memo(function MachineCard({ machine }: MachineCardProps) {
	const statusInfo = getStatusInfo(machine.status);
	const lastData = getLastMachineData(machine);
	const StatusIcon = statusIconMap[statusInfo.category as keyof typeof statusIconMap];
	const statusColorClass = `text-${statusInfo.chipColor}`;

	return (
		<Card>
			<div className="d-flex flex-column gap-2 machine-card">
				<div className="machine-card-header">
					<h6 className="mb-0 fw-semibold">{machine.codigo}</h6>
					<small className="text-secondary">Local: {machine.local}</small>
				</div>

				<hr className="my-1" />

				<div className="machine-card-metrics">
					<div className="machine-card-metric d-flex align-items-center gap-2 flex-fill">
						<FaGaugeHigh className="text-primary" />
						<div>
							<small className="machine-card-metric-label text-secondary d-block">RPM</small>
							<div className="fw-semibold">{lastData?.rpm ?? "--"}</div>
						</div>
					</div>

					<div className="machine-card-metric d-flex align-items-center gap-2 flex-fill">
						<FaBolt className="text-secondary" />
						<div>
							<small className="machine-card-metric-label text-secondary d-block">Potência</small>
							<div className="fw-semibold">{lastData?.potencia ?? "--"} W</div>
						</div>
					</div>

					<div className="machine-card-metric machine-card-metric-temperature d-flex align-items-center gap-2 flex-fill">
						<FaTemperatureThreeQuarters className="text-warning" />
						<div>
							<small className="machine-card-metric-label text-secondary d-block">Temp</small>
							<div className="fw-semibold">{lastData?.temperatura ?? "--"} °C</div>
						</div>
					</div>
				</div>

				<hr className="my-1" />

				<div className="machine-card-status d-flex align-items-center gap-2">
					<div className="d-flex align-items-center gap-1">
						<StatusIcon className={statusColorClass} size={14} />
						<Badge color={statusInfo.chipColor} pill>
							{statusInfo.category === "operando" ? "Operando" : machine.status}
						</Badge>
					</div>

					{machine.alertas?.length ? (
						<div className="d-flex align-items-center gap-1 flex-wrap">
							{machine.alertas.slice(0, 2).map((alerta) => (
								<Badge key={`${machine.id}-${alerta}`} color="warning" className="text-dark" pill>
									{alerta}
								</Badge>
							))}
						</div>
					) : null}
				</div>
			</div>
		</Card>
	);
});
