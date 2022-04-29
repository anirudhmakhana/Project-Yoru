import React, { Component, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { ethers } from "ethers";

import ShipmentService from '../services/ShipmentService'
import CompanyService from '../services/CompanyService'

export default function TempViewShipment(props) {
    const [allShipments, setAllShipments] = useState([])
    const [shipment, setShipment] = useState({"0":"", "1":"", "2":""})
    const [shipmentId, setShipmentId] = useState('')
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    //contract variables
    
    useEffect(() => {
            // ShipmentService.getAllShipments()
            // .then( res => setAllShipments(res))
        }
    ,[allShipments] );

    async function handleSubmit(e) {
      e.preventDefault()
      if (shipmentId.length < 1 ) {
          console.log('Please enter shipment ID.')
      } 
      CompanyService.getCompanyByCode(userData.companyCode, userData.token)
      .catch( error =>  {
        console.log("Cannot find company by code")
      })
      .then( res => {
          console.log(res)
          ShipmentService.getShipmentById(shipmentId, res.data.walletPublicKey, userData.token)
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
            {allShipments.slice(0, 7).map(({productName, producer, _uid, status}) => <p>{productName} {producer} {_uid} {status}</p>)}
        </div>
    )
}

