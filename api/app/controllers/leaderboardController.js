import moment from "moment";

import dbQuery from "../db/dbQuery";

import { isEmpty, generateUUID } from "../helpers/validation";

import { errorMessage, successMessage, status } from "../helpers/status";

import {
	MIN_USERS_FREE,
	MAX_USERS_FREE,
	DEFAULT_CLASSIC_MEAN,
	DEFAULT_CLASSIC_VARIANCE,
	DEFAULT_TRUESKILL_MEAN,
	DEFAULT_TRUESKILL_VARIANCE,
} from "../constants";

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

	const getAllLeaderboardsQuery = `
		SELECT uuid, title, place, note, min_users, 
			max_users, start_date, end_date, created_by 
		FROM leaderboard 
		WHERE uuid = $1`;
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
		mode,
		full_name,
		email,
	} = req.body;

	const flag_active = 1;
	const created_at = moment(new Date());
	const modified_at = moment(new Date());
	// from header
	const created_by = req.user.uuid;
	const modified_by = req.user.uuid;

	// TODO: sistema le costanti
	const min_users_check = min_users ? min_users : MIN_USERS_FREE;
	const max_users_check = max_users ? max_users : MAX_USERS_FREE;
	const place_check = place ? place : null;
	const note_check = note ? note : null;
	const start_date_check = start_date ? start_date : moment(new Date());
	const end_date_check = end_date ? end_date : moment(new Date("2099-12-31"));
	const mode_check = mode ? mode : "C"; // C = Classical T = Trueskill
	const flag_public_check = 1; // for when implementi public / private

	if (isEmpty(title)) {
		errorMessage.error = "Title must not be empty";
		return res.status(status.bad).send(errorMessage);
	}

	if (min_users_check > max_users_check) {
		errorMessage.error = "Max users must be more than Min users";
		return res.status(status.bad).send(errorMessage);
	}

	if (max_users_check > MAX_USERS_FREE) {
		errorMessage.error = "Max must be less than " + MAX_USERS_FREE;
		return res.status(status.bad).send(errorMessage);
	}

	const leaderboard_uuid = generateUUID(title + created_by);

	// todo: manda mail con link laderboard
	// parametro email (eventualmente full_name)

	const createLeaderboardQuery = `
		INSERT INTO leaderboard (
			uuid, title, place, note, min_users, max_users, 
			start_date, end_date, mode, flag_public, flag_active, 
			created_at, created_by, modified_at, modified_by
		) VALUES(
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
		) RETURNING 
			uuid, title, place, note, min_users, max_users, 
			start_date, end_date, flag_public, flag_active, 
			created_at, created_by, modified_at, modified_by, mode
	`;

	const values = [
		leaderboard_uuid,
		title,
		place_check,
		note_check,
		min_users_check,
		max_users_check,
		start_date_check,
		end_date_check,
		mode_check,
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
	const user_uuid = req.user.uuid;
	const leaderboard_uuid = req.params.uuid;

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

	// TODO: fa le stesse cose della funzione di ricerca per uuid => aggiornare il codice
	const getLeaderboardUUIDQuery = `
		SELECT uuid, title, place, note, min_users, max_users, 
			start_date, end_date, created_by 
		FROM leaderboard 
		WHERE uuid = $1`;
	var values = [leaderboard_uuid];

	try {
		// search by uuid
		var { rows } = await dbQuery.query(getLeaderboardUUIDQuery, values);
		const dbResponse = rows[0];
		if (!dbResponse) {
			errorMessage.error = "Leaderboard Cannot be found";
			return res.status(status.notfound).send(errorMessage);
		}

		if (dbResponse.created_by != user_uuid) {
			errorMessage.error = "User unauthorized to modify leaderboard";
			return res.status(status.unauthorized).send(errorMessage);
		}

		// modify
		const modified_at = moment(new Date());
		// from header
		const modified_by = user_uuid;

		const title_check = title || dbResponse.title;
		const place_check = place || dbResponse.place;
		const note_check = note || dbResponse.note;
		const min_users_check = min_users || dbResponse.min_users;
		const max_users_check = max_users || dbResponse.max_users;
		const start_date_check = start_date || dbResponse.start_date;
		const end_date_check = end_date || dbResponse.end_date;

		if (isEmpty(title)) {
			errorMessage.error = "Title must not be empty";
			return res.status(status.bad).send(errorMessage);
		}

		if (min_users_check > max_users_check) {
			errorMessage.error = "Max users must be more than Min users";
			return res.status(status.bad).send(errorMessage);
		}

		if (max_users_check > MAX_USERS_FREE) {
			errorMessage.error = "Max must be less than " + MAX_USERS_FREE;
			return res.status(status.bad).send(errorMessage);
		}

		const modifyLeaderboardQuery = `
			UPDATE leaderboard 
			SET title = $2, place = $3, note = $4, min_users = $5, 
				max_users = $6, start_date = $7, end_date = $8, 
				modified_at = $9, modified_by = $10
			WHERE uuid = $1
			RETURNING *`;

		var values = [
			leaderboard_uuid,
			title_check,
			place_check,
			note_check,
			min_users_check,
			max_users_check,
			start_date_check,
			end_date_check,
			modified_at,
			modified_by,
		];

		var { rows } = await dbQuery.query(modifyLeaderboardQuery, values);
		const dbResponseMod = rows[0];
		successMessage.data = dbResponseMod;

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

/**
 * Join A Leaderboard
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const joinLeaderboard = async (req, res) => {
	console.log(req.body);
	const { user_uuid, leaderboard_uuid, user_full_name } = req.body;

	const created_at = moment(new Date());
	const modified_at = moment(new Date());
	// from header
	const modified_by = req.user.uuid;
	var user_mean = null;
	var user_variance = null;

	if (isEmpty(user_uuid)) {
		errorMessage.error = "User UUID must not be empty";
		return res.status(status.bad).send(errorMessage);
	}

	if (user_uuid != req.user.uuid) {
		errorMessage.error = "User not allowed to join another user";
		return res.status(status.unauthorized).send(errorMessage);
	}

	if (isEmpty(leaderboard_uuid)) {
		errorMessage.error = "Leaderboard UUID must not be empty";
		return res.status(status.bad).send(errorMessage);
	}

	if (isEmpty(user_full_name)) {
		errorMessage.error = "User Full Name must not be empty";
		return res.status(status.bad).send(errorMessage);
	}

	const checkUserQuery = `SELECT * FROM users WHERE uuid = $1`;
	const user_values = [user_uuid];

	const checkLeaderboardQuery = `SELECT uuid, title, mode, start_date, end_date, 
		min_users, max_users, users FROM leaderboard_v WHERE uuid = $1`;
	const leaderboard_values = [leaderboard_uuid];

	const checkUserNameQuery = `SELECT * FROM user_leaderboard WHERE user_full_name = $1`;
	const user_name_values = [user_full_name];

	try {
		// check user exixts
		var { rows } = await dbQuery.query(checkUserQuery, user_values);
		const user_dbResponse = rows[0];
		if (!user_dbResponse) {
			errorMessage.error = "User Cannot be found";
			return res.status(status.notfound).send(errorMessage);
		}
		// check leaderboard exixts
		var { rows } = await dbQuery.query(
			checkLeaderboardQuery,
			leaderboard_values
		);
		const leaderboard_dbResponse = rows[0];
		// check leaderboard max users
		if (leaderboard_dbResponse.users == leaderboard_dbResponse.max_users) {
			errorMessage.error = "Leaderboard has not remaining free places";
			return res.status(status.conflict).send(errorMessage);
		}
		// check leaderboard end_date
		if (leaderboard_dbResponse.end_date <= moment(new Date())) {
			errorMessage.error = "Leaderboard is already ended";
			return res.status(status.conflict).send(errorMessage);
		}

		// check user full_name
		var { rows } = await dbQuery.query(checkUserNameQuery, user_name_values);
		const user_name_dbResponse = rows[0];
		if (user_name_dbResponse) {
			errorMessage.error = "User Full Name already used";
			return res.status(status.conflict).send(errorMessage);
		}
		// set user mean and variance based on leaderboard scoring mode
		switch (leaderboard_dbResponse.mode) {
			case "C":
				user_mean = DEFAULT_CLASSIC_MEAN;
				user_variance = DEFAULT_CLASSIC_VARIANCE;
				break;
			case "T":
				user_mean = DEFAULT_TRUESKILL_MEAN;
				user_variance = DEFAULT_TRUESKILL_VARIANCE;
				break;
		}

		const joinLeaderboardQuery = `
			INSERT INTO user_leaderboard(
				leaderboard_uuid, user_uuid, user_full_name, user_mean, 
				user_variance, created_at, modified_at, modified_by
			) VALUES(
					$1, $2, $3, $4, $5, $6, $7, $8
			) returning leaderboard_uuid, user_uuid, user_full_name, 
				user_mean, user_variance, modified_at`;
		const values = [
			leaderboard_uuid,
			user_uuid,
			user_full_name,
			user_mean,
			user_variance,
			created_at,
			modified_at,
			modified_by,
		];

		var { rows } = await dbQuery.query(joinLeaderboardQuery, values);
		const dbResponseJoin = rows[0];
		successMessage.data = dbResponseJoin;

		return res.status(status.created).send(successMessage);
	} catch (error) {
		if (error.routine === "_bt_check_unique") {
			errorMessage.error = "User already participating";
			return res.status(status.conflict).send(errorMessage);
		}
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

/**
 * Get a Leaderboard (UUID) participants
 * @param {object} req
 * @param {object} res
 * @returns {object} participants of the leaderboard
 */
const getLeaderboardParticipants = async (req, res) => {
	const uuid = req.params.uuid;

	const getLeaderboardQuery = `SELECT * FROM leaderboard WHERE uuid = $1`;
	const values_lb = [uuid];

	const getAllLeaderboardPartQuery = `
		SELECT ul.leaderboard_uuid, ul.user_uuid, 
			ul.user_full_name, ul.user_mean, ul.user_variance, u.image
		FROM user_leaderboard ul 
			LEFT JOIN users u ON (ul.user_uuid = u.uuid)
		WHERE leaderboard_uuid = $1
		ORDER BY user_mean desc, user_variance asc
	;`;
	const values = [uuid];

	try {
		// chack leaderbaord exists
		var { rows } = await dbQuery.query(getLeaderboardQuery, values_lb);
		const dbResponse = rows[0];
		if (!dbResponse) {
			errorMessage.error = "Leaderboard Cannot be found";
			return res.status(status.notfound).send(errorMessage);
		}
		// get participants
		var { rows } = await dbQuery.query(getAllLeaderboardPartQuery, values);
		successMessage.data = rows;

		return res.status(status.created).send(successMessage);
	} catch (error) {
		if (error.routine === "_bt_check_unique") {
			errorMessage.error = "Get All Leaderboard Participants internal error";
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
	joinLeaderboard,
	getLeaderboardParticipants,
};
