import { Chip, Fab, ListItem, TextField } from "@material-ui/core";
import React, { useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import handleChangeProvider from "../../providers/handleChange.provider";
const ChatWidget = ({ messages, onSendMessage}) => {
	const [form, setForm] = useState({message:''});
	/**
	 * return a message in case there is no messagees in the chat
	 */
	const _retornarRelleno = () => {
		if (messages.length == 0)
			return (
				<Chip label="No se ha enviado ningun mensaje" color="secondary" />
			);
		return "";
	};
	/**
	 * Function that will send the message to the state of the parent with the message
	 */
	const handleSendMessage = () => {
		onSendMessage(form.message)
	};
	return (
		<div>
			<ListItem>Chat</ListItem>
			<ListItem>{_retornarRelleno()}</ListItem>
			{messages.map((message, i) => (
				<ListItem key={i}>
					<Chip
						label={message.body}
						color={`${
							message.ownedByCurrentUser ? "primary" : "default"
						}`}
					/>
					{/* {message.body} */}
				</ListItem>
			))}
			<ListItem>
				<TextField
					id="filled-basic"
					label="Escribe un mensaje..."
					variant="filled"
					value={form.message}
					name='message'
					onChange={(e)=>handleChangeProvider(e,form,setForm)}
				/>
				<Fab onClick={handleSendMessage} color="primary" aria-label="add">
					<SendIcon />
				</Fab>
			</ListItem>
		</div>
	);
};

export default ChatWidget;
