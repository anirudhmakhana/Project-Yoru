import axios from "axios";
import NodeDataService from "./NodeDataService";
import ShipmentService from "./ShipmentService";
import DateUtils from "../utils/DateUtils";
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

            {uid:"SHP013", scannedAt:"LKB-1003", scannedTime:new Date(2022, 0, 1, 9, 20).getTime(), status:"created"},

            {uid:"SHP014", scannedAt:"LKB-1003", scannedTime:new Date(2022, 4, 1, 9, 20).getTime(), status:"created"},

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

        this.graphTimeRange = ['day', 'week','month', 'year']
        this.xAxisLabel = {week:"Date", month:"Day", year:"Month", day:"Hour"}
        this.yAxisLabel = {shipping: "Shipped",stock:"Stock", created: "Created", completed:"Completed"}
        this.graphName = {shipping: "Shipments Shipping",stock:"Stocking Shipments", created:"Created Shipments", completed:"Completed Shipments"}
        this.graphTypes = ['shipping', 'stock', 'created', 'completed']
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
        const response = await ShipmentService.scanByNode(nodeCode, token)
        if (response) {
            const scannedData = response.data
            // console.log(scannedData)
            scannedData.forEach((v, i) => {
                if (v.scannedAt == nodeCode && (v.status == "created" || v.status == "arrived" )){
                    stock.push(scannedData[i])
                }
            })
            var shipped = []
            scannedData.forEach((v, i) => {
                if (v.scannedAt == nodeCode && (v.status == "shipping")){
                    shipped.push(scannedData[i])
                }
            })
            var result = []
            // console.log(stock, shipped)
            timeInterval.forEach( (t, index )=> {
                let date = new Date(t)
                // console.log( date.toLocaleDateString(), this.getCountShipmentAtTime(stock, t), this.getCountShipmentAtTime(shipped, t))
                let temp = {x:date.getTime(), y:this.getCountShipmentAtTime(stock, t) - this.getCountShipmentAtTime(shipped, t)}
                result.push(temp)
            })
            // console.log(result)
            return {data:result}
            
        }
        
    }

    async getCompanyStockByTime( companyCode, timeInterval, token) {
        const res = await NodeDataService.getNodeByCompany( companyCode, token)
        .catch((error) => {
            throw error
        })
        const nodes = res.data
        // console.log('nodes',nodes)
        var temp_res = {}
        timeInterval.forEach(t => {
            temp_res[t] = 0
        })
        var result = []
        for(let i = 0; i < nodes.length; i++) {
            var node_res = await this.getNodeStockByTime(nodes[i].nodeCode, timeInterval, token)
            // console.log(node_res)
            node_res.data.forEach( graph_data => {
                temp_res[graph_data.x] = temp_res[graph_data.x] + graph_data.y
            })
        }
        // console.log('graph',temp_res)
    
        timeInterval.forEach( t => {
            // console.log(temp_res[t])
            result.push({x:t, y:temp_res[t]})
        })

          

        
        // console.log(result)
        return {data:result}
        
        // axios.get('http://localhost:4000/node/', {headers:{"x-access-token":token}})
        // .then( response => {

        // })
        // .catch((error) => {
        //     throw error
        // })
        // return response
    }

    // need to input extra start time before the actual time 
    // e.g. last 7 days -> input 7 day time interval + 1 day before that 7 days
    async getNodeGraphByTimeStatus( nodeCode, timeInterval, status, token) {
    
        var shipped = []
        const response = await ShipmentService.scanByNode(nodeCode, token)
        if ( response) {
            var scannedData = response.data
            scannedData.forEach((v, i) => {
                if (v.scannedAt == nodeCode && (v.status.toLowerCase() == status.toLowerCase())){
                    shipped.push(scannedData[i])
                }
            })
            var result = []
            // console.log(stock, shipped)
            timeInterval.forEach( (t, index )=> {
                if ( index != timeInterval.length -1 ) {
                    let tPlus1 = timeInterval[index+1]
                    let date = new Date(tPlus1)
    
                    // console.log( date.toLocaleDateString(), this.getCountShipmentAtTime(stock, t), this.getCountShipmentAtTime(shipped, t))
                    let temp = {x:date.getTime(), y:this.getCountShipmentAtTime(shipped, tPlus1) - this.getCountShipmentAtTime(shipped, t) }
                    result.push(temp)

                }
                
            })
            // console.log(result)

            // console.log(result)
            return {data:result}
            
        }
       
        // axios.get('http://localhost:4000/node/', {headers:{"x-access-token":token}})
        // .then( response => {

        // })
        // .catch((error) => {
        //     throw error
        // })
        // return response
    }

    // need to input extra start time before the actual time 
    // e.g. last 7 days -> input 7 day time interval + 1 day before that 7 days
    async getCompanyGraphByTimeStatus( companyCode, timeInterval, status, token) {
        const res = await NodeDataService.getNodeByCompany( companyCode, token)
        .catch((error) => {
            throw error
        })
        const nodes = res.data
        var temp_res = {}
        let temp_time = timeInterval.slice(1)
        // console.log( "interval", timeInterval) 
        // console.log( "temp_time", temp_time)
        temp_time.forEach(t => {
            temp_res[t] = 0
        })
        var result = []
        for( let i = 0; i < nodes.length; i++) {
            var node_res = await this.getNodeGraphByTimeStatus(nodes[i].nodeCode, timeInterval, status, token)
            node_res.data.forEach( graph_data => {
                // console.log(graph_data.x, graph_data.y)
                temp_res[graph_data.x] = temp_res[graph_data.x] + graph_data.y
            })

        }

        temp_time.forEach( t => {
            // console.log(temp_res[t])
            result.push({x:t, y:temp_res[t]})
        })
        

          

        
        // console.log(result)
        return {data:result}
        
        // axios.get('http://localhost:4000/node/', {headers:{"x-access-token":token}})
        // .then( response => {

        // })
        // .catch((error) => {
        //     throw error
        // })
        // return response
    }

    adjustGraphTime(graph_data, graphTimeRange) {
        var adjustedDate = []
        var startDate = null
        var endDate = null
        graph_data.forEach( (data, ind) => {
            let dataDate = new Date(data.x)
            if (graphTimeRange == "day") {
                let dataDate = new Date(data.x)
                adjustedDate.push({x:dataDate.getHours()+":00", y:data.y})
                if (ind == 0) {
                    startDate = dataDate.toLocaleDateString()
                } else if (ind == graph_data.length -1 ) {
                    endDate = dataDate.toLocaleDateString()
                }
            }
            else if (  graphTimeRange == "week") {
                dataDate.setDate(dataDate.getDate() - 1)
                adjustedDate.push({x:dataDate.toLocaleDateString(), y:data.y})
                if (ind == 0) {
                    startDate = dataDate.toLocaleDateString()
                } else if (ind == graph_data.length -1 ) {
                    endDate = dataDate.toLocaleDateString()
                }
            }
            else if ( graphTimeRange == "month" ) {
                dataDate.setDate(dataDate.getDate() - 1)
                adjustedDate.push({x:dataDate.toLocaleDateString(), y:data.y})
                if (ind == 0) {
                    startDate = dataDate.toLocaleDateString()
                } else if (ind == graph_data.length -1 ) {
                    endDate = dataDate.toLocaleDateString()
                }
            }
            else if ( graphTimeRange == "year") {
                let dataDate = new Date(data.x)
                // console.log(dataDate.getMonth(), dataDate.toDateString())
                adjustedDate.push({x:DateUtils.monthNames[dataDate.getMonth() - 1]+"", y:data.y})
                if (ind == 0) {
                    startDate = DateUtils.monthNames[dataDate.getMonth() - 1]+""
                } else if (ind == graph_data.length -1 ) {
                    endDate = DateUtils.monthNames[dataDate.getMonth() - 1]+""
                }
            }
        })
        // console.log("TEST", adjustedDate)
        return {adjustedDate: adjustedDate, startDate:startDate, endDate:endDate}
    }

    async generateGraph(graphType, graphTimeRange, token, companyCode = null, nodeCode = null) {
        var temp = new Date()
        var curDate = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate())
        var timeInterval = []
        var timeRange = null
        var graphData = null
        if (graphTimeRange == "day") {
            timeRange = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 1).getTime() - 
                        new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 0).getTime()
            for ( let i = 0; i <= 23; i++ ) {
                let temp = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), i) 
                timeInterval.push(temp.getTime())
            }
        }
        else if ( graphTimeRange == "week") {
            timeRange = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()).getTime() - 
                        new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() - 1).getTime()
            for ( let i = 0; i <= 6; i++ ) {
                let temp = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() - i + 1) 
                timeInterval.push(temp.getTime())
            }
            timeInterval = timeInterval.reverse()
        }
        else if ( graphTimeRange == "month") {
            timeRange = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()).getTime() - 
                        new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() - 1).getTime()
            let noOfDays = DateUtils.daysInMonth(curDate.getMonth(), curDate.getFullYear())
            for ( let i = 0; i <= noOfDays - 1; i++ ) {
                let temp = new Date(curDate.getFullYear(), curDate.getMonth(), noOfDays - i + 1) 
                timeInterval.push(temp.getTime())
            }
            timeInterval = timeInterval.reverse().slice(0, curDate.getDate())
        }
        else if ( graphTimeRange == "year") {
            timeRange = new Date(curDate.getFullYear(), 1).getTime() - 
                        new Date(curDate.getFullYear(), 0 ).getTime()
            // console.log(new Date(2020, 0).toDateString())
            for ( let i = 1; i <= curDate.getMonth() + 1; i++ ) {
                let temp = new Date(curDate.getFullYear(), i) 
                timeInterval.push(temp.getTime())
            }
        }
        
        if (companyCode ) {
            if (timeRange && (graphType == "shipping" || graphType == "created" || graphType == "completed")) {
                timeInterval.unshift(timeInterval[0] - timeRange)
                // timeInterval.forEach(t => console.log(new Date(t).toLocaleString()))

                const res_graph = await this.getCompanyGraphByTimeStatus( companyCode, timeInterval, graphType, token)
                graphData = this.adjustGraphTime(res_graph.data, graphTimeRange)
            }
            else if (graphType == "stock" ) {    
                const res_graph = await this.getCompanyStockByTime( companyCode, timeInterval, token)
                graphData = this.adjustGraphTime(res_graph.data, graphTimeRange)
            }
        }
        else if ( nodeCode) {
            if (timeRange && (graphType == "shipping" || graphType == "created" || graphType == "completed")) {
                
                timeInterval.unshift(timeInterval[0] - timeRange)
                const res_graph = await this.getNodeGraphByTimeStatus( nodeCode, timeInterval, graphType, token)
                graphData = this.adjustGraphTime(res_graph.data, graphTimeRange)

            }
            else if (graphType == "stock" ) {    
                const res_graph = await this.getNodeStockByTime( nodeCode, timeInterval, token)
                graphData = this.adjustGraphTime(res_graph.data, graphTimeRange)
            }
        }
        // console.log(graphData)
        var highest = {date:graphData.adjustedDate[0].x+'', value: graphData.adjustedDate[0].y}
        var lowest =  {date:graphData.adjustedDate[0].x+'', value: graphData.adjustedDate[0].y}
        var total = graphData.adjustedDate[0].y
        var count = 1
        var original = graphData.adjustedDate[0].y
        var latest = graphData.adjustedDate[0].y
        graphData.adjustedDate.slice(1).forEach( d => {
            if (d.y > highest.value) { highest = {date: d.x+'', value:d.y} }
            else if (d.y == highest.value) { highest.date = highest.date + ', ' + d.x}
            if (d.y < lowest.value) {lowest = {date: d.x+'', value:d.y}}
            else if (d.y == lowest.value) { lowest.date = lowest.date + ', ' + d.x}

            total += d.y
            count += 1
            latest = d.y
        })
        var change = latest - original
        change = change / original
        return {data:{graph:graphData.adjustedDate, startDate: graphData.startDate, endDate: graphData.endDate, highest:highest,
             lowest:lowest, average:total/count, change: change, percentageChange: change*100, total:total}}
    }
}

export default new GraphService()