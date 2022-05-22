import React, { useEffect, useState } from "react";
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

// import "../../assets/style/shipment.css";
import "../../assets/style/style.css";

import { Titlebar } from "../../components/titlebar";
import { NodeSelectPopup } from "../../components/node_select_popup";
import { EditProfilePopup } from "../../components/edit_profile_popup";

import NodeDataService from "../../services/NodeDataService";
import ShipmentService from "../../services/ShipmentService";
import CompanyService from "../../services/CompanyService";
import { getOverlayDirection } from "react-bootstrap/esm/helpers";
import RfidService from "../../services/RfidService";
import StringValidator from "../../utils/StringValidator";
import { ScanPopup } from "../../components/scan_popup";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
  } from "react-places-autocomplete";
const google = window.google;

export const CreateSHP = () => {
	const [shipment, setShipment] = useState(null);
	const [userData, setUserData] = useState(
		eval("(" + localStorage.getItem("userData") + ")")
	);
	const [userCompany, setUserCompany] = useState(null)

	const [warning, setWarning] = useState(null)
	const [nodePopup, setNodePopup] = useState(false);
    const [editProfPopup, setEditProfPopup] = useState(false);
	const [shipmentId, setShipmentId] = useState(null);
	const [description, setDescription] = useState("");
	const [destinationNode, setDestinationNode] = useState(null);
	const [status, setStatus] = useState("created");
	const [producer, setProducer ] = useState('');
	const [currentNode, setCurrentNode] = useState(null);
	// const [destinationNode, setDestination] = useState(null);
	const [allCompanies, setAllCompanies] = useState([]);
	const [companyNodes, setCompanyNodes] = useState([]);
	const [destinationCompany, setDestinationCompany] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null)
	const [showDestInfo, setShowDestInfo] = useState(true)
	const [destRef, setDestRef] = useState( null)
	const [searchRef, setSearchRef] = useState('')
	const navigate = useNavigate();
	const [mapRef, setMapRef] = React.useState(
		/** @type google.map.Map */ (null)
	);
	const [showScanPopup, setShowScanPopup] = useState(false)

	const [nodeStock, setNodeStock] = useState(0);
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

	async function getDirection() {
		const directionsService = new google.maps.DirectionsService();

		var results = await directionsService.route({
					origin: {lat:currentNode.lat, lng:currentNode.lng},
					destination:{lat:destinationNode.lat, lng:destinationNode.lng},
					// eslint-disable-next-line no-undef
					travelMode: google.maps.TravelMode.DRIVING,
		})
			
		console.log(results);
		return results;
		
	}

	useEffect(() => {
		if ( eval('('+localStorage.getItem("currentNode")+')')) {
            setCurrentNode(eval('('+localStorage.getItem("currentNode")+')'))
			setProducer(eval("(" + localStorage.getItem("currentNode") + ")").companyCode)
        }
		CompanyService.getAllCompanyCode(userData.token)
			.then((result) => {
				setAllCompanies(result.data);
			})
			.catch((err_company) => {
				setShipment(null);
				console.log(err_company);
			});
		CompanyService.getCompanyByCode(userData.companyCode, userData.token)
		.then((result) => {
			setUserCompany(result.data);
		})
		.catch((err_company) => {
			setShipment(null);
			console.log(err_company);
		});
	}, []);

	useEffect(() => {
		if (destinationCompany) {
			NodeDataService.getActiveNodeByCompany(destinationCompany, userData.token)
				.then((result) => {
					console.log(result.data);
					setCompanyNodes(result.data);
				})
				.catch((err_company) => {
					setShipment(null);
					setCompanyNodes([])
					console.log(err_company);
				});
		}
	}, [destinationCompany]);

	useEffect( () => {
		if ( currentNode && destinationNode && isLoaded) {
			getDirection()
			.then(
				results => 
				setDirectionsResponse(results)

			)
	
		}
	
    }
    ,[isLoaded, currentNode, destinationNode] );

	useEffect( () => {
		if ( destRef) {
			NodeDataService.getNearestNodeExcept(destRef, currentNode.nodeCode, userData.token)
				.then( nearestNode => {
					setDestinationCompany(nearestNode.data.companyCode)
					setDestinationNode(nearestNode.data)
					ShipmentService.currentStockCountByNode(nearestNode.data.nodeCode, userData.token)
					.then((res_stock) => {
						// console.log('testtesttest', res_stock)
						console.log(res_stock.data);
						setNodeStock(res_stock.data);

					})
					.catch((err_stock) => {
						setNodeStock(0);
						console.log(err_stock);
					});
			})
		}
	}, [destRef])

	function handleCompanyDropdown(e) {
		console.log(e);
		setDestinationCompany(e);
		console.log(destinationNode);
		setDestinationNode(null);
		setNodeStock(0);
		setDirectionsResponse(null)
		
	};

	async function handleNodeDropdown(e) {
		console.log(e);
		if (e) {
			const result = await NodeDataService.getNodeByCode(e, userData.token)
			
			setDestinationNode(result.data);
			setShowDestInfo(true)
			console.log(result.data);
			ShipmentService.currentStockCountByNode(result.data.nodeCode, userData.token)
			.then((res_stock) => {
				// console.log('testtesttest', res_stock)
				console.log(res_stock.data);
				setNodeStock(res_stock.data);

			})
			.catch((err_stock) => {
				setNodeStock(0);
				console.log(err_stock);
			});
		} else {
			setNodeStock(0);
			setDestinationNode(null);
			setDirectionsResponse(null)
		}
		
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

	async function handleSearchSelect(value) {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
		setSearchRef(value)
        setDestRef(latLng);

      };
    
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

	function handleChangeDescription(e) {
        setDescription( e.target.value )
	}

	function handleCreateShipment() {
		var invalidDescription = StringValidator.validateShipmentDescription(description);
		if (invalidDescription) {
			setWarning(invalidDescription)
		}
		else {
			var shipmentData = { uid: shipmentId,
				description: description, 
				originNode: currentNode.nodeCode,
				currentNode: currentNode.nodeCode,
				destinationNode: destinationNode.nodeCode,
				companyCode: userData.companyCode,
				status:status,
				scannedTime:new Date().getTime() }
			ShipmentService.createShipment(shipmentData, userCompany.walletPublicKey, userData.token )
			.then(res => {
				console.log("Shipment created")
				setWarning(null)
				setDescription('')
				setDestinationNode(null)
				setDestinationCompany(null)
				setDirectionsResponse(null)
				setShipmentId(null)
			})
			.catch( err => {
				console.log(err)
				
			})
		}

	}


	return (
		<div className="content-main-container">
			{currentNode ? <Titlebar pageTitle="Create Shipment" setExtNodePopup={setNodePopup} setExtProfPopup={setEditProfPopup} extNodeCode={currentNode.nodeCode}/>
			: <Titlebar pageTitle="Create Shipment" setExtNodePopup={setNodePopup} setExtProfPopup={setEditProfPopup} />}
			<div className="detailed-main-container p-lg-4 p-md-2" style={{overflowY: "auto", height: "fit-content"}}>
				<form onSubmit={ () => {} }>
                    

					<div className="input-location-container">
						<div className="input-left-container">
							{currentNode ? 	null : <p className="p-warning">Please select your current node first!</p>}

							{ warning &&
							<div className="alert alert-danger">
								{warning}
							</div>}
							<div className="textInputContainerCol">
								<label className="inputLabel" for="producer">Producer</label>
								<input type="text" id="producer" name="producer" placeholder="e.g. Fender" value={producer} disabled></input>
							</div>

							<div className="textInputContainerCol">
								<label className="inputLabel" for="desciption">Shipment Description</label>
								<input type="text" id="desciption" name="desciption" placeholder="e.g. Fender Telecaster" value={description}
								onChange={handleChangeDescription}></input>
							</div>
							
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
										<Dropdown.Item eventKey={null}>--- Cancel Selection ---</Dropdown.Item>
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
							<div className="textInputContainerCol">
								<label className="inputLabel">Shipment ID: {shipmentId}</label>
								<label className="inputLabel">Scan RFID tag</label>
								<Button className="universal-button" onClick={() => {
									setShowScanPopup(true)
									RfidService.makeScan()
									.then ( res => {
										console.log(res)
										if (res.data.statusCode == 200) {

											ShipmentService.getShipmentById( res.data.data.uid, userData.token)
											.then( res_shipment => {
												if ( res_shipment.data ) {
													setShipmentId(null)

													setWarning(`Shipment ${res_shipment.data.uid} already created!`)
													setShowScanPopup(false)
												}
												else {
													setShipmentId(res.data.data.uid)
													setWarning(null)
													setShowScanPopup(false)
												}
											})
										}
										else if (res.data.statusCode == 300) {
											setShipmentId(null)

											setWarning("Scanning timeout! Please try again.")
											setShowScanPopup(false)
											
										}
									})
									.catch( err => {
										console.log(err)
									})
								}} >Scan</Button>
							</div>
						</div>

						<div style={{ width: "50%", height: "90%" }}>
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
							{ currentNode ? (
									<GoogleMap
										center={{ lat: currentNode.lat, lng: currentNode.lng }}
										zoom={15}
										mapContainerStyle={{ width: "100%", height: "100%" }}
										options={options}
										onLoad={(map) => setMapRef(map)}
										onClick={(e) => {setDestRef({lat:e.latLng.lat(), lng:e.latLng.lng()})}}
									>
										{destinationNode && showDestInfo && <InfoWindow
											position={{ lat: destinationNode.lat, lng: destinationNode.lng }}
											onCloseClick={() => {
												setShowDestInfo(false)
											}}>
											<div>
												<h2>
													<span>🏣  {destinationNode.nodeCode}</span>
												</h2>
												<p style={{ color: "#000000" }}>
													Company: {destinationNode.companyCode}
												</p>
												<p style={{ color: "#000000" }}>
													Address: {destinationNode.address}
												</p>
												<p style={{ color: "#000000" }}>
													Contact: {destinationNode.phoneNumber}
												</p>
												<p style={{ color: "#000000" }}>
													Stocking: {nodeStock} shipment(s)
												</p>
											</div>
										</InfoWindow>}
										
										{destinationNode && 
										<Marker
											key={`${destinationNode.lat}-${destinationNode.lng}`}
											position={{ lat: destinationNode.lat, lng: destinationNode.lng }}
											onClick={() => {
												
												console.log(destinationNode.lat + "-" + destinationNode.lng);
											}}
											map={mapRef}
										/>
										}
										{currentNode && 
										<Marker
											key={`${currentNode.lat}-${currentNode.lng}`}
											position={{ lat: currentNode.lat, lng: currentNode.lng }}
											onClick={() => {
												
												console.log(currentNode.lat + "-" + currentNode.lng);
											}}
											map={mapRef}
										/>
										}
										{directionsResponse ? (
											<DirectionsRenderer directions={directionsResponse} />
										): null}
									</GoogleMap>
								) : (
									<GoogleMap
										center={{ lat: 13.7563, lng: 100.5018 }}
										zoom={15}
										mapContainerStyle={{ width: "100%", height: "100%" }}
										options={options}
										onLoad={(map) => setMapRef(map)}
										onClick={() => {}}
									></GoogleMap>
								)}
						</div>
					</div>

					{ userCompany && destinationNode && currentNode && shipmentId ? (
						<div style={{display: "flex", justifyContent: "flex-end", marginTop: "2%"}}>
                        	<Button className="universal-button" style={{width: "20%"}} onClick={handleCreateShipment}>Create Shipment</Button>
                    	</div>
					) : (
						<div style={{display: "flex", justifyContent: "flex-end", marginTop: "2%"}}>
                        	<Button className="cancelBtn" style={{width: "20%"}}  disabled>Create Shipment</Button>
                    	</div>
					)}
                </form>
			</div>
			{ showScanPopup && <ScanPopup setOpenPopup={setShowScanPopup}/>}
			{ nodePopup && <NodeSelectPopup setOpenPopup={setNodePopup} handleConfirm={handleNodePopupConfirm} handleCancel={handleNodePopupCancel} />}
            { editProfPopup && <EditProfilePopup setOpenPopup={setEditProfPopup} handleConfirm={handleEditProfConfirm} handleCancel={handleEditProfCancel} />}
		</div>
	);


};
