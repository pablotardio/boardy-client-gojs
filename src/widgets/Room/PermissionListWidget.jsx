import {
	Chip,
	Fab,
    FormControlLabel,
	Grid,
	ListItem,
	ListItemText,
    Switch,
	TextField,
	Typography,
} from "@material-ui/core";
import React, { useState } from "react";
const PermissionListWidget = ({ userList, onTogglePermission }) => {


	return (
		<div>
			<ListItem>Lista de participantes</ListItem>
			
			{userList.map((user, i) => (
				<div>
					<ListItem
						// divider
						key={i}
					>
						<Grid container>
							<Grid item xs={12} xl={12}>
								{/* Se verifica que no se repitio el usuario enviador del mensaje */}
								{user.nombre}

								<FormControlLabel
									control={
										<Switch
											// checked={state.checkedB}
											// onChange={handleChange}
											name="checkedB"
											color="primary"
										/>
									}
									label="Primary"
								/>
                                <FormControlLabel
									control={
										<Switch
											// checked={state.checkedB}
											// onChange={handleChange}
											name="checkedB"
											color="primary"
										/>
									}
									label="Primary"
								/>

							</Grid>
							

							{/* {message.body} */}
						</Grid>
					</ListItem>
				</div>
			))}
		</div>
	);
};

export default PermissionListWidget;
