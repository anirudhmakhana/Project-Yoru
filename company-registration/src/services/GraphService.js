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
            {uid:"SHP001", scannedAt:"LKB-1003", scannedTime: new Date(2022, 4, 6, 15, 40).getTime(), status:"created"},
            {uid:"SHP001", scannedAt:"LKB-1003", scannedTime: new Date(2022, 4, 6, 23, 20).getTime(), status:"shipping"},

            {uid:"SHP002", scannedAt:"LKB-1003", scannedTime:new Date(2022, 4, 6, 23, 12).getTime(), status:"created"},
            {uid:"SHP002", scannedAt:"LKB-1003", scannedTime:new Date(2022, 4, 7, 7, 20).getTime(), status:"shipping"},
            {uid:"SHP002", scannedAt:"RAM-52011", scannedTime:new Date(2022, 4, 7, 18, 20).getTime(), status:"arrived"},
            
            {uid:"SHP003", scannedAt:"CNX-2040", scannedTime:new Date(2022, 4, 3, 12, 20).getTime(), status:"created"},
            {uid:"SHP003", scannedAt:"CNX-2040", scannedTime:new Date(2022, 4, 3, 13, 20).getTime(), status:"shipping"},
            {uid:"SHP003", scannedAt:"RAM-52011", scannedTime:new Date(2022, 4, 4, 18, 20).getTime(), status:"arrived"},
            {uid:"SHP003", scannedAt:"RAM-52011", scannedTime:new Date(2022, 4, 5, 8, 20).getTime(), status:"shipping"},
            {uid:"SHP003", scannedAt:"LKB-1003", scannedTime:new Date(2022, 4, 5, 9, 20).getTime(), status:"completed"},

            {uid:"SHP004", scannedAt:"LKB-1003", scannedTime:new Date(2022, 4, 2, 9, 20).getTime(), status:"created"},
            {uid:"SHP004", scannedAt:"LKB-1003", scannedTime:new Date(2022, 4, 3, 12, 20).getTime(), status:"shipping"},
            {uid:"SHP004", scannedAt:"RAM-52011", scannedTime:new Date(2022, 4, 3, 13, 20).getTime(), status:"arrived"},

            {uid:"SHP005", scannedAt:"RAM-52011", scannedTime:new Date(2022, 4, 3, 7, 20).getTime(), status:"created"},
            {uid:"SHP005", scannedAt:"RAM-52011", scannedTime:new Date(2022, 4, 5, 12, 20).getTime(), status:"shipping"},
            {uid:"SHP005", scannedAt:"LKB-1003", scannedTime:new Date(2022, 4, 5, 14, 20).getTime(), status:"arrived"},

            {uid:"SHP006", scannedAt:"LKB-1003", scannedTime:new Date(2022, 4, 7, 15, 20).getTime(), status:"created"},
            {uid:"SHP006", scannedAt:"LKB-1003", scannedTime:new Date(2022, 4, 8, 7, 20).getTime(), status:"shipping"},
            {uid:"SHP006", scannedAt:"RAM-52011", scannedTime:new Date(2022, 4, 8, 10, 20).getTime(), status:"arrived"},

            {uid:"SHP007", scannedAt:"LKB-1003", scannedTime:new Date(2022, 4, 9, 7, 20).getTime(), status:"created"},

            {uid:"SHP008", scannedAt:"LKB-1003", scannedTime:new Date(2022, 4, 9, 9, 20).getTime(), status:"created"},

            {uid:"SHP009", scannedAt:"LKB-1003", scannedTime:new Date(2022, 4, 9, 11, 20).getTime(), status:"created"},

            {uid:"SHP010", scannedAt:"LKB-1003", scannedTime:new Date(2022, 4, 9, 11, 20).getTime(), status:"created"},

            {uid:"SHP011", scannedAt:"LKB-1003", scannedTime:new Date(2022, 4, 9, 12, 20).getTime(), status:"created"},

            {uid:"SHP012", scannedAt:"LKB-1003", scannedTime:new Date(2022, 4, 9, 20, 20).getTime(), status:"created"},

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
        var result = []
        console.log(stock, shipped)
        timeInterval.forEach( (t, index )=> {
            let date = new Date(t)
            console.log( date.toLocaleDateString(), this.getCountShipmentAtTime(stock, t), this.getCountShipmentAtTime(shipped, t))
            let temp = {x:date.getTime(), y:this.getCountShipmentAtTime(stock, t) - this.getCountShipmentAtTime(shipped, t)}
            result.push(temp)
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