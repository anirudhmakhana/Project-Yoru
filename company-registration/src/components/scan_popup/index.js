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

export function ScanPopup({ setOpenPopup }) {
    
    function handleCancel() {
        setOpenPopup(false)
    }

    return (
      <div className="popupBackground">
        <div className="scan-popupContainer">
          <div className="title">
            <h1>Please scan your RFID.</h1>
          </div>
          
          <div className="footer">
            <Button
              onClick={handleCancel}
              className="cancelBtn"
            >Cancel</Button>
            
          </div>
        </div>
      </div>
    );
  }
  
