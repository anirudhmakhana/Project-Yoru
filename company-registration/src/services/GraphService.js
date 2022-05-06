import axios from "axios";
import ShipmentService from "./ShipmentService";

class GraphService {

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
        this.scannedData = [
            {uid:"SHP001", scannedAt:"LKB-1003", scannedTime:100, status:"created"},
            {uid:"SHP001", scannedAt:"LKB-1003", scannedTime:210, status:"shipping"},

            {uid:"SHP002", scannedAt:"LKB-1003", scannedTime:201, status:"created"},
            {uid:"SHP002", scannedAt:"LKB-1003", scannedTime:220, status:"shipping"},
            {uid:"SHP002", scannedAt:"RAM-52011", scannedTime:300, status:"arrived"},
            
            {uid:"SHP003", scannedAt:"CNX-2040", scannedTime:10, status:"created"},
            {uid:"SHP003", scannedAt:"CNX-2040", scannedTime:20, status:"shipping"},
            {uid:"SHP003", scannedAt:"RAM-52011", scannedTime:40, status:"arrived"},
            {uid:"SHP003", scannedAt:"RAM-52011", scannedTime:50, status:"shipping"},
            {uid:"SHP003", scannedAt:"LKB-1003", scannedTime:100, status:"completed"},

            {uid:"SHP004", scannedAt:"LKB-1003", scannedTime:98, status:"created"},
            {uid:"SHP004", scannedAt:"LKB-1003", scannedTime:110, status:"shipping"},
            {uid:"SHP004", scannedAt:"RAM-52011", scannedTime:150, status:"arrived"},

            {uid:"SHP005", scannedAt:"RAM-52011", scannedTime:20, status:"created"},
            {uid:"SHP005", scannedAt:"RAM-52011", scannedTime:40, status:"shipping"},
            {uid:"SHP005", scannedAt:"LKB-1003", scannedTime:80, status:"arrived"},

            {uid:"SHP006", scannedAt:"LKB-1003", scannedTime:100, status:"created"},
            {uid:"SHP006", scannedAt:"LKB-1003", scannedTime:120, status:"shipping"},
            {uid:"SHP006", scannedAt:"RAM-52011", scannedTime:300, status:"arrived"},
        ]
    }

    getCountShipmentAtTime( shipments, time ){
        var count = 0
        shipments.forEach( s => {
            if ( s.scannedTime <= time ){
                count += 1
            }
        })
        return count
    }
    

    async getNodeStockByTime( nodeCode, timeInterval, token) {
        
        var stock = []
        this.scannedData.forEach((v, i) => {
            if (v.scannedAt == nodeCode && (v.status == "created" || v.status == "arrived" )){
                stock.push(this.scannedData[i])
            }
        })
        var shipped = []
        this.scannedData.forEach((v, i) => {
            if (v.scannedAt == nodeCode && (v.status == "shipping")){
                shipped.push(this.scannedData[i])
            }
        })
        var result = {}
        timeInterval.forEach( (t, index )=> {
            result[t] = this.getCountShipmentAtTime(stock, t) - this.getCountShipmentAtTime(shipped, t)
        })
        console.log(result)
        return {data:result}
        
        // axios.get('http://localhost:4000/node/', {headers:{"x-access-token":token}})
        // .then( response => {

        // })
        // .catch((error) => {
        //     throw error
        // })
        // return response
    }

}

export default new GraphService()