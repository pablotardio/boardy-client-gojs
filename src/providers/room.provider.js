import APIurlProvider from "./url.provider";

const url = APIurlProvider;
class RoomProvider {
     
    static async verifySave(body) {
        let headers= this.getHeaders();
        
        let config = {
            method: 'POST',
            headers:headers,
            body: JSON.stringify(body)
        }
        let res = await fetch(`${url}/room/verifysave`, config);
        let json = await res.json();
        
        return json
    }
    static async create(body) {
        let headers= this.getHeaders();
        
        let config = {
            method: 'POST',
            headers:headers,
            body: JSON.stringify(body)
        }
        let res = await fetch(`${url}/room/create`, config);
        let json = await res.json();
        
        return json
    }
    static async update(body,codigo) {
        let headers= this.getHeaders();
        
        let config = {
            method: 'PUT',
            headers:headers,
            body: JSON.stringify(body)
        }
        let res = await fetch(`${url}/room/update/${codigo}`, config);
        let json = await res.json();
        return json
    }
    /**
     * To fetch a specific diagram
     * @param {*} codigo  the code of the room  (not id)
     */
    static async getDiagramOfRoom(codigo) {
        let headers= this.getHeaders();
        
        let config = {
            method: 'GET',
            headers:headers
        }
        let res = await fetch(`${url}/room/${codigo}/diagram`, config);
        let json = await res.json();
        return json
    }
    static async delete(codigo) {
        let headers= this.getHeaders();
        
        let config = {
            method: 'DELETE',
            headers:headers
        }
        let res = await fetch(`${url}/room/delete/${codigo}`, config);
        let json = await res.json();
        return json
    }
    static async getAllOfUser (body){
        let headers= this.getHeaders();
        
        let config = {
            method: 'GET',
            headers:headers,
            body: JSON.stringify(body)
        }
        let res = await fetch(`${url}/room/all/user`, config);
        let json = await res.json();
        return json
    }
    static getHeaders=()=>{
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+localStorage.getItem('token')
        }
    }
   
}

export default RoomProvider