import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { useHistory } from "react-router-dom";
import { css } from "styled-components/macro"; //eslint-disable-line
import { ReactComponent as SvgDotPatternIcon } from "../../images/dot-pattern.svg";

import ErrorAlert from "../../alerts/ErrorAlert";

import PaypalButton from "../payment/PaypalButton";

import {
	createLeaderboard,
	validateLeaderboard,
} from "../../controllers/leaderboardController";

const Container = tw.div`relative`;
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;

const FormContainer = styled.div`
	${tw`p-10 sm:p-12 md:p-16 bg-primary-900 text-gray-100 rounded-lg relative`}
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
			${tw`text-gray-900`}
		}
	}
`;

const Column = tw.div` flex flex-col`;
const InputContainer = tw.div`relative py-5 mt-6`;
const Label = tw.label`absolute top-0 left-0 tracking-wide font-semibold text-sm`;
const Input = tw.input``;
const ButtonLeft = tw.button`w-full sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;
const ButtonRight = tw.button`w-full float-right sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;
const ButtonRightPP = tw.button`float-right mt-6 `;

const setLocalStorage = (email, full_name) => {
	sessionStorage.setItem("name-input", full_name);
	sessionStorage.setItem("email-input", email);
};

const SvgDotPattern1 = tw(
	SvgDotPatternIcon
)`absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 -z-10 opacity-50 text-primary-500 fill-current w-24`;

export default ({ setLeaderboardCreation }) => {
	const history = useHistory();

	const [errorMessage, setErrorMessage] = useState(null);

	const user = JSON.parse(localStorage.getItem("user"));

	const titleSS = sessionStorage.getItem("title-input");
	const placeSS = sessionStorage.getItem("place-input");
	const noteSS = sessionStorage.getItem("note-input");
	const min_usersSS = sessionStorage.getItem("min-users-input");
	const max_usersSS = sessionStorage.getItem("max-users-input");
	const start_dateSS = sessionStorage.getItem("start-date-input");
	const end_dateSS = sessionStorage.getItem("end-date-input");
	const modeSS = sessionStorage.getItem("active-tab")
		? sessionStorage.getItem("active-tab")
		: "C";
	const full_nameSS = sessionStorage.getItem("name-input");
	const emailSS = sessionStorage.getItem("email-input");
	const pricingSS = sessionStorage.getItem("pricing-input"); // basic - medium - large

	const doCreateLeaderboard = async () => {
		return createLeaderboard({
			title: titleSS,
			place: placeSS,
			note: noteSS,
			min_users: min_usersSS,
			max_users: max_usersSS,
			start_date: start_dateSS,
			end_date: end_dateSS,
			mode: modeSS,
			pricing: pricingSS,
		});
	};

	/*
	const nameInputSS = sessionStorage.getItem("name-input")
		? sessionStorage.getItem("name-input")
		: user
		? user.full_name
		: null;
	const emailInputSS = sessionStorage.getItem("email-input")
		? sessionStorage.getItem("email-input")
		: user
		? user.email
		: null;
		*/

	const handleBackBtnClick = () => {
		//const full_name = document.getElementById("name-input").value;
		//const email = document.getElementById("email-input").value;
		//setLocalStorage(email, full_name);

		history.push({
			pathname: "/new/options",
		});
	};

	const handleNextBtnClick = () => {
		//const full_name = document.getElementById("name-input").value;
		//const email = document.getElementById("email-input").value;
		doCreateLeaderboard()
			.then((e) => {
				if (e.status == "error") {
					throw new Error(e.error);
				}
				setLeaderboardCreation(false);
				const leaderboard_uuid = e.data.uuid;
				history.push({
					pathname: "/leaderboard/" + leaderboard_uuid,
				});
			})
			.catch((e) => {
				setErrorMessage(e);
			});
	};

	useEffect(() => {
		// validate checkout
		!errorMessage &&
			validateLeaderboard({
				title: titleSS,
				place: placeSS,
				note: noteSS,
				min_users: min_usersSS,
				max_users: max_usersSS,
				start_date: start_dateSS,
				end_date: end_dateSS,
				mode: modeSS,
				pricing: pricingSS,
			})
				.then((e) => {
					if (e.status == "error") {
						throw new Error(e.error);
					}
				})
				.catch((e) => {
					setErrorMessage(e);
				});
	});

	return (
		<Container>
			<Content>
				{errorMessage && (
					<ErrorAlert
						message={errorMessage}
						setMessage={setErrorMessage}
					/>
				)}
				<FormContainer>
					<div tw="mx-auto max-w-4xl">
						<h2>Checkout</h2>
						<Column>
							{/*<InputContainer>
								<Label htmlFor="name-input">Your Name</Label>
								<Input
									id="name-input"
									type="text"
									placeholder="E.g. John Doe"
									defaultValue={nameInputSS}
									readOnly
								/>
							</InputContainer>
							<InputContainer>
								<Label htmlFor="email-input">Your Email Address</Label>
								<Input
									id="email-input"
									type="email"
									placeholder="E.g. john@mail.com"
									defaultValue={emailInputSS}
									readOnly
								/>
							</InputContainer>*/}
							<InputContainer>
								<Label htmlFor="title-input">Title</Label>
								<Input
									id="title-input"
									type="text"
									defaultValue={titleSS}
									readOnly
								/>
							</InputContainer>
							<InputContainer>
								<Label htmlFor="place-input">Place</Label>
								<Input
									id="place-input"
									type="text"
									defaultValue={placeSS}
									readOnly
								/>
							</InputContainer>
							<InputContainer>
								<Label htmlFor="place-input">Note</Label>
								<Input
									id="note-input"
									type="text"
									defaultValue={noteSS}
									readOnly
								/>
							</InputContainer>
							<InputContainer>
								<Label htmlFor="users-input">Users</Label>
								<Input
									id="users-input"
									type="text"
									defaultValue={min_usersSS + " - " + max_usersSS}
									readOnly
								/>
							</InputContainer>
							{start_dateSS && end_dateSS && (
								<InputContainer>
									<Label htmlFor="users-input">Period</Label>
									<Input
										id="period-input"
										type="text"
										defaultValue={start_dateSS + " - " * end_dateSS}
										readOnly
									/>
								</InputContainer>
							)}
							<InputContainer>
								<Label htmlFor="mode-input">Mode</Label>
								<Input
									id="mode-input"
									type="text"
									defaultValue={
										modeSS == "C" ? "Classic" : "TrueSkill"
									}
									readOnly
								/>
							</InputContainer>
						</Column>

						<ButtonLeft
							onClick={(e) => {
								handleBackBtnClick();
							}}
						>
							Back
						</ButtonLeft>
						{user ? (
							pricingSS == "basic" ? (
								<ButtonRight
									onClick={(e) => {
										handleNextBtnClick();
									}}
								>
									Done
								</ButtonRight>
							) : (
								<ButtonRightPP>
									<PaypalButton
										pricing={pricingSS}
										history={history}
										doCreateLeaderboard={doCreateLeaderboard}
										setErrorMessage={setErrorMessage}
									/>
								</ButtonRightPP>
							)
						) : (
							<ButtonRight
								onClick={(e) => {
									history.push({
										pathname: "/signin",
										calling_page: "/new/checkout",
									});
								}}
							>
								Login
							</ButtonRight>
						)}
					</div>
					<SvgDotPattern1 />
				</FormContainer>
			</Content>
		</Container>
	);
};
