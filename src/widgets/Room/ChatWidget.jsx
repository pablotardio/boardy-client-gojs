import {
	Chip,
	Fab,
	Grid,
	ListItem,
	TextField,
	Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import handleChangeProvider from "../../providers/handleChange.provider";
const ChatWidget = ({ messages, onSendMessage }) => {
	const [form, setForm] = useState({ message: "" });
	/**
	 * return a message in case there is no messagees in the chat
	 */
	const _retornarRelleno = () => {
		if (messages.length === 0)
			return (
				<Chip label="No se ha enviado ningun mensaje" color="secondary" />
			);
		return "";
	};
	/**
	 * Function that will send the message to the state of the parent with the message
	 */
	const handleSendMessage = () => {
		onSendMessage(form.message);
	};
	const retornarAutor = (i,messages,message) => {
		return messages[i - 1]?.userData.nombre !== message.userData.nombre ? (
			<Typography
				variant="caption"
				// display="block"
				gutterBottom
			>
				{"De:" + message.userData.nombre}
			</Typography>
		) : (
			""
		);
	};
	return (
		<div>
			<ListItem key={"idChat"}>Chat</ListItem>
			<ListItem key={"idChatVacio"}>{_retornarRelleno()}</ListItem>
			{messages.map((message, i) => (
				<div>
					<ListItem 
						// divider
						key={"divider"+i}
					>
						<Grid container>
							<Grid item xs={12} xl={12}>
								{/* Se verifica que no se repitio el usuario enviador del mensaje */}
								{retornarAutor(i,messages,message)}
							</Grid>
							<Chip key={"mensaje"+i}
								label={message.body}
								color={`${
									message.ownedByCurrentUser ? "primary" : "default"
								}`}
							/>

							{/* {message.body} */}
						</Grid>
					</ListItem>
				</div>
			))}
			<ListItem>
				<TextField
					id="filled-basic"
					label="Escribe un mensaje..."
					variant="filled"
					value={form.message}
					name="message"
					onChange={(e) => handleChangeProvider(e, form, setForm)}
				/>
				<Fab onClick={handleSendMessage} color="primary" aria-label="add">
					<SendIcon />
				</Fab>
			</ListItem>
		</div>
	);
};

export default ChatWidget;
