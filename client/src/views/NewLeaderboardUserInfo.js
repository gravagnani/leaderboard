import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";

import Form from "components/forms/NewLeaderboadFormUserInfo";

export default ({ setLeaderboardCreation }) => {
	return (
		<AnimationRevealPage>
			<Form setLeaderboardCreation={setLeaderboardCreation} />
		</AnimationRevealPage>
	);
};
