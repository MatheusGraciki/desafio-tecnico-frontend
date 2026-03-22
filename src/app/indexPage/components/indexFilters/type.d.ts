export interface IndexFiltersProps {
	selectedLocation: string;
	locations: string[];
	onLocationChange: (value: string) => void;
}