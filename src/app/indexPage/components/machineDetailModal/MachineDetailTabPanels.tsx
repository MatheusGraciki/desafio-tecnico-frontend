import { formatPotenciaW, formatRpm, formatTemperatura } from "@/app/indexPage/utils/format";
import type { Machine } from "@/services/machines/type";
import type { MainTab } from "./hooks/useMachineDetail";

type Props = {
	tab: MainTab;
	machine: Machine;
	kpis: {
		alerta: string;
		atencao: string;
		totalOper: string;
	};
	efficiency: string;
	efficiencyClass: string;
};

export function MachineDetailTabPanels({
	tab,
	machine,
	kpis,
	efficiency,
	efficiencyClass,
}: Props) {
	const dados = machine.dados ?? [];
	const latestData = dados[dados.length - 1];
	const recentData = [...dados].slice(-24).reverse();

	if (tab === "historico") {
		return recentData.length ? (
			<div className="table-responsive">
				<table className="table table-sm align-middle mb-0">
					<thead>
						<tr>
							<th>Horário</th>
							<th>RPM</th>
							<th>Potência</th>
							<th>Temperatura</th>
						</tr>
					</thead>
					<tbody>
						{recentData.map((item) => (
							<tr key={item.timestamp}>
								<td className="small text-nowrap">
									{new Date(item.timestamp).toLocaleString("pt-BR")}
								</td>
								<td>{formatRpm(item.rpm)}</td>
								<td>{formatPotenciaW(item.potencia)}</td>
								<td>{formatTemperatura(item.temperatura)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		) : (
			<p className="machine-detail-modal-placeholder mb-0">
				Sem histórico disponível.
			</p>
		);
	}

	if (tab === "estatisticas") {
		return (
			<div className="machine-detail-modal-kpi-list">
				<div className="machine-detail-modal-kpi-line">
					<span className="text-secondary">Tempo em Alerta:</span>
					<span>{kpis.alerta}</span>
				</div>
				<div className="machine-detail-modal-kpi-line">
					<span className="text-secondary">Tempo em Atenção:</span>
					<span>{kpis.atencao}</span>
				</div>
				<div className="machine-detail-modal-kpi-line">
					<span className="text-secondary">Tempo Total em Operação:</span>
					<span>{kpis.totalOper}</span>
				</div>
				<div className="machine-detail-modal-kpi-line machine-detail-modal-kpi-line-efficiency">
					<span className="text-secondary">Eficiência:</span>
					<span className={`machine-detail-modal-kpi-efficiency ${efficiencyClass}`}>
						{efficiency}
					</span>
				</div>
			</div>
		);
	}

	if (tab === "alertas") {
		return (
			<div className="d-grid gap-3">
				<div>
					<h3 className="h6 mb-2">Alertas Ativos</h3>
					{machine.alertas.length ? (
						<ul className="mb-0 ps-3">
							{machine.alertas.map((alerta, index) => (
								<li key={`${alerta}-${index}`}>{alerta}</li>
							))}
						</ul>
					) : (
						<p className="machine-detail-modal-placeholder mb-0">
							Nenhum alerta registrado.
						</p>
					)}
				</div>
				<div>
					<h3 className="h6 mb-2">Última Leitura</h3>
					{latestData ? (
						<div className="machine-detail-modal-kpi-list">
							<div className="machine-detail-modal-kpi-line">
								<span className="text-secondary">RPM:</span>
								<span>{formatRpm(latestData.rpm)}</span>
							</div>
							<div className="machine-detail-modal-kpi-line">
								<span className="text-secondary">Potência:</span>
								<span>{formatPotenciaW(latestData.potencia)}</span>
							</div>
							<div className="machine-detail-modal-kpi-line">
								<span className="text-secondary">Temperatura:</span>
								<span>{formatTemperatura(latestData.temperatura)}</span>
							</div>
						</div>
					) : (
						<p className="machine-detail-modal-placeholder mb-0">Sem telemetria.</p>
					)}
				</div>
			</div>
		);
	}

	return null;
}
