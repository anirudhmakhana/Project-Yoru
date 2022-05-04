import axios from "axios";

class CompanyService {

    async getCompanyByCode( companyCode, token ) { 
        const response = await axios.get('http://localhost:4000/company/'+companyCode,{headers:{"x-access-token":token}})
        .catch((error) => {
            throw error
        })
        return response

    }

    async getAllCompanyCode( token ) {
        const response = await axios.get('http://localhost:4000/company/companyCode/', {headers:{"x-access-token":token}})
        .catch((error) => {
            throw error
        })
        const result = []
        response.data.forEach( comp => result.push(comp.companyCode))
        console.log(result)
        return {data:result}
    }

    async updateCompany( companyCode, newData, token ) {
        const response = await axios.put("http://localhost:4000/company/update/"+ companyCode, newData,  {headers:{"x-access-token":token}})
            .catch( error => {
                throw error
            }) 
        return response
    }

    async createCompany( newData, token ) {
        const response = await axios.post("http://localhost:4000/company/", newData, 
        {headers:{"x-access-token":token}})
            .catch( error => {
                throw error
            }) 
        return response
    }

    async deleteCompany( companyCode, token ) { 
        const response = await axios.delete('http://localhost:4000/company/' + companyCode,
        {headers:{"x-access-token":token}})
        .catch( error => {
            throw error
        }) 
        return response
    }
}

export default new CompanyService()