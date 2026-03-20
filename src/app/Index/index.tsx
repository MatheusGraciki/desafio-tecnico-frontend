import { useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaRegCircleCheck } from "react-icons/fa6";
import { Alert, Button, Col, Row } from "reactstrap";

import { AnalysisSidebar } from "./components/AnalysisSidebar/index.tsx";
import { IndexFilters } from "./components/IndexFilters/index.tsx";
import { MachineCard } from "./components/MachineCard/index.tsx";
import { StatusCards } from "./components/StatusCards/index.tsx";
import { useIndexMachines } from "./hooks/useIndexMachines";
import "./styles.scss";

import type { MachineStatusCategory } from "@/services/machines/type.d.ts";
import type { StatusCardItem } from "./components/StatusCards/type";
import { MdOutlineCrisisAlert, MdOutlineSpeed } from "react-icons/md";
import { LuClock12, LuClock4, LuClock6 } from "react-icons/lu";

interface SummaryItem extends StatusCardItem {
	key: MachineStatusCategory;
}

const SUMMARY_META: Record<
	MachineStatusCategory,
	Pick<SummaryItem, "label" | "textColor" | "buttonColor" | "smallIcon" | "largeIcon">
> = {
	operando: {
		label: "Em Operação",
		textColor: "success",
		buttonColor: "success",
		smallIcon: null,
		largeIcon: <FaRegCircleCheck size={30} />,
	},
	alerta: {
		label: "Em Alerta",
		textColor: "danger",
		buttonColor: "danger",
		smallIcon: <MdOutlineCrisisAlert size={16} />,
		largeIcon: null,
	},
	atencao: {
		label: "Em Atenção",
		textColor: "warning",
		buttonColor: "warning",
		smallIcon: <MdOutlineSpeed size={16} />,
		largeIcon: <LuClock6 size={30} />,
	},
	parada: {
		label: "Parada ou Offline",
		textColor: "secondary",
		buttonColor: "secondary",
		smallIcon: <LuClock12 size={16} />,
		largeIcon: <LuClock4 size={30} />,
	},
};

function DashboardSkeleton() {
	return (
		<div className="index-skeleton">
			<div className="index-skeleton-top">
				{Array.from({ length: 4 }).map((_, index) => (
					<div key={index} className="bg-body-secondary rounded index-skeleton-card" />
				))}
			</div>
			<div className="index-skeleton-bottom">
				<div className="bg-body-secondary rounded index-skeleton-main" />
				<div className="bg-body-secondary rounded index-skeleton-side" />
			</div>
		</div>
	);
}

export default function IndexPage() {
	const [analysisOpen, setAnalysisOpen] = useState(true);
	const {
		loading,
		error,
		selectedLocation,
		setSelectedLocation,
		machinesPage,
		setMachinesPage,
		machinesPerPage,
		totalMachinePages,
		locations,
		filteredMachines,
		paginatedMachines,
		statusCounts,
		alertsEnteredToday,
		criticalMachines,
		warningMachines,
		timelineData,
	} = useIndexMachines();

	const summaryItems = useMemo<SummaryItem[]>(() => {
		const total = filteredMachines.length || 1;

		return (Object.keys(SUMMARY_META) as MachineStatusCategory[]).map((key) => ({
			key,
			label: SUMMARY_META[key].label,
			count: statusCounts[key],
			percentage: key === "operando" ? Math.round((statusCounts[key] / total) * 100) : undefined,
			countDetail: key === "alerta" ? `(+${alertsEnteredToday} hoje)` : undefined,
			textColor: SUMMARY_META[key].textColor,
			buttonColor: SUMMARY_META[key].buttonColor,
			smallIcon: SUMMARY_META[key].smallIcon,
			largeIcon: SUMMARY_META[key].largeIcon,
		}));
	}, [alertsEnteredToday, filteredMachines, statusCounts]);

	function handlePreviousPage() {
		setMachinesPage((value) => (value === 0 ? totalMachinePages - 1 : value - 1));
	}

	function handleNextPage() {
		setMachinesPage((value) => (value === totalMachinePages - 1 ? 0 : value + 1));
	}

	return (
		<div className="index-page d-flex flex-column px-2 px-md-3 px-lg-4">
			<h1 className="h4 fw-bold mb-0">Visão Geral</h1>

			{error ? <Alert color="danger">{error}</Alert> : null}

			{loading ? (
				<DashboardSkeleton />
			) : (
				<>
					<Row className="g-3 align-items-start">
						<Col xs={12} lg={9}>
							<Row className="g-3">
								<IndexFilters
									selectedLocation={selectedLocation}
									locations={locations}
									onLocationChange={setSelectedLocation}
								/>
							</Row>

							<div className="index-summary-wrapper">
								<StatusCards items={summaryItems} />
							</div>

							<div className="index-distribution">
								<div className="index-distribution-header d-flex align-items-center justify-content-between">
									<h2 className="h6 mb-0">Distribuição de Status</h2>

									{filteredMachines.length > machinesPerPage ? (
										<div className="index-pagination d-flex align-items-center">
											<Button
												color="link"
												className="p-0 index-pagination-button"
												onClick={handlePreviousPage}
												aria-label="Página anterior"
											>
												<FaChevronLeft size={12} />
											</Button>

											<small className="text-secondary">
												{machinesPage + 1}/{totalMachinePages}
											</small>

											<Button
												color="link"
												className="p-0 index-pagination-button"
												onClick={handleNextPage}
												aria-label="Próxima página"
											>
												<FaChevronRight size={12} />
											</Button>
										</div>
									) : null}
								</div>
								<div className="index-machine-grid">
									{paginatedMachines.map((machine) => (
										<MachineCard key={machine.id} machine={machine} />
									))}
								</div>
							</div>
						</Col>

						<Col xs={12} lg={3}>
							<AnalysisSidebar
								analysisOpen={analysisOpen}
								onToggle={() => setAnalysisOpen((value) => !value)}
								criticalMachines={criticalMachines}
								warningMachines={warningMachines}
								timelineData={timelineData}
							/>
						</Col>
					</Row>
				</>
			)}
		</div>
	);
}
