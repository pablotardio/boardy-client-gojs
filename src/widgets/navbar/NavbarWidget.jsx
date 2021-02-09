import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom'; //Se debe instalar el @types/PAQUETE para reconocer sus jsx props etc
/** @type {import('react-router-dom').{Link}} */
const useStyles = makeStyles((theme) => ({
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
const NavbarWidget = ({ parentStateVistas, updateNav }) => {
    const handleClick = () => {
        console.log('Cerrando sesion');
        localStorage.clear()
        updateNav()
    }
    /**
     * Para que dependiendo si esta iniciada la sesion o no se devuelva la respectiva iniciar o cerrar
     * sesion
     */
    const _retornoDeSesion = () => {
        console.log(parentStateVistas);
        if (parentStateVistas?.length === 0 || parentStateVistas?.vistas == null) {
            return (
                    <Button onClick={handleClick} color="inherit">
                        Iniciar Sesion
                    <Link  to={"/login"} > </Link >
                    </Button>
                    )
        }
        else {
            return (
                
               
                    <Button onClick={handleClick} color="inherit">
                        Cerrar sesion
                     <Link  to={"/home"} ></Link>
                    </Button>
               
            )


        }
    }
    const classes = useStyles();
    return (
        <div>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Boardy Home
                    </Typography>
                        {
                        parentStateVistas?.map(item=> (<Button onClick={handleClick} color="inherit">
                        Iniciar Sesion
                    <Link  to={"/login"} > </Link >
                    </Button>))
                         }
                    {_retornoDeSesion()}

                </Toolbar>
            </AppBar>
        </div>
    );
}

export default NavbarWidget;
