import { Chip, Fab, ListItem } from "@material-ui/core";
import { Message,Person } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRoom from "../hooks/useRoom";
import MenuLateralWidget from "../widgets/navbar/MenuLateralWidget";
import ChatWidget from "../widgets/Room/ChatWidget";
import FlowgrammerWidget from "../widgets/Room/FlowgrammerWidget";
import PermissionListWidget from "../widgets/Room/PermissionListWidget";
import DiagramContainer from "../widgets/Room/ReactFlowy";

function RoomPage({ setShowChat }) {
	//    se puede obtener los parametros de un compenente que se linkee sin ninguna prop
	//    const { roomId, password } = props.match.params;
	// se puede hacer con mas de una prop
	// https://stackoverflow.com/questions/54114416/how-to-access-this-props-match-params-along-with-other-props
	const [state, setState] = useState({
		top: false,
		left: false,
		permissionRight:false,
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
	const {switchData, messages, sendMessage, mousesCoord, emitMouseActivity,emitDiagramNodeChanges } = useRoom(
		roomId,
		password,
		diagramController,
		localStorage.getItem('userData')
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
	const toggleDrawerPermission = (anchor, open) => (event) => {
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
		// right: 20,
		// bottom: 20,
		left: "auto",
		position: "blocked",
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
			<Fab
				style={styleFAB}
				onClick={toggleDrawerChat(anchor, true)}
				color="primary"
				aria-label="add"
			>
				<Person />
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
			<MenuLateralWidget
				state={state}
				anchor={anchor}
				toggleDrawer={toggleDrawerPermission}
			>
				<PermissionListWidget
					userList={switchData.switchList}
					onTogglePermission={switchData.toggleSwitchSocket}
				></PermissionListWidget>
			</MenuLateralWidget>
		</div>
	);
}

export default RoomPage;
