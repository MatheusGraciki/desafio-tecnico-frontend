import {
	ResponsiveContainer,
	LineChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	Line,
} from "recharts";

export interface AppLineSeries {
	key: string;
	label?: string;
	color: string;
}

interface AppLineChartProps {
	data: Record<string, string | number>[];
	xKey: string;
	series: AppLineSeries[];
	height?: number;
}

export function AppLineChart({ data, xKey, series, height = 220 }: AppLineChartProps) {
	return (
		<ResponsiveContainer width="100%" height={height}>
			<LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
				<CartesianGrid strokeDasharray="4 4" />
				<XAxis dataKey={xKey} />
				<YAxis />
				<Tooltip />
				<Legend />
				{series.map((item) => (
					<Line
						key={item.key}
						type="monotone"
						name={item.label || item.key}
						dataKey={item.key}
						stroke={item.color}
						dot={false}
						strokeWidth={2}
					/>
				))}
			</LineChart>
		</ResponsiveContainer>
	);
}
