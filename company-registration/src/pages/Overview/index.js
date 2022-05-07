import React, { useState, useEffect } from "react";

import axios from 'axios';

import "../../assets/style/overview.css"
import "../../assets/style/style.css"

import { Card } from "../../components/card";
import { FrequencyChart } from "../../components/chart";
import { NodeSelectPopup } from "../../components/node_select_popup";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export const OverviewPage = (props) => {
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const [currentNodeCode, setCurrentNodeCode] = useState(null)
    const [buttonPopup, setButtonPopup] = useState(false);
    // useEffect(() => {
    //     setUserData(props.userData)
    //     console.log(props.userData)
    //   }, [userData]);

    useState(() => {
        var node = eval('('+localStorage.getItem("currentNode")+')')
        if (node) {
            setCurrentNodeCode(node.nodeCode)
        } else {
            setCurrentNodeCode('-')
        }
    }, [])

    function handlePopupConfirm(currentNode) {
        localStorage.setItem("currentNode", JSON.stringify(currentNode))
        setCurrentNodeCode(eval('('+localStorage.getItem("currentNode")+')').nodeCode)
        setButtonPopup(false)
    }
    
    function handlePopupCancel() {
        console.log(localStorage)
        setButtonPopup(false)
    }

    return (
        <div className="overview content-main-container">
            <div className="content-title-container">
                <h1>Overview</h1>
                <button onClick={() => setButtonPopup(true)} className="node-select-button">
                    <FontAwesomeIcon icon={faPen} className="node-select-icon"/>Current Node: {currentNodeCode}
                </button>
            </div>
            <div className="body-top">
                <Card title="In transit" info="0"/>
                <Card title="Shipped" info="0"/>
                <Card title="Delayed" info="0"/>
                <Card title="On hold" info="0"/>
            </div>
            <div className="body-main">
                
                <div className="chart-container">
                    <div className="chart-title-container">
                        <h3 className="chart-title">Today's shipping</h3>
                        <p>25 May 2022</p>
                    </div>
                    <div className="body-chart-container">
                        <FrequencyChart/>
                    </div>
                </div>
                <div className="chart-info-right">
                    <hr/>
                    <div className="chart-item">
                        <p>Placeholder</p>
                    </div>
                    <hr/>
                    <div className="chart-item">
                        <p>Placeholder</p>
                    </div>
                    <hr/>
                    <div className="chart-item">
                        <p>Placeholder</p>
                    </div>
                    <hr/>
                </div>
            </div>
            { buttonPopup && <NodeSelectPopup setOpenPopup={setButtonPopup} handleConfirm={handlePopupConfirm} handleCancel={handlePopupCancel}/>}
        </div>
    );
}