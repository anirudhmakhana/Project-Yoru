import React, { useState } from "react";
import { Button } from "react-bootstrap";

import "../../assets/style/style.css"

import { Titlebar } from "../../components/titlebar";

import RfidService from "../../services/RfidService";

export const CancelSHP = () => {
    const [shipmentId, setShipmentId] = useState("");

    return (
        <div className="content-main-container">
            <Titlebar pageTitle="Cancel Shipment"/>
            <div className="detailed-main-container" style={{width: "min-content"}}>
                <div className="textInputContainerCol">
                    <label className="inputLabel">Shipment ID: {shipmentId}</label>
                    <label className="inputLabel">Scan RFID tag</label>
                    <Button className="signinBtn" style={{minWidth: "30vw"}} onClick={() => {
                            RfidService.makeScan()
                            .then ( res => {
                                setShipmentId(res.data.data.uid)
                            })
                        }}>Scan</Button>

                    <Button className="signinBtn" style={{marginTop: "10%", backgroundColor: "red"}}>Cancel</Button>
                </div>
            </div>
        </div>
    );
}