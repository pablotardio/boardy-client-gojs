import {APIurlProvider} from "./url.provider";

const url = APIurlProvider;
class TemporalRoomProvider {
     
    static async verifyRoomCreate(body) {
        let headers= this.getHeaders();
        
        let config = {
            method: 'POST',
            headers:headers,
            body: JSON.stringify(body)
        }
        let res = await fetch(`${url}/room/verify/create`, config);
        let json = await res.json();
        
        return json
    }
    static async verifyRoomJoin(body) {
        let headers= this.getHeaders();
        
        let config = {
            method: 'POST',
            headers:headers,
            body: JSON.stringify(body)
        }
        let res = await fetch(`${url}/room/verify/join`, config);
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

export default TemporalRoomProvider