/** Mesmo critério de “hoje” usado em `useIndexMachines` (alertas do dia). */
export function isSameCalendarDay(iso?: string | null): boolean {
	if (!iso) return false;
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return false;
	const now = new Date();
	return (
		date.getFullYear() === now.getFullYear() &&
		date.getMonth() === now.getMonth() &&
		date.getDate() === now.getDate()
	);
}
