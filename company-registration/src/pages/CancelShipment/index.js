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

export const CancelSHP = () => {
    const [shipment, setShipment] = useState(null);
	const [userData, setUserData] = useState(
		eval("(" + localStorage.getItem("userData") + ")")
	);
	const [nodePopup, setNodePopup] = useState(false);
    const [editProfPopup, setEditProfPopup] = useState(false);
	const [shipmentId, setShipmentId] = useState("");
	const [currentNode, setCurrentNode] = useState(null);
	// const [destinationNode, setDestination] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null)
	const [warning, setWarning] = useState(null)
    const [showInfo, setShowInfo] = useState(true)
	const [showScanPopup, setShowScanPopup] = useState(false)
	const [allScans, setAllScans] = useState([])
	const [userCompany, setUserCompany] = useState(null)
	const [updateInfo, setUpdateInfo] = useState(null)
	const [newStatus, setNewStatus] = useState(null)
	const [shipmentCurNode, setShipmentCurNode] = useState(null)

	const [mapRef, setMapRef] = React.useState(
		/** @type google.map.Map */ (null)
	);
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
		if ( eval('('+localStorage.getItem("currentNode")+')')) {
            setCurrentNode(eval('('+localStorage.getItem("currentNode")+')'))

        }
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

	function handleCancelShipment() {
		var shipmentData = { uid: shipment.uid,
			description: shipment.description, 
			originNode: shipment.originNode,
			currentNode: currentNode.nodeCode,
			destinationNode: shipment.destinationNode,
			companyCode: shipment.companyCode,
			status:'cancel',
			scannedTime:new Date().getTime() }
		ShipmentService.updateShipment(shipmentData, userCompany.walletPublicKey, userData.token )
		.then(res => {
			console.log("Shipment cancelled")
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
				ShipmentService.getShipmentById( res.data.data.uid, userData.token)
				.then( res_shipment => {
					console.log(currentNode)
					if (res_shipment.data) {
						setShipmentId(res.data.data.uid)
						setShipment(res_shipment.data)
						var newState = "cancel"
						if (res_shipment.data.status == "cancel" || res_shipment.data.status == "completed") {
							newState = null
						}
						setNewStatus(newState)
						if (newState) {
							
							setUpdateInfo(`Cancel shipment at ${currentNode.nodeCode}`)
							setWarning(null)
							setShowScanPopup(false)
						}
						else {
							setUpdateInfo(null)
							setShipment(null)
							setWarning("Cancelled or completed shipment cannot be cancelled!")
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
			{currentNode ? <Titlebar pageTitle="Cancel Shipment" setExtNodePopup={setNodePopup} setExtProfPopup={setEditProfPopup} extNodeCode={currentNode.nodeCode}/>
			: <Titlebar pageTitle="Cancel Shipment" setExtNodePopup={setNodePopup} setExtProfPopup={setEditProfPopup} />}
           	<div className="detailed-main-container p-lg-4 p-md-2" style={{height: "fit-content"}}>
           		<form onSubmit={ () => {} }>
					<div className="input-location-container" style={{margin: 0}}>
						<div className="input-left-container">
							{currentNode ? 	null : <p className="p-warning">Please select your current node first!</p>}
							
							{ warning &&
							<div className="alert alert-danger">
								{warning}
							</div>}
							{ updateInfo &&
							<div className="alert alert-warning">
								{updateInfo}
							</div>}
							<div className="textInputContainerCol">
								<label className="inputLabel">Shipment ID: {shipmentId}</label>
								<label className="inputLabel">Scan RFID tag</label>
								{ currentNode ? <Button className="universal-button" onClick={handleScan} >Scan</Button> :
								<Button className="universal-button" onClick={handleScan} disabled>Scan</Button>}
							</div>
							
							<div style={{ width: "100%", height: "60%" }}>
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
									{showInfo && shipment && shipmentCurNode && <InfoWindow
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
									center={{ lat: 13.756331, lng: 100.501762 }}
									zoom={15}
									mapContainerStyle={{ width: '100%', height: '100%' }}
									options={options}
									onLoad={map => setMapRef(map)}
									onClick={()=>{}}>
									
									</GoogleMap>}
							</div>
						</div>
						<div style={{display:"flex", "flex-direction":"column", width:"50%", "text-align":"left"}}>
							<div className='scan-history-container'>
								<h3 style={{color: "#252733", marginBottom: "3%", paddingLeft:"3%"}}>Update History</h3>
								{ allScans.map( scan => {
								return(
									<div>
										<p style={{color:"#585A66","text-align":"left", 'marginBottom':1}}><strong>Scan At:</strong> {scan.scannedAt}</p>
										<p style={{color:"#585A66","text-align":"left", 'marginBottom':1}}><strong>Scan Timestamp:</strong> {new Date(scan.scannedTime).toLocaleString()}</p>
										<p style={{color:"#585A66","text-align":"left", 'marginBottom':1}}><strong>Status:</strong> {scan.status.toUpperCase()}</p>
										{scan.status == "shipping" && 
											<p style={{color:"#585A66","text-align":"left", 'marginBottom':1}}><strong>Shipped to:</strong> {scan.nextNode}</p>}
										<p style={{color:"#585A66","text-align":"left", 'marginBottom':1}}><strong>Transaction Hash:</strong> {scan.txnHash}</p>
										<br/>
									</div>
								) 
								})}
							</div>
						</div>
						


					</div>

					{ newStatus && updateInfo && userCompany && shipment && currentNode ? (
						<div style={{display: "flex", justifyContent: "flex-end", marginTop: "2%"}}>
                            <Button className="universal-button" style={{width: "20%", backgroundColor: "#FF4444", borderColor: "#FF4444"}} onClick={handleCancelShipment}>Cancel Shipment</Button>
                    	</div>
					) : (
						<div style={{display: "flex", justifyContent: "flex-end", marginTop: "2%"}}>
                        	<Button className="cancelBtn" style={{width: "20%", backgroundColor:"pink"}}  disabled>Cancel Shipment</Button>
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