import { memo, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
	const theme = useTheme();

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
			<Box sx={{ py: 2 }}>
				<Typography variant="body2" color="text.secondary">
					Sem dados para exibir no gráfico.
				</Typography>
			</Box>
		);
	}

	return (
		<Box className="machine-chart">
			<AppLineChart
				data={chartData}
				xKey="timestamp"
				series={[
					{ key: "rpm", label: "RPM", color: theme.palette.primary.main },
					{
						key: "potencia",
						label: "Potência",
						color: theme.palette.info?.main || theme.palette.secondary.main,
					},
					{ key: "temperatura", label: "Temperatura", color: theme.palette.warning.main },
				]}
				height={220}
			/>
		</Box>
	);
});
