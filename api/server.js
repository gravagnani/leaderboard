import express from "express";
import "babel-polyfill";
import cors from "cors";

import env from "./env";

import userRoute from "./app/routes/userRoute";
import leaderboardRoute from "./app/routes/leaderboardRoute";
import gameRoute from "./app/routes/gameRoute";

//import adminRoute from "./app/routes/adminRoute";

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1", userRoute);
app.use("/api/v1", leaderboardRoute);
app.use("/api/v1", gameRoute);

//app.use("/api/v1", adminRoute);

app.listen(env.port).on("listening", () => {
	console.log(`🚀 are live on ${env.port}`);
});


export default app;