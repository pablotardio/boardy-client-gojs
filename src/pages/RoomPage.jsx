import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useRoom from "../hooks/useRoom";

function RoomPage({setShowChat}) {
  //    se puede obtener los parametros de un compenente que se linkee sin ninguna prop
  //    const { roomId, password } = props.match.params;
  // se puede hacer con mas de una prop 
  // https://stackoverflow.com/questions/54114416/how-to-access-this-props-match-params-along-with-other-props
	
    const {roomId,password}=useParams()
  const { mousesCoord, emitMouseActivity } = useRoom(roomId, password);
	//Component did mount
	useEffect(() => {
		console.log();
		setShowChat(true);

		//Component wil unmount
		return () => {
			setShowChat(false);
		};
	}, []);

	return (
		<div
			style={{ backgroundColor: "salmon", height: "1000px" }}
			onMouseMove={emitMouseActivity}
		>
			{mousesCoord.map((item, i) => {
				return (
					<div
						style={{
							position: "absolute",
							backgroundColor: "black",
							width: "4px",
							height: "4px",
							zIndex: "3",
							left: item.coords.x,
							top: item.coords.y,
						}}
					>
						usuario: {item.session_id}
					</div>
				);
				// return <div key={item.session_id}> aqui ta el mouse {i}  {item.session_id}
				// coods x: {item.coords.x}  y: {item.coords.y}</div>
			})}
		</div>
	);
}

export default RoomPage;
