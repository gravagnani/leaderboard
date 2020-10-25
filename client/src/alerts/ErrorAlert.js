import React from "react";
import tw from "twin.macro";

import { FaBell } from "react-icons/fa";

const Alert = tw.div`text-white px-6 py-4 border-0 rounded relative mb-4 bg-pink-500`;
const AlertIcon = tw.span`text-xl inline-block mr-5 align-middle`;
const AlertText = tw.span`inline-block align-middle mr-8`;
const AlertButton = tw.button`absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none`;

export default (props) => {
	return (
		<Alert>
			{/*<AlertIcon>
				<FaBell />
         </AlertIcon>*/}
			<AlertText>{props.message.toString()}</AlertText>
			<AlertButton
				onClick={() => {
					props.setMessage(null);
				}}
			>
				<span>×</span>
			</AlertButton>
		</Alert>
	);
};
