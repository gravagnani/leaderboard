import moment from "moment";

import dbQuery from "../db/dbQuery";

import { isEmpty, generateUUID } from "../helpers/validation";

import { errorMessage, successMessage, status } from "../helpers/status";

/**
 * Get all Leaderboards
 * @param {object} req
 * @param {object} res
 * @returns {object} list of all leaderboards
 */
const getAllLeaderboards = async (req, res) => {
	const getAllLeaderboardsQuery = `SELECT uuid, title, place, min_users, max_users, start_date, end_date FROM leaderboard`;

	try {
		const { rows } = await dbQuery.query(createLeaderboardQuery);
		successMessage.data = rows;

		return res.status(status.created).send(successMessage);
	} catch (error) {
		if (error.routine === "_bt_check_unique") {
			errorMessage.error = "Get All Leaderboard internal error";
			return res.status(status.conflict).send(errorMessage);
		}
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

/**
 * Get a Leaderboard by UUID
 * @param {object} req
 * @param {object} res
 * @returns {object} leaderboard with corresponding uuid
 */
const getLeaderboardByUUID = async (req, res) => {
	const uuid = req.params.uuid;

	const getAllLeaderboardsQuery = `SELECT uuid, title, place, min_users, max_users, start_date, end_date FROM leaderboard WHERE uuid = $1`;
	const values = [uuid];

	try {
		const { rows } = await dbQuery.query(getAllLeaderboardsQuery, values);
		const dbResponse = rows[0];
		if (!dbResponse) {
			errorMessage.error = "Leaderboard Cannot be found";
			return res.status(status.notfound).send(errorMessage);
		}
		successMessage.data = rows;

		return res.status(status.created).send(successMessage);
	} catch (error) {
		if (error.routine === "_bt_check_unique") {
			errorMessage.error = "Get All Leaderboard internal error";
			return res.status(status.conflict).send(errorMessage);
		}
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

/**
 * Get a Leaderboard by Title
 * @param {object} req
 * @param {object} res
 * @returns {object} leaderboard with corresponding title
 */
const getLeaderboardByTitle = async (req, res) => {
	const title = req.params.title;

	const getAllLeaderboardsQuery = `SELECT uuid, title, place, min_users, max_users, start_date, end_date FROM leaderboard WHERE lower(title) like "%$1%"`;
	const values = [title];

	try {
		const { rows } = await dbQuery.query(getAllLeaderboardsQuery, values);
		const dbResponse = rows[0];
		if (!dbResponse) {
			errorMessage.error = "Leaderboard Cannot be found";
			return res.status(status.notfound).send(errorMessage);
		}
		successMessage.data = rows;

		return res.status(status.created).send(successMessage);
	} catch (error) {
		if (error.routine === "_bt_check_unique") {
			errorMessage.error = "Get All Leaderboard internal error";
			return res.status(status.conflict).send(errorMessage);
		}
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

/**
 * Create A Leaderboard
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const createLeaderboard = async (req, res) => {
	const {
		title,
		place,
		note,
		min_users,
		max_users,
		start_date,
		end_date,
		flag_public,
	} = req.body;

	const flag_active = 1;
	const created_at = moment(new Date());
	const modified_at = moment(new Date());
	// from header
	const created_by = req.user.email;
	const modified_by = req.user.email;

	// TODO: sistema le costanti
	const min_users_check = min_users ? min_users : 1;
	const max_users_check = max_users ? max_users : 99;
	const start_date_check = start_date ? start_date : moment(new Date());
	const flag_public_check = flag_public ? flag_public : 1;

	if (isEmpty(title)) {
		errorMessage.error = "Title must not be empty";
		return res.status(status.bad).send(errorMessage);
	}

	const leaderboard_uuid = generateUUID(title + created_by);

	const createLeaderboardQuery = `INSERT INTO
		leaderboard(uuid, title, place, note, min_users, max_users
			, start_date , end_date, flag_public, flag_active
			, created_at , created_by, modified_at, modified_by)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      returning *`;
	const values = [
		leaderboard_uuid,
		title,
		place,
		note,
		min_users_check,
		max_users_check,
		start_date_check,
		end_date,
		flag_public_check,
		flag_active,
		created_at,
		created_by,
		modified_at,
		modified_by,
	];

	try {
		const { rows } = await dbQuery.query(createLeaderboardQuery, values);
		const dbResponse = rows[0];
		successMessage.data = dbResponse;

		return res.status(status.created).send(successMessage);
	} catch (error) {
		if (error.routine === "_bt_check_unique") {
			errorMessage.error = "Create Leaderboard internal error";
			return res.status(status.conflict).send(errorMessage);
		}
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};
/**
 * Create A Leaderboard
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const modifyLeaderboard = async (req, res) => {
	const user_id = req.user.id;

	const {
		uuid,
		title,
		place,
		note,
		min_users,
		max_users,
		start_date,
		end_date,
		flag_public,
	} = req.body;

	// TODO: fa le stesse cose della funzione di ricerca per uuid => aggiornare il codice
	const getAllLeaderboardsQuery = `SELECT uuid, title, place, min_users, max_users, start_date, end_date, created_by FROM leaderboard WHERE uuid = $1`;
	const values = [uuid];

	try {
		// search by uuid
		const { rows } = await dbQuery.query(getAllLeaderboardsQuery, values);
		const dbResponse = rows[0];
		if (!dbResponse) {
			errorMessage.error = "Leaderboard Cannot be found";
			return res.status(status.notfound).send(errorMessage);
		}

		if (dbResponse.created_by != user_id) {
			errorMessage.error = "User unauthorized to modify leaderboard";
			return res.status(status.unauthorized).send(errorMessage);
		}

		// modify
		const modified_at = moment(new Date());
		// from header
		const modified_by = req.user.email;

		// TODO: sistema le costanti
		const min_users_check = min_users ? min_users : 1;
		const max_users_check = max_users ? max_users : 99;
		const start_date_check = start_date ? start_date : moment(new Date());
		const flag_public_check = flag_public ? flag_public : 1;

		if (isEmpty(title)) {
			errorMessage.error = "Title must not be empty";
			return res.status(status.bad).send(errorMessage);
		}

		const modifyLeaderboardQuery = `UPDATE leaderboard set title = $1, place = $2, note = $3
			, min_users = $4, max_users = $5, start_date = $6, end_date = $7, flag_public = $8
			, modified_at = $9, modified_by = $10)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning *`;
		const values = [
			title,
			place,
			note,
			min_users_check,
			max_users_check,
			start_date_check,
			end_date,
			flag_public_check,
			modified_at,
			modified_by,
		];

		const { rows } = await dbQuery.query(modifyLeaderboardQuery, values);
		const dbResponse = rows[0];
		successMessage.data = dbResponse;

		return res.status(status.created).send(successMessage);
	} catch (error) {
		if (error.routine === "_bt_check_unique") {
			errorMessage.error = "Modify Leaderboard internal error";
			return res.status(status.conflict).send(errorMessage);
		}
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

export {
	createLeaderboard,
	getAllLeaderboards,
	getLeaderboardByUUID,
	getLeaderboardByTitle,
	modifyLeaderboard,
};
