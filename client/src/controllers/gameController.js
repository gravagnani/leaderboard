import { BASE_URL } from "../config";

/**
 * Create a game
 * @param {object} body
 * @returns {object} -> {}
 */
const createGame = async (leaderboard_uuid, team_win, team_lose) => {
	const user = JSON.parse(localStorage.getItem("user"));
	const response = await fetch(
		BASE_URL + "/api/v1/leaderboard/" + leaderboard_uuid + "/game",
		{
			method: "POST", // *GET, POST, PUT, DELETE, etc.
			mode: "cors", // no-cors, *cors, same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json",
				token: user.token,
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			redirect: "follow", // manual, *follow, error
			referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			body: JSON.stringify({ team_win, team_lose }), // body data type must match "Content-Type" header
		}
	);
	return response.json();
};

export { createGame };
