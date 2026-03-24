export function formatRpm(value: number | undefined) {
	if (value === undefined || Number.isNaN(value)) return "--";
	return `${new Intl.NumberFormat("pt-BR").format(value)} rpm`;
}

export function formatPotenciaW(value: number | undefined) {
	if (value === undefined || Number.isNaN(value)) return "--";
	return `${new Intl.NumberFormat("pt-BR").format(value)} W`;
}

export function formatTemperatura(value: number | undefined) {
	if (value === undefined || Number.isNaN(value)) return "--";
	return `${value} °C`;
}

/** Formato compacto para o card (ex.: 78°C). */
export function formatTemperaturaCompact(value: number | undefined) {
	if (value === undefined || Number.isNaN(value)) return "--";
	return `${value}°C`;
}
