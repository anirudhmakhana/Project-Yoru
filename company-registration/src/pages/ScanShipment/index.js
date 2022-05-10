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
		CompanyService.getAllCompanyCode(userData.token)
			.then((result) => {
				setAllCompanies(result.data);
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

	const handleChangeDescription = (e) => {
        setDescription( e.target.value )
     
	}

    return (
        <div className="content-main-container">
            <Titlebar pageTitle="Update Shipment"/>
           <div className="detailed-main-container" style={{height: "fit-content"}}>
           <form onSubmit={ () => {} }>
                    

					<div className="input-location-container" style={{margin: 0}}>
						<div className="input-left-container">
							{currentNode ? 	null : <p className="p-warning">Please select your current node first!</p>}
							
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
								<label className="inputLabel">Scan RFID tag</label>
								<input className="signinBtn" type="submit" value="Scan" style={{width: "70%"}}></input>
							</div>
						</div>

						<div style={{ width: "50%", height: "55vh" }}>
							{ GoogleMap ? (currentNode ? (
									<GoogleMap
										center={{ lat: currentNode.lat, lng: currentNode.lng }}
										zoom={15}
										mapContainerStyle={{ width: "100%", height: "100%" }}
										options={options}
										onLoad={(map) => setMapRef(map)}
										onClick={() => {}}
									>
										{destinationNode && showDestInfo && nodeStock && <InfoWindow
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
													Stocking: {nodeStock.length} shipment(s)
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
								)):null
							}
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
            { nodePopup && <NodeSelectPopup setOpenPopup={setNodePopup} handleConfirm={handleNodePopupConfirm} handleCancel={handleNodePopupCancel} />}
            { editProfPopup && <EditProfilePopup setOpenPopup={setEditProfPopup} handleConfirm={handleEditProfConfirm} handleCancel={handleEditProfCancel} />}
        </div>
    );
}