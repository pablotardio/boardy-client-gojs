
import React, {  useEffect } from "react";
import useRoom from '../hooks/useRoom'


function RoomPage(props) {
  const { roomId,password } = props.match.params;
 
  const {mousesCoord,
    emitMouseActivity }=useRoom(roomId,roomId);
  //Component did mount
  useEffect(() => {
    console.log();
   

    //Component wil unmount 
    return () => { }
  }, []);

  


  return (
   
  
   <div  style={{backgroundColor:'salmon',height:'1000px'}} onMouseMove={emitMouseActivity}>
   
    { 
    mousesCoord.map((item,i)=>{
      return <div style={{position:'absolute',
      backgroundColor:'black',
      width:'4px',
      height:'4px',
      zIndex:'3',
      left:item.coords.x,
      top:item.coords.y
      }}>
        usuario: {item.session_id}
      </div>
      // return <div key={item.session_id}> aqui ta el mouse {i}  {item.session_id} 
      // coods x: {item.coords.x}  y: {item.coords.y}</div>
      
    })}
   
   </div>
  );
}

export default RoomPage;