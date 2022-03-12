import {APIurlProvider} from "./url.provider";

const url = APIurlProvider;
class AuthProvider {
     
    static async login(body) {
        let headers= {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        // console.log(headers);
        let config = {
            method: 'POST',
            headers:headers,
            body: JSON.stringify(body)
        }
        let res = await fetch(`${url}/login`, config);
        let json = await res.json();
        //console.log(json);
        return json
    }
    static async register(body) {
        let headers= {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        // console.log(headers);
        let config = {
            method: 'POST',
            headers:headers,
            body: JSON.stringify(body)
        }
        let res = await fetch(`${url}/register`, config);
        let json = await res.json();
        //console.log(json);
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

export default AuthProvider