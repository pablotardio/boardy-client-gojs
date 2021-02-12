import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Message } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom"; //Se debe instalar el @types/PAQUETE para reconocer sus jsx props etc

import MenuLateralWidget from "./MenuLateralWidget";
import { Chip, ListItem } from "@material-ui/core";

const NavbarWidget = ({ parentStateVistas, isChatActive, updateNav }) => {
	let history = useHistory();
	const [state, setState] = React.useState({
		top: false,
		left: false,
		bottom: false,
		right: false,
	});

	/**
	 * Function to administrate the show or hidden of the side menu
	 */
	const toggleDrawer = (anchor, open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setState({ ...state, [anchor]: open });
	};
	const useStyles = makeStyles((theme) => ({
		list: {
			width: 250,
		},
		fullList: {
			width: "auto",
		},
		root: {
			flexGrow: 1,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},
	}));

	const handleClick = {
		login: () => {
			history.push("/login");
		},
		logout: () => {
			console.log("Cerrando sesion");
			localStorage.clear();
			updateNav();
		},
	};
	/**
	 * Para que dependiendo si esta iniciada la sesion o no se devuelva la respectiva iniciar o cerrar
	 * sesion
	 */
	const _retornoDeSesion = () => {
		// console.log(parentStateVistas);
		if (parentStateVistas?.length === 0 || parentStateVistas == null) {
			return (
				<Button onClick={handleClick.login} color="inherit">
					Iniciar Sesion
				</Button>
			);
		} else {
			return (
				<Button onClick={handleClick.logout} color="inherit">
					Cerrar sesion
					<Link to={"/home"}></Link>
				</Button>
			);
		}
	};
	const _retornarBotonMenu = () => {
		const anchor = "left";
		return parentStateVistas != null ? (
			<div key={anchor}>
				<IconButton
					onClick={toggleDrawer(anchor, true)}
					edge="end"
					className={classes.menuButton}
					color="inherit"
					aria-label="menu"
				>
					<MenuIcon />
				</IconButton>
				<MenuLateralWidget
					menuItems={parentStateVistas}
					state={state}
					anchor={anchor}
					toggleDrawer={toggleDrawer}
				></MenuLateralWidget>
			</div>
		) : (
			""
		);
	};
	const _retornarBotonChat = () => {
		const anchor = "right";
		return isChatActive ? (
			<div key={anchor}>
				<IconButton
					onClick={toggleDrawer(anchor, true)}
					edge="end"
					className={classes.menuButton}
					color="inherit"
					aria-label="menu"
				>
					<Message />
				</IconButton>
				<MenuLateralWidget
					state={state}
					anchor={anchor}
					toggleDrawer={toggleDrawer}
				>
					<ListItem>Chat</ListItem>
					<ListItem>
						<Chip
							label="No se ha enviado ningun mensaje"
							color="secondary"
						/>
					</ListItem>
				</MenuLateralWidget>
			</div>
		) : (
			""
		);
	};
	const classes = useStyles();
	return (
		<div>
			<AppBar position="static">
				<Toolbar variant="dense">
					{_retornarBotonMenu()}

					<Typography variant="h6" className={classes.title}>
						Boardy Home
					</Typography>
					{_retornarBotonChat()}
					{_retornoDeSesion()}
				</Toolbar>
			</AppBar>
		</div>
	);
};

export default NavbarWidget;
