import React, { Component, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { ethers } from "ethers";

import abi from "../utils/TrackingContract.json"

export default function TempViewShipment(props) {
    const [allShipments, setAllShipments] = useState([])
    const [shipment, setShipment] = useState({"0":"", "1":"", "2":""})
    const [shipmentId, setShipmentId] = useState('')
    const [userData, setUserData] = useState(null)
    //contract variables
    const contractAddress = "0xD3Dd4FD11B1Bad20E32436140532869BE2542554"
    const contractABI = abi
    useEffect(
        React.useCallback(() => {
            // getAllShipments()
            setUserData(props.userData)
            console.log(props.userData)
        })
    ,[userData] );
    
    async function getAllShipments() {

        const externalProvider = new ethers.providers.JsonRpcProvider(
          `https://rinkeby.infura.io/v3/6c9af8d40e4d4ff0bad46e193bc1aa8b`,
          "rinkeby"
        );
        const shipmentContract = new ethers.Contract(contractAddress, contractABI.abi, externalProvider);
        
    
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
    
        setAllShipments(shipmentsUntilNow.reverse())
      }

    async function handleSubmit(e) {
      e.preventDefault()
      if (shipmentId.length < 1 ) {
          console.log('Please enter shipment ID.')
      } 
      axios.get("http://localhost:4000/company/" + userData.companyCode,
      {headers:{"x-access-token":userData.token}}) 
      .catch( error =>  {
        console.log("Cannot find company by code")
      })
      .then( res => {
          console.log(res)
          axios.get("http://localhost:4010/shipment/" + shipmentId + "/" + res.data.walletPublicKey, 
          {headers:{"x-access-token":userData.token}}) 
          .catch( error_shipment => {
              console.log("Shipment not found!")
          }) 
          .then( res_shipment =>{
              console.log(res_shipment.data)
              setShipment(res_shipment.data)
          }
          )
      })

      

    }
    function handleChangeId(e) {
        setShipmentId(e.target.value)
    }

    return (
        <div className="form-wrapper mt-5">
          <form onSubmit={handleSubmit}>
            <div className="textInputContainerCol">
                <label className="inputLabel" for="shipmentId">Shipment ID</label>
                <input type="text" id="shipmentId" name="shipmentId" placeholder="Shipment ID" onChange={handleChangeId} value={shipmentId}></input>
            </div>
            
            <input className="viewBtn" type="submit" value="View Shipment"></input>
            
        </form>
            <p className="mt-5"> {shipment["0"]} </p>
            <p>{shipment["1"]} </p>
            <p className="mb-5">{shipment["2"]}</p>
            <p>-------------------------------</p>
        </div>
    )
}

