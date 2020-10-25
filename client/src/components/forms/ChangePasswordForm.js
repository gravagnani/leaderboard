import React, { useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { useHistory } from "react-router-dom";
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

const Column = tw.div` flex flex-col`;
const InputContainer = tw.div`relative py-5 mt-6`;
const Label = tw.label`absolute top-0 left-0 tracking-wide font-semibold text-sm`;
const Link = tw.a`absolute top-0 left-0 tracking-wide font-semibold text-sm hover:underline`;
const Input = tw.input``;
const ButtonLeft = tw.button`w-full sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;
const ButtonRight = tw.button`w-full float-right sm:w-32 mt-6 py-3 bg-gray-100 text-primary-500 rounded-full font-bold tracking-wide shadow-lg uppercase text-sm transition duration-300 transform focus:outline-none focus:shadow-outline hover:bg-gray-300 hover:text-primary-700 hocus:-translate-y-px hocus:shadow-xl`;

const SvgDotPattern1 = tw(
	SvgDotPatternIcon
)`absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 -z-10 opacity-50 text-primary-500 fill-current w-24`;

export default () => {
	const history = useHistory();

	const user = JSON.parse(localStorage.getItem("user"));

	return (
		<Container>
			<Content>
				<FormContainer>
					<div tw="mx-auto max-w-4xl">
						<h2>Change Password</h2>
						<Column>
							<InputContainer>
								<Label htmlFor="name-input">New Password</Label>
								<Input
									id="new-password-input"
									type="password"
								/>
							</InputContainer>
							<InputContainer>
								<Label htmlFor="email-input">Repeat New Password</Label>
								<Input
									id="new-password-rep-input"
									type="password"
								/>
							</InputContainer>
						</Column>

						<ButtonLeft
							onClick={(e) => {
								e.preventDefault();
								history.push({
									pathname: "/profile",
								});
							}}
						>
							Back
						</ButtonLeft>
						<ButtonRight
							onClick={(e) => {
								e.preventDefault();
								history.push({
									pathname: "/profile",
								});
							}}
						>
							Done
						</ButtonRight>
					</div>
					<SvgDotPattern1 />
				</FormContainer>
			</Content>
		</Container>
	);
};
