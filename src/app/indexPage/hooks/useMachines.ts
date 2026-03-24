import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchMachines } from "@/services/machines";
import type { Machine } from "@/services/machines/type";
import { countMachinesByStatus, getStatusCategory } from "../utils/machine";
import type { MachineStatusCount } from "../utils/machine/type";

function isToday(value?: string | null) {
	if (!value) return false;

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return false;

	const now = new Date();
	return (
		date.getFullYear() === now.getFullYear() &&
		date.getMonth() === now.getMonth() &&
		date.getDate() === now.getDate()
	);
}

export function useIndexMachines() {
	const [machines, setMachines] = useState<Machine[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedLocation, setSelectedLocation] = useState("all");
	const [machinesPage, setMachinesPage] = useState(0);

	useEffect(() => {
		let active = true;

		async function loadMachines() {
			setLoading(true);
			setError(null);

			try {
				const data = await fetchMachines();
				if (!active) return;
				if (!Array.isArray(data)) {
					setError("Resposta inválida da API (esperado lista de máquinas).");
					setMachines([]);
					return;
				}
				setMachines(data);
			} catch {
				if (!active) return;
				setError("Não foi possível carregar as máquinas no momento.");
			} finally {
				if (active) {
					setLoading(false);
				}
			}
		}

		loadMachines();

		return () => {
			active = false;
		};
	}, []);

	const locations = useMemo(
		() => [
			"all",
			...new Set(
				machines
					.map((machine) => machine?.local)
					.filter((location): location is string => Boolean(location)),
			),
		],
		[machines],
	);

	const filteredMachines = useMemo(() => {
		if (selectedLocation === "all") return machines;
		return machines.filter((machine) => machine?.local === selectedLocation);
	}, [machines, selectedLocation]);

	const machinesPerPage = 9;
	const totalMachinePages = Math.max(1, Math.ceil(filteredMachines.length / machinesPerPage));

	const paginatedMachines = useMemo(
		() =>
			filteredMachines.slice(
				machinesPage * machinesPerPage,
				machinesPage * machinesPerPage + machinesPerPage,
			),
		[filteredMachines, machinesPage],
	);

	useEffect(() => {
		if (machinesPage > totalMachinePages - 1) {
			setMachinesPage(0);
		}
	}, [machinesPage, totalMachinePages]);

	const statusCounts = useMemo<MachineStatusCount>(
		() => countMachinesByStatus(filteredMachines),
		[filteredMachines],
	);

	const alertsEnteredToday = useMemo(
		() =>
			filteredMachines.filter(
				(machine) =>
					getStatusCategory(machine?.status) === "alerta" && isToday(machine?.ultimaAtualizacao),
			).length,
		[filteredMachines],
	);

	const criticalMachines = useMemo(
		() => filteredMachines.filter((machine) => getStatusCategory(machine?.status) === "alerta"),
		[filteredMachines],
	);

	const warningMachines = useMemo(
		() => filteredMachines.filter((machine) => getStatusCategory(machine?.status) === "atencao"),
		[filteredMachines],
	);

	const mergeMachine = useCallback((updated: Machine) => {
		setMachines((prev) =>
			prev.map((machine) =>
				String(machine.id) === String(updated.id) ? { ...machine, ...updated } : machine,
			),
		);
	}, []);

	return {
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
		mergeMachine,
	};
}
