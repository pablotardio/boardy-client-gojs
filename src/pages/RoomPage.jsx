import { Chip, Fab, ListItem } from "@material-ui/core";
import { Message } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRoom from "../hooks/useRoom";
import MenuLateralWidget from "../widgets/navbar/MenuLateralWidget";
import ChatWidget from "../widgets/Room/ChatWidget";
import FlowgrammerWidget from "../widgets/Room/FlowgrammerWidget";
import DiagramContainer from "../widgets/Room/ReactFlowy";

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
	const [diagramController, setDiagramController] = useState({
		getDiagram:()=>{},
		setDiagram: (diagram) => {},
		handleModelChange: () => {},
		setDiagramReadOnly: () => {},
	});
	const { messages, sendMessage, mousesCoord, emitMouseActivity,emitDiagramNodeChanges } = useRoom(
		roomId,
		password,
		diagramController
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
	const styleFAB = {
		margin: 0,
		top: "auto",
		right: 20,
		bottom: 20,
		left: "auto",
		position: "fixed",
		zIndex: "4",
	};
	
	const handleModelChange = (changes) => {
		console.log(changes);
		alert("GoJS model changed!");
		const diagram=diagramController.getDiagram()
		emitDiagramNodeChanges(diagram.model.toJson());

	};
	const handleClickButtonPermission = () => {
		const newModel = {
			class: "GraphLinksModel",
			linkKeyProperty: "id01",
			nodeDataArray: [
				{ key: 1, text: "S", category: "Start" },
				{ key: 2, text: "E", category: "End" },
			],
			linkDataArray: [{ from: 1, to: 2, id01: -1 }],
		};
		diagramController.setDiagram(newModel);
	};
	return (
		<div
			style={{ backgroundColor: "#9fe3da", height: "700px" }}
			// onMouseMove={emitMouseActivity}
		>
			<FlowgrammerWidget
				setDiagramController={setDiagramController}
				onModelChange={handleModelChange}
			></FlowgrammerWidget>

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
				style={styleFAB}
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
				<ChatWidget
					messages={messages}
					onSendMessage={sendMessage}
				></ChatWidget>
			</MenuLateralWidget>
		</div>
	);
}

export default RoomPage;
