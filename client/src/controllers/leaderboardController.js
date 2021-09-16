import { BASE_URL } from "../config";

import {
	PRICING_BASIC,
	PRICING_MEDIUM,
	PRICING_LARGE,
	MIN_USERS_BASIC,
	MAX_USERS_BASIC,
	MIN_USERS_MEDIUM,
	MAX_USERS_MEDIUM,
	MIN_USERS_LARGE,
	MAX_USERS_LARGE,
} from "../constants";

/**
 *
 * @param {string} pricing
 */
const getMinUsers = (pricing) => {
	switch (pricing) {
		case PRICING_BASIC:
			return MIN_USERS_BASIC;

		case PRICING_MEDIUM:
			return MIN_USERS_MEDIUM;

		case PRICING_LARGE:
			return MIN_USERS_LARGE;
	}
};

/**
 *
 * @param {string} pricing
 */
const getMaxUsers = (pricing) => {
	switch (pricing) {
		case PRICING_BASIC:
			return MAX_USERS_BASIC;

		case PRICING_MEDIUM:
			return MAX_USERS_MEDIUM;

		case PRICING_LARGE:
			return MAX_USERS_LARGE;
	}
};

/**
 * Create a leaderboard
 * @param {object} body -> {title, place, note, min_users, max_users, start_date, end_date, mode, full_name, email}
 * @returns {object} -> {}
 */
const validateLeaderboard = async (body) => {
	const user = JSON.parse(localStorage.getItem("user"));
	const response = await fetch(BASE_URL + "/api/v1/leaderboard/validate", {
		//const response = await fetch(BASE_URL + "/api/v1/pay", {
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		crossDomain: true,
		mode: "cors", // no-cors, *cors, same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, *same-origin, omit
		headers: {
			"Content-Type": "application/json",
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: "follow", // manual, *follow, error
		referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(body), // body data type must match "Content-Type" header
	});
	return response.json();
};

/**
 * Create a leaderboard
 * @param {object} body -> {title, place, note, min_users, max_users, start_date, end_date, mode, full_name, email}
 * @returns {object} -> {}
 */
const createLeaderboard = async (body) => {
	const user = JSON.parse(localStorage.getItem("user"));
	const response = await fetch(BASE_URL + "/api/v1/leaderboard", {
		//const response = await fetch(BASE_URL + "/api/v1/pay", {
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		crossDomain: true,
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
		body: JSON.stringify(body), // body data type must match "Content-Type" header
	});
	return response.json();
};

/**
 *
 * @param {*} uuid
 * @returns
 */
const getLeaderboardByUUID = async (uuid) => {
	const response = await fetch(BASE_URL + "/api/v1/leaderboard/uuid/" + uuid, {
		method: "GET", // *GET, POST, PUT, DELETE, etc.
		mode: "cors", // no-cors, *cors, same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, *same-origin, omit
		headers: {
			"Content-Type": "application/json",
		},
		redirect: "follow", // manual, *follow, error
		referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	});
	return response.json();
};

/**
 *
 * @param {*} user_uuid
 * @param {*} leaderboard_uuid
 * @param {*} user_full_name
 * @returns
 */
const joinLeaderboard = async (user_uuid, leaderboard_uuid, user_full_name) => {
	const user = JSON.parse(localStorage.getItem("user"));
	const response = await fetch(BASE_URL + "/api/v1/leaderboard/join/", {
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		mode: "cors", // no-cors, *cors, same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, *same-origin, omit
		headers: {
			"Content-Type": "application/json",
			token: user.token,
		},
		redirect: "follow", // manual, *follow, error
		referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify({ user_uuid, leaderboard_uuid, user_full_name }),
	});
	return response.json();
};

/**
 *
 * @param {*} leaderboard_uuid
 * @returns
 */
const getLeaderboardParticipants = async (leaderboard_uuid) => {
	const response = await fetch(
		BASE_URL + "/api/v1/leaderboard/" + leaderboard_uuid + "/users/",
		{
			method: "GET", // *GET, POST, PUT, DELETE, etc.
			mode: "cors", // no-cors, *cors, same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json",
			},
			redirect: "follow", // manual, *follow, error
			referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		}
	);
	return response.json();
};

/**
 *
 * @param {*} leaderboard
 * @param {*} title
 * @param {*} note
 * @returns
 */
const modifyLeadeboardTitleNote = async (leaderboard, title, note) => {
	const user = JSON.parse(localStorage.getItem("user"));
	const response = await fetch(
		BASE_URL + "/api/v1/leaderboard/" + leaderboard.uuid,
		{
			method: "PUT", // *GET, POST, PUT, DELETE, etc.
			mode: "cors", // no-cors, *cors, same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json",
				token: user.token,
			},
			redirect: "follow", // manual, *follow, error
			referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			body: JSON.stringify({ title, note }),
		}
	);
	return response.json();
};

export {
	getMinUsers,
	getMaxUsers,
	validateLeaderboard,
	createLeaderboard,
	getLeaderboardByUUID,
	joinLeaderboard,
	getLeaderboardParticipants,
	modifyLeadeboardTitleNote,
};
