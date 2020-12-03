//const BASE_URL = "http://localhost:5000";
const BASE_URL =
	process.env.NODE_ENV === "development"
		? "http://localhost:5000"
		: window.location.origin;

export { BASE_URL };
