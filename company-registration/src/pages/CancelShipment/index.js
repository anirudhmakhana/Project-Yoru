import React, { useState } from "react";

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
                    <label className="inputLabel">Shiment ID: {shipmentId}</label>
                    <label className="inputLabel">Scan RFID tag</label>
                    <input className="signinBtn" type="submit" value="Scan" style={{minWidth: "30vw"}} onClick={() => {
                            RfidService.makeScan()
                            .then ( res => {
                                setShipmentId(res.data.data.uid)
                            })
                        }}>
                    </input>

                    <input className="signinBtn" type="submit" value="Cancel" style={{marginTop: "10%", backgroundColor: "red"}}></input>
                </div>
            </div>
        </div>
    );
}