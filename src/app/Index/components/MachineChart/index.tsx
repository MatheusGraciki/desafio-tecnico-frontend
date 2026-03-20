import { memo, useMemo } from "react";
import { AppLineChart } from "@/components/common/Chart.tsx";
import type { MachineChartProps } from "./type";
import "./styles.scss";

function formatChartTimestamp(timestamp: string) {
	const date = new Date(timestamp);
	if (Number.isNaN(date.getTime())) {
		return timestamp;
	}
	return new Intl.DateTimeFormat("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

export const MachineChart = memo(function MachineChart({ dados }: MachineChartProps) {
	const chartData = useMemo(
		() =>
			dados.map((item) => ({
				timestamp: formatChartTimestamp(item.timestamp),
				rpm: item.rpm,
				potencia: item.potencia,
				temperatura: item.temperatura,
			})),
		[dados],
	);

	if (!chartData.length) {
		return (
			<div style={{ paddingBlock: 8 }}>
				<small className="text-secondary">Sem dados para exibir no gráfico.</small>
			</div>
		);
	}

	const rootStyles = getComputedStyle(document.documentElement);
	const primary = rootStyles.getPropertyValue("--primary").trim() || "#0d6efd";
	const accent = rootStyles.getPropertyValue("--accent").trim() || "#6c757d";
	const warning = rootStyles.getPropertyValue("--warning").trim() || "#ffc107";

	return (
		<div className="machine-chart">
			<AppLineChart
				data={chartData}
				xKey="timestamp"
				series={[
					{ key: "rpm", label: "RPM", color: primary },
					{
						key: "potencia",
						label: "Potência",
						color: accent,
					},
					{ key: "temperatura", label: "Temperatura", color: warning },
				]}
				height={220}
			/>
		</div>
	);
});
