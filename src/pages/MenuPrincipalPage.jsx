import { Grid, Button } from "@material-ui/core";
import React from "react";
import AirplayIcon from "@material-ui/icons/Airplay";
import AddToQueueIcon from "@material-ui/icons/AddToQueue";
import { Height } from "@material-ui/icons";
import FormDialogWidget from '../widgets/MenuPrincipal/FormDialogWidget'
const MenuPrincipalPage = () => {
	const [openNew, setOpenNew] = React.useState(false);
	const newBoard={
		 handleClickOpen : () => {
			setOpenNew(true);
		  },
		  handleClose :() => {
			setOpenNew(false);
		  }
	}
	return (
		<div>
			<FormDialogWidget 
			open={openNew}
			handleClickOpen={newBoard.handleClickOpen}
			handleClose={newBoard.handleClose}
			 title="Nueva Sesion Boardy" 
			 description="Necesitamos los siguientes datos para crear una nueva sala de Boardy">
				
			</FormDialogWidget>

			<div style={{ paddingTop: "2vmin ", paddingInline: "10%" }}>
				<Grid container justify="center">
					<Grid item xs={6} style={{ paddingBlock: "1vmin " }} >
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
