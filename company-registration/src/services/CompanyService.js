import axios from "axios";
import {serverBasedURL} from "../utils/ApiUrl";


class CompanyService {
    constructor() {
        this.apiURL = serverBasedURL + '/company'
    }

    async getCompanyByCode( companyCode, token ) { 
        const response = await axios.get(this.apiURL + '/' + companyCode,{headers:{"x-access-token":token}})
        .catch((error) => {
            throw error
        })
        return response

    }

    async getAllCompany( token ) {
        const response = await axios.get(this.apiURL, {headers:{"x-access-token":token}})
        .catch((error) => {
            throw error
        })

        return response
    }

    async getAllCompanyCode( token ) {
        const response = await axios.get(this.apiURL , {headers:{"x-access-token":token}})
        .catch((error) => {
            throw error
        })
        const result = []
        response.data.forEach( comp => result.push(comp.companyCode))
        console.log(result)
        return {data:result}
    }

    async updateCompany( companyCode, newData, token ) {
        const response = await axios.put(this.apiURL +"/update/"+ companyCode, newData,  {headers:{"x-access-token":token}})
            .catch( error => {
                throw error
            }) 
        return response
    }

    async createCompany( newData, token ) {
        const response = await axios.post(this.apiURL , newData, 
        {headers:{"x-access-token":token}})
            .catch( error => {
                throw error
            }) 
        return response
    }

    async deleteCompany( companyCode, token ) { 
        const response = await axios.delete(this.apiURL + '/' + companyCode,
        {headers:{"x-access-token":token}})
        .catch( error => {
            throw error
        }) 
        return response
    }
}

export default new CompanyService()