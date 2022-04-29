import axios from "axios";

class AdminAccountService {

    async registerAdmin( newAccount, token ) { 
        const response = await axios.post("http://localhost:4000/admin/register", newAccount,{headers:{"x-access-token":token}})
        .catch( error => {
            throw error
        }) 
        return response
    }

    async login( loginData ) { 
        const response = await axios.post("http://localhost:4000/admin/login", loginData)
        .catch( error => {
            throw error
        }) 
        return response
    }

    

}

export default new AdminAccountService()