import { Grid } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

import useSavedRoomsFetch from "../hooks/useSavedRoomsFetch";
import RoomCardWidget from "../widgets/savedRooms/RoomCardWidget";
const DIAGRAM_LOAD='diagramLoad' //Session Storage item
const SavedRoomsPage = () => {
	const [savedRooms, deleteRoom] = useSavedRoomsFetch();
    const history=useHistory();
	const handleClickDelete = (roomId) => {
		deleteRoom(roomId);
	};
    const handleClickBegin = (room) => {
		sessionStorage.setItem(DIAGRAM_LOAD,'true');
        history.push(`/room/${room.codigo}/${room.password}`);
	};
	return (
		<div style={{ padding: "3vh" }}>
			<Grid container spacing={2}>
				{savedRooms.map((room) => (
					<RoomCardWidget
						nombre={room.nombre}
						descripcion={room.descripcion}
						handleClickDelete={() => handleClickDelete(room.id)}
                        handleClickBegin={() => handleClickBegin(room)}
					></RoomCardWidget>
				))}
			</Grid>
		</div>
	);
};

export default SavedRoomsPage;
