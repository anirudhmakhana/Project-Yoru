import axios from "axios";
import { ethers } from "ethers";
import abi from "../utils/TrackingContract.json"

class ShipmentService {
    constructor() {
        // this.contractAddress = "0x70CB7E6DEFd1a235Ff11a45e4a382F6E0dFC7DB7"
        // this.contractABI = abi
        // this.externalProvider = new ethers.providers.JsonRpcProvider(
        //     `https://rinkeby.infura.io/v3/6c9af8d40e4d4ff0bad46e193bc1aa8b`,
        //     "rinkeby"
        //   );
        // this.shipmentContract = new ethers.Contract(this.contractAddress, this.contractABI.abi, this.externalProvider);
        this.shipments = [
            {uid:"SHP001", description:"Stainless Steel 2 rolls", originNode:"LKB-1003", status:"shipping", 
            currentNode:"LKB-1003", scannedTime:1651393111, companyCode:"YORU", destinationNode:"CNX-2040"},

            {uid:"SHP002", description:"PS5 2EA, Nintendo Switch 1EA", originNode:"LKB-1003", status:"arrived", 
            currentNode:"RAM-52011", scannedTime:1651220311, companyCode:"YORU", destinationNode:"BANG-RAK-HQ1"},

            {uid:"SHP003", description:"Fender Telecaster Jim Root", originNode:"CNX-2040", status:"completed", 
            currentNode:"LKB-1003", scannedTime:1651306711, companyCode:"YORU", destinationNode:"LKB-1003"}
        ]

        this.scannedData = [
            {uid:"SHP001", scannedAt:"LKB-1003", scannedTime:1651385911, status:"created"},
            {uid:"SHP001", scannedAt:"LKB-1003", scannedTime:1651393111, status:"shipping"},

            {uid:"SHP002", scannedAt:"LKB-1003", scannedTime:1651120311, status:"created"},
            {uid:"SHP002", scannedAt:"LKB-1003", scannedTime:1651217311, status:"shipping"},
            {uid:"SHP002", scannedAt:"RAM-52011", scannedTime:1651220311, status:"arrived"},
            
            {uid:"SHP003", scannedAt:"CNX-2040", scannedTime:1651203711, status:"created"},
            {uid:"SHP003", scannedAt:"CNX-2040", scannedTime:1651205011, status:"shipping"},
            {uid:"SHP003", scannedAt:"RAM-52011", scannedTime:1651300711, status:"arrived"},
            {uid:"SHP003", scannedAt:"RAM-52011", scannedTime:1651303711, status:"shipping"},
            {uid:"SHP003", scannedAt:"LKB-1003", scannedTime:1651306711, status:"completed"},
        ]
    }
    compareTime = ( a, b ) => {
    if ( a.scannedTime < b.scannedTime ){
        return -1;
    }
    if ( a.scannedTime > b.scannedTime ){
        return 1;
    }
    return 0;
    }

    async getAllShipmentsBlock() {
        
    }
    async getAllShipments(token) {

        const response = await axios.get('http://localhost:4000/shipment/', {headers:{"x-access-token":token}})
        .catch((error) => {
            throw error
        })
        
        return response
        // const filter = this.shipmentContract.on("NewScanEvent", (from, timestamp, _uid ,_productName, _producer, _status) => {
        //   console.log (
        //     {
        //       from: from,
        //       timestamp: timestamp,
        //       _uid: _uid,
        //       productName : _productName,
        //       producer: _producer,
        //       status: _status
        //     }
        //   )
        // });
        // const startBlock = 10526213; // Contract creation block.
        // const endBlock = await this.externalProvider.getBlockNumber();
        
        // console.log("hello", endBlock)
    
        // const queryResult = await this.shipmentContract.queryFilter(filter, startBlock, endBlock);
        
        // const shipmentsUntilNow = queryResult.map(matchedEvent => {
        //   return (
        //     {

        //       from: matchedEvent.args[0],
        //       _uid: matchedEvent.args[2],
        //       productName : matchedEvent.args[3],
        //       producer: matchedEvent.args[4],
        //       status: matchedEvent.args[5],
        //     }
        //   )        
        // })
    
        // console.log(shipmentsUntilNow)
    
        // return (shipmentsUntilNow.reverse())
        // return {data:this.shipments}
    }
    
    async getShipmentByIdChain( shipmentId, walletPublicKey, token ) { 
        // const response = await axios.get("http://localhost:4010/shipment/" + shipmentId + "/" + walletPublicKey, 
        // {headers:{"x-access-token":token}})
        // .catch((error) => {
        //     return error
        // })
        // return response
        var temp = null
        this.shipments.forEach( (shipment,ind) => {
            if (shipment.uid == shipmentId ) {
                temp = ind
            }
        })
        return {data:this.shipments[temp]}
    }

    async getShipmentById( shipmentId, token ) { 
        const response = await axios.get("http://localhost:4000/shipment/" + shipmentId , 
        {headers:{"x-access-token":token}})
        .catch((error) => {
            return error
        })
        return response
    
    }


    async getStockByNode( nodeCode, token ) {
        var result = []
        for( let i = 0; i < this.shipments.length; i++ ) {
            if ( this.shipments[i].status == "arrived" && this.shipments[i].currentNode == nodeCode) {
                result.push(this.shipments[i])
            }
        }
        console.log(result)
        return {data:result}
    }

    async getPathByShipmentId( shipmentId, token) {
        var result = []
        for (let i = 0; i < this.scannedData.length; i++ ){
            if ( this.scannedData[i].uid == shipmentId && this.scannedData[i].status != "shipping") {
                result.push(this.scannedData[i])
            }
        }
        return {data:result.sort((a,b) => a.scannedTime - b.scannedTime)}
    }

    async shipmentIdExisted( shipmentId, token ) {
        for ( let i = 0; i < this.shipments.length;i++) {
            if ( this.shipments[i].uid == shipmentId) {
                return {data:true}
            }
        }
        return {data:false}
    }
}

export default new ShipmentService()