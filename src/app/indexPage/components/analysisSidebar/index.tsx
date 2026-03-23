import { useState } from "react";
import { Card } from "@/components/common/card";
import { AnaliseTab } from "./tabs/analiseTab";
import { PrevisoesTab } from "./tabs/previsoesTab";
import { Tabs } from "./tabs/index";
import type { AnalysisSidebarProps, AnalysisSidebarTab } from "./type";
import "./styles.scss";

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
					<AnaliseTab
						criticalMachines={criticalMachines}
						warningMachines={warningMachines}
						machines={machines}
						onMachineSelect={onMachineSelect}
					/>
				) : (
					<PrevisoesTab machines={machines} />
				)}
			</Card>
		</div>
	);
}
