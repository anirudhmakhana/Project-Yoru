import React, { useEffect, useState } from "react";
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
import AsyncSelect  from 'react-select/async';
import Dropdown from "react-bootstrap/Dropdown";
import Map from "../map"
import "../../assets/style/popup.css"

const google = window.google
export function NodeSelectPopup({ setOpenPopup, handleConfirm, handleCancel }) {
    const navigate = useNavigate()
    const [mapRef, setMapRef] = React.useState(/** @type google.maps.Map */(null));
    const [currentLocation, setCurrentLocation] = useState(null)
    const [currentNode, setCurrentNode] = useState(null)
    const [allNodes, setAllNodes] = useState([])
    const [status, setStatus] = useState(null)
    const defaultNodeOption = [{label:"Select node...", value: ""}]
    const [nodeOptions, setNodeOptions] = useState(null)
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
        NodeDataService.getNodeByCompany(userData.companyCode, userData.token)
        .then( res => {
          console.log('res.data', res.data)
          var temp = res.data
          setAllNodes(temp.sort((a,b) => a.nodeCode.localeCompare(b.nodeCode)))
          var tempCurrentNode = eval('('+localStorage.getItem("currentNode")+')')
          if ( !navigator.geolocation ) {
              setStatus("Geolocation is not supported.")
              setCurrentNode(res.data[0])
          } else if ( tempCurrentNode) {
            setCurrentNode(tempCurrentNode)
          }
           else {
              setStatus("Finding your nearest node...")
              navigator.geolocation.getCurrentPosition((pos) => {
                  var curPos = {lat: pos.coords.latitude, lng: pos.coords.longitude}
                  setCurrentLocation()
                  setStatus(null)
                  NodeDataService.getNearestNode(curPos, userData.companyCode, userData.token)
                  .then( nearestNode => {
                      setCurrentNode(nearestNode.data)
                      console.log('Nearest node: ', nearestNode.data)
                  })
              }, () => {
                  setStatus("Cannot find any nearest node")
              })
              
          }
        })
        .catch( err => {
            setStatus("Cannot find any node of the company!")
            console.log(err)
        })
    }, [])

    const handleNodeDropdown = (e) => {
      allNodes.forEach((node, ind) => {
        if ( node.nodeCode == e) {
          setStatus("")
          setCurrentNode(allNodes[ind])
          mapRef.panTo({ lat: node.lat, lng: node.lng })
          console.log(node)
        }
      })
    };

    return (
      <div className="popupBackground">
        <div className="popupContainer">
          <div className="title">
            <h1>Please choose your current location.</h1>
          </div>
          <div className="map-container">
            {GoogleMap && isLoaded? (currentNode && allNodes ? (
                  <GoogleMap
                    center={{ lat: currentNode.lat, lng: currentNode.lng }}
                    zoom={15}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    options={options}
                    onLoad={map => setMapRef(map)}
                    onClick={()=>{}}
                  >
                    {allNodes.map( node => <Marker
                      key={`${node.lat}-${node.lng}`}
                      position={{ lat: node.lat, lng: node.lng }}
                      onClick={() => {
                        console.log(node.lat + "-" + node.lng);
                        setCurrentNode(node)
                        mapRef.panTo({ lat: node.lat, lng: node.lng })
                      }}
                      map={mapRef}
                    />)}
                    
                  </GoogleMap>
            ): (
                  <GoogleMap
                    center={{ lat: 13.7563, lng: 100.5018}}
                    zoom={15}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    options={options}
                    onLoad={map => setMapRef(map)}
                    onClick={()=>{}}
                  >
                  </GoogleMap>
            )) : null}
            {/* <Map id="popupMap" options={options} setMapRef={setMapRef} center={{ lat: 13.7563, lng: 100.5018}}
                    zoom={15}
                    mapContainerStyle={{ width: '100%', height: '100%' }} ></Map> */}
                  
            </div>

          { currentNode ? 
          (<div className="body">
              <p>{status}</p>
              <p>Node : {currentNode.nodeCode}<br/>
              {currentNode.address}</p>
          </div>): 
          <div className="body">
            <p>{status}</p>
          </div>}

          <p>Not yours?</p>
          
          {/* { nodeOptions && <SearchDropdown style={"body"} options={nodeOptions} onChange={() => {console.log('test')}} defaultValue={defaultNodeOption}/>} */}
          <Dropdown onSelect={handleNodeDropdown} >
            {currentNode ? 
              (<Dropdown.Toggle variant="primary" id="dropdown-basic" >
                {currentNode.nodeCode}
              </Dropdown.Toggle>) : 
              (<Dropdown.Toggle variant="primary" id="dropdown-basic"disabled={status != null}>
              Select node
              </Dropdown.Toggle>)}

            <Dropdown.Menu>
              {allNodes.map((node) => (
                <Dropdown.Item eventKey={node.nodeCode}>{node.nodeCode}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          
          
          <div className="footer">
            <Button
              onClick={() => {
                handleCancel()
              }}
              id="cancelBtn"
            >
              Cancel
            </Button>
            { currentNode ? (
                <Button
            onClick={() => {handleConfirm(currentNode)}}>Continue</Button>
            ) : (<Button disabled>Continue</Button>)}
          </div>
        </div>
      </div>
    );
  }
  
