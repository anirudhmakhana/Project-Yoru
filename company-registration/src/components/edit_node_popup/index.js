import React, { useEffect, useState, useRef } from "react";
import {useNavigate} from "react-router-dom"
import Button from 'react-bootstrap/Button'
import NodeDataService from "../../services/NodeDataService";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";


import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
  } from "react-places-autocomplete";

import AsyncSelect  from 'react-select/async';
import Dropdown from "react-bootstrap/Dropdown";
import Map from "../map"
import "../../assets/style/popup.css"
import StringValidator from "../../utils/StringValidator";

const google = window.google
export function EditNodePopup({ setOpenPopup, initNodeCode, updateTable }) {
    const navigate = useNavigate()
    const [nodeRef, setNodeRef] = useState('')
    const [selectPosition, setSelectPosition] = useState(null)
    const [mapRef, setMapRef] = React.useState(/** @type google.maps.Map */(null));
    const [nodeCode, setNodeCode] = useState(initNodeCode)
    const [address, setAddress] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [status, setStatus] = useState("active")
    const [companyCode, setCompanyCode] = useState('')
    const [warning, setWarning] = useState(null)
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
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
        setCompanyCode(userData.companyCode)
        NodeDataService.getNodeByCode(nodeCode, userData.token)
        .then( res => {
            setSelectPosition({lat:res.data.lat, lng:res.data.lng})
            setAddress(res.data.address)
            setPhoneNumber(res.data.phoneNumber)
            
        })
    }, [])


    function handleConfirm(currentNode) {
        var invalidCode = StringValidator.validateNodeCode(nodeCode);
        var invalidAddress = StringValidator.validateAddress(address);
        var invalidPhone = StringValidator.validatePhoneNumber(phoneNumber);
        
        if ( selectPosition == null ) {
            setWarning("Please pin your node location on the map!")
        } 
        else if (invalidCode ) {
            setWarning(invalidCode)
        }
        else if ( invalidAddress ) {
            setWarning(invalidAddress)
        }
        else if (invalidPhone) {
            setWarning(invalidPhone)
        }
        
        else {
            const newNode = {
                companyCode: companyCode,
                nodeCode: nodeCode,
                address: address,
                phoneNumber: phoneNumber,
                lat: selectPosition.lat,
                lng: selectPosition.lng,
                status: status
            }
            console.log(newNode)
            
            NodeDataService.updateNode(initNodeCode, newNode, userData.token)
            .then( res =>{
                setWarning(null)
                setNodeCode("")
                setSelectPosition(null)
                setAddress("")
                setPhoneNumber("")
                setOpenPopup(false)
            })
            .catch( error => {
                console.log(error.response.status)
                if (error.response.status == 403) {
                    setWarning("Node code is already taken!")
                    console.log(error)
                }
            }) 
            
        }

    }
    
    function handleCancel() {
        // console.log(localStorage)
        setOpenPopup(false)
    }

    function handleChangeAddress(e) {
        setAddress(e.target.value)
    }

    function handleChangeNodeCode(e) {
        setNodeCode(e.target.value)
    }

    function handleChangePhone(e) {
        setPhoneNumber(e.target.value)
    }

    async function handleSearchSelect(value) {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        setNodeRef(value);
        setSelectPosition(latLng);
        console.log(latLng)
      };

    if (!isLoaded) {
        return <></>
    }

    return (
      <div className="popupBackground">
        <div className="add-node-popupContainer">
          <div className="title">
            <h1>Please choose your node location.</h1>
          </div>
          { warning &&
                 <div className="alert alert-danger">
                    {warning}
                </div>}
            {GoogleMap && isLoaded ? (
                <div className="add-node-map-container">
                    {/* <div className = "add-node-search-bar"> */}
                        
                        <PlacesAutocomplete value={nodeRef} onChange={setNodeRef} onSelect={handleSearchSelect}>
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div >

                                <input className={"add-node-search-bar"} {...getInputProps({ placeholder: "Address" })} />

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
                    {/* </div> */}
                    {
                        selectPosition ? (
                    <GoogleMap
                    
                    center={selectPosition}
                    zoom={15}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    options={options}
                    onLoad={map => setMapRef(map)}
                    onClick={(e)=>
                        setSelectPosition({
                            lat: e.latLng.lat(),
                            lng: e.latLng.lng(),
                          })}
                  >
                    {selectPosition && <Marker
                      key={`${selectPosition.lat}-${selectPosition.lng}`}
                      position={selectPosition}
                      onClick={() => {
                        console.log(selectPosition.lat + "-" + selectPosition.lng);
                        // setCurrentNode(node)
                        mapRef.panTo(selectPosition)
                      }}
                      map={mapRef}
                    />}
                    </GoogleMap>)
                    : (<GoogleMap
                        center={{ lat: 13.756331, lng: 100.501762 }}
                        zoom={15}
                        mapContainerStyle={{ width: '100%', height: '100%' }}
                        options={options}
                        onLoad={map => setMapRef(map)}
                        onClick={(e)=>
                            setSelectPosition({
                                lat: e.latLng.lat(),
                                lng: e.latLng.lng(),
                        })}/>)
                    }
                </div>

            ) : null}

          <div className="body">
            <form >
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="companyCode">Company</label>
                        <input type="text" id="companyCode" name="companyCode" placeholder={companyCode} disabled></input>
                    </div>
                    
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="nodeCode">Node Code</label>
                        <input type="text" id="nodeCode" name="nodeCode" placeholder="e.g. LKB-001" value={nodeCode} onChange={handleChangeNodeCode}></input>
                    </div>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="address">Address</label>
                        <input type="text" id="address" name="address" placeholder="e.g. 123 Lad Krabang, Bangkok 10520" value={address} onChange={handleChangeAddress}></input>
                    </div>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="phoneNumber">Contact Number</label>
                        <input type="text" id="phoneNumber" name="phoneNumber" placeholder="e.g. 021232131" value={phoneNumber} onChange={handleChangePhone}></input>
                    </div>
            
                </form>
          </div>
          
          <div className="footer">
            <Button
              onClick={handleCancel}
              id="cancelBtn"
            >Cancel</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button onClick={handleConfirm}>Update Node</Button>
            
          </div>
        </div>
      </div>
    );
  }
  
