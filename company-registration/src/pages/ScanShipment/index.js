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
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
  } from "react-places-autocomplete";

const google = window.google;

export const ScanSHP = () => {
    const [shipment, setShipment] = useState(null);
	const [userData, setUserData] = useState(
		eval("(" + localStorage.getItem("userData") + ")")
	);
	const [nodePopup, setNodePopup] = useState(false);
    const [editProfPopup, setEditProfPopup] = useState(false);
	const [shipmentId, setShipmentId] = useState("");
	// const [path, setPath] = useState(null)
	const [currentNode, setCurrentNode] = useState(eval("(" + localStorage.getItem("currentNode") + ")"));
    const [directionsResponse, setDirectionsResponse] = useState(null)
	const [warning, setWarning] = useState(null)
	const [recommendInfo, setRecommendInfo] = useState(null)

    const [showInfo, setShowInfo] = useState(true)
	const [showScanPopup, setShowScanPopup] = useState(false)
	const [allScans, setAllScans] = useState([])
	const [userCompany, setUserCompany] = useState(null)
	const [updateInfo, setUpdateInfo] = useState(null)
	const [newStatus, setNewStatus] = useState(null)
	const [shipmentCurNode, setShipmentCurNode] = useState(null)
	const [recommendNode, setRecommendNode] = useState(null)
	const [nextPath, setNextPath] = useState(null)
	const [showNextInfo, setShowNextInfo] = useState(true)
	const [nextNodeRef, setNextNodeRef] = useState(null)
	const [searchRef, setSearchRef] = useState('')
	const [nextCompany, setNextCompany] = useState(null);
	const [nextNode, setNextNode] = useState(null);
	const [nextNodeStock, setNextNodeStock] = useState(0);
	const [allCompanies, setAllCompanies] = useState([]);
	const [showDestInfo, setShowDestInfo] = useState(true)
	const [companyNodes, setCompanyNodes] = useState([]);

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
			CompanyService.getAllCompanyCode(userData.token)
			.then((result) => {
				setAllCompanies(result.data);
			})
			.catch((err_company) => {
				console.log(err_company);
			});
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

	useEffect(() => {
		if (nextNode) {
			ShipmentService.currentStockCountByNode(nextNode.nodeCode, userData.token)
			.then((res_stock) => {
				// console.log('testtesttest', res_stock)
				console.log(res_stock.data);
				setNextNodeStock(res_stock.data);

			})
			.catch((err_stock) => {
				setNextNodeStock(0);
				console.log(err_stock);
			});
			const directionsService = new google.maps.DirectionsService()
			directionsService.route({
				origin: {lat:currentNode.lat, lng:currentNode.lng},
				destination: {lat:nextNode.lat, lng:nextNode.lng},
				// eslint-disable-next-line no-undef
				travelMode: google.maps.TravelMode.DRIVING,
			}).then(tempDirection=> {
				setNextPath(tempDirection)

			})
		}
		
	}, [nextNode])

	useEffect(() => {
		if (nextCompany) {
			NodeDataService.getActiveNodeByCompany(nextCompany, userData.token)
				.then((result) => {
					console.log(result.data);
					// console.log(path)
					var res_node = []
					for ( let i = 0; i < result.data.length; i++) {
						if ( result.data[i].nodeCode != currentNode.nodeCode) {
							res_node.push(result.data[i])
						}
					}
					setCompanyNodes(res_node);
				})
				.catch((err_company) => {
					setCompanyNodes([])
					console.log(err_company);
				});
		}
	}, [nextCompany]);

	async function handleSearchSelect(value) {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
		setSearchRef(value)
        setNextNodeRef(latLng);

	};

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
		console.log(shipment)
		
		var shipmentData = { uid: shipment.uid,
			description: shipment.description, 
			originNode: shipment.originNode,
			currentNode: currentNode.nodeCode,
			destinationNode: shipment.destinationNode,
			companyCode: shipment.companyCode,
			status:newStatus,
			scannedTime:new Date().getTime() }

		if ( newStatus == "shipping" && nextNode) {
			shipmentData.nextNode = nextNode.nodeCode

		}
		ShipmentService.updateShipment(shipmentData, userCompany.walletPublicKey, userData.token )
		.then(res => {
			console.log("Shipment updated")
			setWarning(null)
			setUpdateInfo(null)
			setShipment(null)
			setShipmentId(null)
			setAllScans([])
			setNextNode(null)
			setNextCompany(null)
			setRecommendInfo(null)
			setRecommendNode(null)
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
								.catch( err=> { 
									recommend = null
								})
								if ( recommend) {
									NodeDataService.getNodeByCode( recommend, userData.token)
									.then( async res => {
										setNextCompany(res.data.companyCode)
										setNextNode(res.data)
										setRecommendInfo("Recommended next node.")
									})
									var commonDest = await NodeRecommender.recommendNextNode(res_shipment.data, userData.token)
									.catch( err=> { 
										commonDest = null
									})
									if ( commonDest) {
										NodeDataService.getNodeByCode( commonDest, userData.token)
										.then( async res => {
											setRecommendNode(res.data)
										})
									}
								}
								else {
									NodeDataService.getNodeByCode( res_shipment.data.destinationNode, userData.token)
									.then( async res => {
										setNextCompany(res.data.companyCode)
										setNextNode(res.data)
										setRecommendInfo("Recommended next node.")
									})

								}
								
							}
						}
						else if ( res_shipment.data.status == "shipping" && res_shipment.data.currentNode == currentNode.nodeCode) {
							incorrectCurNode = true
							newState = null
						}
						 else if (res_shipment.data.status == "shipping" && res_shipment.data.destinationNode == currentNode.nodeCode) {
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
							setWarning("Current node not matched or already checked out from this node. Please check your current node!")
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

	function handleCompanyDropdown(e) {
		console.log(e);
		setNextCompany(e);
		console.log(nextNode);
		setNextNode(null);
		setNextNodeStock(0);
		setDirectionsResponse(null)
		
	};

	async function handleNodeDropdown(e) {
		console.log(e);
		if (e) {
			const result = await NodeDataService.getNodeByCode(e, userData.token)
			
			setNextNode(result.data);
			setShowDestInfo(true)
			console.log(result.data);
			setRecommendInfo(null)
			
		} else {
			setNextNodeStock(0);
			setNextNode(null);
			setRecommendInfo(null)
			setDirectionsResponse(null)
		}
		
	};

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
								<label className="inputLabel">Shipment ID: {shipmentId}</label>
								{shipment && <label className="inputLabel">Destination: {shipment.destinationNode}</label>}
								<label className="inputLabel">Scan RFID tag</label>
								<Button className="signinBtn" onClick={handleScan} >Scan</Button>
								{ shipment && <Button className="signinBtn" onClick={() => {
									setShowInfo(true)
									setShowNextInfo(true)
								}} >Show Info</Button>}

							</div>
							{ shipment && newStatus == "shipping" && recommendInfo &&
							<div className="alert alert-info">
								{recommendInfo}
							</div>}
							{ shipment && newStatus == "shipping" && 
							<div>
								<div className="textInputContainerCol">
									<label className="inputLabel">Select Next Node Company</label>
									<Dropdown onSelect={handleCompanyDropdown}>
										{nextCompany ? (
											<Dropdown.Toggle variant="primary" id="dropdown-basic">
												{nextCompany}
											</Dropdown.Toggle>
										) : (
											<Dropdown.Toggle variant="primary" id="dropdown-basic">
												Company
											</Dropdown.Toggle>
										)}

										<Dropdown.Menu>
											<Dropdown.Item eventKey={null}>--- Cancel Selection ---</Dropdown.Item>
											{allCompanies.map((companyCode) => (
												<Dropdown.Item eventKey={companyCode}>{companyCode}</Dropdown.Item>
											))}
										</Dropdown.Menu>
									</Dropdown>
								</div>
								<div className="textInputContainerCol">
									<label className="inputLabel">Select Next Node</label>
									<Dropdown onSelect={handleNodeDropdown}>
									{nextCompany  ? (
										nextNode ? (
											<Dropdown.Toggle variant="primary" id="dropdown-basic">
												{nextNode.nodeCode}
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
										<Dropdown.Item eventKey={null}>--- Cancel Selection ---</Dropdown.Item>
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
								
								<PlacesAutocomplete value={searchRef} onChange={setSearchRef} onSelect={handleSearchSelect}>
								{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
									<div >

										<input className={"add-node-search-bar"} {...getInputProps({ placeholder: "Next node location" })} />

										<div>
										{loading ? <div>Loading...</div> : null}

										{suggestions.map(suggestion => {
											const style = {
											backgroundColor: suggestion.active ? "#D4F0F7" : "#FFFFFF",
											"text-align" :'left'
											};

											return (
											<div {...getSuggestionItemProps(suggestion, { style })}>
												{suggestion.description}
											</div>
											);
										})}
										</div>
									</div>
								)}
								</PlacesAutocomplete>
							</div>
							}
							<div style={{ width: "100%", height: "45vh" }}>
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
									{nextPath && <DirectionsRenderer directions={nextPath} />}
									{showNextInfo && shipment && shipmentCurNode && nextNode &&
									<InfoWindow
										position={{ lat:nextNode.lat, lng: nextNode.lng }}
										onCloseClick={() => {
											setShowNextInfo(false)
										}}
										>
										<div>
											<h2>
												Next: {nextNode.nodeCode}
											</h2>
											{/* <p style={{color:"#000000"}}>This is the nearest node that has shipment with the same destination as your!</p> */}
											<p style={{color:"#000000"}}>Company: {nextNode.companyCode}</p>
											<p style={{color:"#000000"}}>Contact: {nextNode.phoneNumber}</p>
											<p style={{color:"#000000"}}>Address: {nextNode.address}</p>
											<p style={{color:"#000000"}}>Stocking: {nextNodeStock} shipment(s)</p>

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
						<div style={{display:"flex", "flex-direction":"column", width:"50%", "text-align":"left"}}>
							{ recommendNode && <div className="recommendContainer">
								<p style={{color:"#277382","text-align":"left", 'marginBottom':1}}><strong>This is the nearest node that has shipment with the same destination as your shipment!</strong></p>
								<p style={{color:"#388493","text-align":"left", 'marginBottom':1}}><strong>Node:</strong> {recommendNode.nodeCode}</p>
								<p style={{color:"#388493","text-align":"left", 'marginBottom':1}}><strong>Company:</strong> {recommendNode.companyCode}</p>
								<p style={{color:"#388493","text-align":"left", 'marginBottom':1}}><strong>Contact:</strong> {recommendNode.phoneNumber}</p>
								<p style={{color:"#388493","text-align":"left", 'marginBottom':1}}><strong>Address:</strong> {recommendNode.address}</p>
							</div>}
							<h3 style={{color: "#252733", marginBottom: "3%", paddingLeft:"3%"}}>Update History</h3>

							<div className='scan-history-container' style={{marginLeft: "3%"}}>
								{ allScans.reverse().map( scan => {
									return(
									<div>
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
					{ newStatus && updateInfo && userCompany && shipment && currentNode ? (
						newStatus == 'shipping' ? (
							nextNode ? 
							<div style={{display: "flex", justifyContent: "flex-end", marginTop: "2%"}}>
                        	<Button className="signinBtn" style={{width: "20%"}} onClick={handleUpdateShipment}>Update Shipment</Button>
                    		</div> : 
							<div style={{display: "flex", justifyContent: "flex-end", marginTop: "2%"}}>
                        	<Button className="cancelBtn" style={{width: "20%"}}  disabled>Update Shipment</Button>
                    		</div>
						) : 
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