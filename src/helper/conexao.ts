import axios, { type AxiosRequestConfig } from "axios";

const baseURL = "/api";

const authType = import.meta.env.VITE_API_AUTH_TYPE;
const username = import.meta.env.VITE_API_USER;
const password = import.meta.env.VITE_API_PASSWORD || import.meta.env.VITE_API_PASSWWORD;
const apiKey = import.meta.env.VITE_API_KEY;

export const api = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
		...(apiKey ? { "x-api-key": apiKey } : {}),
	},
	...(authType === "basic" && username && password ? { auth: { username, password } } : {}),
	withCredentials: true,
});

export function get<T = unknown>(url: string, params?: Record<string, unknown>) {
	return api.get<T>(url, { params });
}

export function post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
	return api.post<T>(url, data, config);
}

export function put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
	return api.put<T>(url, data, config);
}
