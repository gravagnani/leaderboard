//import { Pool } from "pg";
import pkg from 'pg';
import env from "../../env.js";

const databaseConfig = { connectionString: env.database_url };

const { Pool } = pkg;
const pool = new Pool(databaseConfig);

pool.on("connect", (client) => {
	client.query("SET search_path TO " + env.dev_database_schema + ";");
	console.log("connected to the db");
});

export default pool;
