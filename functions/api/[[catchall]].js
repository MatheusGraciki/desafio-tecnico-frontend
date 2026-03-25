export async function onRequest(context) {
	const { request, env } = context;
	const url = new URL(request.url);

	const incomingPath = url.pathname.replace(/^\/api/, "");
	const targetUrl = `https://webhook.ecoplus-apps.com/webhook${incomingPath}${url.search}`;

	const username = env.API_USER;
	const password = env.API_PASSWORD;

	const headers = new Headers(request.headers);
	headers.set("Authorization", "Basic " + btoa(`${username}:${password}`));
	headers.set("Host", "webhook.ecoplus-apps.com");

	if (
		!headers.has("Content-Type") &&
		request.method !== "GET" &&
		request.method !== "HEAD"
	) {
		headers.set("Content-Type", "application/json");
	}

	const response = await fetch(targetUrl, {
		method: request.method,
		headers,
		body:
			request.method === "GET" || request.method === "HEAD"
				? undefined
				: await request.arrayBuffer(),
	});

	const responseHeaders = new Headers(response.headers);
	responseHeaders.set("Access-Control-Allow-Origin", "*");
	responseHeaders.set(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, PATCH, DELETE, OPTIONS",
	);
	responseHeaders.set(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization, x-api-key",
	);

	return new Response(response.body, {
		status: response.status,
		headers: responseHeaders,
	});
}
