import React from "react";
import { Divider, List, ListItem, ListItemIcon } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";

import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import {home} from "@material-ui/icons";
import getIcon from '../../providers/icon.provider'
/**
 *
 * @param {*} param0
 * @param anchor the anchor object
 * @param toggleDrawer the function that will show or hide the drawer
 */
const MenuLateralWidget = ({ menuItems,state, anchor, toggleDrawer }) => {
	const list = (anchor) => (
		<div
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			<List>
				{menuItems?.map((item, index) => (
					<ListItem button key={item.id}>
						<ListItemIcon>
							{getIcon(item.icono)}
							{/* (index % 2 === 0 ? <InboxIcon /> : <MailIcon />)*/}
						</ListItemIcon>
						<ListItemText primary={item.texto} />
					</ListItem>
				))}
			</List>
			<Divider />
			<List>
				{["All mail", "Trash", "Spam"].map((text, index) => (
					<ListItem button key={text}>
						<ListItemIcon>
                           
							{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
						</ListItemIcon>
						<ListItemText primary={text} />
					</ListItem>
				))}
			</List>
		</div>
	);

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