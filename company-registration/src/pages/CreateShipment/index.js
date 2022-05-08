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

import "../../assets/style/shipment.css";
import "../../assets/style/style.css";
import { Titlebar } from "../../components/titlebar";

import NodeDataService from "../../services/NodeDataService";
import ShipmentService from "../../services/ShipmentService";
import CompanyService from "../../services/CompanyService";
import { getOverlayDirection } from "react-bootstrap/esm/helpers";
const google = window.google;

export const CreateSHP = () => {
	const [shipment, setShipment] = useState(null);
	const [userData, setUserData] = useState(
		eval("(" + localStorage.getItem("userData") + ")")
	);
	const [shipmentId, setShipmentId] = useState("");
	const [description, setDescription] = useState("");
	const [originNode, setOriginNode] = useState(null);
	const [status, setStatus] = useState("created");
	const [currentNode, setCurrentNode] = useState("");
	const [destinationNode, setDestination] = useState(null);
	const [allCompanies, setAllCompanies] = useState([]);
	const [companyNodes, setCompanyNodes] = useState([]);
	const [originCompany, setOriginCompany] = useState(null);

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

	async function getDirection(path) {
		const directionsService = new google.maps.DirectionsService();

		var checkpoints = [];
		for (let i = 0; i < path.length; i++) {
			let res = await NodeDataService.getCoordinateByNode(
				path[i].scannedAt,
				userData.token
			);
			checkpoints.push(res.data);
		}
		console.log(checkpoints);
		if (checkpoints.length >= 2) {
			var results = [];
			for (let i = 0; i < checkpoints.length - 1; i++) {
				results.push(
					await directionsService.route({
						origin: checkpoints[i],
						destination: checkpoints[i + 1],
						// eslint-disable-next-line no-undef
						travelMode: google.maps.TravelMode.DRIVING,
					})
				);
			}
			console.log(results);
			return results;
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

	useEffect(() => {
		if (originCompany) {
			NodeDataService.getActiveNodeByCompany(originCompany, userData.token)
				.then((result) => {
					console.log(result.data);
					setCompanyNodes(result.data);
				})
				.catch((err_company) => {
					setShipment(null);
					console.log(err_company);
				});
		}
	}, [originCompany]);

	// useEffect(() => {

	//     CompanyService.getCompanyByCode(userData.companyCode, userData.token)
	//     .then( result => {
	//         ShipmentService.getShipmentById(shipmentId,result.data.walletPublicKey ,userData.token)
	//         .then( res => {console.log(res.data)
	//             setShipment(res.data)
	//             ShipmentService.getPathByShipmentId(shipmentId, userData.token)
	//             .then( async res_path => {
	//                 setPath(res_path.data)
	//                 if (isLoaded ){
	//                     const results = await getDirection(res_path.data)
	//                     setDirectionsResponse(results)
	//                 }

	//             })
	//             .catch( err => {
	//                 setPath(null)
	//                 console.log(err)
	//             })

	//             NodeDataService.getCoordinateByNode(res.data.currentNode, userData.token)
	//             .then( res_current => {
	//                 setCurrentNode(res_current.data)
	//             })
	//             .catch( err => {
	//                 setCurrentNode(null)
	//                 console.log(err)
	//             })
	//         })
	//         .catch( err_shipment => {
	//             setShipment(null)
	//             console.log(err_shipment)
	//         })
	//     })
	//     .catch( err_company => {
	//         setShipment(null)
	//         console.log(err_company)
	//     })

	// }
	// ,[originNode] );

	const handleCompanyDropdown = (e) => {
		console.log(e);
		setOriginCompany(e);
		console.log(originNode);
		setOriginNode(null);
		setNodeStock(null);
	};

	const handleNodeDropdown = (e) => {
		console.log(e);
		NodeDataService.getNodeByCode(e, userData.token)
			.then((result) => {
				setOriginNode(result.data);
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
				setOriginNode(null);
				console.log(err);
			});
	};
	return (
		<div className="content-main-container">
			{/* <div className="content-title-container">
				<h1>Create Shipment</h1>
			</div> */}
			<Titlebar pageTitle="Create Shipment"/>

			<div className="detailed-main-container">
				<div style={{ width: "100%", height: "50%" }}>
				{ GoogleMap ? (originNode && nodeStock ? (
					<GoogleMap
						center={{ lat: originNode.lat, lng: originNode.lng }}
						zoom={15}
						mapContainerStyle={{ width: "100%", height: "100%" }}
						options={options}
						onLoad={(map) => setMapRef(map)}
						onClick={() => {}}
					>
						<InfoWindow
							position={{ lat: originNode.lat, lng: originNode.lng }}
							onCloseClick={() => {}}
						>
							<div>
								<h2>
									<span>📦 {originNode.nodeCode}</span>
								</h2>
								<p style={{ color: "#000000" }}>
									Company: {originNode.companyCode}
								</p>
								<p style={{ color: "#000000" }}>
									Address: {originNode.address}
								</p>
								<p style={{ color: "#000000" }}>
									Contact: {originNode.phoneNumber}
								</p>
								<p style={{ color: "#000000" }}>
									Stocking: {nodeStock.length} shipment(s)
								</p>
							</div>
						</InfoWindow>
						<Marker
							key={`${originNode.lat}-${originNode.lng}`}
							position={{ lat: originNode.lat, lng: originNode.lng }}
							onClick={() => {
								console.log(originNode.lat + "-" + originNode.lng);
							}}
							map={mapRef}
						/>
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

				<Dropdown onSelect={handleCompanyDropdown}>
				{originCompany ? (
					<Dropdown.Toggle variant="primary" id="dropdown-basic">
						{originCompany}
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

				<Dropdown onSelect={handleNodeDropdown}>
				{originCompany ? (
					originNode ? (
						<Dropdown.Toggle variant="primary" id="dropdown-basic">
							{originNode.nodeCode}
						</Dropdown.Toggle>
					) : (
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
					{companyNodes.map((node) => (
						<Dropdown.Item eventKey={node.nodeCode}>
							{node.nodeCode}
						</Dropdown.Item>
					))}
				</Dropdown.Menu>
				</Dropdown>
			</div>
			
		</div>
	);

	// if ( shipment && currentNode ) {

	//     return (
	//         <div id="shipment">
	//             <div className="title-container">
	//                 <Button type="button" onClick={() => {
	//                     navigate(-1)
	//                 }}className="btn btn-dark"> Back</Button>
	//             </div>

	//             <div className="title-container">
	//                 <h1>Shipment : {shipment.uid}</h1>
	//             </div>
	//             <div style={{width:'82vw', height:'50vh'}}>
	//               <GoogleMap
	//                 center={{ lat: currentNode.lat, lng: currentNode.lng }}
	//                 zoom={15}
	//                 mapContainerStyle={{ width: '100%', height: '100%' }}
	//                 options={options}
	//                 onLoad={map => setMapRef(map)}
	//                 onClick={()=>{}}
	//               >
	//               {directionsResponse ? (
	//                 directionsResponse.map((direction) =><DirectionsRenderer directions={direction} />)
	//               ): null}
	//                <InfoWindow
	//                 position={{ lat: currentNode.lat, lng: currentNode.lng }}
	//                 onCloseClick={() => {
	//                 }}
	//                 >
	//                 <div>
	//                     <h2>

	//                 {shipment.status == "shipping"
	//                 ? (<span>🚚 {shipment.uid}</span>) :
	//                  (<span>📦 {shipment.uid}</span>)}

	//                     </h2>
	//                     <p style={{color:"#000000"}}>Status: { shipment.status.toUpperCase()}</p>
	//                     <p style={{color:"#000000"}}>Current: {shipment.currentNode}</p>
	//                 </div>
	//                 </InfoWindow>
	//                 {/*
	//                 <Marker
	//                     key={`${shipment.lat}-${shipment.lng}`}
	//                     position={{lat:shipment.lat, lng:shipment.lng}}
	//                     onClick={() => {
	//                     console.log(shipment.lat+"-"+ shipment.lgn)
	//                     }}
	//                     map={mapRef}
	//                 /> */}
	//               </GoogleMap>
	//             </div>
	//             <div className="body-main">
	//                 <p className="mt-5"> {shipment.uid} </p>
	//                 <p>{shipment.description} </p>
	//                 <p className="mb-5">Origin: {shipment.originNode}</p>
	//                 <p className="mb-5">Current: {shipment.currentNode}</p>
	//                 <p className="mb-5">Destination: {shipment.destinationNode}</p>
	//                 <p className="mb-5">Status: {shipment.status}</p>
	//             </div>

	//         </div>
	//     );
	// } else {
	//     return (<div id="shipment">
	//             <div className="title-container">
	//                 <h1>Node</h1>
	//                 <h2>Cannot find any Node</h2>
	//             </div>

	//         </div>)
	// }
};
