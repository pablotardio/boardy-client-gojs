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
        })
        //El slice me separa el arreglo de un indice especifico
        let changedUserPermission=switchList.slice(i, i+1);
        //establezco los nuevos permisos
        changedUserPermission[0].acceso={lectura:r,escritura:w};
        //concateno el arreglo con sus valores anteriores 
        const auxList = [
            ...switchList.slice(0, i),
            ...changedUserPermission,
            ...switchList.slice(i + 1)
          ]
          //cambio el estado
        setSwitchList(auxList)
        /*Nota : todo esto se hace por que en react no se puede mutar el estado haciendo un 
        switchList[i].permissions={r,w}; si no que se debe crear un nuevo arreglo*/
    }
    
    return {switchList, setSwitchList,toggleSwitch}

}
export default useSwitchPermission;