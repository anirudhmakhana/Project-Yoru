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
    const contractAddress = "0x1e56630De2CCE2D849A6CF387ea6A87b7Aa060A7"
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
        
    
        const filter = shipmentContract.on("NewScanEvent", (from, timestamp, _uid) => {
          console.log (
            {
              from : from,
              timestamp: timestamp,
              _uid: _uid
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
              timestamp: matchedEvent.args[1],
              _uid: matchedEvent.args[2]
            }
          )        
        })
    
        console.log(queryResult)
    
        setAllShipments(shipmentsUntilNow.reverse())
      }

    return (
        <div className="form-wrapper mt-5">
            {allShipments.map(({from, timestamp, _uid}) => <p>{from} {timestamp} {_uid}</p>)}
        </div>
    )
}

