import React, { useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { useHistory, useLocation } from "react-router-dom";
import { css } from "styled-components/macro"; //eslint-disable-line
import { ReactComponent as SvgDotPatternIcon } from "../../images/dot-pattern.svg";

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

const FormContainer = styled.div`
	${tw`p-10 sm:p-12 md:p-16 bg-primary-500 text-gray-100 rounded-lg relative`}
	form {
		${tw`mt-4`}
	}
	h2 {
		${tw`text-3xl sm:text-4xl font-bold`}
	}
	input,
	textarea {
		${tw`w-full bg-transparent text-gray-100 text-base font-medium tracking-wide border-b-2 py-2 text-gray-100 hocus:border-pink-400 focus:outline-none transition duration-200`};

		::placeholder {
			${tw`text-gray-500`}
		}
	}
`;

const TwoColumn = tw.div`flex flex-col sm:flex-row justify-between`;
const Column = tw.div`sm:w-5/12 flex flex-col`;
const InputContainer = tw.div`relative py-5 mt-6`;
const Label = tw.label`absolute top-0 left-0 tracking-wide font-semibold text-sm`;
const Input = tw.input``;
const TextArea = tw.textarea`h-24 sm:h-full resize-none`;
const ButtonLeft = tw.button`w-full sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;
const ButtonRight = tw.button`w-full float-right sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;
const TabsControl = tw.div`flex flex-wrap bg-gray-200 px-2 py-2 rounded leading-none mt-12 xl:mt-0`;

const TabControl = styled.div`
  ${tw`cursor-pointer px-6 py-3 mt-2 sm:mt-0 last:mr-0 text-gray-600 font-medium rounded-sm transition duration-300 text-sm sm:text-base w-1/2 text-center`}
  &:hover {
    ${tw`bg-gray-300 text-gray-700`}
  }
  ${(props) => props.active && tw`bg-primary-500! text-gray-100!`}
  }
`;

const SvgDotPattern1 = tw(
	SvgDotPatternIcon
)`absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 -z-10 opacity-50 text-primary-500 fill-current w-24`;

const setLocalStorage = () => {
	sessionStorage.setItem(
		"min-users-input",
		document.getElementById("min-users-input").value
	);
	sessionStorage.setItem(
		"max-users-input",
		document.getElementById("max-users-input").value
	);
	sessionStorage.setItem(
		"start-date-input",
		document.getElementById("start-date-input").value
	);
	sessionStorage.setItem(
		"end-date-input",
		document.getElementById("end-date-input").value
	);
	//sessionStorage.setItem(
	//	"mode",
	//	tabs[activeTab].description.value
	//);
};

export default ({
	tabs = {
		classical: {
			mode: "Classical",
			value: "classical",
			description: "Classical Description",
		},
		trueskill: {
			mode: "TrueSkill",
			value: "trueskill",
			description: "TrueSkill Description",
		},
	},
}) => {
	const history = useHistory();

	const minUsersInputSS = sessionStorage.getItem("min-users-input")
		? sessionStorage.getItem("min-users-input")
		: "";
	const maxUsersInputSS = sessionStorage.getItem("max-users-input")
		? sessionStorage.getItem("max-users-input")
		: "";
	const startDateInputSS = sessionStorage.getItem("start-date-input")
		? sessionStorage.getItem("start-date-input")
		: "";
	const endDateInputSS = sessionStorage.getItem("end-date-input")
		? sessionStorage.getItem("end-date-input")
		: "";
	const activeTabIndexSS = sessionStorage.getItem("active-tab-index")
		? sessionStorage.getItem("active-tab-index")
		: "";

	// todo: save informaton about selected tab
	const tabsKeys = Object.keys(tabs);
	const [activeTab, setActiveTab] = useState(
		tabsKeys[activeTabIndexSS ? activeTabIndexSS : 0]
	);

	return (
		<Container>
			<Content>
				<FormContainer>
					<div tw="mx-auto max-w-4xl">
						<h2>Leaderboard Options</h2>
						<TwoColumn>
							<Column>
								<InputContainer>
									<Label htmlFor="min-users-input">Min Users</Label>
									<Input
										id="min-users-input"
										type="number"
										placeholder="1"
										defaultValue={minUsersInputSS}
									/>
								</InputContainer>
								<InputContainer>
									<Label htmlFor="max-users-input">Max Users</Label>
									<Input
										id="max-users-input"
										type="number"
										placeholder="10"
										defaultValue={maxUsersInputSS}
									/>
								</InputContainer>
							</Column>
							<Column>
								<InputContainer tw="flex-1">
									<Label htmlFor="start-date-input">Start Date</Label>
									<Input
										id="start-date-input"
										type="date"
										defaultValue={startDateInputSS}
									/>
								</InputContainer>
								<InputContainer>
									<Label htmlFor="end-date-input">End Date</Label>
									<Input
										id="end-date-input"
										type="date"
										defaultValue={endDateInputSS}
									/>
								</InputContainer>
							</Column>
						</TwoColumn>

						<TabsControl>
							{Object.keys(tabs).map((tab, index) => (
								<TabControl
									key={index}
									active={activeTab === tab}
									onClick={() => {
										setActiveTab(tab);
										sessionStorage.setItem("active-tab-index", index);
										sessionStorage.setItem("active-tab", tab);
									}}
								>
									{tabs[tab].mode}
								</TabControl>
							))}
						</TabsControl>
						<InputContainer>
							<p id="tab-description" type="text" name="name">
								{tabs[activeTab].description}
							</p>
						</InputContainer>

						<ButtonLeft
							onClick={(e) => {
								e.preventDefault();
								setLocalStorage();
								history.push({
									pathname: "/new/info",
								});
							}}
							value="Back"
						>
							Back
						</ButtonLeft>
						<ButtonRight
							onClick={(e) => {
								e.preventDefault();
								setLocalStorage();
								history.push({
									pathname: "/new/userinfo",
								});
							}}
							value="Next"
						>
							Next
						</ButtonRight>
					</div>
					<SvgDotPattern1 />
				</FormContainer>
			</Content>
		</Container>
	);
};