import React from "react";
import tw from "twin.macro";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Pricing from "components/pricing/NewLeaderboardPricing.js";
import { useHistory } from "react-router-dom";

const HighlightedText = tw.span`text-primary-500`;
const HomeLink = tw.span`cursor-pointer hover:underline`;

export default ({ setLeaderboardCreation }) => {
	const history = useHistory();
	return (
		<AnimationRevealPage>
			<Pricing
				heading={
					<>
						<HomeLink
							onClick={() => {
								history.push("/");
							}}
						>
							Leaderboard
						</HomeLink>
						<HighlightedText> Plans</HighlightedText>
					</>
				}
				setLeaderboardCreation={setLeaderboardCreation}
			/>
		</AnimationRevealPage>
	);
};
