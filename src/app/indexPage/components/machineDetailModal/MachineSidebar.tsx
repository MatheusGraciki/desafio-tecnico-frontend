import { FaLocationDot, FaTriangleExclamation } from "react-icons/fa6";

import type { Machine, MachineData } from "@/services/machines/type";
import {
	formatPotenciaW,
	formatRpm,
	formatTemperatura,
} from "@/app/indexPage/utils/format";

interface MachineSidebarProps {
	machine: Machine;
	lastData?: MachineData;
	imageUrl: string;
	alertaLabels: string[];
	temperaturaAlertaAtiva: boolean;
	temperaturaSpark: number[];
}

type TemperatureSparkProps = {
	values: number[];
	isDanger: boolean;
};

type MetricItemProps = {
	label: string;
	value: string;
	isDanger?: boolean;
	children?: React.ReactNode;
};

function TemperatureSpark({ values, isDanger }: TemperatureSparkProps) {
	if (!values.length) {
		return <div className="machine-detail-modal-spark-empty" aria-hidden />;
	}

	return (
		<div
			className="machine-detail-modal-spark-track"
			role="img"
			aria-label="Variação recente de temperatura"
		>
			{values.map((_, index) => (
				<span
					key={index}
					className={`machine-detail-modal-spark-seg ${
						isDanger
							? "machine-detail-modal-spark-seg--hot"
							: "machine-detail-modal-spark-seg--ok"
					}`}
				/>
			))}
		</div>
	);
}

function AlertBadge({ text, title }: { text: string; title?: string }) {
	return (
		<div className="machine-detail-modal-footer-badge" title={title ?? text}>
			<FaTriangleExclamation size={14} className="flex-shrink-0" aria-hidden />
			<span className="machine-detail-modal-footer-badge-text">{text}</span>
		</div>
	);
}

function MetricItem({ label, value, isDanger = false, children }: MetricItemProps) {
	return (
		<div className="machine-detail-modal-mcol">
			<span className="machine-detail-modal-mcol-label">{label}</span>
			<div
				className={`machine-detail-modal-mcol-value ${
					isDanger ? "machine-detail-modal-mcol-value-danger" : ""
				}`}
			>
				{value}
			</div>
			{children}
		</div>
	);
}

export function MachineSidebar({
	machine,
	lastData,
	imageUrl,
	alertaLabels,
	temperaturaAlertaAtiva,
	temperaturaSpark,
}: MachineSidebarProps) {
	const hasAlerts = alertaLabels.length > 0;
	const alertBadgeTitle = alertaLabels.join(" · ");
	const alertBadgeText =
		alertaLabels.length === 1 ? alertaLabels[0] : `${alertaLabels.length} alertas`;

	const rpmText = formatRpm(lastData?.rpm);
	const potenciaText = formatPotenciaW(lastData?.potencia);
	const temperaturaText = formatTemperatura(lastData?.temperatura);
	const locationText = machine.local || "—";

	return (
		<div className="machine-detail-modal-left">
			<div className="machine-detail-modal-image-wrap">
				<img
					className="machine-detail-modal-image"
					src={imageUrl}
					alt=""
					loading="lazy"
					decoding="async"
				/>

				{hasAlerts ? (
					<span
						className="machine-detail-modal-image-badge"
						title={alertBadgeTitle}
					>
						<FaTriangleExclamation size={14} className="flex-shrink-0" aria-hidden />
						<span className="machine-detail-modal-image-badge-text">
							{alertBadgeText}
						</span>
					</span>
				) : null}
			</div>

			<div>
				<div className="machine-detail-modal-id">ID #{machine.id}</div>

				<div className="machine-detail-modal-location">
					<FaLocationDot className="text-secondary flex-shrink-0" aria-hidden />
					<span>Local: {locationText}</span>
				</div>
			</div>

			<div className="machine-detail-modal-metrics-card">
				<div className="machine-detail-modal-metrics-card-grid">
					<MetricItem label="Velocidade" value={rpmText} />

					<div className="machine-detail-modal-mcol-divider" aria-hidden />

					<MetricItem label="Potência" value={potenciaText} />

					<div className="machine-detail-modal-mcol-divider" aria-hidden />

					<div className="machine-detail-modal-mcol machine-detail-modal-mcol--temp">
						<MetricItem
							label="Temperatura"
							value={temperaturaText}
							isDanger={temperaturaAlertaAtiva}
						>
							<TemperatureSpark
								values={temperaturaSpark}
								isDanger={temperaturaAlertaAtiva}
							/>
						</MetricItem>
					</div>
				</div>

				{hasAlerts ? (
					<>
						<div className="machine-detail-modal-metrics-card-rule" />

						<div className="machine-detail-modal-metrics-card-footer machine-detail-modal-metrics-card-footer--alerts">
							{alertaLabels.map((label, index) => (
								<AlertBadge key={`${index}-${label}`} text={label} />
							))}
						</div>
					</>
				) : null}
			</div>
		</div>
	);
}
