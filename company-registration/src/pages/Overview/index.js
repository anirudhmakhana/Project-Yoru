import React, { useState, useEffect } from "react";

import axios from 'axios';
import Dropdown from "react-bootstrap/Dropdown";

import "../../assets/style/overview.css"
import "../../assets/style/style.css"
import NodeDataService from '../../services/NodeDataService';
import GraphService from '../../services/GraphService';

import { Card } from "../../components/card";
import { FrequencyChart } from "../../components/chart";
import { NodeSelectPopup } from "../../components/node_select_popup";
import { Titlebar } from "../../components/titlebar";
import DateUtils from "../../utils/DateUtils";
import DatePicker from 'react-datepicker'
import ShipmentService from "../../services/ShipmentService";
import { EditProfilePopup } from "../../components/edit_profile_popup";
// In this case, January = 0


export const OverviewPage = (props) => {
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const [currentNodeCode, setCurrentNodeCode] = useState(eval('('+localStorage.getItem("currentNode")+')').nodeCode)
    const [nodePopup, setNodePopup] = useState(false);
    const [editProfPopup, setEditProfPopup] = useState(false);

    const [dateGraphData, setDateGraphData] = useState(null)
    // const [hourGraphData, setHourGraphData] = useState(null)
    const [currentDate, setCurrentDate] = useState( new Date() )
    const [graphTimeRange, setGraphTimeRange] = useState("day")
    const [graphType, setGraphType] = useState("shipped")
    const [graphName, setGraphName] = useState({shipped: "Shipments Shipping",stock:"Stocking Shipments"})
    const [yAxisLabel, setYAxisLabel] = useState({shipped: "Shipped",stock:"Stock"})

    const [xAxisLabel, setXAxisLabel] = useState({week:"Date", month:"Day", year:"Month", day:"Hour"})
    const [completedCount, setCompletedCount] = useState(0)
    const [stockCount, setStockCount] = useState(0)
    const [incompleteCount, setIncompleteCount] = useState(0)
    const [shippingCount, setShippingCount] = useState(0)

    // useState(() => {
    //     var node = eval('('+localStorage.getItem("currentNode")+')')
    //     if (node) {
    //         setCurrentNodeCode(node.nodeCode)
    //     } else {
    //         setCurrentNodeCode('-')
    //     }
    // }, [])
    const handleGraphType = (e) => {
        setGraphType(e)        
    };

    const handleTimeRangeDropdown = (e) => {
        setGraphTimeRange(e)
    };



    
    useEffect(() => {
        
        ShipmentService.completedCountByCompany(userData.companyCode, userData.token)
        .then( res => {
            setCompletedCount(res.data)
        })
        .catch( err => {
            console.log(err)
        })
        ShipmentService.currentStockCountByCompany(userData.companyCode, userData.token)
        .then( res => {
            console.log(res.data)
            setStockCount(res.data)
        })
        .catch( err => {
            console.log(err)
        })
        ShipmentService.shippingCountByCompany(userData.companyCode, userData.token)
        .then( res => {
            setShippingCount(res.data)
        })
        .catch( err => {
            console.log(err)
        })
        ShipmentService.incompleteCountByCompany(userData.companyCode, userData.token)
        .then( res => {
            setIncompleteCount(res.data)
        })
        .catch( err => {
            console.log(err)
        })
        var temp = new Date()
        var curDate = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate())
        var timeInterval = []
        var timeRange = null

        if (graphTimeRange == "day") {
            timeRange = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 1).getTime() - 
                        new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), 0).getTime()
            for ( let i = 0; i <= 23; i++ ) {
                let temp = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate(), i) 
                timeInterval.push(temp.getTime())
            }
        }
        else if ( graphTimeRange == "week") {
            timeRange = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()).getTime() - 
                        new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() - 1).getTime()
            for ( let i = 0; i <= 6; i++ ) {
                let temp = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() - i + 1) 
                timeInterval.push(temp.getTime())
            }
            timeInterval = timeInterval.reverse()
        }
        else if ( graphTimeRange == "month") {
            timeRange = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate()).getTime() - 
                        new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate() - 1).getTime()
            let noOfDays = DateUtils.daysInMonth(curDate.getMonth(), curDate.getFullYear())
            for ( let i = 0; i <= noOfDays - 1; i++ ) {
                let temp = new Date(curDate.getFullYear(), curDate.getMonth(), noOfDays - i + 1) 
                timeInterval.push(temp.getTime())
            }
            timeInterval = timeInterval.reverse().slice(0, curDate.getDate())
        }
        else if ( graphTimeRange == "year") {
            timeRange = new Date(curDate.getFullYear(), curDate.getMonth()).getTime() - 
                        new Date(curDate.getFullYear(), curDate.getMonth() -1 ).getTime()
            console.log(new Date(2020, 4).toDateString())
            for ( let i = 1; i <= curDate.getMonth() + 1; i++ ) {
                let temp = new Date(curDate.getFullYear(), i) 
                timeInterval.push(temp.getTime())
            }
        }
                
        if (timeRange && graphType == "shipped") {
            timeInterval.unshift(timeInterval[0] - timeRange)
            // console.log('INTERVALLL',timeInterval)

            GraphService.getCompanyShippedByTime( userData.companyCode, timeInterval, userData.token)
            .then(res_graph => {
                console.log(res_graph)
                setDateGraphData(GraphService.adjustGraphTime(res_graph.data, graphTimeRange))
            })
            .catch( err => {
                console.log(err)
            })
        }
        else if (graphType == "stock" ) {
            // console.log('INTERVALLL',timeInterval)

            GraphService.getCompanyStockByTime( userData.companyCode, timeInterval, userData.token)
            .then(res_graph => {
                console.log(res_graph)
                setDateGraphData(GraphService.adjustGraphTime(res_graph.data, graphTimeRange))
            })
            .catch( err => {
                console.log(err)
            })
        }
        
    }, [graphType,graphTimeRange])




    function handlePopupConfirm(currentNode) {
        localStorage.setItem("currentNode", JSON.stringify(currentNode))
        setCurrentNodeCode(eval('('+localStorage.getItem("currentNode")+')').nodeCode)
        // window.location.reload(false);

        setNodePopup(false)
    }
    
    function handlePopupCancel() {
        console.log(localStorage)
        setNodePopup(false)
    }

    function handleEditProfConfirm(newProfile) {
        localStorage.setItem("userData", JSON.stringify(newProfile))
        setUserData(eval('('+localStorage.getItem("userData")+')'))
        setEditProfPopup(false)

    }
    
    function handleEditProfCancel() {
        console.log(localStorage)
        setEditProfPopup(false)
    }

    return (
        <div className="overview content-main-container">
            {/* <div className="content-title-container">
                <h1>Overview</h1>
                <button onClick={() => setButtonPopup(true)} className="node-select-button">
                    <FontAwesomeIcon icon={faPen} className="node-select-icon"/>Current Node: {currentNodeCode}
                </button>
            </div> */}
            <Titlebar pageTitle="Overview" setExtNodePopup={setNodePopup} setExtProfPopup={setEditProfPopup} extNodeCode={currentNodeCode}/>
            <div className="body-top">
                <Card title="Incomplete" info={incompleteCount}/>
                <Card title="Shipping" info={shippingCount}/>
                <Card title="Completed" info={completedCount}/>
                <Card title="In-Stock" info={stockCount}/>
            </div>
            <div className="body-main">
                
                <div className="chart-container">
                    <div className="chart-title-container">
                        {/* <h3 className="chart-title">Stocking Shipments</h3> */}
                        <Dropdown onSelect={handleGraphType} >
                            <Dropdown.Toggle className="btn btn-secondary dropdown-toggle">
                                {graphName[graphType]}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey={"shipped"}>{graphName.shipped}</Dropdown.Item>
                                <Dropdown.Item eventKey={"stock"}>{graphName.stock}</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown onSelect={handleTimeRangeDropdown} >
                            <Dropdown.Toggle className="btn btn-secondary dropdown-toggle">
                                {graphTimeRange[0].toUpperCase() + graphTimeRange.slice(1).toLowerCase()}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {GraphService.graphTimeRange.map( g => 
                                    <Dropdown.Item eventKey={g}>{g[0].toUpperCase()+g.slice(1).toLowerCase()}</Dropdown.Item>
                                    )}
                                {/* <Dropdown.Item eventKey={"day"}>Day</Dropdown.Item>
                                <Dropdown.Item eventKey={"week"}>Week</Dropdown.Item>
                                <Dropdown.Item eventKey={"month"}>Month</Dropdown.Item>
                                <Dropdown.Item eventKey={"year"}>Year</Dropdown.Item> */}
                            </Dropdown.Menu>
                        </Dropdown>
                        <p>
                            {new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6)
                            .toLocaleDateString()} - {currentDate.toLocaleDateString()}
                        </p>
                    </div>
                    <div className="body-chart-container">
                        { dateGraphData && <FrequencyChart chartDataPrim={dateGraphData} indicatorX={xAxisLabel[graphTimeRange]} indicatorY={yAxisLabel[graphType]}/>}
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
            { nodePopup && <NodeSelectPopup setOpenPopup={setNodePopup} handleConfirm={handlePopupConfirm} handleCancel={handlePopupCancel} />}
            { editProfPopup && <EditProfilePopup setOpenPopup={setEditProfPopup} handleConfirm={handleEditProfConfirm} handleCancel={handleEditProfCancel} />}

        </div>
    );
}