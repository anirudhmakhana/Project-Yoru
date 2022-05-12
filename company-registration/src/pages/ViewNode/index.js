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
import { FrequencyChart } from '../../components/chart';

const google = window.google


export const ViewNodePage = () => {
    const [node, setNode] = useState(null)
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const { nodeCode } = useParams()
    const navigate = useNavigate()
    const [stockCount, setStockCount] = useState(0)
    const [dateGraphData, setDateGraphData] = useState(null)
    const [mapRef, setMapRef] = React.useState(/** @type google.map.Map */(null));
    // const [currentMark, setCurrentMark] = useState(null)
    const [showInfo, setShowInfo] = useState(true)
    const [graphTimeRange, setGraphTimeRange] = useState("day")
    const [graphType, setGraphType] = useState("shipped")
    const [graphName, setGraphName] = useState({shipped: "Shipments Shipping",stock:"Stocking Shipments"})
    const [yAxisLabel, setYAxisLabel] = useState({shipped: "Shipped",stock:"Stock"})

    const [xAxisLabel, setXAxisLabel] = useState({week:"Date", month:"Day", year:"Month", day:"Hour"})

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY,
        libraries: ['places'],
    })
  
      const options={
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
    }
    const handleGraphType = (e) => {
        setGraphType(e)        
    };

    const handleTimeRangeDropdown = (e) => {
        setGraphTimeRange(e)
    };


    useEffect(() => {
        var temp = new Date()
        var currentDate = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate())
        var timeInterval = []
        for ( let i = 0; i <= 6; i++ ) {
            let temp = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - i + 1) 
            timeInterval.push(temp.getTime())
        }

        var hourInterval = []
        for ( let i = 0; i <= 23; i++ ) {
            let temp = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), i) 
            hourInterval.push(temp.getTime())
        }
        console.log(timeInterval)
        

        console.log(currentDate.getTime())
    }, [])
    useEffect(() => {
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
        NodeDataService.getNodeByCode(nodeCode,userData.token)
        .then( res => {console.log(res)
            setNode(res.data)
            if (timeRange && graphType == "shipped") {
                timeInterval.unshift(timeInterval[0] - timeRange)
                // console.log('INTERVALLL',timeInterval)
    
                GraphService.getNodeShippedByTime( res.data.nodeCode, timeInterval, userData.token)
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
    
                GraphService.getNodeStockByTime( res.data.nodeCode, timeInterval, userData.token)
                .then(res_graph => {
                    console.log(res_graph)
                    setDateGraphData(GraphService.adjustGraphTime(res_graph.data, graphTimeRange))
                })
                .catch( err => {
                    console.log(err)
                })
            }
        })
        .catch( err => {
            setNode(null)
            console.log(err)
        })
                
        
        
    }, [graphType,graphTimeRange])
    useEffect(() => {
        ShipmentService.currentStockCountByNode(nodeCode,userData.token)
        .then( res => {console.log(res)
            setStockCount(res.data)
        })
        .catch( err => {
            setStockCount(0)
            console.log(err)
        })
    }
    ,[isLoaded] );
    
    if ( node ) {
        
        return (
            <div className="content-main-container">
                <div className="content-title-container">
                    <h1>Node</h1>
                </div>
                <div className="detailed-main-container">
                    <div className="detailed-title-container">
                        <Button type="button" onClick={() => {
                            navigate(-1)
                            }}className="back-button">
                            <FontAwesomeIcon icon={faAngleLeft} className="alignIconTop"/>
                        </Button>
                        <h3 className="content-header">Node : {node.nodeCode} 🏣</h3>
                    </div>
                    <div className="body-main-row">
                        <div className="body-main-col" style={{width: "50%"}}>
                            <p><b>Node Code:</b> {node.nodeCode}</p>
                            <p><b>Address:</b> {node.address}</p>
                            <p><b>Company:</b> {node.companyCode}</p>
                        </div>
                        <div className="body-main-col" style={{width: "50%"}}>
                            <p><b>Contact:</b> {node.phoneNumber}</p>
                            <p><b>Status:</b> {node.status.toUpperCase()}</p>
                            <p><b>In-stock shipment:</b> {stockCount}</p>
                        </div>
                    </div>
                    
                    
                    <div className="node-info">
                        <div style={{"flex-direction":"column", width:"50%"}}>
                            <div style={{display: "flex", "flex-direction":"row"}}>
                                <Dropdown onSelect={handleGraphType} style={{marginRight: "2%"}}>
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
                                        <Dropdown.Item eventKey={"day"}>Day</Dropdown.Item>
                                        <Dropdown.Item eventKey={"week"}>Week</Dropdown.Item>
                                        <Dropdown.Item eventKey={"month"}>Month</Dropdown.Item>
                                        <Dropdown.Item eventKey={"year"}>Year</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            
                            <div style={{width:'100%', height:'90%'}}>
                                { dateGraphData && <FrequencyChart chartDataPrim={dateGraphData} indicatorX={xAxisLabel[graphTimeRange]} indicatorY={yAxisLabel[graphType]}/>}
                            </div>
                        </div>
                        <div style={{width:'50%', height:'100%'}}>
                                <GoogleMap
                                    center={{ lat: node.lat, lng: node.lng }}
                                    zoom={15}
                                    mapContainerStyle={{ width: '100%', height: '100%' }}
                                    options={options}
                                    onLoad={map => setMapRef(map)}
                                    onClick={()=>{}}
                                >
                                
                                { showInfo && <InfoWindow
                                    position={{ lat: node.lat, lng: node.lng }}
                                    onCloseClick={() => {
                                        setShowInfo(false)
                                    }}>
                                    <div>
                                        <h2>
                                        <span>
                                        🏣 {node.nodeCode}
                                        </span>
                                        </h2>
                                        <p>Contact: {node.phoneNumber}</p>
                                        <p>Status: {node.status.toUpperCase()}</p>
                                        <p>{node.lat} : {node.lng}</p>
                                    </div>
                                    </InfoWindow>
                                    }
                                    <Marker
                                        key={`${node.lat}-${node.lng}`}
                                        position={{lat:node.lat, lng:node.lng}}
                                        onClick={() => {
                                            setShowInfo(true)
                                        console.log(node.lat+"-"+ node.lgn)
                                        }}
                                        map={mapRef}
                                    />
                                </GoogleMap>
                            </div>
                    </div>
                </div>
                
            </div>
        );
    } else {
        return (<div id="shipment">
                <div className="title-container">
                    <h1>Node</h1>
                    <p>Loading...</p>
                </div>
            
            </div>)
    }
}