import axios from "axios";

class NodeDataService {

    constructor() {
        this.allNodes = [ 
            {nodeCode:"LKB-1003", companyCode:"YORU", address:"123 Ladkrabang 14 Alley, Lad krabang, Bangkok 10520",
             lat:13.717731, lng:100.712577, phoneNumber:"021231212", status:"active"},

             {nodeCode:"CNX-2040", companyCode:"YORU", address:"QXX5+4X8, Tambon Su Thep, Mueang Chiang Mai District, Chiang Mai 50200",
             lat:18.797894, lng:98.960138, phoneNumber:"029384751", status:"active"},

             {nodeCode:"RAM-52011", companyCode:"YORU", address:"QMQV+3MJ Ramkhamhaeng Road Saphan Sung, Bangkok 10240",
             lat:13.788017, lng:100.693971, phoneNumber:"021231212", status:"active"},

             {nodeCode:"BANG-RAK-HQ1", companyCode:"YORU", address:"476 Maha Phruttharam, Bang Rak, Bangkok 10500",
             lat:13.731021, lng:100.519982, phoneNumber:"021113333", status:"active"}
            ]
    }
    

    async getAllNode(token) { 
        const response = await axios.get('http://localhost:4000/node/', {headers:{"x-access-token":token}})
        .catch((error) => {
            throw error
        })
        return response
    }

    async getNodeByCompany( companyCode, token ) {
        const response = await axios.get('http://localhost:4000/node/bycompany/'+companyCode, {headers:{"x-access-token":token}})
        .catch((error) => {
            throw error
        })
        return response
    }

    async getActiveNodeByCompany( companyCode, token ) {
        const response = await axios.get('http://localhost:4000/node/active/'+companyCode, {headers:{"x-access-token":token}})
        .catch((error) => {
            throw error
        })
        return response
    }

    async getNodeByCode(nodeCode, token) {
        const response = await axios.get('http://localhost:4000/node/'+nodeCode, {headers:{"x-access-token":token}})
        .catch((error) => {
            throw error
        })
        return response
    }

    async getCompanyOfNode( nodeCode, token ) {
        const response = await axios.get('http://localhost:4000/node/'+nodeCode, {headers:{"x-access-token":token}})
        .catch((error) => {
            throw error
        })
        response.data = response.data.companyCode
        return response
    }

    async getCoordinateByNode( nodeCode, token ) {
        const response = await axios.get('http://localhost:4000/node/'+nodeCode, {headers:{"x-access-token":token}})
        .catch((error) => {
            throw error
        })
        response.data ={lat:response.data.lat, lng:response.data.lng}
        return response
    }
    

}

export default new NodeDataService()