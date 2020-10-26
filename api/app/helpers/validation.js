import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../../env";

/**
 * Hash Password Method
 * @param {string} password
 * @returns {string} returns hashed password
 */
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = (password) => bcrypt.hashSync(password, salt);

/**
 * comparePassword
 * @param {string} hashPassword
 * @param {string} password
 * @returns {Boolean} return True or False
 */
const comparePassword = (hashedPassword, password) => {
	return bcrypt.compareSync(password, hashedPassword);
};

/**
 * isValidEmail helper method
 * @param {string} email
 * @returns {Boolean} True or False
 */
const isValidEmail = (email) => {
	const regEx = /\S+@\S+\.\S+/;
	return regEx.test(email);
};

/**
 * validatePassword helper method
 * @param {string} password
 * @returns {Boolean} True or False
 */
const validatePassword = (password) => {
	if (password.length <= 5 || password === "") {
		return false;
	}
	return true;
};

/**
 * validateFullName helper method
 * @param {string} fill_name
 * @returns {Boolean} True or False
 */
const validateFullName = (full_name) => {
	if (full_name.length <= 3 || full_name === "") {
		return false;
	}
	return true;
};

/**
 * isEmpty helper method
 * @param {string, integer} input
 * @returns {Boolean} True or False
 */
const isEmpty = (input) => {
	if (input === undefined || input === "") {
		return true;
	}
	if (input.replace(/\s/g, "").length) {
		return false;
	}
	return true;
};

/**
 * empty helper method
 * @param {string, integer} input
 * @returns {Boolean} True or False
 */
const empty = (input) => {
	if (input === undefined || input === "") {
		return true;
	}
};

/**
 * Generate UUID
 * @param {string} input
 * @returns {string} uuid
 */
const generateUUID = (input, len = 10) => {
	var uuid = "";

	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < len; i++) {
		uuid += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return uuid;
};

/**
 * Generate Token
 * @param {string} id
 * @returns {string} token
 */
const generateUserToken = (id, uuid, email, full_name, password) => {
	const token = jwt.sign(
		{
			user_id: id,
			email,
			uuid,
			full_name,
			password,
		},
		env.secret,
		{ expiresIn: "3d" }
	);
	return token;
};

export {
	hashPassword,
	comparePassword,
	isValidEmail,
	validatePassword,
	validateFullName,
	isEmpty,
	empty,
	generateUUID,
	generateUserToken,
};
