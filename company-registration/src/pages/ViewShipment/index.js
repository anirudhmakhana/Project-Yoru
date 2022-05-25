import React, { useEffect, useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    InfoWindow,
    Autocomplete,
    DirectionsRenderer,
} from "@react-google-maps/api";

import "../../assets/style/shipment.css"
import "../../assets/style/style.css"

import NodeDataService from '../../services/NodeDataService';
import ShipmentService from '../../services/ShipmentService';
import CompanyService from '../../services/CompanyService';
import { getOverlayDirection } from 'react-bootstrap/esm/helpers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const google = window.google

export const ViewShipmentPage = () => {
    const [shipment, setShipment] = useState(null)
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const { shipmentId } = useParams()
    const navigate = useNavigate()
    const [mapRef, setMapRef] = React.useState(/** @type google.map.Map */(null));
    // const [path, setPath] = useState([])
    const [loading, setLoading] = useState(true)
    // const [currentMark, setCurrentMark] = useState(null)
    const [currentNode, setCurrentNode] = useState(null)
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [showInfo, setShowInfo] = useState(true)
    const [allScans, setAllScans] = useState([])
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

    async function getDirection(path) {
        console.log(google)
        const directionsService = new google.maps.DirectionsService()
        
        var checkpoints = []
        for ( let i = 0; i < path.length; i++ ){
            let res = await NodeDataService.getCoordinateByNode(path[i].scannedAt, userData.token)
            checkpoints.push( res.data )
        }
        console.log(checkpoints)
        if ( checkpoints.length >= 2) {
            var results=[]
            for (let i = 0; i < checkpoints.length - 1; i++ ) {
                results.push( await directionsService.route({
                    origin: checkpoints[i],
                    destination: checkpoints[i+1],
                    // eslint-disable-next-line no-undef
                    travelMode: google.maps.TravelMode.DRIVING,
                }))
            }
            console.log(results)
            return results
        }
    }

    useEffect(() => {
        ShipmentService.getScanByShipmentId(shipmentId, userData.token)
        .then( res => {
            console.log(res.data)
            var temp = []
            for ( let i = 0; i < res.data.length; i++ ) {
                console.log(res.data[i].status )

                if ( (res.data[i].status == "arrived") && res.data[i - 1].nextNode != res.data[i].scannedAt) {
                    res.data[i].scannedAt = res.data[i].scannedAt + " ##MISMATCHED##"
                } 
                temp.push(res.data[i])
            }
            setAllScans(temp)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        console.log(shipment)
        
        ShipmentService.getShipmentById(shipmentId ,userData.token)
        .then( res => {console.log(res.data)
            setShipment(res.data)
            ShipmentService.getPathByShipmentId(shipmentId, userData.token)
            .then( async res_path => {
                console.log(res_path.data)
                // setPath(res_path.data)
                if (isLoaded ){ 
                    const results = await getDirection(res_path.data)
                    console.log(results)

                    setDirectionsResponse(results)
                }
                
            })
            .catch( err => {
                // setPath(null)
                console.log(err)
            })

            NodeDataService.getCoordinateByNode(res.data.currentNode, userData.token)
            .then( res_current => {
                setCurrentNode(res_current.data)
            })
            .catch( err => {
                setCurrentNode(null)
                console.log(err)
            })
        })
        .catch( err_shipment => {
            setShipment(null)
            console.log(err_shipment)
        })
    }
    ,[isLoaded] );
    
    if ( shipment && currentNode ) {
        
        return (
            <div className="shipment content-main-container">
                <div className="content-title-container">
                    <h1>Shipment</h1>
                </div>
                <div className="detailed-main-container ps-lg-5 ps-md-3 p-md-2">
                    <div className="detailed-title-container">
                        <Button type="button" onClick={() => {
                            navigate(-1)
                        }}className="back-button">
                            <FontAwesomeIcon icon={faAngleLeft}/>
                        </Button>
                        <div className="shipmentTitleContainer">
                            <h2>Shipment: {shipment.description}</h2>
                            <h4>ID: {shipment.uid}</h4>
                        </div>
                        
                    </div>
                    <div className="container-row mt-4">
                        <div className="infoContainer" style={{width: "40%"}}>
                            {/* <p>{shipment.description}</p> */}
                            <p><b>Producer:</b> {shipment.companyCode}</p>
                            <p><b>Origin:</b> {shipment.originNode}</p>
                            <p><b>Destination:</b> {shipment.destinationNode}</p>

                        </div>
                        <div className="infoContainer">
                            <p><b>Status:</b> {shipment.status.toUpperCase()}</p>
                            <p><b>Current Location:</b> {shipment.currentNode}</p>
                            <div style={{display:'flex', flexDirection:'row'}}>
                                <p><b>Latest Transaction:</b></p>
                                <p style={{width: '70%', height: '80%','word-break': 'break-word', 'text-align': 'left', 'margin-left': '1%'}}>{shipment.txnHash}</p>
                            </div>
                            

                        </div>
                    </div>
                    
                    <div className="shipment-info">
                        <div style={{width:'45%', height:'47vh', textAlign: "left"}}>
                            <div style={{display:'flex', flexDirection:'row', marginBottom: "10px"}}>
                                <h2 style={{'margin-top':'10px','margin-left':'10px'}}>Map</h2>
                                <Button type="button" onClick={() => {
                                    setShowInfo(true)
                                }} className="infoBtn" style={{'margin-top':'10px','margin-left':'3%', 'margin-bottom': '2%'}}>
                                    SHOW INFO
                                </Button>
                            </div>
                            
                            <GoogleMap
                                center={{ lat: currentNode.lat, lng: currentNode.lng }}
                                zoom={15}
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                options={options}
                                onLoad={map => setMapRef(map)}
                                onClick={()=>{}}
                            >
                            {directionsResponse ? (
                                directionsResponse.map((direction) =><DirectionsRenderer directions={direction} />)
                            ): null}
                            {showInfo && <InfoWindow
                                position={{ lat: currentNode.lat, lng: currentNode.lng }}
                                onCloseClick={() => {
                                    setShowInfo(false)
                                }}
                                >
                                <div>
                                    <h2>
                                    
                                {shipment.status == "shipping" 
                                ? (<span>🚚 {shipment.uid}</span>) :
                                ( shipment.status == "completed" ?
                                <span>✅ {shipment.uid}</span> :
                                shipment.status == "cancelled" ?
                                <span>❌ {shipment.uid}</span> : <span>📦 {shipment.uid}</span>)}
                                    
                                    
                                    </h2>
                                    <p style={{color:"#000000"}}>Status: { shipment.status.toUpperCase()}</p>
                                    <p style={{color:"#000000"}}>Current: {shipment.currentNode}</p>
                                </div>
                            </InfoWindow>}
                            <Marker 
                            key={`${currentNode.lat}-${currentNode.lng}`}
                            position={{lat:currentNode.lat, lng:currentNode.lng}}
                            onClick={() => {
                                setShowInfo(true)
                            console.log(currentNode.lat+"-"+ currentNode.lgn)
                            }}
                            map={mapRef}
                            />
                                {/*
                                <Marker
                                    key={`${shipment.lat}-${shipment.lng}`}
                                    position={{lat:shipment.lat, lng:shipment.lng}}
                                    onClick={() => {
                                    console.log(shipment.lat+"-"+ shipment.lgn)
                                    }}
                                    map={mapRef}
                                /> */}
                            </GoogleMap>
                        </div>
                        
                        <div className='scan-history-container' style={{overflow: "visible", width: "50%", justifyContent: "space-between"}}>
                            <h2 style={{'margin-top':'10px','margin-left':'3%'}}>History</h2>
                            <div style={{height: "85%",overflowY: "auto"}}>
                                { allScans.map( (scan) => {

                                return(
                                <div className="scanContainer">
                                    <br/>
                                    <p style={{"text-align":"left", 'marginBottom':1}}><strong>Scan At:</strong> {scan.scannedAt}</p>
                                    <p style={{"text-align":"left", 'marginBottom':1}}><strong>Scan Timestamp:</strong> {new Date(scan.scannedTime).toLocaleString()}</p>
                                    <p style={{"text-align":"left", 'marginBottom':1}}><strong>Status:</strong> {scan.status.toUpperCase()}</p>
                                    {scan.status == "shipping" && 
										<p style={{"text-align":"left", 'marginBottom':1}}><strong>Shipped to:</strong> {scan.nextNode}</p>}
                                    <p style={{"text-align":"left", 'marginBottom':1}}><strong>Transaction Hash:</strong> {scan.txnHash}</p>
                                    <br/>
                                </div>
                                ) 
                                
                            })}
                            </div>
                            
                        </div>
                        
                        

                    </div>
                    
                    
                    
                </div>
            </div>
            
        );
    } else {
        return (
            <div className="content-main-container">
                <div className="content-title-container">
                    <h1>Node</h1>
                    <h2>Cannot find any Node</h2>
                </div>
            </div>)
    }
}