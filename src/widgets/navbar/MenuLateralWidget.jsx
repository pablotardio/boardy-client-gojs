import React from "react";
import { Divider, List, ListItem, ListItemIcon } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";

import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import getIcon from '../../providers/icon.provider'
import { useHistory } from "react-router-dom";
/**
 *
 * @param {*} param0
 * @param anchor the anchor object
 * @param toggleDrawer the function that will show or hide the drawer
 */
const MenuLateralWidget = ({ children,menuItems,state, anchor, toggleDrawer }) => {
	const history=useHistory();
	
	const list = (anchor) => {
		const rutear=(item)=>{
			history.push(item.ruta)
			console.log(item.ruta);
		}
		return(
		<div
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
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
			<Drawer
				anchor={anchor}
				open={state[anchor]}
				onClose={toggleDrawer(anchor, false)}
			>
				{list(anchor)}
			</Drawer>
		</div>
	);
};

export default MenuLateralWidget;
