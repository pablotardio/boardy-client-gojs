import React from "react";
import { Divider, List, ListItem, ListItemIcon } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";

import ListItemText from "@material-ui/core/ListItemText";


import getIcon from '../../providers/icon.provider'
import { useHistory } from "react-router-dom";
/**
 *
 * @param {*} param0
 * @param anchor the anchor object
 * @param toggleDrawer the function that will show or hide the drawer
 */
const MenuLateralWidget = ({ children,menuItems,state,stateIndex, anchor, toggleDrawer }) => {
	const history=useHistory();
	
	const list = (anchor) => {
		const rutear=(item)=>{
			history.push(item.ruta)
			console.log(item.ruta);
		}
		return(
		<div
			role="presentation"
			// onClick={toggleDrawer(anchor, false)} esto hacia que al hacer click en el drawer se oculte
			// onKeyDown={toggleDrawer(anchor, false)} esto hace que al escribir el drawer se oculte
		>
			<List>
				{children}
				{menuItems?.map((item, index) => (
					
					<ListItem button  key={item.id} onClick={	()=>rutear(item)}>
						<ListItemIcon>
							{getIcon(item.icono)}
							{/* (index % 2 === 0 ? <InboxIcon /> : <MailIcon />)*/}
						</ListItemIcon>
						<ListItemText primary={item.texto} />
					</ListItem>
				))}
			</List>
			<Divider />
			{/* <List>
				{["All mail", "Trash", "Spam"].map((text, index) => (
					<ListItem button key={text}>
						<ListItemIcon>
                           
							{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
						</ListItemIcon>
						<ListItemText primary={text} />
					</ListItem>
				))}
			</List> */}
		</div>
	)};

	return (
		<div>
			<Drawer variant="temporary" 
				
				anchor={anchor}
				open={state[stateIndex]}
				onClose={toggleDrawer(stateIndex, false)}
			>
				{list(anchor)}
			</Drawer>
		</div>
	);
};

export default MenuLateralWidget;
