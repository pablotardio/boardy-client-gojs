import { Grid, Button } from "@material-ui/core";
import React from "react";
import AirplayIcon from "@material-ui/icons/Airplay";
import AddToQueueIcon from "@material-ui/icons/AddToQueue";

import FormDialogWidget from "../widgets/MenuPrincipal/FormDialogWidget";
import DialogWidget from "../widgets/MenuPrincipal/DialogWidget";
import { useHistory } from "react-router-dom";
import RoomProvider from "../providers/room.provider";
const MenuPrincipalPage = () => {
	const [openNew, setOpenNew] = React.useState(false);
	const [openAlert, setOpenAlert] = React.useState(false);
	const [openJoin, setOpenJoin] = React.useState(false);
	const [form, setForm] = React.useState({ codigo: "", password: "" });
	const history = useHistory();

	const [alert, setAlert] = React.useState({
		title: "",
		description: "",
		handleClickOpen: () => {
			setOpenAlert(true);
		},
		handleClose: () => {
			setOpenAlert(false);
			setForm({ codigo: "", password: "" });
		},
		handleSubmit: async () => {
			history.push(`/room/${form.codigo}/${form.password}`);
		},
	});
	const newBoard = {
		handleClickOpen: () => {
			setOpenNew(true);
		},
		handleClose: () => {
			setOpenNew(false);
			setForm({ codigo: "", password: "" });
		},
		handleSubmit: async () => {
			console.log(form);
			const json = await RoomProvider.verifyRoom(form);
			//como tenemos el json debemos establecer que pasara con el modal
			
		},
	};
	
	const joinBoard = {
		handleClickOpen: () => {
			setOpenJoin(true);
		},
		handleClose: () => {
			setOpenJoin(false);
			setForm({ codigo: "", password: "" });
		},
		handleSubmit: () => {
			console.log(form);
		},
	};
	return (
		<div>
			<FormDialogWidget
				form={form}
				setForm={setForm}
				open={openNew}
				handleClose={newBoard.handleClose}
				handleSubmit={newBoard.handleSubmit}
				title="Nueva Sesion Boardy"
				description="Necesitamos los siguientes datos para crear una nueva sala de Boardy"
			></FormDialogWidget>
			<DialogWidget
				open={openAlert}
				handleClose={alert.handleClose}
				handleSubmit={alert.handleSubmit}
				title={alert.title}
				description={alert.description}
			></DialogWidget>
			<FormDialogWidget
				form={form}
				setForm={setForm}
				open={openJoin}
				handleClose={joinBoard.handleClose}
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
