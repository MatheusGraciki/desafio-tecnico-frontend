import { useEffect, useMemo, useState } from "react";

import { fetchMachines } from "@/services/machines/index";
import type { Machine, MachineData } from "@/services/machines/type.d.ts";
import { countMachinesByStatus, getStatusCategory } from "../utils/machine";
import type { MachineStatusCount } from "../utils/machine/type";

function aggregateMachineTimeline(machines: Machine[]): MachineData[] {
	const timeline = new Map<
		string,
		{ timestamp: string; rpm: number; potencia: number; temperatura: number; count: number }
	>();

	machines.forEach((machine) => {
		machine.dados?.forEach((item) => {
			const existing = timeline.get(item.timestamp);
			if (existing) {
				existing.rpm += item.rpm;
				existing.potencia += item.potencia;
				existing.temperatura += item.temperatura;
				existing.count += 1;
				return;
			}

			timeline.set(item.timestamp, {
				timestamp: item.timestamp,
				rpm: item.rpm,
				potencia: item.potencia,
				temperatura: item.temperatura,
				count: 1,
			});
		});
	});

	return Array.from(timeline.values())
		.map((item) => ({
			timestamp: item.timestamp,
			rpm: Math.round(item.rpm / item.count),
			potencia: Math.round(item.potencia / item.count),
			temperatura: Math.round(item.temperatura / item.count),
		}))
		.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
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
				setMachines(data ?? []);
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
		() => ["all", ...new Set(machines.map((machine) => machine.local))],
		[machines],
	);

	const filteredMachines = useMemo(() => {
		if (selectedLocation === "all") return machines;
		return machines.filter((machine) => machine.local === selectedLocation);
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

	const criticalMachines = useMemo(
		() =>
			filteredMachines
				.filter((machine) => getStatusCategory(machine.status) === "alerta")
				.slice(0, 4),
		[filteredMachines],
	);

	const warningMachines = useMemo(
		() =>
			filteredMachines
				.filter((machine) => getStatusCategory(machine.status) === "atencao")
				.slice(0, 4),
		[filteredMachines],
	);

	const timelineData = useMemo(
		() => aggregateMachineTimeline(filteredMachines),
		[filteredMachines],
	);

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
		criticalMachines,
		warningMachines,
		timelineData,
	};
}
