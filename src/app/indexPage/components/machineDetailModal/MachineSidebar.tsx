import { FaLocationDot, FaTemperatureHigh } from "react-icons/fa6";
import type { Machine, MachineData } from "@/services/machines/type";

interface MachineSidebarProps {
	machine: Machine;
	lastData?: MachineData;
	imageUrl: string;
	showTempBadge: boolean;
}

function formatRpm(value: number | undefined) {
	if (value === undefined || Number.isNaN(value)) return "--";
	return `${new Intl.NumberFormat("pt-BR").format(value)} rpm`;
}

export function MachineSidebar({
	machine,
	lastData,
	imageUrl,
	showTempBadge,
}: MachineSidebarProps) {
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
				{showTempBadge ? (
					<span className="machine-detail-modal-image-badge">
						<FaTemperatureHigh size={14} aria-hidden />
						Temp. Alta
					</span>
				) : null}
			</div>

			<div>
				<div className="machine-detail-modal-id">ID #{machine.id}</div>
				<div className="machine-detail-modal-location">
					<FaLocationDot className="text-secondary flex-shrink-0" aria-hidden />
					<span>Local: {machine.local || "—"}</span>
				</div>
			</div>

			<div className="machine-detail-modal-quick-metrics custom-metrics-horizontal">
				<div className="custom-metric-block">
					<span className="custom-metric-label">Velocidade</span>
					<span className="custom-metric-value">{formatRpm(lastData?.rpm)}</span>
				</div>
				<div className="custom-metric-separator" />
				<div className="custom-metric-block">
					<span className="custom-metric-label">Potência</span>
					<span className="custom-metric-value">
						{lastData?.potencia !== undefined && !Number.isNaN(lastData.potencia)
							? `${new Intl.NumberFormat("pt-BR").format(lastData.potencia)} W`
							: "--"}
					</span>
				</div>
				<div className="custom-metric-separator" />
				<div className="custom-metric-block custom-metric-temp">
					<span className="custom-metric-label">Temperatura</span>
					<span className={`custom-metric-value custom-metric-temp-value${showTempBadge ? " custom-metric-temp-danger" : ""}`}>
						{lastData?.temperatura !== undefined && !Number.isNaN(lastData.temperatura)
							? `${lastData.temperatura} °C`
							: "--"}
					</span>
				</div>
			</div>
			{showTempBadge ? (
				<div className="machine-detail-modal-footer-badge">
					<FaTemperatureHigh size={14} aria-hidden />
					Temp. Alta
				</div>
			) : null}
		</div>
	);
}
