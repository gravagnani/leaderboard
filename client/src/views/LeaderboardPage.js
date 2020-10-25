import React from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";

import Hero from "components/hero/TwoColumnWithFeaturesAndTestimonialLeaderboard.js";
import LeaderboardList from "components/blogs/LeaderboardList.js";
import Footer from "components/footers/MiniCenteredFooter.js";
import LeaderboardShare from "components/forms/LeaderboardShare.js";
import LeaderboardSignIn from "components/forms/LeaderboardSignIn.js";
import LeaderboardChooseName from "components/forms/LeaderboardChooseName.js";

const HighlightedText = tw.span`text-primary-500`;

const user = JSON.parse(localStorage.getItem("user"));

var userIsCreator = true || !user;
var userIsSignedIn = !!user;
var userIsAlreadyPlaying = false || user;

export default () => {
	return (
		<AnimationRevealPage>
			<Hero />
			{/** to be displayed only if the user is the creator */}
			{userIsCreator && <LeaderboardShare />}
			{/** to be displayed only if the user is not signed up */}
			{!userIsSignedIn && <LeaderboardSignIn />}
			{/** to be displayed only if the user is not signed up */}
			{!userIsAlreadyPlaying && <LeaderboardChooseName />}
			<LeaderboardList />
			<Footer />
		</AnimationRevealPage>
	);
};
