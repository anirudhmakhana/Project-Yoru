import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import Button from 'react-bootstrap/Button'
import NodeDataService from "../../services/NodeDataService";
/* eslint-disable no-undef */
/* global google */
import "../../assets/style/popup.css"
const google = window.google
export function NodeSelectPopup({ setOpenPopup }) {
    const navigate = useNavigate()
    const [currentLocation, setCurrentLocation] = useState(null)
    const [currentNode, setCurrentNode] = useState(null)
    const [allNodes, setAllNodes] = useState(null)
    const [status, setStatus] = useState(null)
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))

    useEffect(() => {
        NodeDataService.getNodeByCompany(userData.companyCode, userData.token)
        .then( res => {
            setAllNodes(res.data)
            if ( !navigator.geolocation ) {
                setStatus("Geolocation is not supported.")
            } else {
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
        })
    }, [])

    return (
      <div className="popupBackground">
        <div className="popupContainer">
          <div className="title">
            <h1>Please choose your current location.</h1>
          </div>
          { currentNode ? 
          (<div className="body">
              <p>{status}</p>
            <p>Node : {currentNode.nodeCode}<br/>
            {currentNode.address}</p>
          </div>)
          : <div className="body">
          <p>{status}</p>
            </div>}
          
          <div className="footer">
            <Button
              onClick={() => {
                setOpenPopup(false);
              }}
              id="cancelBtn"
            >
              Cancel
            </Button>
            { currentNode ? (
                <Button
            onClick={() => {
                navigate("main/overview")
                localStorage.setItem("currentNode", JSON.stringify(currentNode))
            }}>Continue</Button>
            ) : (<Button disabled>Continue</Button>)}
          </div>
        </div>
      </div>
    );
  }
  
