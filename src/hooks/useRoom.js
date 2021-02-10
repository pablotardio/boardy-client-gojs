import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage"; // Name of the event
const SOCKET_SERVER_URL = "http://localhost:3002";

const useRoom = (roomId,roomPass) => {
  const [messages, setMessages] = useState([]); // Sent and received messages
  const [mousesCoord, setMousesCoord] = useState([]); 

  const socketRef = useRef();

  useEffect(() => {
    
    // Creates a WebSocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL,  {transports: ['websocket'],
      query: { roomId,roomPass },
    });
    
    // Listens for incoming messages
    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });
    
    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId,roomPass]);

  // Sends a message to the server that
  // forwards it to all users in the same room
  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
    });
  };
  const emitMouseActivity=(e)=>{
    let mousePosition={
      x:e.pageX,
      y:e.pageY
    }
    
    socketRef.current.emit('mouse_activity',mousePosition);
    socketRef.current.on('all_mouse_activity', (data)=>{

      let index=mousesCoord.findIndex(function (item) {
        return item.session_id===data.session_id;
    })
      
      //console.log(index);
      let newMousesCoord =mousesCoord;
      if(index !==-1){
        newMousesCoord[index]=data;
        setMousesCoord(newMousesCoord);
      }
      else{
        setMousesCoord([...mousesCoord,data])
      }}
    )
  }
  return { messages, sendMessage,mousesCoord,emitMouseActivity };
};

export default useRoom;