import React, { Component, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import mapStyles from "./map/map-styles";
import { formatRelative } from "date-fns";
import axios from 'axios'


export default function AddDistCenter() {
    const [lat, setLat] = useState()
    const [lng, setLng] = useState()
    const mapRef = React.useRef();
    const [selected, setSelected] = React.useState(null);
    const [markers, setMarkers] = React.useState([]);
    const [currentMark, setCurrentMark] = useState(null)
    const options = {
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
      };
    
    function DistMap() {
        
        
        const onMapClick = React.useCallback((e) => {
            // setMarkers((current) => [
            //   ...current,
            //   {
            //     lat: e.latLng.lat(),
            //     lng: e.latLng.lng(),
            //     time: new Date(),
            //   },
            // ]);
            setCurrentMark({lat:e.latLng.lat(), lng:e.latLng.lng(), time: new Date()})
            setLat(e.latLng.lat().toFixed(3))
            setLng(e.latLng.lng().toFixed(3))
            console.log(lat, lng)
          }, []);
    
        const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
        }, []);
    
      return (
        <GoogleMap
          defaultZoom={10}
          defaultCenter={{ lat: 13.756331, lng: 100.501762 }}
          defaultOptions={{ styles: mapStyles }}
          onClick={onMapClick}
          onLoad={onMapLoad}
          options={options}
        >
    
        {/* {markers.map((marker) => (
              <Marker
                key={`${marker.lat}-${marker.lng}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => {
                  setSelected(marker);
                }}
              />
        ))} */}

        {currentMark ? (
              <Marker
                key={`${currentMark.lat}-${currentMark.lng}`}
                position={{ lat: currentMark.lat, lng: currentMark.lng }}
                onClick={() => {
                  setSelected(currentMark);
                }}
              />
        ) : null}
    
        {/* {selected ? (
              <InfoWindow
                position={{ lat: selected.lat, lng: selected.lng }}
                onCloseClick={() => {
                  setSelected(null);
                }}
              >
                <div>
                  <h2>
                    <span role="img" aria-label="bear">
                        ⛩
                    </span>
                  </h2>
                  <p>Spotted {formatRelative(selected.time, new Date())}</p>
                  <p>{currentMark["lat"]} : {currentMark["lng"]}</p>
                </div>
              </InfoWindow>
            ) : null} */}
    
        </GoogleMap>
      );
    }

    const MapWrapped = withScriptjs(withGoogleMap(DistMap));
    const API_KEY = process.env.REACT_APP_MAP_API_KEY

    const {id} = useParams()
    const [companyName, setCompanyName] = useState()
    const [centerName, setCenterName] = useState('')
    const [address, setAddress] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [contactNumber, setContactNumber ] = useState('')
    
    // console.log(id)
    useEffect(() => {
      axios.get('http://localhost:4000/companies/get-company/' + id)
      .then( res => {
              console.log(res.data)
              setCompanyName(res.data.companyName)
      })
      .catch((error) => {
          console.log(error)
      })}
    );
    
    function onSubmit (e) {
        e.preventDefault();
        const newDistCenter = {
            name: centerName,
            coordinate: {lat:lat, lng:lng},
            address: address,
            zipCode: zipCode,
            contactNumber: contactNumber
        }
    
        axios.put("http://localhost:4000/companies/add-dist-center/" + id, newDistCenter).then( 
            res => console.log(res.data))

        setCompanyName('')
        setCenterName('')
        setLat(0)
        setLng(0)
        setAddress('')
        setZipCode('')
        setContactNumber('')
        // console.log("created success")
        // console.log('Name:' + this.state.companyName)
        // console.log('Public Key: '+this.state.publicKey)
    
    }
      return (
        <div style={{width:'100vx', height:'70vh'}}>
                <MapWrapped
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${
                    API_KEY
                  }`}
                  loadingElement={<div style={{ height: `80%` , width: '80%'}} />}
                  containerElement={<div style={{ height: `80%` , width: '80%'}} />}
                  mapElement={<div style={{ height: `80%` , width: '80%'}} />}
                />
                <div className="form-wrapper mt-5">
              <h1>Add Account to the Company</h1>
              
              <h2>{lat} : {lng}</h2>
              <Form onSubmit={onSubmit}>
                  <Form.Group controlId="CompanyName">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control type="text" value={companyName} />
                  </Form.Group>

                  <Form.Group controlId="DistCenterName">
                      <Form.Label>Distribution Center Name</Form.Label>
                      <Form.Control type="text" value={centerName} 
                      onChange={(e)=>setCenterName(e.target.value)}/>
                  </Form.Group>
                  
                  <Form.Group controlId="Address">
                      <Form.Label>Address</Form.Label>
                      <Form.Control type="text" value={address} 
                      onChange={(e)=>setAddress(e.target.value)}/>
                  </Form.Group>

                  <Form.Group controlId="ZipCode">
                      <Form.Label>Zip Code</Form.Label>
                      <Form.Control type="text" value={zipCode} 
                      onChange={(e)=>setZipCode(e.target.value)}/>
                  </Form.Group>

                  <Form.Group controlId="ContactNumber">
                      <Form.Label>Contact Number</Form.Label>
                      <Form.Control type="text" value={contactNumber} 
                      onChange={(e)=>setContactNumber(e.target.value)}/>
                  </Form.Group>

                  <Button variant="success" size="lg" block="block" type="submit">
                      Add Staff
                  </Button>
              </Form>
          </div>
              </div>
          
      )
  }

