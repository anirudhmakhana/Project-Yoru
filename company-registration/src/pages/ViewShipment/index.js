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
import NodeDataService from '../../services/NodeDataService';
import ShipmentService from '../../services/ShipmentService';
import CompanyService from '../../services/CompanyService';
import { getOverlayDirection } from 'react-bootstrap/esm/helpers';
const google = window.google

export const ViewShipmentPage = () => {
    const [shipment, setShipment] = useState(null)
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const { shipmentId } = useParams()
    const navigate = useNavigate()
    const [mapRef, setMapRef] = React.useState(/** @type google.map.Map */(null));
    const [path, setPath] = useState([])
    const [loading, setLoading] = useState(true)
    // const [currentMark, setCurrentMark] = useState(null)
    const [currentNode, setCurrentNode] = useState(null)
    const [directionsResponse, setDirectionsResponse] = useState(null)
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

        CompanyService.getCompanyByCode(userData.companyCode, userData.token)
        .then( result => {
            ShipmentService.getShipmentById(shipmentId,result.data.walletPublicKey ,userData.token)
            .then( res => {console.log(res.data)
                setShipment(res.data)
                ShipmentService.getPathByShipmentId(shipmentId, userData.token)
                .then( async res_path => {
                    setPath(res_path.data)
                    if (isLoaded ){ 
                        const results = await getDirection(res_path.data)
                        setDirectionsResponse(results)
                    }
                    
                })
                .catch( err => {
                    setPath(null)
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
        })
        .catch( err_company => {
            setShipment(null)
            console.log(err_company)
        })
        
        
    
    }
    ,[shipment] );
    
    if ( shipment && currentNode ) {
        
        return (
            <div id="shipment">
                <div className="title-container">
                    <Button type="button" onClick={() => {
                        navigate(-1)
                    }}className="btn btn-dark"> Back</Button>                
                </div>
                
                <div className="title-container">
                    <h1>Shipment : {shipment.uid}</h1>
                </div>
                <div style={{width:'82vw', height:'50vh'}}>
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
                   <InfoWindow
                    position={{ lat: currentNode.lat, lng: currentNode.lng }}
                    onCloseClick={() => {
                    }}
                    >
                    <div>
                        <h2>
                        
                    {shipment.status == "shipping" 
                    ? (<span>🚚 {shipment.uid}</span>) :
                     (<span>📦 {shipment.uid}</span>)}
                           
                        
                        </h2>
                        <p style={{color:"#000000"}}>Status: { shipment.status.toUpperCase()}</p>
                        <p style={{color:"#000000"}}>Current: {shipment.currentNode}</p>
                    </div>
                    </InfoWindow>
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
                <div className="body-main">
                    <p className="mt-5"> {shipment.uid} </p>
                    <p>{shipment.description} </p>
                    <p className="mb-5">Origin: {shipment.originNode}</p>
                    <p className="mb-5">Current: {shipment.currentNode}</p>
                    <p className="mb-5">Destination: {shipment.destinationNode}</p>
                    <p className="mb-5">Status: {shipment.status}</p>
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