import { Button, Card, CardActions, CardContent, Grid, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import React from "react";
const useStyles = makeStyles({
    root: {
      minWidth: 275,
      
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    
  });
const RoomCardWidget = ({nombre,descripcion}) => {
    const classes = useStyles();
	return (
		
            <Grid item xs={3} >
                
           
			<Card className={classes.root} variant="outlined">
				<CardContent>
					
					<Typography variant="h5" component="h3">
						{nombre}
					</Typography>
					
					<Typography variant="body2" color="textSecondary" component="p">
						{descripcion}
						
					</Typography>
				</CardContent>
				<CardActions>
					<Button size="small" color="primary">Iniciar</Button>
					<Button size="small" color="primary">Eliminar</Button>
				</CardActions>
                
			</Card>
            </Grid>
		
	);
};

export default RoomCardWidget;
