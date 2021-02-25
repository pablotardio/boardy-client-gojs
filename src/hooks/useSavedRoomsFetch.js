import { useEffect, useState } from "react";
import RoomProvider from "../providers/room.provider";

const useSavedRoomsFetch=()=>{
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        getAllRooms()
        return () => {
           
        };
    }, []);
    const  getAllRooms=async()=>{
       const roomsJSON= await RoomProvider.getAllOfUser();
        setRooms(roomsJSON);
    }
    return [rooms];
}
export default useSavedRoomsFetch