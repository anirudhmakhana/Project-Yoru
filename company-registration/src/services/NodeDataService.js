import axios from "axios";
const google = window.google = window.google ? window.google : {}
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
             lat:13.731021, lng:100.519982, phoneNumber:"021113333", status:"active"},

            ]
    }
    sphericalDistance(lat1, lon1, lat2, lon2 ) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            return dist * 1.609344 
        }
    }

    async addNode( newData, token ) {
        const response = await axios.post("http://localhost:4000/node/", newData, 
        {headers:{"x-access-token":token}})
            .catch( error => {
                throw error
            }) 
        return response
    }

    async updateNode( nodeCode, newData, token ) {
        const response = await axios.put("http://localhost:4000/node/update/"+ nodeCode, newData,  {headers:{"x-access-token":token}})
            .catch( error => {
                throw error
            }) 
        return response
    }

    async updateNodeStatus( nodeCode, statusData, token ) {
        const response = await axios.patch("http://localhost:4000/node/update/status/"+ nodeCode, statusData,  {headers:{"x-access-token":token}})
            .catch( error => {
                throw error
            }) 
        return response
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

    async getNearestNode( coord, companyCode, token, google ) {
        const response = await this.getNodeByCompany( companyCode, token)
        .catch((error) => {
            throw error
        })
        try {

        var result = response.data[0]
        // var minDist = google.maps.geometry.spherical.computeDistanceBetween( {lat: result.lat, lng:result.lng}, coord)
        let minDist = this.sphericalDistance(coord.lat, coord.lng, result.lat, result.lng)

            
            response.data.forEach( (node, ind) => {
                // let curDist =  google.maps.geometry.spherical.computeDistanceBetween( {lat: node.lat, lng:node.lng}, coord)
                let curDist = this.sphericalDistance(coord.lat, coord.lng, node.lat, node.lng)
                if ( curDist < minDist) {
                    result = response.data[ind]
                    minDist = curDist
                }
            }) 
        }
        catch (err) {         
            throw err
        }
        return {data: result}
    }
    

}

export default new NodeDataService()