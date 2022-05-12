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
import NodeRecommender from "../../utils/NodeRecommender";

const google = window.google;

export const ScanSHP = () => {
    const [shipment, setShipment] = useState(null);
	const [userData, setUserData] = useState(
		eval("(" + localStorage.getItem("userData") + ")")
	);
	const [nodePopup, setNodePopup] = useState(false);
    const [editProfPopup, setEditProfPopup] = useState(false);
	const [shipmentId, setShipmentId] = useState("");

	const [currentNode, setCurrentNode] = useState(eval("(" + localStorage.getItem("currentNode") + ")"));
    const [directionsResponse, setDirectionsResponse] = useState(null)
	const [warning, setWarning] = useState(null)
    const [showInfo, setShowInfo] = useState(true)
	const [showScanPopup, setShowScanPopup] = useState(false)
	const [allScans, setAllScans] = useState([])
	const [userCompany, setUserCompany] = useState(null)
	const [updateInfo, setUpdateInfo] = useState(null)
	const [newStatus, setNewStatus] = useState(null)
	const [shipmentCurNode, setShipmentCurNode] = useState(null)
	const [recommendNode, setRecommendNode] = useState(null)
	const [recommendPath, setRecommendPath] = useState(null)
	const [showRecommend, setShowRecommend] = useState(true)
	const [mapRef, setMapRef] = React.useState(
		/** @type google.map.Map */ (null)
	);
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
		CompanyService.getCompanyByCode(userData.companyCode, userData.token)
		.then((result) => {
			setUserCompany(result.data);
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
				NodeDataService.getNodeByCode(res.data.currentNode, userData.token)
				.then( res_node => {
					setShipmentCurNode(res_node.data)
				})
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
			})
			.catch( err_shipment => {
				setShipment(null)
				console.log(err_shipment)
			})
		}

    }
    ,[isLoaded, shipmentId] );

	useEffect(() => {
		if (shipmentId) {
			ShipmentService.getScanByShipmentId(shipmentId, userData.token)
			.then( res => {
				console.log(res.data)
				setAllScans(res.data)
			})
			.catch(err => {
				console.log(err)
			})
		}
        
    }, [shipmentId])

	function handleNodePopupConfirm(newCurrentNode) {
        localStorage.setItem("currentNode", JSON.stringify(newCurrentNode))
		// console.log(currentNode, newCurrentNode)
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

	function handleUpdateShipment() {
		var shipmentData = { uid: shipment.uid,
			description: shipment.description, 
			originNode: shipment.originNode,
			currentNode: currentNode.nodeCode,
			destinationNode: shipment.destinationNode,
			companyCode: shipment.companyCode,
			status:newStatus,
			scannedTime:new Date().getTime() }
		ShipmentService.updateShipment(shipmentData, userCompany.walletPublicKey, userData.token )
		.then(res => {
			console.log("Shipment updated")
			setWarning(null)
			setUpdateInfo(null)
			setShipment(null)
			setShipmentId(null)
			setAllScans([])
		})
		.catch( err => {
			console.log(err)
			
		})
		

	}

	function handleScan() {
		setShowScanPopup(true)
		RfidService.makeScan()
		.then ( res => {
			if (res.data.statusCode == 200) {
				setShipmentId(res.data.data.uid)

				ShipmentService.getShipmentById( res.data.data.uid, userData.token)
				.then( async res_shipment => {
					console.log(currentNode)
					var incorrectCurNode = false
					if (res_shipment.data) {
						setShipment(res_shipment.data)
						var newState = "arrived"
						if ((res_shipment.data.status == "created" || res_shipment.data.status == "arrived") ) {
							if ( currentNode.nodeCode != res_shipment.data.currentNode) {
								incorrectCurNode = true
								newState = null
							} else{
								newState = "shipping"
								var recommend = await NodeRecommender.recommendNextNode(res_shipment.data, userData.token)
								if ( recommend) {
									NodeDataService.getNodeByCode( recommend, userData.token)
									.then( async res => {
										const directionsService = new google.maps.DirectionsService()

										setRecommendNode(res.data)
										let tempDirection = await directionsService.route({
											origin: {lat:currentNode.lat, lng:currentNode.lng},
											destination: {lat:res.data.lat, lng:res.data.lng},
											// eslint-disable-next-line no-undef
											travelMode: google.maps.TravelMode.DRIVING,
										})
										setRecommendPath(tempDirection)
									})
								}
							}
						} else if (res_shipment.data.status == "shipping" && res_shipment.data.destinationNode == currentNode.nodeCode) {
							newState = "completed"
						} else if (res_shipment.data.status == "cancel" || res_shipment.data.status == "completed") {
							newState = null
						}
						setNewStatus(newState)
						if (newState) {
							
							setUpdateInfo(`Update shipment status to ${newState.toUpperCase()} at ${currentNode.nodeCode}`)
							setWarning(null)
							setShowScanPopup(false)
						}
						else if (incorrectCurNode) {
							setUpdateInfo(null)
							setShipment(null)
							setWarning("Current node not matched. Please check your current node!")
							setShowScanPopup(false)
						} else {
							setUpdateInfo(null)
							setShipment(null)
							setWarning("Cancelled or completed shipment cannot be updated!")
							setShowScanPopup(false)
						}
					} else {
						setUpdateInfo(null)
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
	}

    return (
        <div className="content-main-container">
			<Titlebar pageTitle="Update Shipment" setExtNodePopup={setNodePopup} setExtProfPopup={setEditProfPopup} extNodeCode={currentNode.nodeCode}/>
           <div className="detailed-main-container" style={{height: "fit-content"}}>
           <form onSubmit={ () => {} }>
                    

					<div className="input-location-container" style={{margin: 0}}>
						<div className="input-left-container">
							{currentNode ? 	null : <p className="p-warning">Please select your current node first!</p>}
							
							{ warning &&
							<div className="alert alert-danger">
								{warning}
							</div>}
							{ updateInfo &&
							<div className="alert alert-primary">
								{updateInfo}
							</div>}
							<div className="textInputContainerCol">
								<label className="inputLabel">Shiment ID: {shipmentId}</label>
								<label className="inputLabel">Scan RFID tag</label>
								<Button className="signinBtn" style={{width: "70%"}} onClick={handleScan} >Scan</Button>
								{ shipment && <Button className="signinBtn" style={{width: "70%"}} onClick={() => {
									setShowInfo(true)
									setShowRecommend(true)
								}} >Show Info</Button>}

							</div>
							<div style={{ width: "100%", height: "55vh" }}>
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
									{showInfo && shipment && shipmentCurNode && 
									<InfoWindow
										position={{ lat:shipmentCurNode.lat, lng: shipmentCurNode.lng }}
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
									{recommendPath && <DirectionsRenderer directions={recommendPath} />}
									{showRecommend && shipment && shipmentCurNode && recommendNode &&
									<InfoWindow
										position={{ lat:recommendNode.lat, lng: recommendNode.lng }}
										onCloseClick={() => {
											showRecommend(false)
										}}
										>
										<div>
											<h2>
												Recommended: {recommendNode.nodeCode}
											</h2>
											<p style={{color:"#000000"}}>This is the nearest node that has shipment with the same destination as your!</p>
											<p style={{color:"#000000"}}>Company: {recommendNode.companyCode}</p>
											<p style={{color:"#000000"}}>Contact: {recommendNode.phoneNumber}</p>
											<p style={{color:"#000000"}}>Address: {recommendNode.address}</p>
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
									<Marker 
									key={`${currentNode.lat}-${currentNode.lng}`}
									position={{lat:currentNode.lat, lng:currentNode.lng}}
									onClick={() => {
										setShowInfo(true)
									console.log(currentNode.lat+"-"+ currentNode.lgn)
									}}
									map={mapRef}
									/>
									</GoogleMap>}
							</div>
						</div>
						<div className='scan-history-container' style={{marginLeft: "3%"}}>
							<h3 style={{color: "#252733", marginBottom: "3%"}}>Update History</h3>
							{ allScans.reverse().map( scan => {
								return(
								<div>
									<p style={{"text-align":"left", 'marginBottom':1}}><strong>Scan At:</strong> {scan.scannedAt}</p>
									<p style={{"text-align":"left", 'marginBottom':1}}><strong>Scan Timestamp:</strong> {new Date(scan.scannedTime).toLocaleString()}</p>
									<p style={{"text-align":"left", 'marginBottom':1}}><strong>Status:</strong> {scan.status.toUpperCase()}</p>
									<p style={{"text-align":"left", 'marginBottom':1}}><strong>Transaction Hash:</strong> {scan.txnHash}</p>
									<br/>
								</div>
								) 
							})}
						</div>
					</div>

					{ newStatus && updateInfo && userCompany && shipment && currentNode ? (
						<div style={{display: "flex", justifyContent: "flex-end", marginTop: "2%"}}>
                        	<Button className="signinBtn" style={{width: "20%"}} onClick={handleUpdateShipment}>Update Shipment</Button>
                    	</div>
					) : (
						<div style={{display: "flex", justifyContent: "flex-end", marginTop: "2%"}}>
                        	<Button className="cancelBtn" style={{width: "20%"}}  disabled>Update Shipment</Button>
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