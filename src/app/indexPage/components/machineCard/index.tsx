import {
	memo,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type ComponentType,
} from "react";
import { UncontrolledTooltip } from "reactstrap";
import {
	FaBolt,
	FaCircleExclamation,
	FaCirclePause,
	FaGaugeHigh,
	FaGear,
	FaIndustry,
	FaTemperatureThreeQuarters,
	FaTriangleExclamation,
} from "react-icons/fa6";

import { Card } from "@/components/card";
import { getLastMachineData, getStatusInfo } from "../../utils/machine";

import type { MachineCardProps } from "./type";
import "./styles.scss";

const footerIconByCategory = {
	operando: FaBolt,
	alerta: FaCircleExclamation,
	atencao: FaTriangleExclamation,
	parada: FaCirclePause,
} as const;

function formatRpm(value: number | undefined) {
	if (value === undefined || Number.isNaN(value)) return "--";
	return `${new Intl.NumberFormat("pt-BR").format(value)} rpm`;
}

function pickFooterIcon(category: string): ComponentType<{ className?: string; size?: number }> {
	return footerIconByCategory[category as keyof typeof footerIconByCategory] ?? FaCircleExclamation;
}

export const MachineCard = memo(function MachineCard({ machine, onSelect }: MachineCardProps) {
	const statusInfo = getStatusInfo(machine.status);
	const lastData = getLastMachineData(machine);

	const footerLabel = useMemo(() => {
		if (statusInfo.category === "operando") return "Operando";
		if (machine.alertas?.length) return machine.alertas[0];
		return machine.status;
	}, [machine.alertas, machine.status, statusInfo.category]);

	const FooterIcon = useMemo(() => pickFooterIcon(statusInfo.category), [statusInfo.category]);

	const footerToneClass = statusInfo.chipColor;
	const footerLabelId = `machine-card-footer-label-${machine.id}`;
	const footerTextRef = useRef<HTMLSpanElement>(null);
	const [footerLabelTruncated, setFooterLabelTruncated] = useState(false);

	useLayoutEffect(() => {
		const element = footerTextRef.current;
		if (!element) return;
		const measure = () => {
			setFooterLabelTruncated(element.scrollWidth > element.clientWidth + 1);
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(element);
		return () => ro.disconnect();
	}, [footerLabel]);

	return (
		<>
			<Card>
				<button
					type="button"
					className="machine-card-trigger"
					onClick={() => onSelect?.(machine)}
					aria-label={`Abrir detalhes de ${machine.codigo}`}
				>
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
							<span
								ref={footerTextRef}
								id={footerLabelId}
								className="machine-card-footer-text"
							>
								{footerLabel}
							</span>
						</div>
					</div>
				</button>
			</Card>
			{footerLabelTruncated ? (
				<UncontrolledTooltip
					innerClassName="machine-card-footer-tooltip-inner"
					target={footerLabelId}
					placement="top"
				>
					{footerLabel}
				</UncontrolledTooltip>
			) : null}
		</>
	);
});
