import { useMemo, useState } from "react";
import { Alert, Button, Col, Row } from "reactstrap";

import { AnalysisSidebar } from "./components/analysisSidebar";
import { MachineEditModal } from "./components/machineEditModal";
import { MachineDetailModal } from "./components/machineDetailModal";
import { IndexFilters } from "./components/indexFilters";
import { StatusDistribution } from "./components/statusDistribution";
import { MachineCard } from "./components/machineCard";
import { STATUS_CONFIG } from "./constants/statusConfig";
import { DashboardSkeleton } from "./components/dashboardSkeleton";
import { StatusCategoryMachinesModal } from "./components/statusCategoryMachinesModal";
import { StatusCards } from "./components/statusCards";
import { useIndexMachines } from "./hooks/useIndexMachines";
import "./styles.scss";

import { getStatusCategory } from "@/app/indexPage/utils/machine";
import type { Machine, MachineStatusCategory } from "@/services/machines/type";
import type { SummaryItem } from "./type";

export default function IndexPage() {
	const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
	const [machineToEdit, setMachineToEdit] = useState<Machine | null>(null);
	const [statusListCategory, setStatusListCategory] =
		useState<MachineStatusCategory | null>(null);

	const {
		error,
		loading,
		retryLoad,
		selectedLocation,
		setSelectedLocation,
		selectedMachineKind,
		setSelectedMachineKind,
		machineKinds,
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
		updateMachine,
	} = useIndexMachines();

	const items = useMemo<SummaryItem[]>(() => {
		const total = filteredMachines.length || 1;

		return (Object.keys(STATUS_CONFIG) as MachineStatusCategory[]).map(
			(status) => {
				const config = STATUS_CONFIG[status];
				const count = statusCounts[status];

				const isOperando = status === "operando";
				const isAlerta = status === "alerta";

				return {
					key: status,
					...config,
					count,
					percentage: isOperando
						? Math.round((count / total) * 100)
						: undefined,
					countDetail: isAlerta ? `(+${alertsEnteredToday} hoje)` : undefined,
				};
			},
		);
	}, [alertsEnteredToday, filteredMachines.length, statusCounts]);

	const machinesForStatusModal = useMemo(() => {
		if (!statusListCategory) return [];
		return filteredMachines.filter(
			(machine) => getStatusCategory(machine.status) === statusListCategory,
		);
	}, [filteredMachines, statusListCategory]);

	const statusModalTitle = statusListCategory
		? `Máquinas — ${STATUS_CONFIG[statusListCategory].label}`
		: "";

	function handlePreviousPage() {
		setMachinesPage((currentPage) => {
			const isFirstPage = currentPage === 0;

			if (isFirstPage) {
				return totalMachinePages - 1;
			}

			return currentPage - 1;
		});
	}

	function handleNextPage() {
		setMachinesPage((currentPage) => {
			const isLastPage = currentPage === totalMachinePages - 1;

			if (isLastPage) {
				return 0;
			}

			return currentPage + 1;
		});
	}

	return (
		<div className="index-page d-flex flex-column px-2 px-md-3 px-lg-4">
			<h1 className="h4 fw-bold mb-0">Visão Geral</h1>

			{error ? (
				<Alert color="danger" className="mt-3 mb-0">
					<div className="d-flex flex-column flex-sm-row gap-2 justify-content-between align-items-start">
						<span>{error}</span>
						<Button
							size="sm"
							color="danger"
							outline
							type="button"
							onClick={retryLoad}
						>
							Tentar novamente
						</Button>
					</div>
				</Alert>
			) : null}

			{loading ? (
				<DashboardSkeleton />
			) : (
				<>
					<Row className="g-3 align-items-start">
						<Col xs={12} md={8} xxl={9} className="index-main-col">
							<Row className="g-3">
								<IndexFilters
									selectedLocation={selectedLocation}
									locations={locations}
									onLocationChange={setSelectedLocation}
									selectedMachineKind={selectedMachineKind}
									machineKinds={machineKinds}
									onMachineKindChange={setSelectedMachineKind}
								/>
							</Row>

							<div className="index-summary-wrapper">
								<StatusCards
									items={items}
									onDetailsClick={(key) =>
										setStatusListCategory(key as MachineStatusCategory)
									}
								/>
							</div>

							<div className="index-distribution">
								<div className="index-distribution-header d-flex align-items-center">
									<h2 className="h6 mb-0">Distribuição de Status</h2>
									<div
										className="index-distribution-separator"
										aria-hidden="true"
									/>

									{filteredMachines.length > machinesPerPage ? (
										<StatusDistribution
											currentPage={machinesPage}
											totalPages={totalMachinePages}
											onPrevious={handlePreviousPage}
											onNext={handleNextPage}
											onSelectPage={setMachinesPage}
										/>
									) : null}
								</div>
								<div className="index-machine-grid">
									{paginatedMachines.map((machine) => (
										<MachineCard
											key={machine.id}
											machine={machine}
											onSelect={setSelectedMachine}
											onEditRequest={setMachineToEdit}
										/>
									))}
								</div>
							</div>
						</Col>

						<Col xs={12} md={4} xxl={3}>
							<AnalysisSidebar
								criticalMachines={criticalMachines}
								warningMachines={warningMachines}
								machines={filteredMachines}
								onMachineSelect={setSelectedMachine}
							/>
						</Col>
					</Row>
				</>
			)}

			<StatusCategoryMachinesModal
				isOpen={statusListCategory !== null}
				title={statusModalTitle}
				category={statusListCategory}
				machines={machinesForStatusModal}
				onClose={() => setStatusListCategory(null)}
				onSelectMachine={(machine) => {
					setSelectedMachine(machine);
					setStatusListCategory(null);
				}}
			/>

			<MachineEditModal
				isOpen={Boolean(machineToEdit)}
				machine={machineToEdit}
				onClose={() => setMachineToEdit(null)}
				onSaved={(machine) => {
					updateMachine(machine);
					setSelectedMachine((currentSelected) => {
						if (!currentSelected) return currentSelected;
						if (Number(currentSelected.id) !== Number(machine.id)) {
							return currentSelected;
						}
						return { ...currentSelected, ...machine };
					});
				}}
			/>

			<MachineDetailModal
				machine={selectedMachine}
				isOpen={Boolean(selectedMachine)}
				onClose={() => setSelectedMachine(null)}
			/>
		</div>
	);
}
