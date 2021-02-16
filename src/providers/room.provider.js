import urlProvider from "./url.provider";

const url = urlProvider;
class RoomProvider {
     
    static async verifyRoom(body) {
        let headers= this.getHeaders();
        
        let config = {
            method: 'POST',
            headers:headers,
            body: JSON.stringify(body)
        }
        let res = await fetch(`${url}/room/verifyRoom`, config);
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