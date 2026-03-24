import { FaLocationDot, FaTemperatureHigh } from "react-icons/fa6";
import type { Machine, MachineData } from "@/services/machines/type";
import {
	formatPotenciaW,
	formatRpm,
	formatTemperaturaCompact,
} from "@/app/indexPage/utils/format";

const TEMP_ALERT_THRESHOLD = 75;

interface MachineSidebarProps {
	machine: Machine;
	lastData?: MachineData;
	imageUrl: string;
	showTempBadge: boolean;
	temperaturaSpark: number[];
}

function TemperatureSpark({ values }: { values: number[] }) {
	if (!values.length) {
		return <div className="machine-detail-modal-spark-empty" aria-hidden />;
	}

	return (
		<div
			className="machine-detail-modal-spark-track"
			role="img"
			aria-label="Variação recente de temperatura"
		>
			{values.map((v, i) => {
				const hot = v >= TEMP_ALERT_THRESHOLD;
				return (
					<span
						key={i}
						className={`machine-detail-modal-spark-seg ${hot ? "machine-detail-modal-spark-seg--hot" : "machine-detail-modal-spark-seg--ok"}`}
					/>
				);
			})}
		</div>
	);
}

export function MachineSidebar({
	machine,
	lastData,
	imageUrl,
	showTempBadge,
	temperaturaSpark,
}: MachineSidebarProps) {
	const tempDisplay = formatTemperaturaCompact(lastData?.temperatura);

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

			<div className="machine-detail-modal-metrics-card">
				<div className="machine-detail-modal-metrics-card-grid">
					<div className="machine-detail-modal-mcol">
						<span className="machine-detail-modal-mcol-label">Velocidade</span>
						<div className="machine-detail-modal-mcol-value">{formatRpm(lastData?.rpm)}</div>
					</div>
					<div className="machine-detail-modal-mcol-divider" aria-hidden />
					<div className="machine-detail-modal-mcol">
						<span className="machine-detail-modal-mcol-label">Potência</span>
						<div className="machine-detail-modal-mcol-value">{formatPotenciaW(lastData?.potencia)}</div>
					</div>
					<div className="machine-detail-modal-mcol-divider" aria-hidden />
					<div className="machine-detail-modal-mcol machine-detail-modal-mcol--temp">
						<span className="machine-detail-modal-mcol-label">Temperatura</span>
						<div
							className={`machine-detail-modal-mcol-value ${showTempBadge ? "machine-detail-modal-mcol-value-danger" : ""}`}
						>
							{tempDisplay}
						</div>
						<TemperatureSpark values={temperaturaSpark} />
					</div>
				</div>
				{showTempBadge ? (
					<>
						<div className="machine-detail-modal-metrics-card-rule" />
						<div className="machine-detail-modal-metrics-card-footer">
							<div className="machine-detail-modal-footer-badge">
								<FaTemperatureHigh size={14} aria-hidden />
								Temp. Alta
							</div>
						</div>
					</>
				) : null}
			</div>
		</div>
	);
}
