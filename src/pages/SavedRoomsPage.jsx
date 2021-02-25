import { Grid } from '@material-ui/core';
import React from 'react';
import useSavedRoomsFetch from '../hooks/useSavedRoomsFetch'
import RoomCardWidget from '../widgets/savedRooms/RoomCardWidget'
const SavedRoomsPage = () => {
    const [savedRooms]=useSavedRoomsFetch();
    return (
        <div style={{padding:'3vh'}}>

    
        <Grid container spacing={2} >
            {savedRooms.map(room=><RoomCardWidget nombre={room.nombre} descripcion={room.descripcion}></RoomCardWidget>)}
            
        </Grid>
        </div>
    );
}

export default SavedRoomsPage;
