import React, { useState } from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";

import Hero from "components/hero/TwoColumnWithFeaturesAndTestimonialLeaderboard.js";
import LeaderboardList from "components/blogs/LeaderboardList.js";
import Footer from "components/footers/MiniCenteredFooter.js";
import LeaderboardShare from "components/forms/LeaderboardShare.js";
import LeaderboardSignIn from "components/forms/LeaderboardSignIn.js";
import LeaderboardChooseName from "components/forms/LeaderboardChooseName.js";

import { getLeaderboardByUUID } from "../controllers/leaderboardController";

const HighlightedText = tw.span`text-primary-500`;

export default () => {
	const user = JSON.parse(localStorage.getItem("user"));
	const leaderboard_uuid = window.location.href.split("/").pop();
	const [leaderboard, setLeaderboard] = useState(null);
	//const [userIsCreator, setUserIsCreator] = useState(null);
	//const [userIsSignedIn, setUserIsSignedIn] = useState(null);
	//const [userIsAlreadyPlaying, setUserIsAlreadyPlaying] = useState(null);

	getLeaderboardByUUID(leaderboard_uuid)
		.then((e) => {
			if (e.status == "error") {
				throw new Error(e.error);
			}
			!leaderboard && setLeaderboard(e.data[0]);
		})
		.catch((e) => {
			console.log(e.message);
		});

	const userIsCreator =
		leaderboard && user && leaderboard.created_by == user.uuid;
	const userIsSignedIn = !!user;
	const userIsAlreadyPlaying = null; // todo: cercare tra i partecipanti

	//const userIsCreator = leaderbaord.created_by == user.uuid;
	//const userIsSignedIn = !!user;
	//const userIsAlreadyPlaying = false || user;

	return (
		<AnimationRevealPage>
			<Hero />
			{/** to be displayed only if the user is the creator */}
			{userIsCreator && userIsAlreadyPlaying && <LeaderboardShare />}
			{/** to be displayed only if the user is not signed up */}
			{!userIsSignedIn && (
				<LeaderboardSignIn leaderboardUUID={leaderboard_uuid} />
			)}
			{/** to be displayed only if the user is not signed up */}
			{!userIsAlreadyPlaying && !!userIsSignedIn && (
				<LeaderboardChooseName />
			)}
			<LeaderboardList />
			<Footer />
		</AnimationRevealPage>
	);
};
