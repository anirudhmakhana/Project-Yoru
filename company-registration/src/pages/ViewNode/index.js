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
import "../../assets/style/shipment.css"
import NodeDataService from '../../services/NodeDataService';
import ShipmentService from '../../services/ShipmentService';
import GraphService from '../../services/GraphService';
const google = window.google


export const ViewNodePage = () => {
    const [node, setNode] = useState(null)
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const { nodeCode } = useParams()
    const navigate = useNavigate()
    const [stock, setStock] = useState([])
    const [mapRef, setMapRef] = React.useState(/** @type google.map.Map */(null));
    // const [currentMark, setCurrentMark] = useState(null)

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
        NodeDataService.getNodeByCode(nodeCode,userData.token)
        .then( res => {console.log(res)
            setNode(res.data)
        })
        .catch( err => {
            setNode(null)
            console.log(err)
        })

        GraphService.getNodeStockByTime( nodeCode, [100,200,300,400,500], userData.token)

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
            <div id="shipment">
                <div className="title-container">
                    <Button type="button" onClick={() => {
                        navigate(-1)
                    }}className="btn btn-dark"> Back</Button>                
                </div>
                
                <div className="title-container">
                    <h1>Node : {node.nodeCode}</h1>
                </div>
                <div style={{width:'82vw', height:'50vh'}}>
                  <GoogleMap
                    center={{ lat: node.lat, lng: node.lng }}
                    zoom={15}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    options={options}
                    onLoad={map => setMapRef(map)}
                    onClick={()=>{}}
                  >
                  
                  <InfoWindow
                    position={{ lat: node.lat, lng: node.lng }}
                    onCloseClick={() => {
                    }}
                    >
                    <div>
                        <h2>
                        <span>
                           { node.nodeCode}
                        </span>
                        </h2>
                        <p>{node.lat} : {node.lng}</p>
                    </div>
                    </InfoWindow>
                    <Marker
                        key={`${node.lat}-${node.lng}`}
                        position={{lat:node.lat, lng:node.lng}}
                        onClick={() => {
                        console.log(node.lat+"-"+ node.lgn)
                        }}
                        map={mapRef}
                    />
                  </GoogleMap>
                </div>
                <div className="body-main">
                    <p className="mt-5"> {node.nodeCode} </p>
                    <p>{node.address} </p>
                    <p className="mb-5">Company: {node.companyCode}</p>
                    <p className="mb-5">Contact: {node.phoneNumber}</p>
                    <p className="mb-5">Status: {node.status}</p>
                    <p className="mb-5">In-stock shipment: {stock.length}</p>
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