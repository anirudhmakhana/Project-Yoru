import React, { useEffect, useState } from "react";

import "../../assets/style/style.css"

import { useParams, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";

import {
	useJsApiLoader,
	GoogleMap,
	Marker,
	InfoWindow,
	Autocomplete,
	DirectionsRenderer,
} from "@react-google-maps/api";

import { Titlebar } from "../../components/titlebar"
import { NodeSelectPopup } from "../../components/node_select_popup";
import { EditProfilePopup } from "../../components/edit_profile_popup";

import NodeDataService from "../../services/NodeDataService";
import ShipmentService from "../../services/ShipmentService";
import CompanyService from "../../services/CompanyService";
import { getOverlayDirection } from "react-bootstrap/esm/helpers";

import RfidService from "../../services/RfidService";
import { ScanPopup } from "../../components/scan_popup";

const google = window.google;

export const ScanSHP = () => {
    const [shipment, setShipment] = useState(null);
	const [userData, setUserData] = useState(
		eval("(" + localStorage.getItem("userData") + ")")
	);
	const [nodePopup, setNodePopup] = useState(false);
    const [editProfPopup, setEditProfPopup] = useState(false);
	const [shipmentId, setShipmentId] = useState("");
	const [description, setDescription] = useState("");
	const [destinationNode, setDestinationNode] = useState(null);
	const [status, setStatus] = useState("created");
	const [producer, setProducer ] = useState(eval("(" + localStorage.getItem("currentNode") + ")").companyCode);
	const [currentNode, setCurrentNode] = useState(eval("(" + localStorage.getItem("currentNode") + ")"));
	// const [destinationNode, setDestination] = useState(null);
	const [allCompanies, setAllCompanies] = useState([]);
	const [companyNodes, setCompanyNodes] = useState([]);
	const [destinationCompany, setDestinationCompany] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null)
	const [showDestInfo, setShowDestInfo] = useState(true)
	const navigate = useNavigate();
	const [warning, setWarning] = useState(null)
    const [showInfo, setShowInfo] = useState(true)
	const [showScanPopup, setShowScanPopup] = useState(false)

	const [mapRef, setMapRef] = React.useState(
		/** @type google.map.Map */ (null)
	);
	const [nodeStock, setNodeStock] = useState(null);
	// const [currentMark, setCurrentMark] = useState(null)
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY,
		libraries: ["places"],
	});

	const options = {
		zoomControl: false,
		streetViewControl: false,
		mapTypeControl: false,
		fullscreenControl: false,
	};

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
		CompanyService.getAllCompanyCode(userData.token)
			.then((result) => {
				setAllCompanies(result.data);
			})
			.catch((err_company) => {
				setShipment(null);
				console.log(err_company);
			});
	}, []);

    useEffect( () => {
		if (shipmentId) {
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

    }
    ,[isLoaded, shipmentId] );

	const handleCompanyDropdown = (e) => {
		console.log(e);
		setDestinationCompany(e);
		console.log(destinationNode);
		setDestinationNode(null);
		setNodeStock(null);
	};

	const handleNodeDropdown = (e) => {
		console.log(e);
		NodeDataService.getNodeByCode(e, userData.token)
			.then((result) => {
				setDestinationNode(result.data);
				setShowDestInfo(true)
				console.log(result.data);
				ShipmentService.getStockByNode(result.data.nodeCode, userData.token)
					.then((res_stock) => {
						console.log(res_stock.data);
						setNodeStock(res_stock.data);

					})
					.catch((err_stock) => {
						setNodeStock(null);
						console.log(err_stock);
					});
			})
			.catch((err) => {
				setDestinationNode(null);
				console.log(err);
			});
	};

	function handleNodePopupConfirm(newCurrentNode) {
        localStorage.setItem("currentNode", JSON.stringify(newCurrentNode))
		// console.log(currentNode, newCurrentNode)
		if (destinationNode && newCurrentNode.nodeCode == destinationNode.nodeCode) {
			setDestinationNode(null)
			setDirectionsResponse(null)
			setShowDestInfo(false)
		}
		setCurrentNode(newCurrentNode)
        setNodePopup(false)

    }
    
    function handleNodePopupCancel() {
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
        <div className="content-main-container">
            <Titlebar pageTitle="Update Shipment"/>
           <div className="detailed-main-container" style={{height: "fit-content"}}>
           <form onSubmit={ () => {} }>
                    

					<div className="input-location-container" style={{margin: 0}}>
						<div className="input-left-container">
							{currentNode ? 	null : <p className="p-warning">Please select your current node first!</p>}
							
							{ warning &&
							<div className="alert alert-danger">
								{warning}
							</div>}
							<div className="textInputContainerCol">
								<label className="inputLabel">Select Destination Company</label>
								<Dropdown onSelect={handleCompanyDropdown}>
									{destinationCompany ? (
										<Dropdown.Toggle variant="primary" id="dropdown-basic">
											{destinationCompany}
										</Dropdown.Toggle>
									) : (
										<Dropdown.Toggle variant="primary" id="dropdown-basic">
											Company
										</Dropdown.Toggle>
									)}

									<Dropdown.Menu>
										{allCompanies.map((companyCode) => (
											<Dropdown.Item eventKey={companyCode}>{companyCode}</Dropdown.Item>
										))}
									</Dropdown.Menu>
								</Dropdown>
							</div>
							<div className="textInputContainerCol">
								<label className="inputLabel">Select Destination Node</label>
								<Dropdown onSelect={handleNodeDropdown}>
								{destinationCompany  ? (
									destinationNode ? (
										<Dropdown.Toggle variant="primary" id="dropdown-basic">
											{destinationNode.nodeCode}
										</Dropdown.Toggle>
									) : (
										companyNodes.length < 1 ? 
										<Dropdown.Toggle variant="primary" id="dropdown-basic" disabled>
											No existed node
										</Dropdown.Toggle>
										:
										<Dropdown.Toggle variant="primary" id="dropdown-basic">
											Node
										</Dropdown.Toggle>
									)
									) : (
										<Dropdown.Toggle variant="primary" id="dropdown-basic" disabled>
											Node
										</Dropdown.Toggle>
									)}

								<Dropdown.Menu>
									{companyNodes.map((node) => {
										if (node.companyCode != currentNode.companyCode ||
											node.nodeCode != currentNode.nodeCode) {
											return <Dropdown.Item eventKey={node.nodeCode}>
											{node.nodeCode}
											</Dropdown.Item>
										}
										
									}
										
									)}
								</Dropdown.Menu>
								</Dropdown>
							</div>
							<div className="textInputContainerCol">
								<label className="inputLabel">Shiment ID: {shipmentId}</label>
								<label className="inputLabel">Scan RFID tag</label>
								<Button className="signinBtn" style={{width: "70%"}} onClick={() => {
									setShowScanPopup(true)
									RfidService.makeScan()
									.then ( res => {
										if (res.data.statusCode == 200) {
											ShipmentService.getShipmentById( res.data.data.uid, userData.token)
											.then( res_shipment => {
												if (res_shipment.data) {
													setShipmentId(res.data.data.uid)
													setShipment(res_shipment.data)
													setWarning(null)
													setShowScanPopup(false)
												} else {
													setShipmentId(null)
													setShipment(null)
													setWarning("Shipment not found!")
													setShowScanPopup(false)
												}
											})
											.catch(err => {
												setShipmentId(null)
												setShipment(null)
												setWarning("Shipment not found!")
												setShowScanPopup(false)
												
											})
										}
										else if (res.data.statusCode == 300) {
											setShipmentId(null)
											setShipment(null)
											setWarning("Scanning timeout! Please try again.")
											setShowScanPopup(false)
											
										}
									})
									.catch(error => {
										console.log(error)
										
									})
								}} >Scan</Button>
							</div>
						</div>

						<div style={{ width: "50%", height: "55vh" }}>
							{ shipment ? <GoogleMap
									center={{ lat: currentNode.lat, lng: currentNode.lng }}
									zoom={15}
									mapContainerStyle={{ width: '100%', height: '100%' }}
									options={options}
									onLoad={map => setMapRef(map)}
									onClick={()=>{}}>
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
									<span>✅ {shipment.uid}</span> : <span>📦 {shipment.uid}</span>)}
										
										
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
								</GoogleMap>
								: <GoogleMap
                                center={{ lat: currentNode.lat, lng: currentNode.lng }}
                                zoom={15}
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                options={options}
                                onLoad={map => setMapRef(map)}
                                onClick={()=>{}}>
                            	</GoogleMap>}
						</div>
					</div>

					{ currentNode ? (
						<div style={{display: "flex", justifyContent: "flex-end", marginTop: "2%"}}>
                        	<input className="signinBtn" type="submit" value="Update Shipment" style={{width: "20%"}} disabled={true}></input>
                    	</div>
					) : (
						<div style={{display: "flex", justifyContent: "flex-end", marginTop: "2%"}}>
                        	<input className="signinBtn" type="submit" value="Update Shipment" style={{width: "20%"}} disabled={true} ></input>
                    	</div>
					)}
                </form>
            </div>
			{ showScanPopup && <ScanPopup setOpenPopup={setShowScanPopup}/>}
            { nodePopup && <NodeSelectPopup setOpenPopup={setNodePopup} handleConfirm={handleNodePopupConfirm} handleCancel={handleNodePopupCancel} />}
            { editProfPopup && <EditProfilePopup setOpenPopup={setEditProfPopup} handleConfirm={handleEditProfConfirm} handleCancel={handleEditProfCancel} />}
        </div>
    );
}