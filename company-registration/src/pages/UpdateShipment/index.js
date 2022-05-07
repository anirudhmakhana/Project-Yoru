import React, { useEffect, useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'

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
const google = window.google

export const UpdateSHP = () => {
    const [shipment, setShipment] = useState(null)
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const {shipmentId}  = useParams()
    const availableStatus = ["arrived", "shipping", "cancel"]
    const navigate = useNavigate()
    const [mapRef, setMapRef] = React.useState(/** @type google.map.Map */(null));
    const [path, setPath] = useState([])
    const [loading, setLoading] = useState(true)
    const [allCompanies, setAllCompanies ] = useState([])
    const [companyNodes, setCompanyNodes] = useState([])
    const [updateCompany, setUpdateCompany] = useState(null)
    const [nodeStock, setNodeStock] = useState(null)
    const [updateNode, setUpdateNode] = useState(null)
    const [updateStatus, setUpdateStatus] = useState(null)

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

    async function getDirection(p) {
        console.log(google)
        const directionsService = new google.maps.DirectionsService()
        
        var checkpoints = []
        for ( let i = 0; i < p.length; i++ ){
            let res = await NodeDataService.getCoordinateByNode(p[i].scannedAt, userData.token)
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
    
    const handleCompanyDropdown = (e) => {
        console.log(e)
        setUpdateCompany(e)
    }

    const handleStatusDropdown = (e) => {
        console.log(e)
        setUpdateStatus(e)
    }

    const handleNodeDropdown = (e) => {
        console.log(e)
        NodeDataService.getNodeByCode(e, userData.token)
        .then( async result => {
            setUpdateNode(result.data)
            console.log( isLoaded,shipment.status,result.data)
            if (isLoaded && shipment.status != "arrived" ){ 
                ShipmentService.getPathByShipmentId(shipmentId, userData.token)
                .then( async res_path => {
                    setPath(res_path.data)
                    if (isLoaded ){ 
                        res_path.data.push({scannedAt:result.data.nodeCode})
                        console.log('######',res_path.data)
                        const results = await getDirection(res_path.data)
                        console.log(results)
                        setDirectionsResponse(results)
                    }
                })
                .catch( err => {
                    setPath(null)
                    console.log(err)
                })
            }
            ShipmentService.getStockByNode(result.data.nodeCode, userData.token)
            .then( res_stock => {
                console.log(res_stock.data)
                setNodeStock(res_stock.data)
            })
            .catch(err_stock => {
                setNodeStock(null)
                console.log(err_stock)
            })

        })
        .catch( err => {
            setUpdateNode(null)
            console.log(err)
        })


    }

    useEffect(()=> {
        CompanyService.getAllCompanyCode(userData.token)
        .then( result => {
            setAllCompanies(result.data)
        })
        .catch( err_company => {
            setShipment(null)
            console.log(err_company)
        })
    }, [])

    useEffect(()=> {
        if ( updateCompany ) {
            NodeDataService.getActiveNodeByCompany(updateCompany, userData.token)
            .then( result => {
                console.log(result.data)
                setCompanyNodes(result.data)
            })
            .catch( err_company => {
                setCompanyNodes(null)
                console.log(err_company)
            })
        }
    }, [updateCompany])

    useEffect(() => {

        CompanyService.getCompanyByCode(userData.companyCode, userData.token)
        .then( result => {
            ShipmentService.getShipmentById(shipmentId ,userData.token)
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

                NodeDataService.getNodeByCode(res.data.currentNode, userData.token)
                .then( res_current => {
                    setCurrentNode(res_current.data)
                    setUpdateNode(res_current.data)
                    setUpdateCompany(res_current.data.companyCode)
                    ShipmentService.getStockByNode(res_current.data.nodeCode, userData.token)
                    .then( res_stock => {
                        console.log(res_stock.data)
                        setNodeStock(res_stock.data)
                    })
                    .catch(err_stock => {
                        setNodeStock(null)
                        console.log(err_stock)
                    })

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
            <div className="content-main-container">
                <div className="content-title-container">
                    <Button type="button" onClick={() => {
                        navigate(-1)
                    }}className="btn btn-dark"> Back</Button>                
                </div>
                <div className="detailed-main-container">
                    <div className="detailed-title-container">
                        <h1>Shipment : {shipment.uid}</h1>
                    </div>
                    <div style={{width:'100%', height:'50%'}}>
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
                            {updateNode && updateNode != currentNode ? (
                                <InfoWindow
                                position={{ lat: updateNode.lat, lng: updateNode.lng }}
                                onCloseClick={() => {
                                }}>
                                <div>
                                    <h2>
                                    <span>📦 {updateNode.nodeCode}</span>
                                    </h2>
                                    <p style={{color:"#000000"}}>Company: {updateNode.companyCode}</p>
                                    <p style={{color:"#000000"}}>Address: {updateNode.address}</p>
                                    <p style={{color:"#000000"}}>Contact: {updateNode.phoneNumber}</p>
                                    <p style={{color:"#000000"}}>Stocking: {nodeStock.length} shipment(s)</p>
                
                                </div>
                                </InfoWindow>
                            ): null}
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
                        <Dropdown onSelect={handleCompanyDropdown}>

                            {shipment.status != "shipping" ? (
                            <Dropdown.Toggle variant="primary" id="dropdown-basic" disabled>{currentNode.companyCode}</Dropdown.Toggle>)
                            : (updateCompany ? ( <Dropdown.Toggle variant="primary" id="dropdown-basic" >{updateCompany}</Dropdown.Toggle>) 
                                : (<Dropdown.Toggle variant="primary" id="dropdown-basic">Company</Dropdown.Toggle>))}
                            <Dropdown.Menu> 
                            {allCompanies.map( companyCode => <Dropdown.Item eventKey={companyCode}>{companyCode}</Dropdown.Item>)}
                            </Dropdown.Menu>
                        
                        </Dropdown>

                        <Dropdown onSelect={handleNodeDropdown}>
                            {shipment.status != "shipping" ? (
                                <Dropdown.Toggle variant="primary" id="dropdown-basic" disabled>{currentNode.nodeCode}</Dropdown.Toggle>)
                                : (
                                updateCompany ? 
                                (updateNode ? (
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">{updateNode.nodeCode}</Dropdown.Toggle> ) : 
                                (<Dropdown.Toggle variant="primary" id="dropdown-basic">Node</Dropdown.Toggle>))

                            : (<Dropdown.Toggle variant="primary" id="dropdown-basic" disabled>Node</Dropdown.Toggle>))}
                            <Dropdown.Menu >
                                {companyNodes.map( node => {
                                if (node.nodeCode != currentNode.nodeCode) 
                                    return <Dropdown.Item eventKey={node.nodeCode}>{node.nodeCode}</Dropdown.Item>})}
                            </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown onSelect={handleStatusDropdown} >
                            {updateStatus ? (<Dropdown.Toggle variant="primary" id="dropdown-basic" >{updateStatus.toUpperCase()}</Dropdown.Toggle>) 
                            : (<Dropdown.Toggle variant="primary" id="dropdown-basic" >Status</Dropdown.Toggle>)}
                            <Dropdown.Menu >
                                {availableStatus.map( sts => {
                                return sts == shipment.status ? (<></>) :
                                ( <Dropdown.Item eventKey={sts}>{sts.toUpperCase()}</Dropdown.Item>)
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                        <p className="mt-5"> {shipment.uid} </p>
                        <p>{shipment.description} </p>
                        <p className="mb-5">Origin: {shipment.originNode}</p>
                        <p className="mb-5">Current: {shipment.currentNode}</p>
                        <p className="mb-5">Destination: {shipment.destinationNode}</p>
                        <p className="mb-5">Status: {shipment.status}</p>
                    </div>
                </div>
            </div>
        );
    } else {
        return (<div className="content-main-container">
                    <div className="content-title-container">
                        <h1>Node</h1>
                        <h2>Cannot find any Node</h2>
                    </div>
                </div>)
    }
}