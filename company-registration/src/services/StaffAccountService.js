import axios from "axios";
import { serverBasedURL } from "../utils/ApiUrl";

class StaffAccountService {
    constructor( ) {
        this.apiURL = serverBasedURL + '/staff'
    }
    async getStaffByUsername( username, token ) { 
        const response = await axios.get(this.apiURL + '/' + username ,
        {headers:{"x-access-token":token}})
            .catch((error) => {
                throw error
            })
        return response
    }

    async getStaffByCompany( companyCode, token ) { 
        const response = await axios.get(this.apiURL + '/getByCompany/'+companyCode,
        {headers:{"x-access-token":token}})
        .catch((error) => {
            throw error
        })
        return response
    }

    async login( loginData ) { 
        const response = await axios.post(this.apiURL + "/login", loginData)
        .catch( error => {
            throw error
        }) 
        return response
    }

    async checkPassword( loginData, token ) { 
        const response = await axios.post(this.apiURL + "/checkpassword", loginData,  {headers:{"x-access-token":token}})
        .catch( error => {
            throw error
        }) 
        return response
    }

    async updateStaff( username, newData, token ) {
        const response = await axios.put(this.apiURL + "/update/"+ username, newData,  {headers:{"x-access-token":token}})
            .catch( error => {
                throw error
            }) 
        return response
    }

    async registerStaff( newAccount, token ) { 
        const response = await axios.post(this.apiURL + "/register", newAccount,  
        {headers:{"x-access-token":token}})
        .catch( error => {
            throw error
        }) 
        return response
    }

    async deleteStaff( username, token ) { 
        const response = await axios.delete(this.apiURL + '/' + username,
        {headers:{"x-access-token":token}})
        .catch( error => {
            throw error
        }) 
        return response
    }
}

export default new StaffAccountService()