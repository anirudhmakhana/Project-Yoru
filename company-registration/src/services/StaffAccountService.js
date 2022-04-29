import axios from "axios";

class StaffAccountService {

    async getStaffByUsername( username, token ) { 
        const response = await axios.get('http://localhost:4000/staff/' + username ,
        {headers:{"x-access-token":token}})
            .catch((error) => {
                return error
            })
        return response
    }

    async getStaffByCompany( companyCode, token ) { 
        const response = await axios.get('http://localhost:4000/staff/getByCompany/'+companyCode,
        {headers:{"x-access-token":token}})
        .catch((error) => {
            return error
        })
        return response
    }

    async login( loginData ) { 
        const response = await axios.post("http://localhost:4000/staff/login", loginData)
        .catch( error => {
            return error
        }) 
        return response
    }

    async updateStaff( username, newData, token ) {
        const response = await axios.put("http://localhost:4000/staff/update/"+ username, newData,  {headers:{"x-access-token":token}})
            .catch( error => {
                return error
            }) 
        return response
    }

    async registerStaff( newAccount, token ) { 
        const response = await axios.post("http://localhost:4000/staff/register", newAccount,  
        {headers:{"x-access-token":token}})
        .catch( error => {
            return error
        }) 
        return response
    }

    async deleteStaff( username, token ) { 
        const response = await axios.delete('http://localhost:4000/staff/' + username,
        {headers:{"x-access-token":token}})
        .catch( error => {
            return error
        }) 
        return response
    }
}

export default new StaffAccountService()