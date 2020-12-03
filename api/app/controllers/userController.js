import moment from "moment";

import dbQuery from "../db/dbQuery.js";

import {
	hashPassword,
	comparePassword,
	isValidEmail,
	validatePassword,
	validateFullName,
	isEmpty,
	generateUUID,
	generateUserToken,
} from "../helpers/validation.js";

import { errorMessage, successMessage, status } from "../helpers/status.js";

/**
 * Create A User
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const createUser = async (req, res) => {
	const { email, full_name, password, image } = req.body;

	const flag_active = 1;
	const created_at = moment(new Date());
	const modified_at = moment(new Date());
	const modified_by = null;

	if (isEmpty(email) || isEmpty(full_name) || isEmpty(password)) {
		errorMessage.error =
			"Email, password, and full name field cannot be empty";
		return res.status(status.bad).send(errorMessage);
	}
	if (!isValidEmail(email)) {
		errorMessage.error = "Please enter a valid Email";
		return res.status(status.bad).send(errorMessage);
	}
	if (!validateFullName(full_name)) {
		errorMessage.error = "Full Name must be more than three(3) characters";
		return res.status(status.bad).send(errorMessage);
	}
	if (!validatePassword(password)) {
		errorMessage.error = "Password must be more than five(5) characters";
		return res.status(status.bad).send(errorMessage);
	}

	const hashed_password = hashPassword(password);
	const user_uuid = generateUUID("U");

	const createUserQuery = `INSERT INTO users 
		(uuid, email, full_name, password, image, flag_active, created_at, modified_at, modified_by) 
		VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) 
		returning uuid, email, full_name, image, flag_active, created_at`;
	const values = [
		user_uuid,
		email,
		full_name,
		hashed_password,
		image,
		flag_active,
		created_at,
		modified_at,
		modified_by,
	];

	try {
		const { rows } = await dbQuery.query(createUserQuery, values);
		const dbResponse = rows[0];
		delete dbResponse.password;

		const token = generateUserToken(
			dbResponse.id,
			dbResponse.email,
			dbResponse.uuid,
			dbResponse.full_name
		);
		successMessage.data = dbResponse;
		successMessage.data.token = token;
		return res.status(status.created).send(successMessage);
	} catch (error) {
		if (error.routine === "_bt_check_unique") {
			errorMessage.error = "User with that EMAIL already exist";
			return res.status(status.conflict).send(errorMessage);
		}
		errorMessage.error = "Operation was not successful";
		errorMessage.stacktrace = error;
		return res.status(status.error).send(errorMessage);
	}
};

/**
 * Signin
 * @param {object} req
 * @param {object} res
 * @returns {object} user object
 */
const siginUser = async (req, res) => {
	const { email, password } = req.body;

	if (isEmpty(email) || isEmpty(password)) {
		errorMessage.error = "Email or Password detail is missing";
		return res.status(status.bad).send(errorMessage);
	}

	if (!isValidEmail(email) || !validatePassword(password)) {
		errorMessage.error = "Please enter a valid Email or Password";
		return res.status(status.bad).send(errorMessage);
	}

	const signinUserQuery = `SELECT id, uuid, email, password, full_name, image FROM users WHERE email = $1`;

	try {
		const { rows } = await dbQuery.query(signinUserQuery, [email]);
		const dbResponse = rows[0];

		if (!dbResponse) {
			errorMessage.error = "User with this email does not exist";
			return res.status(status.notfound).send(errorMessage);
		}
		if (!comparePassword(dbResponse.password, password)) {
			errorMessage.error = "The password you provided is incorrect";
			return res.status(status.bad).send(errorMessage);
		}

		const token = generateUserToken(
			dbResponse.id,
			dbResponse.email,
			dbResponse.uuid,
			dbResponse.full_name,
			dbResponse.password
		);

		delete dbResponse.id;
		delete dbResponse.password;

		successMessage.data = dbResponse;
		successMessage.data.token = token;

		return res.status(status.success).send(successMessage);
	} catch (error) {
		console.log(error);
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

/**
 * Logout
 * @param {object} req
 * @param {object} res
 */
const logoutUser = async (req, res) => {
	// TODO: implement logout function
	try {
		successMessage.data = "logout";
		return res.status(status.success).send(successMessage);
	} catch (error) {
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

/**
 * Get user by UUID
 * @param {object} req
 * @param {object} res
 */
const getUserByUUID = async (req, res) => {
	const uuid = req.params.uuid;

	const findUserQuery =
		"SELECT uuid, email, full_name FROM users WHERE uuid=$1";
	const values = [uuid];

	try {
		const { rows } = await dbQuery.query(findUserQuery, values);
		const dbResponse = rows[0];
		if (!dbResponse) {
			errorMessage.error = "User Cannot be found";
			return res.status(status.notfound).send(errorMessage);
		}
		successMessage.data = dbResponse;
		return res.status(status.success).send(successMessage);
	} catch (error) {
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

/**
 * Get user belonging to the leaderboard with UUID
 * @param {object} req
 * @param {object} res
 */
const getUsersOfLeaderboardUUID = async (req, res) => {
	const uuid = req.params.uuid;

	const findUserQuery = `SELECT u.uuid, u.email, u.full_name FROM users u 
			INNER JOIN user_leaderboard ul ON u.user_id = ul.user_id 
			INNER JOIN leaderboard l ON ul.leaderboard_id = l.leaderboard_id 
			WHERE l.uuid=$1`;
	const values = [uuid];

	try {
		const { rows } = await dbQuery.query(findUserQuery, values);

		successMessage.data = rows;
		return res.status(status.success).send(successMessage);
	} catch (error) {
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

/**
 * Modify user (only itself)
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const modifyUser = async (req, res) => {
	const { email, full_name, password, image, user } = req.body;

	const req_user_id = req.user.id;

	const email_check = email ? email : req.user.email;
	const full_name_check = full_name ? full_name : req.user.full_name;
	const password_check = password ? hashPassword(password) : req.user.password;

	const modified_at = moment(new Date());
	const modified_by = req.user.uuid;

	if (!isValidEmail(email_check)) {
		errorMessage.error = "Please enter a valid Email";
		return res.status(status.bad).send(errorMessage);
	}
	if (!validateFullName(full_name_check)) {
		errorMessage.error = "Full Name must be more than three(3) characters";
		return res.status(status.bad).send(errorMessage);
	}
	if (!validatePassword(password_check)) {
		errorMessage.error = "Password must be more than five(5) characters";
		return res.status(status.bad).send(errorMessage);
	}

	const checkMailQuery = `SELECT * from users 
		WHERE email = $1 AND id <> $2`;
	const values_mail = [email_check, req_user_id];

	// check mail already used
	try {
		const { rows } = await dbQuery.query(checkMailQuery, values_mail);
		const dbResponse = rows[0];

		if (dbResponse) {
			errorMessage.error = "Mail already used";
			return res.status(status.conflict).send(errorMessage);
		}
	} catch (error) {
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}

	const updateUserQuery = `UPDATE users 
		SET email = $1, full_name = $2, password = $3, image = $4, modified_at = $5, modified_by = $6 
		WHERE id = $7 returning uuid, email, full_name, image, modified_at`;
	const values = [
		email_check,
		full_name_check,
		password_check,
		image,
		modified_at,
		modified_by,
		req_user_id,
	];

	// TODO: disable user and send notification mail

	try {
		const { rows } = await dbQuery.query(updateUserQuery, values);
		const dbResponse = rows[0];

		if (!dbResponse) {
			errorMessage.error = "User Cannot be found";
			return res.status(status.notfound).send(errorMessage);
		}

		delete dbResponse.password;

		successMessage.data = dbResponse;

		return res.status(status.success).send(successMessage);
	} catch (error) {
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

/**
 * Delete user (only itself)
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
const deleteUser = async (req, res) => {
	const req_user_id = req.user.id;

	const deleteUserQuery = `DELETE FROM users WHERE id = $1 returning *`;
	values = [req_user_id];

	try {
		const { rows } = await dbQuery.query(deleteUserQuery, values);
		const dbResponse = rows[0];

		if (!dbResponse) {
			errorMessage.error = "User Cannot be found";
			return res.status(status.notfound).send(errorMessage);
		}

		delete dbResponse.password;

		successMessage.data = dbResponse;

		return res.status(status.success).send(successMessage);
	} catch (error) {
		errorMessage.error = "Operation was not successful";
		return res.status(status.error).send(errorMessage);
	}
};

export {
	createUser,
	siginUser,
	logoutUser,
	modifyUser,
	deleteUser,
	getUserByUUID,
	getUsersOfLeaderboardUUID,
};
