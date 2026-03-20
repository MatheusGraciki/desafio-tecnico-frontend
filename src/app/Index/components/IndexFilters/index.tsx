import Select from "@/components/select";
import type { IndexFiltersProps } from "./type";
import "./styles.scss";

export function IndexFilters({ selectedLocation, locations, onLocationChange }: IndexFiltersProps) {
	const locationOptions = [
		{ value: "all", label: "Local: Todos" },
		...locations
			.filter((location) => location !== "all")
			.map((location) => ({ value: location, label: `Local: ${location}` })),
	];

	const arrangementOptions = [{ value: "maquinas", label: "Arranjo por: Máquinas CNC" }];

	return (
		<div className="index-filters">
			<div className="index-filters-field index-filters-location">
				<Select
					value={selectedLocation}
					options={locationOptions}
					onChange={onLocationChange}
					ariaLabel="Selecionar local"
				/>
			</div>

			<div className="index-filters-field index-filters-arrangement">
				<Select
					value="maquinas"
					options={arrangementOptions}
					ariaLabel="Arranjo de máquinas"
					isDisabled
				/>
			</div>
		</div>
	);
}
