import { Chip, Fab, ListItem } from "@material-ui/core";
import { Message } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRoom from "../hooks/useRoom";
import MenuLateralWidget from "../widgets/navbar/MenuLateralWidget";
import ChatWidget from "../widgets/Room/ChatWidget";

function RoomPage({ setShowChat }) {
	//    se puede obtener los parametros de un compenente que se linkee sin ninguna prop
	//    const { roomId, password } = props.match.params;
	// se puede hacer con mas de una prop
	// https://stackoverflow.com/questions/54114416/how-to-access-this-props-match-params-along-with-other-props
	const [state, setState] = useState({
		top: false,
		left: false,
		bottom: false,
		right: false,
	});
	const anchor = "right";
	const { roomId, password } = useParams();
	const { messages, sendMessage, mousesCoord, emitMouseActivity } = useRoom(
		roomId,
		password
	);

	//Component did mount
	useEffect(() => {
		console.log();
		setShowChat(true);
		// toggleDrawerChat
		//Component wil unmount
		return () => {
			setShowChat(false);
		};
	}, []);
	/**
	 * Funcion para mostrar el drawer que se le envia al nav
	 * @param {*} anchor
	 * @param {*} open
	 */
	const toggleDrawerChat = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};

	return (
		<div
			style={{ backgroundColor: "salmon", height: "700px" }}
			// onMouseMove={emitMouseActivity}
		>
			{/* {mousesCoord.map((item, i) => {
				return (
					<div
						style={{
							position: "absolute",
							backgroundColor: "black",
							width: "4px",
							height: "4px",
							zIndex: "3",
							left: item.coords.x,
							top: item.coords.y,
						}}
					>
						usuario: {item.session_id}
					</div>
				);
				// return <div key={item.session_id}> aqui ta el mouse {i}  {item.session_id}
				// coods x: {item.coords.x}  y: {item.coords.y}</div>
			})} */}
			<Fab
				onClick={toggleDrawerChat(anchor, true)}
				color="primary"
				aria-label="add"
			>
				<Message />
			</Fab>
			<MenuLateralWidget
				state={state}
				anchor={anchor}
				toggleDrawer={toggleDrawerChat}
			>
				<ChatWidget messages={messages}
				onSendMessage={sendMessage}></ChatWidget>
			</MenuLateralWidget>
		</div>
	);
}

export default RoomPage;
