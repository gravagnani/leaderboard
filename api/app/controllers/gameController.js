import moment from "moment";

import dbQuery from "../db/dbQuery";

import { isEmpty, generateUUID } from "../helpers/validation";

import { errorMessage, successMessage, status } from "../helpers/status";

import {
	MAX_USERS_PER_TEAM,
	WIN_TEAM,
	LOSE_TEAM,
	CLASSIC_WIN_POINTS,
	CLASSIC_LOSE_POINTS,
	CLASSIC_DRAW_POINTS,
} from "../constants";

/**
 * Create A Game
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const createGame = async (req, res) => {
	console.log(req);
	const user = req.user;
	const leaderboard_uuid = req.params.uuid;
	const { team_win, team_lose } = req.body;
	const all_part_uuid = team_win.concat(team_lose); // forse togliere il map

	const created_at = moment(new Date());
	const modified_at = moment(new Date());
	// from header
	const created_by = user.uuid;
	const modified_by = user.uuid;

	// CHECKS

	// one and only one participant per team
	if (
		team_win.length != MAX_USERS_PER_TEAM ||
		team_lose.length != MAX_USERS_PER_TEAM
	) {
		errorMessage.error = "There must be one participant per team";
		return res.status(status.bad).send(errorMessage);
	}

	const searchLeaderboardQuery = `
		SELECT uuid, title, place, note, min_users, max_users, start_date, 
			end_date, mode, flag_public, flag_active, created_by
		FROM leaderboard
		WHERE 1=1
			AND flag_active = B'1'
			AND uuid = $1
	`;
	const search_leaderboard_values = [leaderboard_uuid];

	// = sql listagg users from both lists
	var win_part_string = "";
	var lose_part_string = "";
	team_win.forEach((u) => (win_part_string += u + ", "));
	team_lose.forEach((u) => (lose_part_string += u + ", "));
	win_part_string = win_part_string.substring(0, win_part_string.length - 2);
	lose_part_string = lose_part_string.substring(
		0,
		lose_part_string.length - 2
	);
	const searchUsersLeaderboardQuery = `
		SELECT user_uuid, user_mean, user_variance
		FROM user_leaderboard
		WHERE 1=1
			AND leaderboard_uuid = $1
			AND user_uuid IN ($2)
	`;
	const search_win_users_leaderboard_values = [
		leaderboard_uuid,
		win_part_string,
	];
	const search_lose_users_leaderboard_values = [
		leaderboard_uuid,
		lose_part_string,
	];

	const createGameQuery = `
		INSERT INTO game (
			uuid, leaderboard_uuid, modified_at, modified_by
		) VALUES (
			$1, $2, $3, $4
		) RETURNING 
			uuid, leaderboard_uuid, modified_at, modified_by
	`;
	const new_game_uuid = generateUUID(user.uuid + new Date());
	const create_game_values = [
		new_game_uuid,
		leaderboard_uuid,
		modified_at,
		modified_by,
	];

	const insertUserGameQuery = `
		INSERT INTO user_game (
			game_uuid, user_uuid, team, modified_at, modified_by
		) VALUES (
			$1, $2, $3, $4, $5
		) RETURNING 
			game_uuid, user_uuid, team, modified_at, modified_by
	`;
	var insert_user_game_values = [];

	const updateUserLeaderboardQuery = `
		UPDATE user_leaderboard
		SET user_mean = $1, user_variance = $2, 
			modified_at = $3, modified_by = $4
		WHERE user_uuid = $5 
			AND leaderboard_uuid = $6
		RETURNING 
			leaderboard_uuid, user_uuid, user_full_name, 
			user_mean, user_variance, created_at, modified_at, modified_by
	`;
	var update_update_user_leaderbaord_values = [];

	try {
		// search leaderboard
		var { rows } = await dbQuery.query(
			searchLeaderboardQuery,
			search_leaderboard_values
		);
		var leaderboard_db = rows[0];

		if (!leaderboard_db) {
			errorMessage.error = "Leaderboard not found";
			return res.status(status.notfound).send(errorMessage);
		}

		// participants exist and participate in the leaderboard
		// search winners and loser separately
		var { rows } = await dbQuery.query(
			searchUsersLeaderboardQuery,
			search_win_users_leaderboard_values
		);
		var team_win_db = rows;
		var { rows } = await dbQuery.query(
			searchUsersLeaderboardQuery,
			search_lose_users_leaderboard_values
		);
		var team_lose_db = rows;
		var all_part_uuid_db = team_win_db
			.concat(team_lose_db)
			.map((p) => p.user_uuid);

		var participants_exist = true;
		all_part_uuid.forEach(
			(u) =>
				(participants_exist =
					participants_exist && all_part_uuid_db.includes(u))
		);
		if (!participants_exist) {
			errorMessage.error =
				"Some users are not participating the competition";
			return res.status(status.notfound).send(errorMessage);
		}
		// check on created by user -> only leaderboard crator can crate a new game
		if (user.uuid != leaderboard_db.created_by) {
			errorMessage.error = "Only leaderboard creator can create a new game";
			return res.status(status.unauthorized).send(errorMessage);
		}

		// OK -> insert into db

		// create game -> all transactional
		await dbQuery.beginTransaction();

		var { rows } = await dbQuery.query(createGameQuery, create_game_values);
		var new_game = rows[0];

		// associate teams with game -> insert in user_game table
		for (const u_uuid of team_win) {
			insert_user_game_values = [
				new_game.uuid,
				u_uuid,
				WIN_TEAM,
				modified_at,
				modified_by,
			];
			var { rows } = await dbQuery.query(
				insertUserGameQuery,
				insert_user_game_values
			);
		}

		for (const u_uuid of team_lose) {
			insert_user_game_values = [
				new_game.uuid,
				u_uuid,
				LOSE_TEAM,
				modified_at,
				modified_by,
			];
			var { rows } = await dbQuery.query(
				insertUserGameQuery,
				insert_user_game_values
			);
		}

		// update users with new mean and variance
		// create only one array (join team_win_db and team_lose_db) with both winners and losers

		// trueskill doc https://github.com/freethenation/node-trueskill
		var team_all = [];
		var trueskill = require("trueskill");

		switch (leaderboard_db.mode) {
			case "C":
				team_win_db.forEach(
					(p) => (p.user_mean = p.user_mean + CLASSIC_WIN_POINTS)
				);
				team_lose_db.forEach(
					(p) => (p.user_mean = p.user_mean + CLASSIC_LOSE_POINTS)
				);
				team_all = team_win_db.concat(team_lose_db);
				break;
			case "T":
				team_win_db.forEach((p) => {
					p.skill = [p.user_mean, p.user_variance];
					p.rank = WIN_TEAM;
				});
				team_lose_db.forEach((p) => {
					p.skill = [p.user_mean, p.user_variance];
					p.rank = LOSE_TEAM;
				});
				team_all = team_win_db.concat(team_lose_db);
				// calculate new scores
				trueskill.AdjustPlayers(team_all);
				team_all.forEach((p) => {
					p.user_mean = p.skill[0];
					p.user_variance = p.skill[1];
					delete p.skill;
					delete p.rank;
				});
				break;
		}

		// update the db
		var team_all_upd_db = [];
		for (const p of team_all) {
			update_update_user_leaderbaord_values = [
				p.user_mean,
				p.user_variance,
				modified_at,
				modified_by,
				p.user_uuid,
				leaderboard_db.uuid,
			];
			var { rows } = await dbQuery.query(
				updateUserLeaderboardQuery,
				update_update_user_leaderbaord_values
			);
			team_all_upd_db = team_all_upd_db.concat(rows[0]);
		}

		await dbQuery.commitTransaction();

		successMessage.data = team_all_upd_db;
		return res.status(status.created).send(successMessage);
	} catch (error) {
		console.log(error);
		dbQuery.rollbackTransaction();
		if (error.routine === "_bt_check_unique") {
			errorMessage.error = "Create Game internal error";
			return res.status(status.conflict).send(errorMessage);
		}
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}

};

export { createGame };
