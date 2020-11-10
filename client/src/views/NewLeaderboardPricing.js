import React from "react";
import tw from "twin.macro";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";

//import Form from "components/forms/NewLeaderboadFormPricing";

import Pricing from "components/pricing/NewLeaderboardPricing.js";

const HighlightedText = tw.span`text-primary-500`;

export default () => {
	return (
		<AnimationRevealPage>
			<Pricing
				heading={
					<>
						Leaderboard <HighlightedText>Plans</HighlightedText>
					</>
				}
			/>
		</AnimationRevealPage>
	);
};
