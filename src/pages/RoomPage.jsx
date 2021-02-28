import { Chip, Fab, ListItem } from "@material-ui/core";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco,xcode } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
	Message,
	Person,
	SaveAltRounded,
	SaveRounded,
	Code,
} from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRoom from "../hooks/useRoom";
import RoomProvider from "../providers/room.provider";
import DialogWidget from "../widgets/MenuPrincipal/DialogWidget";
import MenuLateralWidget from "../widgets/navbar/MenuLateralWidget";
import ChatWidget from "../widgets/Room/ChatWidget";
import FlowgrammerWidget from "../widgets/Room/FlowgrammerWidget";
import PermissionListWidget from "../widgets/Room/PermissionListWidget";
import FormSaveDialogWidget from "../widgets/Room/FormSaveDialogWidget";
import DiagramContainer from "../widgets/Room/ReactFlowy";
const TIPO_PARTICIPANTE = "tipoParticipante";
function RoomPage() {
	const guestType = sessionStorage.getItem(TIPO_PARTICIPANTE);
	const [openAlert, setOpenAlert] = useState(false);
	const [openSaveNewAlert, setOpenSaveNewAlert] = useState(false);
	const [openCodeAlert, setOpenCodeAlert] = useState(false);
	const [alertSave, setAlertSave] = useState({
		title: "",
		description: "",
		/**operacion para abrir el modal */
		handleClickClose: () => {
			setOpenAlert(false);
		},
		handleSubmit: async () => {
			setOpenAlert(false);
		},
	});

	const [codeAlert, setCodeAlert] = useState({
		title: "Codigo Generado exitosamente!",
		description: "",
		/**operacion para abrir el modal */
		handleClickClose: () => {
			setOpenCodeAlert(false);
		},
		handleSubmit: async () => {
			setOpenCodeAlert(false);
		},
	});
	const saveNewAlert = {
		title: "",
		description: "",
		/**operacion para abrir el modal */
		handleClickClose: () => {
			setOpenSaveNewAlert(false);
		},
		handleSubmit: async () => {
			try {
				console.log("submited");
				const diagram = diagramController.getDiagram();
				const stringDiagram = JSON.stringify(diagram.model.toJson());
				const json = await RoomProvider.create({
					...form,
					codigo: roomId,
					password: password,
					diagrama: diagram.model.toJson(),
				});
				console.log(json);
				setOpenSaveNewAlert(false);
				setOpenAlert(false);
			} catch (error) {
				console.log(error);
			}
		},
	};

	const [form, setForm] = useState({
		nombre: "",
		descripcion: "",
		codigo: "",
		password: "",
		diagrama: "",
	});

	const styleFAB = {
		margin: 0,
		top: "auto",
		// right: 20,
		// bottom: 20,
		left: "auto",
		position: "blocked",
		zIndex: "4",
	};
	const styleFChip = {
		margin: 0,
		top: "auto",
		// right: 20,
		// bottom: 20,
		left: "auto",
		right: "auto",
		position: "fixed",
		zIndex: "5",
	};
	//    se puede obtener los parametros de un compenente que se linkee sin ninguna prop
	//    const { roomId, password } = props.match.params;
	// se puede hacer con mas de una prop
	// https://stackoverflow.com/questions/54114416/how-to-access-this-props-match-params-along-with-other-props
	const [state, setState] = useState({
		top: false,
		left: false,
		permissionRight: false,
		bottom: false,
		right: false,
	});

	const anchor = "right";
	const { roomId, password } = useParams();
	const [diagramController, setDiagramController] = useState({
		getDiagram: () => {},
		setDiagram: (diagram) => {},
		handleModelChange: () => {},
		setDiagramReadOnly: () => {},
	});

	const {
		canEditText,
		switchData,
		messages,
		sendMessage,
		mousesCoord,
		emitMouseActivity,
		emitDiagramNodeChanges,
	} = useRoom(
		roomId,
		password,
		diagramController,
		localStorage.getItem("userData")
	);

	/**
	 * Funcion para mostrar el drawer que se le envia al nav
	 * @param {*} anchor
	 * @param {*} open
	 */
	const toggleDrawer = (stateIndex, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setState({ ...state, [stateIndex]: open });
	};

	const handleModelChange = (changes) => {
		// console.log(changes);
		// alert("GoJS model changed!");
		console.log("GoJS model changed!");
		const diagram = diagramController.getDiagram();
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
	const handleClickSave = async () => {
		//verfico como se debe guardar y muestro el mensaje
		const json = await RoomProvider.verifySave({ codigo: roomId });
		const { submitAlertFunction } = asignarTipoDeGuardado(json.action);
		setAlertSave({
			...alertSave,
			title: "Guardando",
			description: json.msg,
			handleSubmit: submitAlertFunction,
		});
		setOpenAlert(true);
	};
	const handleClickCodeGenerator = async () => {
		const diagram = diagramController.getDiagram();

		const json = await RoomProvider.getGeneratedCode({
			diagram: diagram.model.toJson(),
		});
		setCodeAlert({
			...codeAlert,
			description: (
				<SyntaxHighlighter language="javascript" showLineNumbers  style={xcode}>
					{`${json.code}`}
				</SyntaxHighlighter>
			),
		});
		setOpenCodeAlert(true);
	};
	const asignarTipoDeGuardado = (accion) => {
		let submitAlertFunction;
		if (accion == "update") {
			submitAlertFunction = () => {
				//si se debe actualizar solo la guardo.
				const currentDiagramJSON = diagramController
					.getDiagram()
					.model.toJson();

				RoomProvider.update({ diagrama: currentDiagramJSON }, roomId);
				setOpenAlert(false);
			};
		} else {
			submitAlertFunction = () => {
				setOpenSaveNewAlert(true);
				console.log("abrir alerta");
			};
		}
		return { submitAlertFunction };
	};
	/**
	 * It will return a Widget/component depending of their type
	 * @param {*} guestType
	 * @param {*} Widget
	 */
	const returnWidgetFor = (userType, Widget) => {
		if (guestType == userType) {
			return Widget;
		}
		return "";
	};

	return (
		<div
			style={{ backgroundColor: "#9fe3da", height: "700px" }}
			// onMouseMove={emitMouseActivity}
		>
			<FormSaveDialogWidget
				form={form}
				setForm={setForm}
				open={openSaveNewAlert}
				handleClose={saveNewAlert.handleClickClose}
				handleSubmit={saveNewAlert.handleSubmit}
				title="Datos de Sala"
				description="Rellene los sgtes datos para guardar esta nueva sala"
			></FormSaveDialogWidget>
			<DialogWidget
				open={openAlert}
				handleClose={alertSave.handleClickClose}
				handleSubmit={alertSave.handleSubmit}
				title={alertSave.title}
				description={alertSave.description}
			></DialogWidget>
			<DialogWidget
				open={openCodeAlert}
				handleClose={codeAlert.handleClickClose}
				handleSubmit={codeAlert.handleSubmit}
				title={codeAlert.title}
				description={codeAlert.description}
			></DialogWidget>
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
				onClick={toggleDrawer(anchor, true)}
				color="primary"
				aria-label="add"
			>
				<Message />
			</Fab>
			{returnWidgetFor(
				"host",
				<Fab
					style={styleFAB}
					onClick={toggleDrawer("permissionRight", true)}
					color="primary"
					aria-label="add"
				>
					<Person />
				</Fab>
			)}
			{returnWidgetFor(
				"host",
				<Fab
					style={styleFAB}
					onClick={handleClickSave}
					color="secondary"
					aria-label="add"
				>
					<SaveRounded />
				</Fab>
			)}
			{returnWidgetFor(
				"host",
				<Fab
					style={styleFAB}
					onClick={handleClickCodeGenerator}
					color="secondary"
					aria-label="add"
				>
					<Code />
				</Fab>
			)}
			{returnWidgetFor(
				"guest",
				<Chip
					style={styleFChip}
					label={"Editar: " + canEditText}
					variant="default"
				/>
			)}
			<MenuLateralWidget
				state={state}
				anchor={anchor}
				toggleDrawer={toggleDrawer}
				stateIndex={"right"}
			>
				<ChatWidget
					messages={messages}
					onSendMessage={sendMessage}
				></ChatWidget>
			</MenuLateralWidget>
			<MenuLateralWidget
				state={state}
				anchor={anchor}
				stateIndex={"permissionRight"}
				toggleDrawer={toggleDrawer}
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
