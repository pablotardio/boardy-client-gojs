import urlProvider from "./url.provider";

const url = urlProvider;
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
    static getHeaders=()=>{
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+localStorage.getItem('token')
        }
    }
}

export default RoomProvider