import { BASE_URL } from "../config";

/**
 * Create a new Game
 * @param {*} leaderboard_uuid the leaderboard uuid
 * @param {*} team_win the array of winners' uuids
 * @param {*} team_lose the array of losers' uuids
 * @returns the array of affected users with updated scores
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

/**
 * Get the last N games of the leaderboard
 * @param {*} leaderboard_uuid the uuid of the leaderboard
 * @param {*} N the number of last games to be searched
 * @returns
 */
const getLeaderboardGames = async (leaderboard_uuid, N) => {
	//const user = JSON.parse(localStorage.getItem("user"));
	const response = await fetch(
		BASE_URL + "/api/v1/leaderboard/" + leaderboard_uuid + "/game/" + N,
		{
			method: "GET", // *GET, POST, PUT, DELETE, etc.
			mode: "cors", // no-cors, *cors, same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json",
				//token: user.token,
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			redirect: "follow", // manual, *follow, error
			referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		}
	);
	return response.json();
};

export { createGame, getLeaderboardGames };
