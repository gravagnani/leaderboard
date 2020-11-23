import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";

import Form from "components/forms/NewLeaderboadFormCheckout";

export default ({ setLeaderboardCreation }) => {
	return (
		<AnimationRevealPage>
			<Form setLeaderboardCreation={setLeaderboardCreation} />
		</AnimationRevealPage>
	);
};
