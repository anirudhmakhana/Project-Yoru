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
    const [graphType, setGraphType] = useState("shipping")
    const [primGraphStartDate, setPrimStartDate] = useState('')
    const [primGraphEndDate, setPrimEndDate] = useState('')

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
        NodeDataService.getNodeByCode(nodeCode,userData.token)
        .then( res => {console.log(res)
            setNode(res.data)
            GraphService.generateGraph( graphType, graphTimeRange, userData.token, null, nodeCode)
            .then( res => {
                setDateGraphData(res.data.graph)
                setPrimStartDate(res.data.startDate)
                setPrimEndDate(res.data.endDate)
            })
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
                                    {GraphService.graphName[graphType]}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    { GraphService.graphTypes.map( type => 
                                    <Dropdown.Item eventKey={type}>{GraphService.graphName[type]}</Dropdown.Item>
                                    )}
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
                            {primGraphEndDate == primGraphStartDate ? 
                            <p>{primGraphStartDate}</p> :
                            <p>{primGraphStartDate}-{primGraphEndDate}</p>}
                            </div>
                            
                            <div style={{width:'100%', height:'90%', display: 'flex', alignItems: 'center'}}>
                                { dateGraphData && <LineChart chartDataPrim={dateGraphData} indicatorX={GraphService.xAxisLabel[graphTimeRange]} indicatorY={GraphService.yAxisLabel[graphType]}/>}
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