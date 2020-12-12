import dotenv from "dotenv";

dotenv.config();

export default {
	database_url: process.env.DATABASE_URL,
	test_database_url: process.env.TEST_DATABASE_URL,
	dev_database_schema: process.env.DEV_DATABASE_SCHEMA,
	secret: process.env.SECRET,
	port: process.env.PORT || 5000,
	environment: process.env.NODE_ENV,
	mj_apikey_private: process.env.MJ_APIKEY_PRIVATE,
	mj_apikey_public: process.env.MJ_APIKEY_PUBLIC,
};
