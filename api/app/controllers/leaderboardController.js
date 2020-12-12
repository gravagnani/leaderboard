import moment from "moment";

import dbQuery from "../db/dbQuery.js";

import { isEmpty, generateUUID } from "../helpers/validation.js";

import { errorMessage, successMessage, status } from "../helpers/status.js";

import { newLeaderboard } from "./mailController.js";

import {
	PRICING_BASIC,
	PRICING_MEDIUM,
	PRICING_LARGE,
	MIN_USERS_BASIC,
	MIN_USERS_MEDIUM,
	MIN_USERS_LARGE,
	MAX_USERS_BASIC,
	MAX_USERS_MEDIUM,
	MAX_USERS_LARGE,
	DEFAULT_CLASSIC_MEAN,
	DEFAULT_CLASSIC_VARIANCE,
	DEFAULT_TRUESKILL_MEAN,
	DEFAULT_TRUESKILL_VARIANCE,
} from "../constants.js";

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
			max_users, start_date, end_date, pricing, created_by 
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
 *
 * @param {*} req
 * @param {*} res
 */
const validateLeaderboard = async (req, res) => {
	try {
		const {
			title,
			place,
			note,
			min_users,
			max_users,
			start_date,
			end_date,
			mode,
			pricing,
		} = req.body;

		const min_users_check = min_users ? min_users : MIN_USERS_BASIC;
		const max_users_check = max_users ? max_users : MAX_USERS_BASIC;
		const place_check = place ? place : null;
		const note_check = note ? note : null;
		const start_date_check = start_date ? start_date : moment(new Date());
		const end_date_check = end_date
			? end_date
			: moment(new Date("2099-12-31"));
		const mode_check = mode ? mode : "C"; // C = Classical T = Trueskill
		const flag_public_check = 1; // for when implementi public / private
		const flag_active = 1;

		if (isEmpty(title)) {
			errorMessage.error = "Title must not be empty";
			return res.status(status.bad).send(errorMessage);
		}

		// CHECK PRICING -> consistents min and max_users (for now)
		switch (pricing) {
			case PRICING_BASIC:
				if (
					!(
						min_users_check >= MIN_USERS_BASIC &&
						min_users_check <= MAX_USERS_BASIC &&
						max_users_check >= MIN_USERS_BASIC &&
						max_users_check <= MAX_USERS_BASIC
					)
				) {
					errorMessage.error =
						"In " +
						pricing +
						" pricing, users must be between " +
						MIN_USERS_BASIC +
						" and " +
						MAX_USERS_BASIC;
					return res.status(status.bad).send(errorMessage);
				}
				break;
			case PRICING_MEDIUM:
				if (
					!(
						min_users_check >= MIN_USERS_MEDIUM &&
						min_users_check <= MAX_USERS_MEDIUM &&
						max_users_check >= MIN_USERS_MEDIUM &&
						max_users_check <= MAX_USERS_MEDIUM
					)
				) {
					errorMessage.error =
						"In " +
						pricing +
						" pricing, users must be between " +
						MIN_USERS_MEDIUM +
						" and " +
						MAX_USERS_MEDIUM;
					return res.status(status.bad).send(errorMessage);
				}
				break;
			case PRICING_LARGE:
				if (
					!(
						min_users_check >= MIN_USERS_LARGE &&
						min_users_check <= MAX_USERS_LARGE &&
						max_users_check >= MIN_USERS_LARGE &&
						max_users_check <= MAX_USERS_LARGE
					)
				) {
					errorMessage.error =
						"In " +
						pricing +
						" pricing, users must be between " +
						MIN_USERS_LARGE +
						" and " +
						MAX_USERS_LARGE;
					return res.status(status.bad).send(errorMessage);
				}
				break;
			default:
				errorMessage.error = "Pricing plan does not exists";
				return res.status(status.bad).send(errorMessage);
		}

		if (min_users_check > max_users_check) {
			errorMessage.error = "Max users must be more than Min users";
			return res.status(status.bad).send(errorMessage);
		}

		successMessage.data = "Leaderoard input validated";
		return res.status(status.created).send(successMessage);
	} catch (error) {
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
	// EXECUTE VALIDATION BEFORE CREATE LEADERBOARD (FOR PAYPAL)
	const {
		title,
		place,
		note,
		min_users,
		max_users,
		start_date,
		end_date,
		mode,
		pricing,
	} = req.body;

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
	const flag_active = 1;

	if (isEmpty(title)) {
		errorMessage.error = "Title must not be empty";
		return res.status(status.bad).send(errorMessage);
	}

	// CHECK PRICING -> consistents min and max_users (for now)
	switch (pricing) {
		case PRICING_BASIC:
			if (
				!(
					min_users_check >= MIN_USERS_BASIC &&
					min_users_check <= MAX_USERS_BASIC &&
					max_users_check >= MIN_USERS_BASIC &&
					max_users_check <= MAX_USERS_BASIC
				)
			) {
				errorMessage.error =
					"In " +
					pricing +
					" pricing, users must be between " +
					MIN_USERS_BASIC +
					" and " +
					MAX_USERS_BASIC;
				return res.status(status.bad).send(errorMessage);
			}
			break;
		case PRICING_MEDIUM:
			if (
				!(
					min_users_check >= MIN_USERS_MEDIUM &&
					min_users_check <= MAX_USERS_MEDIUM &&
					max_users_check >= MIN_USERS_MEDIUM &&
					max_users_check <= MAX_USERS_MEDIUM
				)
			) {
				errorMessage.error =
					"In " +
					pricing +
					" pricing, users must be between " +
					MIN_USERS_MEDIUM +
					" and " +
					MAX_USERS_MEDIUM;
				return res.status(status.bad).send(errorMessage);
			}
			break;
		case PRICING_LARGE:
			if (
				!(
					min_users_check >= MIN_USERS_LARGE &&
					min_users_check <= MAX_USERS_LARGE &&
					max_users_check >= MIN_USERS_LARGE &&
					max_users_check <= MAX_USERS_LARGE
				)
			) {
				errorMessage.error =
					"In " +
					pricing +
					" pricing, users must be between " +
					MIN_USERS_LARGE +
					" and " +
					MAX_USERS_LARGE;
				return res.status(status.bad).send(errorMessage);
			}
			break;
		default:
			errorMessage.error = "Pricing plan does not exists";
			return res.status(status.bad).send(errorMessage);
	}

	if (min_users_check > max_users_check) {
		errorMessage.error = "Max users must be more than Min users";
		return res.status(status.bad).send(errorMessage);
	}

	const leaderboard_uuid = generateUUID("L");

	// todo: manda mail con link laderboard
	// parametro email (eventualmente full_name)

	const createLeaderboardQuery = `
		INSERT INTO leaderboard (
			uuid, title, place, note, min_users, max_users, 
			start_date, end_date, mode, pricing, flag_public, flag_active, 
			created_at, created_by, modified_at, modified_by
		) VALUES(
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
		) RETURNING 
			uuid, title, place, note, min_users, max_users, 
			start_date, end_date, mode, pricing, flag_public, flag_active, 
			created_at, created_by, modified_at, modified_by
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
		pricing,
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

		// send mail
		newLeaderboard(req.user, dbResponse, req.headers.origin + '/leaderboard/' + dbResponse.uuid);

		return res.status(status.created).send(successMessage);
	} catch (error) {
		console.log(error);
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

	const { title, place, note, start_date, end_date, flag_public } = req.body;

	// TODO: fa le stesse cose della funzione di ricerca per uuid => aggiornare il codice
	const getLeaderboardUUIDQuery = `
		SELECT uuid, title, place, note, min_users, max_users, 
			pricing, start_date, end_date, created_by 
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
		const start_date_check = start_date || dbResponse.start_date;
		const end_date_check = end_date || dbResponse.end_date;

		if (isEmpty(title)) {
			errorMessage.error = "Title must not be empty";
			return res.status(status.bad).send(errorMessage);
		}

		const modifyLeaderboardQuery = `
			UPDATE leaderboard 
			SET title = $2, place = $3, note = $4, start_date = $5, 
				end_date = $6, modified_at = $7, modified_by = $8
			WHERE uuid = $1
			RETURNING *`;

		var values = [
			leaderboard_uuid,
			title_check,
			place_check,
			note_check,
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

	const checkUserNameQuery = `SELECT * FROM user_leaderboard WHERE leaderboard_uuid=$1 AND user_full_name = $2`;
	const user_name_values = [leaderboard_uuid, user_full_name];

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
				user_variance, flag_active, created_at, modified_at, modified_by
			) VALUES(
					$1, $2, $3, $4, $5, B'1', $6, $7, $8
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
			AND ul.flag_active = B'1'
			AND u.flag_active = B'1'
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
	validateLeaderboard,
	createLeaderboard,
	getAllLeaderboards,
	getLeaderboardByUUID,
	getLeaderboardByTitle,
	modifyLeaderboard,
	joinLeaderboard,
	getLeaderboardParticipants,
};
