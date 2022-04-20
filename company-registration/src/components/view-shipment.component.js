import React, { Component, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { ethers } from "ethers";

import abi from "../utils/TrackingContract.json"

export default function ViewShipment() {
    const [allShipments, setAllShipments] = useState([])

    //contract variables
    const contractAddress = "0xD3Dd4FD11B1Bad20E32436140532869BE2542554"
    const contractABI = abi
    useEffect(
        React.useCallback(() => {
            getAllShipments()
        })
    );
    
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

    return (
        <div className="form-wrapper mt-5">
            {allShipments.map(({productName, producer, _uid, status}) => <p>{productName} {producer} {_uid} {status}</p>)}
        </div>
    )
}

