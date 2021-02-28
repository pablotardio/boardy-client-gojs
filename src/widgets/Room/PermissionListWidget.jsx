import {
    FormControlLabel,
	Grid,
	ListItem,
    Switch,
} from "@material-ui/core";
import React from "react";
const PermissionListWidget = ({ userList, onTogglePermission }) => {
const handleChange=(e,user)=>{
	console.log(user);
	onTogglePermission(user.socketId,true,e.target.checked)
}

	return (
		<div>
			<ListItem key={'listPart title'}>Lista de participantes</ListItem>
			
			{userList.map((user, i) => (
				<div>
					<ListItem
						// divider
						key={'listPart'+i}
					>
						<Grid container>
							<Grid item xs={12} xl={12}>
								{/* Se verifica que no se repitio el usuario enviador del mensaje */}
								{user.usuario?.nombre}

								
                                <FormControlLabel key={"label"+i} style={{marginInlineStart:'1vh'}}
									control={
										<Switch key={"switch"+i}
											 checked={user.acceso.escritura}
											onChange={(e)=>handleChange(e,user)}
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
