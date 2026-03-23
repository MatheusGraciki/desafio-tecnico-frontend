import { memo, useMemo, type ComponentType } from "react";
import {
	FaBolt,
	FaCircleCheck,
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

function formatRpm(value: number | undefined) {
	if (value === undefined || Number.isNaN(value)) return "--";
	return `${new Intl.NumberFormat("pt-BR").format(value)} rpm`;
}

function pickFooterIcon(
	category: string,
	footerLabel: string,
): ComponentType<{ className?: string; size?: number }> {
	const lower = footerLabel.toLowerCase();

	if (category === "operando") return FaBolt;
	if (/temp|°|celsius/i.test(lower)) return FaTemperatureThreeQuarters;
	if (/lubrific|óleo|oleo/i.test(lower)) return FaDroplet;
	if (/vibr|instabilidade|onda/i.test(lower)) return FaWaveSquare;

	return statusIconMap[category as keyof typeof statusIconMap] ?? FaCircleExclamation;
}

export const MachineCard = memo(function MachineCard({ machine }: MachineCardProps) {
	const statusInfo = getStatusInfo(machine.status);
	const lastData = getLastMachineData(machine);

	const footerLabel = useMemo(() => {
		if (statusInfo.category === "operando") return "Operando";
		if (machine.alertas?.length) return machine.alertas[0];
		return machine.status;
	}, [machine.alertas, machine.status, statusInfo.category]);

	const FooterIcon = useMemo(
		() => pickFooterIcon(statusInfo.category, footerLabel),
		[footerLabel, statusInfo.category],
	);

	const footerToneClass = `machine-card-footer-bar--${statusInfo.chipColor}`;

	return (
		<Card>
			<div className="d-flex flex-column machine-card h-100">
				<div className="machine-card-header">
					<div className="d-flex justify-content-between align-items-start gap-2">
						<h6 className="mb-0 fw-semibold">{machine.codigo}</h6>
						<span className="machine-card-type-icons text-secondary d-inline-flex gap-1" aria-hidden="true">
							<FaGear size={12} />
							<FaIndustry size={12} />
						</span>
					</div>
				</div>

				<hr className="machine-card-rule" />

				<div className="machine-card-body-metrics">
					<div className="machine-card-metrics-left">
						<div className="machine-card-metric">
							<span className="machine-card-metric-gutter" aria-hidden />
							<small className="machine-card-metric-label text-secondary">RPM</small>
							<FaGaugeHigh className="machine-card-metric-icon text-primary" />
							<div className="machine-card-metric-value fw-semibold">{formatRpm(lastData?.rpm)}</div>
						</div>
						<div className="machine-card-metric">
							<span className="machine-card-metric-gutter" aria-hidden />
							<small className="machine-card-metric-label text-secondary">Temp</small>
							<FaTemperatureThreeQuarters className="machine-card-metric-icon text-warning" />
							<div className="machine-card-metric-value fw-semibold">
								{lastData?.temperatura !== undefined && !Number.isNaN(lastData.temperatura)
									? `${lastData.temperatura} °C`
									: "--"}
							</div>
						</div>
					</div>

					<div className="machine-card-metrics-right">
						<div className="machine-card-metric">
							<span className="machine-card-metric-gutter" aria-hidden />
							<small className="machine-card-metric-label text-secondary">Potência</small>
							<FaBolt className="machine-card-metric-icon text-secondary" />
							<div className="machine-card-metric-value fw-semibold">
								{lastData?.potencia !== undefined && !Number.isNaN(lastData.potencia)
									? `${new Intl.NumberFormat("pt-BR").format(lastData.potencia)} W`
									: "--"}
							</div>
						</div>
					</div>
				</div>

				<hr className="machine-card-rule" />

				<div className={`machine-card-footer-bar ${footerToneClass}`}>
					<FooterIcon size={16} className="machine-card-footer-icon flex-shrink-0" />
					<span className="machine-card-footer-text text-truncate">{footerLabel}</span>
				</div>
			</div>
		</Card>
	);
});
