import { useState } from "react";
import { Card } from "@/components/card";
import { AnalysTab } from "./tabs/analysisTab/analysisTab";
import { PrevTab } from "./tabs/prevTab/index";
import { Tabs } from "./tabs/index";
import type { AnalysisSidebarProps, AnalysisSidebarTab } from "./type";
import "./styles.scss";

type SidebarTab = "analise" | "previsoes";

const PREVISAO_TEMPLATES = [
	"Previsão p/ desgaste ferramenta",
	"Revisão de lubrificação",
	"Inspeção de correias",
	"Calibração de eixo",
] as const;

export function AnalysisSidebar({
	criticalMachines,
	warningMachines,
	machines,
	onMachineSelect,
}: AnalysisSidebarProps) {
	const [tab, setTab] = useState<AnalysisSidebarTab>("analise");

	return (
		<div className="analysis-sidebar">
			<Card contentStyle={{ padding: "0.75rem 1rem" }}>
				<Tabs tab={tab} onTabChange={setTab} />

				{tab === "analise" ? (
					<AnalysTab
						criticalMachines={criticalMachines}
						warningMachines={warningMachines}
						machines={machines}
						onMachineSelect={onMachineSelect}
					/>
				) : (
					<PrevTab machines={machines} />
				)}
			</Card>
		</div>
	);
}
