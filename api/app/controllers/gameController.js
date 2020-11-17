import moment from "moment";

import dbQuery from "../db/dbQuery";

import { isEmpty, generateUUID } from "../helpers/validation";

import { errorMessage, successMessage, status } from "../helpers/status";

import {
	MAX_USERS_PER_TEAM,
	MAX_USERS_PER_GAME,
	WIN_TEAM,
	LOSE_TEAM,
	DRAW_TEAM,
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
	const user = req.user;
	const leaderboard_uuid = req.params.uuid;
	const { team_win, team_lose, team_draw } = req.body;
	const all_part_uuid = team_win.concat(team_lose); // forse togliere il map

	const created_at = moment(new Date());
	const modified_at = moment(new Date());
	// from header
	const created_by = user.uuid;
	const modified_by = user.uuid;

	// CHECKS

	// one and only one participant per team
	if (
		team_win.length + team_lose.length + team_draw.length !=
		MAX_USERS_PER_GAME
	) {
		errorMessage.error =
			"There must be " + MAX_USERS_PER_GAME + " participants per game";
		return res.status(status.bad).send(errorMessage);
	}

	if (team_draw.length > 0 && (team_win.length > 0 || team_lose.length > 0)) {
		errorMessage.error =
			"If the game was finished in draw, winners and losers should not be present";
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

	// create dinamically
	const searchUsersPreparedStatementFnc = (params_list) => {
		// first param is leaderboard_uuid, so start from 2
		var params = [];
		for (var i = 1; i < params_list.length; i++) {
			params.push("$" + Number(i + 1));
		}
		if (params_list.length == 1) {
			// se ho solo un parametro (non ho utenti) -> non trovare niente (id=-1)
			return `
				SELECT user_uuid, user_mean, user_variance
				FROM user_leaderboard
				WHERE 1=1
					AND leaderboard_uuid = $1
					AND id = -1`;
		}
		return (
			`
			SELECT user_uuid, user_mean, user_variance
			FROM user_leaderboard
			WHERE 1=1
				AND leaderboard_uuid = $1
				AND user_uuid IN (` +
			params.join(",") +
			`)`
		);
	};
	const search_win_users_leaderboard_values = [
		leaderboard_uuid,
		//win_part_string,
		...team_win,
	];
	const search_lose_users_leaderboard_values = [
		leaderboard_uuid,
		//lose_part_string,
		...team_lose,
	];
	const search_draw_users_leaderboard_values = [
		leaderboard_uuid,
		//draw_part_string,
		...team_draw,
	];

	const createGameQuery = `
		INSERT INTO game (
			uuid, leaderboard_uuid, modified_at, modified_by, created_at, created_by
		) VALUES (
			$1, $2, $3, $4, $5, $6
		) RETURNING 
			uuid, leaderboard_uuid, created_at, created_by
	`;
	const new_game_uuid = generateUUID(user.uuid + new Date());
	const create_game_values = [
		new_game_uuid,
		leaderboard_uuid,
		modified_at,
		modified_by,
		created_at,
		created_by,
	];

	const insertUserGameQuery = `
		INSERT INTO user_game (
			game_uuid, user_uuid, team, mean_old, variance_old, mean_new, variance_new, 
			modified_at, modified_by, created_at, created_by
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
		) RETURNING 
			game_uuid, user_uuid, team, created_at, created_by
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
	var update_update_user_leaderboard_values = [];

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
		// start date and end date
		if (leaderboard_db.start_date > created_at) {
			errorMessage.error = "Leaderboard not started yet";
			return res.status(status.conflict).send(errorMessage);
		}

		if (leaderboard_db.end_date < created_at) {
			errorMessage.error = "Leaderboard already ended";
			return res.status(status.conflict).send(errorMessage);
		}

		// participants exist and participate in the leaderboard
		// search winners and loser separately
		var { rows } = await dbQuery.query(
			searchUsersPreparedStatementFnc(search_win_users_leaderboard_values),
			search_win_users_leaderboard_values
		);
		var team_win_db = rows;
		var { rows } = await dbQuery.query(
			searchUsersPreparedStatementFnc(search_lose_users_leaderboard_values),
			search_lose_users_leaderboard_values
		);
		var team_lose_db = rows;
		var { rows } = await dbQuery.query(
			searchUsersPreparedStatementFnc(search_draw_users_leaderboard_values),
			search_draw_users_leaderboard_values
		);
		var team_draw_db = rows;

		var all_part_uuid_db = team_win_db
			.concat(team_lose_db)
			.concat(team_draw_db)
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

		// update users with new mean and variance
		// create only one array (join team_win_db and team_lose_db) with both winners and losers

		// trueskill doc https://github.com/freethenation/node-trueskill
		var team_all = [];
		var trueskill = require("trueskill");

		switch (leaderboard_db.mode) {
			case "C":
				team_win_db.forEach((p) => {
					p.user_mean_new = p.user_mean + CLASSIC_WIN_POINTS;
					p.team = WIN_TEAM;
				});
				team_lose_db.forEach((p) => {
					p.user_mean_new = p.user_mean + CLASSIC_LOSE_POINTS;
					p.team = LOSE_TEAM;
				});
				team_draw_db.forEach((p) => {
					p.user_mean_new = p.user_mean + CLASSIC_DRAW_POINTS;
					p.team = DRAW_TEAM;
				});
				team_all = team_win_db.concat(team_lose_db);
				break;
			case "T":
				team_win_db.forEach((p) => {
					p.skill = [p.user_mean, p.user_variance];
					p.rank = WIN_TEAM;
					p.team = WIN_TEAM;
				});
				team_lose_db.forEach((p) => {
					p.skill = [p.user_mean, p.user_variance];
					p.rank = LOSE_TEAM;
					p.team = LOSE_TEAM;
				});
				team_draw_db.forEach((p) => {
					p.skill = [p.user_mean, p.user_variance];
					p.rank = DRAW_TEAM;
					p.team = DRAW_TEAM;
				});
				team_all = team_win_db.concat(team_lose_db).concat(team_draw_db);
				// calculate new scores
				trueskill.AdjustPlayers(team_all);
				team_all.forEach((p) => {
					p.user_mean_new = p.skill[0];
					p.user_variance_new = p.skill[1];
					delete p.skill;
					delete p.rank;
				});
				break;
		}

		// create game -> all transactional
		await dbQuery.beginTransaction();

		var { rows } = await dbQuery.query(createGameQuery, create_game_values);
		var new_game = rows[0];

		// associate teams with game -> insert in user_game table
		for (const p of team_all) {
			insert_user_game_values = [
				new_game.uuid,
				p.user_uuid,
				p.team,
				p.user_mean, // mean_old
				p.user_variance, //cvariance_old
				p.user_mean_new,
				p.user_variance_new,
				modified_at,
				modified_by,
				created_at,
				created_by,
			];
			var { rows } = await dbQuery.query(
				insertUserGameQuery,
				insert_user_game_values
			);
		}

		// update the db
		var team_all_upd_db = [];
		for (const p of team_all) {
			update_update_user_leaderboard_values = [
				p.user_mean_new,
				p.user_variance_new,
				modified_at,
				modified_by,
				p.user_uuid,
				leaderboard_db.uuid,
			];
			var { rows } = await dbQuery.query(
				updateUserLeaderboardQuery,
				update_update_user_leaderboard_values
			);
			team_all_upd_db = team_all_upd_db.concat(rows[0]);
		}

		await dbQuery.commitTransaction();

		successMessage.data = team_all_upd_db;
		return res.status(status.created).send(successMessage);
	} catch (error) {
		dbQuery.rollbackTransaction();
		if (error.routine === "_bt_check_unique") {
			errorMessage.error = "Create Game internal error";
			return res.status(status.conflict).send(errorMessage);
		}
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

/**
 * Create A Game
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const getLeaderboardGames = async (req, res) => {
	const leaderboard_uuid = req.params.uuid;
	// if not specified than zero
	const N = req.params.N || 0;

	if (!leaderboard_uuid) {
		errorMessage.error = "Specify the leaderboard UUID";
		return res.status(status.bad).send(errorMessage);
	}

	const getLeaderboardGamesQuery = `
		SELECT 
			game_uuid, leaderboard_uuid, users_uuid, users_name, users_team,
			users_delta, to_char(created_at, 'Dy DD Mon') as date
		FROM game_v
		WHERE 1=1
			AND leaderboard_uuid = $1
		ORDER BY modified_at DESC
		LIMIT ($2)
	`;
	const get_leaderboard_games_values = [leaderboard_uuid, N];

	try {
		var { rows } = await dbQuery.query(
			getLeaderboardGamesQuery,
			get_leaderboard_games_values
		);
		rows.forEach((game) => {
			const uuids = game.users_uuid.split(",");
			const names = game.users_name.split(",");
			const teams = game.users_team.split(",");
			const deltas = game.users_delta.split(",");
			game.users = [];
			for (var i = 0; i < uuids.length; i++) {
				game.users.push({
					user_uuid: uuids[i],
					user_full_name: names[i],
					user_team: teams[i],
					user_delta: deltas[i],
				});
			}
		});

		successMessage.data = rows;
		return res.status(status.created).send(successMessage);
	} catch (error) {
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

/**
 * Create A Game
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const deleteLastGame = async (req, res) => {
	const user = req.user;
	const leaderboard_uuid = req.params.uuid;

	// from header
	const modified_at = moment(new Date());
	const modified_by = user.uuid;

	const searchLeaderboardQuery = `
		SELECT uuid, title, place, note, min_users, max_users, start_date, 
			end_date, mode, flag_public, flag_active, created_by
		FROM leaderboard
		WHERE 1=1
			AND flag_active = B'1'
			AND uuid = $1
	`;
	const search_leaderboard_values = [leaderboard_uuid];

	const getLastGameQuery = `
		SELECT uuid, leaderboard_uuid
		FROM game
		WHERE leaderboard_uuid = $1
		ORDER BY created_at DESC
		LIMIT 1`;
	const get_last_game_query = [leaderboard_uuid];

	const getUsersLastGameQuery = `
		SELECT game_uuid, user_uuid, team, mean_old, variance_old
		FROM user_game
		WHERE game_uuid = $1`;
	var get_users_last_game_query = []; // game_uuid

	const updateUsersLastGameQuery = `
		UPDATE user_leaderboard
		SET user_mean = $1, user_variance = $2, 
			modified_at = $3, modified_by = $4
		WHERE user_uuid = $5
			AND leaderboard_uuid = $6
	`;
	var update_users_last_game_valued = []; // user_mean, user_variance, modified_at, modified_by, uuid

	const deleteUserGameQuery = `
		DELETE FROM user_game
		WHERE game_uuid = $1
	`;
	var delete_user_game_values = []; // game_uuid

	const deleteLastGameQuery = `
		DELETE FROM game
		WHERE uuid = $1
		RETURNING uuid, leaderboard_uuid
	`;
	var delete_last_game_values = []; // game_uuid

	try {
		// search last game
		var { rows } = await dbQuery.query(
			searchLeaderboardQuery,
			search_leaderboard_values
		);
		var leaderboard_db = rows[0];

		if (!leaderboard_db) {
			errorMessage.error = "Leaderboard not found";
			return res.status(status.notfound).send(errorMessage);
		}
		// start date and end date
		if (leaderboard_db.start_date > modified_at) {
			errorMessage.error = "Leaderboard not started yet";
			return res.status(status.conflict).send(errorMessage);
		}

		if (leaderboard_db.end_date < modified_at) {
			errorMessage.error = "Leaderboard already ended";
			return res.status(status.conflict).send(errorMessage);
		}

		// check on created by user -> only leaderboard creator can delete a game
		if (user.uuid != leaderboard_db.created_by) {
			errorMessage.error = "Only leaderboard can delete a game";
			return res.status(status.unauthorized).send(errorMessage);
		}

		// OK -> update and delete

		// get last game
		var { rows } = await dbQuery.query(getLastGameQuery, get_last_game_query);
		var game_db = rows[0];

		if (!game_db) {
			errorMessage.error = "Leaderboard has no Games";
			return res.status(status.notfound).send(errorMessage);
		}

		// get users last game
		var get_users_last_game_query = [game_db.uuid];
		var { rows } = await dbQuery.query(
			getUsersLastGameQuery,
			get_users_last_game_query
		);
		var users_game_db = rows;

		if (!users_game_db) {
			errorMessage.error = "Users last Game not found";
			return res.status(status.notfound).send(errorMessage);
		}

		// delete game -> all transactional
		await dbQuery.beginTransaction();

		// update users with old mean and old variance
		for (let i = 0; i < users_game_db.length; i++) {
			var update_users_last_game_valued = [
				users_game_db[i].mean_old,
				users_game_db[i].variance_old,
				modified_at,
				modified_by,
				users_game_db[i].user_uuid,
				leaderboard_uuid,
			];
			var { rows } = await dbQuery.query(
				updateUsersLastGameQuery,
				update_users_last_game_valued
			);
		}

		// delete user_game
		var delete_user_game_values = [game_db.uuid];
		var { rows } = await dbQuery.query(
			deleteUserGameQuery,
			delete_user_game_values
		);

		// delete game
		var delete_last_game_values = [game_db.uuid];
		var { rows } = await dbQuery.query(
			deleteLastGameQuery,
			delete_last_game_values
		);

		await dbQuery.commitTransaction();

		successMessage.data = rows;
		return res.status(status.created).send(successMessage);
	} catch (error) {
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

export { createGame, getLeaderboardGames, deleteLastGame };
