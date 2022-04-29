import axios from "axios";
import { ethers } from "ethers";
import abi from "../utils/TrackingContract.json"

class ShipmentService {
    constructor() {
        this.contractAddress = "0xD3Dd4FD11B1Bad20E32436140532869BE2542554"
        this.contractABI = abi
    }
    
    async getAllShipments() {

        const externalProvider = new ethers.providers.JsonRpcProvider(
          `https://rinkeby.infura.io/v3/6c9af8d40e4d4ff0bad46e193bc1aa8b`,
          "rinkeby"
        );
        const shipmentContract = new ethers.Contract(this.contractAddress, this.contractABI.abi, externalProvider);
        
    
        const filter = shipmentContract.on("NewScanEvent", (from, timestamp, _uid ,_productName, _producer, _status) => {
          console.log (
            {
              from: from,
              timestamp: timestamp,
              _uid: _uid,
              productName : _productName,
              producer: _producer,
              status: _status
            }
          )
        });
        const startBlock = 10526213; // Contract creation block.
        const endBlock = await externalProvider.getBlockNumber();
        
        console.log("hello", endBlock)
    
        const queryResult = await shipmentContract.queryFilter(filter, startBlock, endBlock);
        
        const shipmentsUntilNow = queryResult.map(matchedEvent => {
          return (
            {

              from: matchedEvent.args[0],
              _uid: matchedEvent.args[2],
              productName : matchedEvent.args[3],
              producer: matchedEvent.args[4],
              status: matchedEvent.args[5],
            }
          )        
        })
    
        console.log(shipmentsUntilNow)
    
        return (shipmentsUntilNow.reverse())
    }
    
    async getShipmentById( shipmentId, walletPublicKey, token ) { 
        const response =axios.get("http://localhost:4010/shipment/" + shipmentId + "/" + walletPublicKey, 
        {headers:{"x-access-token":token}})
        .catch((error) => {
            return error
        })
        return response

    }
}

export default new ShipmentService()