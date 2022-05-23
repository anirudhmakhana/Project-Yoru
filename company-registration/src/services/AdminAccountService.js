import axios from "axios";
import { serverBasedURL } from "../utils/ApiUrl";

class AdminAccountService {
    constructor() {
        this.apiURL = serverBasedURL + '/admin'
    }
    async registerAdmin( newAccount, token ) { 
        const response = await axios.post(this.apiURL +"/register", newAccount,{headers:{"x-access-token":token}})
        .catch( error => {
            throw error
        }) 
        return response
    }

    async login( loginData ) { 
        const response = await axios.post(this.apiURL +"/login", loginData)
        .catch( error => {
            throw error
        }) 
        return response
    }

    

}

export default new AdminAccountService()