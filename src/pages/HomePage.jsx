import { Grid, Typography } from '@material-ui/core';
import React from 'react';

const HomePage = () => {
    let text="Boardy es el sitio ideal para la creacion de Diagramas de flujo en tiempo real "
    return (
        <div>
            <Grid container>
                <Grid item>
                <img src="https://www.iconbunny.com/icons/media/catalog/product/3/1/3157.12-office-board-icon-iconbunny.jpg"  />

                </Grid>
               <Grid item>
               <Typography component="h1" variant="h4" >
                    {text}
                </Typography>
               </Grid>
                    
            </Grid >
        </div>
    );
}

export default HomePage;
