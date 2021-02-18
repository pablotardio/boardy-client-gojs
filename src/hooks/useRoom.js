import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import useSwitchPermission from "./useSwitchPermission";
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event of chat
const DIAGRAM_NODES_CHANGE_EVENT = "diagramNodesChange"; // Name of the event of changing diagram nodes
const GUEST_JOIN_LEAVE = "guestJoinLeave"; // event of joining leaving the roomm
const SOCKET_SERVER_URL = "http://localhost:3002";

const useRoom = (roomId, roomPass, diagramController, userData) => {
	const [messages, setMessages] = useState([]); // Sent and received messages
	const [mousesCoord, setMousesCoord] = useState([]); //sent mouse movement
	const {switchList, setSwitchList, toggleSwitch} = useSwitchPermission();

	const socketRef = useRef();

	useEffect(() => {
		// Creates a WebSocket connection
		socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
			transports: ["websocket"],
			query: { roomId, roomPass, userData },
		});

		// Listens for incoming messages
		listenMessages();
		//Listen for mouse Movements
		listenMouseSocket();
		//Listen for diagram Changes
		listenDiagramNodeChange();

		
		listenJoinLeave(); 
		// listenUserPermissions();
		// Destroys the socket reference
		// when the connection is closed
		return () => {
			socketRef.current.disconnect();
		};
	}, [roomId, roomPass, diagramController]);

	// Sends a message to the server that
	// forwards it to all users in the same room
	const sendMessage = (messageBody) => {
		socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
			body: messageBody,
			senderId: socketRef.current.id,
		});
	};
	const emitMouseActivity = (e) => {
		let mousePosition = {
			x: e.pageX,
			y: e.pageY,
		};

		socketRef.current.emit("mouse_activity", mousePosition);
	};

	const emitDiagramNodeChanges = (diagram) => {
		socketRef.current.emit(DIAGRAM_NODES_CHANGE_EVENT, { diagram });
	};
	/**
	 * if a participants join to the room, the socket should emit this and we capture it
	 */
	const listenJoinLeave=()=>{
		socketRef.current.on(GUEST_JOIN_LEAVE, (data) => {
			// console.log('se unio-retiro alguien');
			// console.log(data);
			setSwitchList(data.guests)
		});
	}
	const listenDiagramNodeChange = () => {
		socketRef.current.on(DIAGRAM_NODES_CHANGE_EVENT, (data) => {
			console.log("escuchado el cambio");

			diagramController.setDiagram(data.diagram);
		});
	};
	/**Socket that listens when the mouse moves */
	const listenMouseSocket = () => {
		socketRef.current.on("all_mouse_activity", (data) => {
			let index = mousesCoord.findIndex(function (item) {
				return item.session_id === data.session_id;
			});
			//console.log(index);
			let newMousesCoord = mousesCoord;
			if (index !== -1) {
				newMousesCoord[index] = data;
				setMousesCoord(newMousesCoord);
			} else {
				setMousesCoord([...mousesCoord, data]);
			}
		});
	};
	const listenMessages=()=>{
		socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
			const incomingMessage = {
				...message,

				ownedByCurrentUser: message.senderId === socketRef.current.id,
			};
			setMessages((messages) => [...messages, incomingMessage]);
		});
	}
	return {
		emitDiagramNodeChanges,
		messages,
		sendMessage,
		mousesCoord,
		emitMouseActivity,
		switchData:{switchList,setSwitchList,toggleSwitch}
	};
};

export default useRoom;
