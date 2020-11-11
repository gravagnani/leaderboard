import React from "react";
import tw from "twin.macro";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import {
	SectionHeading,
	Subheading as SubheadingBase,
} from "components/misc/Headings.js";
import { SectionDescription } from "components/misc/Typography.js";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import {
	Container as ContainerBase,
	ContentWithPaddingXl as ContentBase,
} from "components/misc/Layouts.js";
import { ReactComponent as CheckboxIcon } from "images/checkbox-circle.svg";

import logo from "../../images/logo.svg";

import {
	PRICING_BASIC,
	PRICING_MEDIUM,
	PRICING_LARGE,
	MIN_USERS_BASIC,
	MAX_USERS_BASIC,
	MIN_USERS_MEDIUM,
	MAX_USERS_MEDIUM,
	MIN_USERS_LARGE,
	MAX_USERS_LARGE,
} from "../../constants";

const Container = tw(ContainerBase)`bg-primary-500 text-gray-100 -mx-8 px-8`;
const ContentWithPaddingXl = tw(
	ContentBase
)`relative z-10 mx-auto px-0 py-10 sm:px-6 md:px-8 lg:px-12 xl:px-24 sm:py-20 flex flex-col max-w-screen-xl`;
const HeaderContainer = tw.div`mt-10 w-full flex flex-col items-center`;
const Subheading = tw(SubheadingBase)`mb-4 text-gray-100`;
const Heading = tw(SectionHeading)`w-full`;
const Description = tw(SectionDescription)`w-full text-gray-300 text-center`;

const PlansContainer = tw.div`mt-16 flex flex-col items-center lg:flex-row lg:items-stretch lg:justify-between text-gray-900 font-medium`;
const Plan = styled.div`
	${tw`w-full max-w-sm bg-white rounded-lg shadow-sm py-10 px-6 sm:px-10 lg:px-6 lg:py-10 xl:p-10 mx-3 flex flex-col justify-between mt-16 first:mt-0 lg:mt-0 shadow-raised`}
`;

const PlanHeader = styled.div`
	.nameAndFeaturedContainer {
		${tw`flex flex-wrap flex-col sm:flex-row justify-between items-center`}
	}
	.name {
		${tw`lg:text-lg xl:text-xl font-bold uppercase tracking-wider mr-3`}
	}
	.featuredText {
		${tw`text-xs font-bold px-3 rounded py-2 uppercase bg-green-300 text-green-900 leading-none mt-4 sm:mt-0 w-full sm:w-auto text-center`}
	}
	.pricingContainer {
		${tw`mt-6 flex items-end justify-between`}
		.currentPrice {
			${tw`text-lg font-bold leading-none`}
			.bigText {
				${tw`text-3xl font-bold`}
			}
		}
		.oldPrice {
			${tw`text-gray-500 text-lg line-through hidden sm:block`}
		}
	}
	.description {
		${tw`mt-8 font-medium text-gray-700 lg:text-sm xl:text-base`}
	}
`;
const PlanFeatures = styled.ul`
	${tw`mt-10 flex-1 border-t lg:-mx-6 -mx-6 sm:-mx-10 py-10 px-6 sm:px-10 lg:p-6 xl:-mx-10 xl:p-10`}
	.feature {
		${tw`flex items-start mt-6 first:mt-0`}
		.icon {
			${tw`w-6 h-6 text-primary-500 flex-shrink-0`}
		}
		.text {
			${tw`font-semibold text-primary-500 tracking-wide ml-3`}
		}
	}
`;

const PlanAction = tw.div`mt-4`;
const ActionButton = styled(PrimaryButtonBase)`
	${tw`block text-center text-sm font-semibold tracking-wider w-full text-gray-100 bg-primary-500 px-6 py-4 rounded hover:bg-primary-700 focus:shadow-outline focus:outline-none transition-colors duration-300`}
`;

const WhiteBackgroundOverlay = tw.div`absolute inset-x-0 bottom-0 h-1/6 lg:h-1/3 bg-white z-0`;

// todo: spostare in una libreria di helper -> usato anche in leaderboard options
const getMinUsers = (pricing) => {
	switch (pricing) {
		case PRICING_BASIC:
			return MIN_USERS_BASIC;

		case PRICING_MEDIUM:
			return MIN_USERS_MEDIUM;

		case PRICING_LARGE:
			return MIN_USERS_LARGE;
	}
};

const getMaxUsers = (pricing) => {
	switch (pricing) {
		case PRICING_BASIC:
			return MAX_USERS_BASIC;

		case PRICING_MEDIUM:
			return MAX_USERS_MEDIUM;

		case PRICING_LARGE:
			return MAX_USERS_LARGE;
	}
};

export default ({
	subheading = "",
	heading = "Affordable Pricing",
	description = null, //"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	plans = null,
	primaryButtonText = "Choose",
}) => {
	const history = useHistory();

	const defaultPlans = [
		{
			value: PRICING_BASIC,
			name: "Basic",
			price: ["$0", ".00"],
			//oldPrice: "$11.99",
			description:
				"Perfect for when you want to host your personal blog or a hobby side project.",
			features: [
				"All Scoring Systems",
				"Unlimited Games",
				"Unlimited Time",
				"Up to 15 players",
			],
		},
		{
			value: PRICING_MEDIUM,
			name: "Medium",
			price: ["$9", ".99"],
			//oldPrice: "$19.99",
			description:
				"Perfect for hosting blogs with lots of traffic or heavy development projects. In addition to Basic plan",
			features: ["Up to 30 players"],
			//featured: "Most Popular"
		},
		{
			value: PRICING_LARGE,
			name: "Large",
			price: ["$19", ".99"],
			//oldPrice: "$29.99",
			description:
				"Perfect for hosting production websites & API services with high traffic load. In addition to Medium plan",
			features: ["Up to 100 players"],
		},
	];

	if (!plans) plans = defaultPlans;

	const setLocalStorage = (pricing) => {
    sessionStorage.setItem("pricing-input", pricing);
    sessionStorage.setItem("min-users-input", getMinUsers(pricing));
    sessionStorage.setItem("max-users-input", getMaxUsers(pricing));
	};

	const handleNextBtnClick = (pricing) => {
		setLocalStorage(pricing);
		history.push({
			pathname: "/new/info",
		});
	};

	return (
		<Container>
			<ContentWithPaddingXl>
				<HeaderContainer>
					{subheading && <Subheading>{subheading}</Subheading>}
					<Heading>{heading}</Heading>
					{description && <Description>{description}</Description>}
				</HeaderContainer>
				<PlansContainer>
					{plans.map((plan, index) => (
						<Plan key={index} featured={plan.featured}>
							<PlanHeader>
								<span className="nameAndFeaturedContainer">
									<span className="name">{plan.name}</span>
									{plan.featured && (
										<span className="featuredText">
											{plan.featured}
										</span>
									)}
								</span>
								<div className="pricingContainer">
									<span className="currentPrice">
										<span className="bigText">{plan.price[0]}</span>
										{plan.price[1]}{" "}
									</span>
									{plan.oldPrice && (
										<span className="oldPrice">{plan.oldPrice}</span>
									)}
								</div>
								<p className="description">{plan.description}</p>
							</PlanHeader>
							<PlanFeatures>
								{plan.features.map((feature, index) => (
									<li className="feature" key={index}>
										<CheckboxIcon className="icon" />
										<span className="text">{feature}</span>
									</li>
								))}
							</PlanFeatures>
							<PlanAction>
								<ActionButton
									onClick={() => handleNextBtnClick(plan.value)}
								>
									{primaryButtonText}
								</ActionButton>
							</PlanAction>
						</Plan>
					))}
				</PlansContainer>
			</ContentWithPaddingXl>
			<WhiteBackgroundOverlay />
		</Container>
	);
};
