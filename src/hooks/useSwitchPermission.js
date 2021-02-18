import { useState } from "react";

const useSwitchPermission=()=>{
    //Example of a single array element
    // user: {
    //   email: 'docente@gmail.com',
    //   nombre: 'el ing',
    //   socketId: 'm51ghYNVOfL5xtQwAAAD',
    //   permissions: [Object]
    // }
    const [switchList, setSwitchList] = useState([]);
    const toggleSwitch=(socketId,r,w)=>{
        let i = switchList.findIndex((item) => {
            return item.socketId == socketId;
        });
        let auxList=switchList
        auxList[i].permissions={r,w}
        setSwitchList([auxList])
    }
    
    return {switchList, setSwitchList,toggleSwitch}

}
export default useSwitchPermission;