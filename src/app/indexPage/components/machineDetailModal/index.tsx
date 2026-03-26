import { Modal, ModalBody } from "reactstrap";
import { useMachineDetail } from "./hooks/useMachineDetail";
import { MachineHeader } from "./MachineHeader";
import { MachineSidebar } from "./MachineSidebar";
import { MachineTabs } from "./MachineTabs";
import { MachineChart } from "./MachineChart";
import { MachineDetailTabPanels } from "./MachineDetailTabPanels";
import { formatPotenciaW, formatRpm, formatTemperatura } from "@/app/indexPage/utils/format";
import "./styles.scss";
import type { MachineDetailModalProps } from "./type";

export type { MachineDetailModalProps };

export function MachineDetailModal({
	machine,
	isOpen,
	onClose,
}: MachineDetailModalProps) {
	const detail = useMachineDetail(machine);

	return (
		<Modal
			isOpen={isOpen}
			toggle={onClose}
			centered
			scrollable
			className="machine-detail-modal-dialog"
			contentClassName="machine-detail-modal-content"
			size="xl"
		>
			{machine ? (
				<>
					<MachineHeader
						codigo={machine.codigo}
						statusDotClass={detail.statusDotClass}
						onClose={onClose}
					/>
					<ModalBody className="machine-detail-modal-body">
						<div className="machine-detail-modal-grid">
							<MachineSidebar
								machine={machine}
								lastData={detail.lastData}
								imageUrl={detail.imageUrl}
								alertaLabels={detail.alertaLabels}
								temperaturaAlertaAtiva={detail.temperaturaAlertaAtiva}
								temperaturaSpark={detail.temperaturaSpark}
							/>
							<div className="machine-detail-modal-right">
								<MachineTabs
									mainTab={detail.mainTab}
									setMainTab={detail.setMainTab}
								/>
								{detail.mainTab === "resumo" ? (
									<>
										<div className="machine-detail-modal-history-row">
											<span className="fw-semibold small">Histórico</span>
											<select
												className="form-select form-select-sm w-auto"
												defaultValue="always"
												aria-label="Período do histórico"
											>
												<option value="always">Desde sempre</option>
											</select>
										</div>
										<div className="machine-detail-modal-kpi-list">
											<div className="machine-detail-modal-kpi-line">
												<span className="text-secondary">Tempo em Alerta:</span>
												<span>{detail.kpis.alerta}</span>
											</div>
											<div className="machine-detail-modal-kpi-line">
												<span className="text-secondary">
													Tempo em Atenção:
												</span>
												<span>{detail.kpis.atencao}</span>
											</div>
											<div className="machine-detail-modal-kpi-line">
												<span className="text-secondary">
													Tempo Total em Operação:
												</span>
												<span>{detail.kpis.totalOper}</span>
											</div>
											<div className="machine-detail-modal-kpi-line machine-detail-modal-kpi-line-efficiency">
												<span className="text-secondary">Eficiência:</span>
												<span className={`machine-detail-modal-kpi-efficiency ${detail.efficiencyClass}`}>
													{detail.efficiency}
												</span>
											</div>
										</div>
										<div className="machine-detail-modal-range-tabs">
											{(["24h", "7d", "30d"] as const).map((key) => (
												<button
													key={key}
													type="button"
													className={`machine-detail-modal-range-tab ${detail.range === key ? "machine-detail-modal-range-tab-active" : ""}`}
													disabled={detail.rangeDisabled(key)}
													title={
														detail.rangeDisabled(key)
															? "Dados insuficientes para este período"
															: undefined
													}
													onClick={() => detail.setRange(key)}
												>
													{key === "24h"
														? "Últimas 24 horas"
														: key === "7d"
															? "7 dias"
															: "30 dias"}
												</button>
											))}
											<button
												type="button"
												className="machine-detail-modal-range-nav"
												aria-label="Período anterior"
												disabled={
													!detail.hasEnoughSamplesForRange ||
													detail.windowStart <= 0
												}
												onClick={() =>
													detail.setWindowStart((s) => Math.max(0, s - 1))
												}
											>
												<span className="visually-hidden">Anterior</span>
												&#60;
											</button>
											<button
												type="button"
												className="machine-detail-modal-range-nav"
												aria-label="Próximo período"
												disabled={
													!detail.hasEnoughSamplesForRange ||
													detail.windowStart >= detail.maxStart
												}
												onClick={() =>
													detail.setWindowStart((s) =>
														Math.min(detail.maxStart, s + 1),
													)
												}
											>
												<span className="visually-hidden">Próximo</span>
												&#62;
											</button>
										</div>
										<div className="machine-detail-modal-readings">
											<span className="machine-detail-modal-reading">
												<span className="machine-detail-modal-reading-dot machine-detail-modal-reading-dot-green" />
												RPM: {formatRpm(detail.lastData?.rpm)}
											</span>
											<span className="machine-detail-modal-reading">
												<span className="machine-detail-modal-reading-dot machine-detail-modal-reading-dot-yellow" />
												Potência: {formatPotenciaW(detail.lastData?.potencia)}
											</span>
											<span className="machine-detail-modal-reading">
												<span className="machine-detail-modal-reading-dot machine-detail-modal-reading-dot-red" />
												Temperatura: {formatTemperatura(detail.lastData?.temperatura)}
											</span>
										</div>
										<MachineChart
											chartData={detail.chartData}
											chart24hAxis={detail.chart24hAxis}
										/>
									</>
								) : (
									<MachineDetailTabPanels
										tab={detail.mainTab}
										machine={machine}
										kpis={detail.kpis}
										efficiency={detail.efficiency}
										efficiencyClass={detail.efficiencyClass}
									/>
								)}
							</div>
						</div>
					</ModalBody>
				</>
			) : null}
		</Modal>
	);
}
