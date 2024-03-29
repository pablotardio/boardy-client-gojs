import { Grid, Typography } from "@material-ui/core";
import React from "react";

const HomePage = () => {
	let text =
		"Boardy es el sitio ideal para la creacion de Diagramas de flujo en tiempo real ";
	// When the home is accesed it should destroy the tipoParticipante from session storage

	return (
		<div style={{paddingTop:'2%'}}>
			<Grid container justify="center" >
				<Grid item xs={2}>
					<img
						alt=''
						style={{ maxWidth: "100%" }}
						src="https://www.iconbunny.com/icons/media/catalog/product/3/1/3157.12-office-board-icon-iconbunny.jpg"
					/>
				</Grid>
				<Grid item xs={12}>
					<Grid container justify="center">
						<Grid item xs={8}>
							<Typography component="h1" variant="h4" style={{textAlign:'center'}}>
								{text}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
};

export default HomePage;
