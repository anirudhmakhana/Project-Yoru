import React from "react";

import "../../assets/style/style.css"

import { Titlebar } from "../../components/titlebar";

export const CancelSHP = () => {
    return (
        <div className="content-main-container">
            <Titlebar pageTitle="Cancel Shipment"/>
            <div className="detailed-main-container" style={{width: "min-content"}}>
                <div className="textInputContainerCol">
                    <label className="inputLabel">Scan RFID tag</label>
                    <input className="signinBtn" type="submit" value="Scan" style={{minWidth: "30vw"}}></input>

                    <input className="signinBtn" type="submit" value="Cancel" style={{marginTop: "10%", backgroundColor: "red"}}></input>
                </div>
            </div>
        </div>
    );
}