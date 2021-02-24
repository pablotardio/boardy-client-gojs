import { Grid, Button } from "@material-ui/core";
import React, { useEffect } from "react";
import AirplayIcon from "@material-ui/icons/Airplay";
import AddToQueueIcon from "@material-ui/icons/AddToQueue";

import FormDialogWidget from "../widgets/MenuPrincipal/FormDialogWidget";
import DialogWidget from "../widgets/MenuPrincipal/DialogWidget";
import { useHistory } from "react-router-dom";
import RoomProvider from "../providers/room.provider";
const TIPO_PARTICIPANTE="tipoParticipante";
const MenuPrincipalPage = () => {
	const [openNew, setOpenNew] = React.useState(false);
	const [openAlert, setOpenAlert] = React.useState(false);
	const [openJoin, setOpenJoin] = React.useState(false);
	const [form, setForm] = React.useState({ codigo: "", password: "" });
	const history = useHistory();
	useEffect(() => {
		sessionStorage.setItem(TIPO_PARTICIPANTE,'')
		
	}, []);
	const [alert, setAlert] = React.useState({
		title: "",
		description: "",
		/**operacion para abrir el modal */
		handleClickClose: () => {
			closeAllAlerts()
			setForm({ codigo: "", password: "" });
		},
		handleSubmit: async () => {
			setOpenAlert(false);
		},
	});
	const closeAllAlerts=()=>{
		setOpenJoin(false)
		setOpenAlert(false);
		setOpenNew(false);
	}
	const newBoard = {
		/**operacion para abrir el modal */
		handleClickOpen: () => {
			setOpenNew(true);
		},
		handleClickClose: () => {
			setOpenNew(false);
			setForm({ codigo: "", password: "" });
		},
		handleSubmit: async () => {
			console.log(form);
			const json = await RoomProvider.verifyRoomCreate(form);
			//como tenemos el json debemos establecer que pasara con el modal
		
			const {title,newHandleSubmit}=setAlertContent(json)

			setAlert({...alert,title,description:json.msg,handleSubmit:newHandleSubmit})
			setOpenAlert(true); //abrimos el modal para mostrar el mensaje respectivo
			setForm({ codigo: "", password: "" });
			sessionStorage.setItem(TIPO_PARTICIPANTE,'host') //ponemos la session variable para mostrar el respectivo menu
		},
	};
	const joinBoard = {
		handleClickOpen: () => {
			setOpenJoin(true);
		},
		handleClickClose: () => {
			setOpenJoin(false);
			setForm({ codigo: "", password: "" });
		},
		handleSubmit: async() => {
			
			const json = await RoomProvider.verifyRoomJoin(form);
			//como tenemos el json debemos establecer que pasara con el modal
			
			const {title,newHandleSubmit}=setAlertContent(json)
			setAlert({...alert,title,description:json.msg,handleSubmit:newHandleSubmit})
			setOpenAlert(true); //abrimos el modal para mostrar el mensaje respectivo
			sessionStorage.setItem(TIPO_PARTICIPANTE,'guest') //ponemos la session variable para mostrar el respectivo menu
		},
	};
	const setAlertContent=(json)=>{
		let title='';
		let newHandleSubmit=()=>{}
		if(json.status=='bad'){
			title='Hubo un problema :('
			newHandleSubmit= async ()=>{
				closeAllAlerts();
			};
		}else{
			title='Todo correcto!'
			newHandleSubmit= async ()=>{
				
				history.push(`/room/${form.codigo}/${form.password}`);
			};
		}
		return{title,newHandleSubmit}
	}
	
	return (
		<div>
			<FormDialogWidget
				form={form}
				setForm={setForm}
				open={openNew}
				handleClose={newBoard.handleClickClose}
				handleSubmit={newBoard.handleSubmit}
				title="Nueva Sesion Boardy"
				description="Necesitamos los siguientes datos para crear una nueva sala de Boardy"
			></FormDialogWidget>
			<DialogWidget
				open={openAlert}
				handleClose={alert.handleClickClose}
				handleSubmit={alert.handleSubmit}
				title={alert.title}
				description={alert.description}
			></DialogWidget>
			<FormDialogWidget
				form={form}
				setForm={setForm}
				open={openJoin}
				handleClose={joinBoard.handleClickClose}
				handleSubmit={joinBoard.handleSubmit}
				title="Unirse a Sesion Boardy"
				description="Necesitamos los siguientes datos para unirse a una sala de Boardy"
			></FormDialogWidget>
			<div style={{ paddingTop: "2vmin ", paddingInline: "10%" }}>
				<Grid container justify="center">
					<Grid item xs={6} style={{ paddingBlock: "1vmin " }}>
						<div
							style={{
								maxWidth: "100%",
								borderRadius: "20px",
								objectFit: "cover",
								height: "300px",
								backgroundImage: `url("https://st.depositphotos.com/1526816/1891/v/600/depositphotos_18916471-stock-illustration-a-classroom.jpg")`,
							}}
						></div>
					</Grid>
					<Grid item xs={12} style={{ paddingBlock: "1vmin " }}>
						<Grid container justify="space-around">
							<Grid item xs={1}>
								<Button
									onClick={newBoard.handleClickOpen}
									variant="contained"
									size="large"
									color="primary"
									startIcon={<AddToQueueIcon />}
								>
									Nueva
								</Button>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} style={{ paddingBlock: "1vmin " }}>
						<Grid container justify="space-around">
							<Grid item xs={1}>
								<Button
									onClick={joinBoard.handleClickOpen}
									variant="contained"
									size="large"
									color="primary"
									startIcon={<AirplayIcon />}
								>
									Unirse
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default MenuPrincipalPage;
