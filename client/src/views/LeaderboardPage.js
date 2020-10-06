import React from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";

import Hero from "components/hero/TwoColumnWithFeaturesAndTestimonialLeaderboard.js";
import LeaderboardList from "components/blogs/LeaderboardList.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import LeaderboardShare from "components/forms/LeaderboardShare.js";

const HighlightedText = tw.span`text-primary-500`;

var userIsCreator = true;

export default () => {
	return (
		<AnimationRevealPage>
			<Hero />
			{/** to be displayed only if the user is the creator */}
			{userIsCreator && <LeaderboardShare />}
			<LeaderboardList />
			<Footer />
		</AnimationRevealPage>
	);
};
