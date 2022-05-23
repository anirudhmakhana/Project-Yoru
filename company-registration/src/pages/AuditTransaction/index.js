import React, { useEffect, useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import DateUtils from "../../utils/DateUtils";
import Dropdown from "react-bootstrap/Dropdown";

import Table from 'react-bootstrap/Table'
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    InfoWindow,
    Autocomplete,
    DirectionsRenderer,
    Polyline
  } from "@react-google-maps/api";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

import "../../assets/style/style.css"

import NodeDataService from '../../services/NodeDataService';
import ShipmentService from '../../services/ShipmentService';
import GraphService from '../../services/GraphService';
import { LineChart } from '../../components/linechart'; 
import { ChartDatePicker } from '../../components/date_picker';
import StringValidator from '../../utils/StringValidator';

export const AuditTransactionPage = () => {
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const [transactionHash, setTransactionHash] = useState('')
    const [warning, setWarning] = useState(null)
    const [transactionData, setTransactionData] = useState([])

    function handleChangeTxnHash(e) {
        setTransactionHash(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        var invalidTxnHash = StringValidator.validateTxnHash(transactionHash);
        if (invalidTxnHash) {
            setWarning(invalidTxnHash)
        }
         else {
            ShipmentService.auditTransaction(transactionHash, userData.token)
            .then( res => {
                setWarning(null)
                setTransactionData(res.data)
            })
            .catch( error => {
                setTransactionData([])
                setWarning("Cannot find any transaction!")
            }) 
            
        }
    }

    return (
        <div className="content-main-container">
            <div className="content-title-container">
                <h1>Audit Transaction</h1>
            </div>
            <div className="detailed-main-container p-lg-4 p-md-2">
                { warning &&
                    <div className="alert alert-danger mb-lg-4 mt-lg-4">
                        {warning}
                </div>}
                <form onSubmit={handleSubmit}>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="transactionHash">Transaction Hash</label>
                        <input type="text" id="transactionHash" name="transactionHash" placeholder="e.g. 0x9e2304a9c..." onChange={handleChangeTxnHash} value={transactionHash}></input>
                    </div>
                    <input className="signinBtn" type="submit" value="Audit"></input>
                    
                </form> 

                {transactionData.map( line => <p style={{"color":"#000000","text-align":"left", 'marginBottom':'1%'}}><b>{line.label}:</b> {line.val}</p>)}
            </div>
            
        </div>
    );
} 
