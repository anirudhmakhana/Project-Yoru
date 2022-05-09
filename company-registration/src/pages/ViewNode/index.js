import React, { useEffect, useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

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
    const [stock, setStock] = useState([])
    const [dateGraphData, setDateGraphData] = useState(null)
    const [hourGraphData, setHourGraphData] = useState(null)
    const [mapRef, setMapRef] = React.useState(/** @type google.map.Map */(null));
    // const [currentMark, setCurrentMark] = useState(null)
    const [showInfo, setShowInfo] = useState(true)

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
        NodeDataService.getNodeByCode(nodeCode,userData.token)
        .then( res => {console.log(res)
            setNode(res.data)
            GraphService.getNodeStockByTime( res.data.nodeCode, timeInterval.reverse(), userData.token)
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
            GraphService.getNodeStockByTime( res.data.nodeCode, hourInterval, userData.token)
            .then(res_graph => {
                console.log(typeof res_graph.data[0].y)
                var adjustedDate = []
                res_graph.data.forEach( data => {
                    adjustedDate.push({x:data.getHours()+"", y:data.y})
                })
                setHourGraphData(adjustedDate)
            })
        })
        .catch( err => {
            setNode(null)
            console.log(err)
        })

        console.log(currentDate.getTime())
    }, [])

    useEffect(() => {
        

        ShipmentService.getStockByNode(nodeCode,userData.token)
        .then( res => {console.log(res)
            setStock(res.data)
        })
        .catch( err => {
            setNode(null)
            console.log(err)
        })
    }
    ,[mapRef] );
    
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
                        <h3 className="content-header">Node : {node.nodeCode}</h3>
                    </div>
                    
                    <div className="node-info">
                        <div className="body-main">
                        <p className="mt-5"> {node.nodeCode} </p>
                        <p>{node.address} </p>
                        <p >Company: {node.companyCode}</p>
                        <p >Contact: {node.phoneNumber}</p>
                        <p >Status: {node.status}</p>
                        <p className="mb-5">In-stock shipment: {stock.length}</p>
                        </div>
                        { dateGraphData && 
                        <div style={{width:'30%', height:'100%'}}>
                            <FrequencyChart chartDataPrim={dateGraphData} indicator={"Stock"}/>
                        </div>
                        }
                        { hourGraphData && 
                        <div style={{width:'30%', height:'100%'}}>
                            <FrequencyChart chartDataPrim={hourGraphData} indicator={"Stock"}/>
                        </div>
                        }
                    </div>
                    

                    <div style={{width:'100%', height:'50%'}}>
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
        );
    } else {
        return (<div id="shipment">
                <div className="title-container">
                    <h1>Node</h1>
                    <h2>Cannot find any Node</h2>
                </div>
            
                
            </div>)
    }
}