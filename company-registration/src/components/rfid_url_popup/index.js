import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";

import "../../assets/style/style.css"
import "../../assets/style/login.css"

import StaffAccountService from "../../services/StaffAccountService";
import StringValidator from "../../utils/StringValidator";
import { Button } from "react-bootstrap";

export const RfidUrlPopup = ({setOpenPopup,  handleConfirm, handleCancel }) => {
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const [rfidUrl, setRfidUrl] = useState('')
    const [warning, setWarning] = useState(null)
    useEffect(() => {
        let temp =  localStorage.getItem("rfidUrl")
        if (temp ) {
            setRfidUrl(temp)
        }
    }, [])

    const handleChangeUrl = (e) => {
        setRfidUrl( e.target.value )
    }
    

    async function handleSubmit(e) {
        e.preventDefault()
        var invalidUrl =StringValidator.validateRfidUrl(rfidUrl);
        
        if ( invalidUrl ) {
            setWarning(invalidUrl)
        } 
        else {
            let temp = rfidUrl
            if (rfidUrl[rfidUrl.length - 1] == '/') {
                temp = rfidUrl.slice(0, -1)
            }
            handleConfirm(temp)
            // setUrl(temp)
            // localStorage.setItem("rfidUrl", temp)
        }
    }
 
    return (
        <div className="popupBackground">
            <div className="startPageContainer"  style={{display: "flex", "justify-content": "center"}}>
                <div className="logo mb-lg-5 mb-md-2">
                    <h3 className="h3-logo">Change RFID Scan API URL</h3>
                </div>
                

                { warning &&
                 <div className="alert alert-danger">
                    {warning}
                </div>}
                <form onSubmit={handleSubmit}>
                    <div className="textInputContainerCol mb-lg-4 mb-md-2"> 
                        <label className="inputLabel" for="rfidUrl">RFID Scan API URL</label>
                        <input type="text" id="rfidUrl" name="rfidUrl" placeholder="Enter your API URL." value={rfidUrl} onChange={handleChangeUrl}></input>
                    </div>
                    <input className="signinBtn" type="submit" value="Confirm"></input>
                    <input className="cancelBtn" type="button" onClick={()=> {
                        handleCancel()
                        }} value="Cancel"></input>
                    {/* <Button style={{width:"100%"}} variant="secondary" onClick={() => setOpenPopup(false)}>Cancel</Button> */}
                </form>
            </div>
        </div>
    );
}