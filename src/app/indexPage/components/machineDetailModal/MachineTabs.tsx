import type { MainTab } from "./hooks/useMachineDetail";

interface MachineTabsProps {
	mainTab: MainTab;
	setMainTab: (tab: MainTab) => void;
}

export function MachineTabs({ mainTab, setMainTab }: MachineTabsProps) {
	const tabs: MainTab[] = ["resumo", "historico", "estatisticas", "alertas"];
	return (
		<div className="machine-detail-modal-main-tabs" role="tablist">
			{tabs.map((key) => (
				<button
					key={key}
					type="button"
					role="tab"
					className={`machine-detail-modal-main-tab ${mainTab === key ? "machine-detail-modal-main-tab-active" : ""}`}
					onClick={() => setMainTab(key)}
				>
					{key === "resumo"
						? "Resumo"
						: key === "historico"
							? "Histórico"
							: key === "estatisticas"
								? "Estatísticas"
								: "Alertas & Sensors"}
				</button>
			))}
		</div>
	);
}
