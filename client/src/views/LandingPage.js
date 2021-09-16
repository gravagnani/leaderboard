import React, { useEffect } from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";

import Hero from "components/hero/TwoColumnWithFeaturesAndTestimonial.js";
import Features from "components/features/LeaderboardFeatures.js";
import MainFeature from "components/features/TwoColWithTwoHorizontalFeaturesAndButton.js";
import FeatureStats from "components/features/ThreeColCenteredStatsPrimaryBackground.js";
//import Pricing from "components/pricing/ThreePlansWithHalfPrimaryBackground.js";
import Pricing from "components/pricing/NewLeaderboardPricing.js";
import Blog from "components/blogs/GridWithFeaturedPost.js";
import Testimonial from "components/testimonials/TwoColumnWithImageAndRating.js";
import FAQ from "components/faqs/SingleCol.js";
import GetStarted from "components/cta/GetStartedLight.js";
import Footer from "components/footers/LeaderboardFooter.js";

const HighlightedText = tw.span`text-primary-500`;

export default ({ setLeaderboardCreation }) => {
	sessionStorage.clear();

	useEffect(() => {
		setLeaderboardCreation(false);
	});

	return (
		<AnimationRevealPage>
			<Hero setLeaderboardCreation={setLeaderboardCreation} />
			{false && <FeatureStats />}
			<Features
				heading={
					<>
						Not just a <HighlightedText>Paper Sheet</HighlightedText>
					</>
				}
			/>
			{false && (
				<MainFeature
					heading={
						<>
							Cloud built by and for{" "}
							<HighlightedText>Professionals</HighlightedText>
						</>
					}
				/>
			)}
			{false && (
				<Testimonial
					heading={
						<>
							Our Clients <HighlightedText>Love Us</HighlightedText>
						</>
					}
				/>
			)}
			<Pricing
				heading={
					<>
						Pricing <HighlightedText>Options</HighlightedText>
					</>
				}
				setLeaderboardCreation={setLeaderboardCreation}
			/>
			{false && (
				<FAQ
					heading={
						<>
							Any <HighlightedText>Questions ?</HighlightedText>
						</>
					}
				/>
			)}
			{false && (
				<Blog
					subheading="Blog"
					heading={
						<>
							We love <HighlightedText>Writing</HighlightedText>
						</>
					}
				/>
			)}
			{false && <GetStarted />}
			<Footer />
		</AnimationRevealPage>
	);
};
