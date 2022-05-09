import React, { useState, useEffect } from "react";

import axios from 'axios';

import "../../assets/style/overview.css"
import "../../assets/style/style.css"
import NodeDataService from '../../services/NodeDataService';
import GraphService from '../../services/GraphService';

import { Card } from "../../components/card";
import { FrequencyChart } from "../../components/chart";
import { NodeSelectPopup } from "../../components/node_select_popup";
import { Titlebar } from "../../components/titlebar";

export const OverviewPage = (props) => {
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const [currentNodeCode, setCurrentNodeCode] = useState(null)
    const [buttonPopup, setButtonPopup] = useState(false);
    const [dateGraphData, setDateGraphData] = useState(null)
    const [hourGraphData, setHourGraphData] = useState(null)
    const [currentDate, setCurrentDate] = useState( new Date() )
    // useState(() => {
    //     var node = eval('('+localStorage.getItem("currentNode")+')')
    //     if (node) {
    //         setCurrentNodeCode(node.nodeCode)
    //     } else {
    //         setCurrentNodeCode('-')
    //     }
    // }, [])

    useEffect(() => {
        var temp = new Date()
        var curDate = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate())
        var timeInterval = []
        for ( let i = 0; i <= 6; i++ ) {
            let temp = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() - i + 1) 
            timeInterval.push(temp.getTime())
        }

        var hourInterval = []
        for ( let i = 0; i <= 23; i++ ) {
            let temp = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), i) 
            hourInterval.push(temp.getTime())
        }
        console.log(timeInterval)
        
        GraphService.getAllStockByTime( timeInterval.reverse(), userData.token)
        .then(res_graph => {
            console.log(res_graph)
            var adjustedDate = []
            res_graph.data.forEach( data => {
                let dataDate = new Date(data.x)
                dataDate.setDate(dataDate.getDate() - 1)
                adjustedDate.push({x:dataDate.toLocaleDateString(), y:data.y})
            })
            setDateGraphData(adjustedDate)
        })
        .catch( err => {
            console.log(err)
        })
            // GraphService.getNodeStockByTime( res.data.nodeCode, hourInterval, userData.token)
            // .then(res_graph => {
            //     console.log(typeof res_graph.data[0].y)
            //     var adjustedDate = []
            //     res_graph.data.forEach( data => {
            //         let dataDate = new Date(data.x)
            //         // dataDate.setHours(dataDate.getHours())
            //         adjustedDate.push({x:dataDate.getHours()+"", y:data.y})
            //     })
            //     setHourGraphData(adjustedDate)
            // })
        
        
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
            {/* <div className="content-title-container">
                <h1>Overview</h1>
                <button onClick={() => setButtonPopup(true)} className="node-select-button">
                    <FontAwesomeIcon icon={faPen} className="node-select-icon"/>Current Node: {currentNodeCode}
                </button>
            </div> */}
            <Titlebar pageTitle="Overview" setExternalPopup={setButtonPopup}/>
            <div className="body-top">
                <Card title="In transit" info="0"/>
                <Card title="Shipped" info="0"/>
                <Card title="Delayed" info="0"/>
                <Card title="On hold" info="0"/>
            </div>
            <div className="body-main">
                
                <div className="chart-container">
                    <div className="chart-title-container">
                        <h3 className="chart-title">Last 7 days stocking</h3>
                        <p>{new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6)
                        .toLocaleDateString()} - {currentDate.toLocaleDateString()}</p>
                    </div>
                    <div className="body-chart-container">
                        { dateGraphData && <FrequencyChart chartDataPrim={dateGraphData} indicator={"Stock"}/>}
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
            { buttonPopup && <NodeSelectPopup setOpenPopup={setButtonPopup} handleConfirm={handlePopupConfirm} handleCancel={handlePopupCancel} />}
        </div>
    );
}