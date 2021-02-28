import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import socketIOClient from "socket.io-client";
import RoomProvider from "../providers/room.provider";
import useSwitchPermission from "./useSwitchPermission";
// import { urlProvider } from "../providers/url.provider";
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event of chat
const DIAGRAM_NODES_CHANGE_EVENT = "diagramNodesChange"; // Name of the event of changing diagram nodes
const GUEST_JOIN_LEAVE = "guestJoinLeave"; // event of joining leaving the roomm
const CHANGED_PERMISSION = "changedPermission"; // event for receiving changing permissions
const CHANGE_A_PERMISSION = "changeAPermission"; // event for changing permissions

const SOCKET_SERVER_URL = "http://192.168.1.2:3002";
const CLOSED_ROOM = "closedRoom";
const DIAGRAM_LOAD = "diagramLoad"; //Session Storage item
const useRoom = (roomId, roomPass, diagramController, userData) => {
	const [messages, setMessages] = useState([]); // Sent and received messages
	const [mousesCoord, setMousesCoord] = useState([]); //sent mouse movement
	const { switchList, setSwitchList, toggleSwitch } = useSwitchPermission();
	const  [canEditText, setCanEditText] = useState('Desactivado');
	const history = useHistory();
	const socketRef = useRef();
	//Probando Cargar un diagrama cuando se construye

	useEffect(() => {
		if (sessionStorage.getItem(DIAGRAM_LOAD) == "true") {
			loadSavedDiagram(roomId);
			// si es guest osea invitado debo desactivarle la funcion de diagramar
		}
		if (sessionStorage.getItem("tipoParticipante") == "guest") {
			console.log("es guest ");
			diagramController.setDiagramReadOnly(true);
		}
	}, [diagramController]);
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
		listenToggleSwitch();
		listenClosedRoom();

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
	const listenJoinLeave = () => {
		socketRef.current.on(GUEST_JOIN_LEAVE, (data) => {
			console.log("se unio-retiro alguien");

			console.log(data);
			setSwitchList(data.guests);
			//Luego le enviamos a todos los invitados el diagrama.
			const diagram = diagramController.getDiagram();
			emitDiagramNodeChanges(diagram.model.toJson());
		});
	};
	/**
	 * if a participants join to the room, the socket should emit this and we capture it
	 */
	const listenClosedRoom = () => {
		socketRef.current.on(CLOSED_ROOM, (data) => {
			console.log("se cerro la sala");
			history.goBack();
		});
	};
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
	const listenMessages = () => {
		socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
			const incomingMessage = {
				...message,

				ownedByCurrentUser: message.senderId === socketRef.current.id,
			};
			setMessages((messages) => [...messages, incomingMessage]);
		});
	};
	const listenToggleSwitch = () => {
		socketRef.current.on(CHANGED_PERMISSION, (data) => {
			console.log("list of permissions", data);
			//data should be a boolean containing the new permission value
			diagramController.setDiagramReadOnly(data.readOnly);
			data.readOnly?setCanEditText('Desactivado'):setCanEditText('Activado');
			
		});
	};

	const toggleSwitchSocket = (socketId, r, w) => {
		//emitimos el cambio para cambiar la lista y decirle a un usuarios que ya tiene permisos
		socketRef.current.emit(CHANGE_A_PERMISSION, { socketId, r, w });
		//cambiamos visualmente el switch
		toggleSwitch(socketId, r, w);
	};
	const loadSavedDiagram = async (roomId) => {
		const json = await RoomProvider.getDiagramOfRoom(roomId);
		console.log("Cargando diagrama guardado");
		diagramController.setDiagram(json.sala.diagrama);
		sessionStorage.setItem(DIAGRAM_LOAD, "false");
	};
	return {
		canEditText,
		emitDiagramNodeChanges,
		messages,
		sendMessage,
		mousesCoord,
		emitMouseActivity,
		switchData: {switchList, setSwitchList, toggleSwitchSocket },
	};
};

export default useRoom;
