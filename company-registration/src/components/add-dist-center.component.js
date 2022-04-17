import React, { Component, useState, useEffect, useRef } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";
import axios from 'axios'

export default function AddDistCenter() {

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
    const [mapRef, setMapRef] = React.useState(/** @type google.map.Map */(null));
    const [currentMark, setCurrentMark] = useState(null)
    const [selected, setSelected] = React.useState(null);
    const {id} = useParams()
    const [companyName, setCompanyName] = useState()
    const [centerName, setCenterName] = useState('')
    const [address, setAddress] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [contactNumber, setContactNumber ] = useState('')
    const [lat, setLat] = useState()
    const [lng, setLng] = useState()

    const onMapClick = (e) => {
      let marker = <Marker
              key={`${e.latLng.lat()}-${e.latLng.lng()}`}
              position={{
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
              }}
              onClick={() => {
                setSelected({
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                  time: new Date()
                });
              }}
              map={mapRef}
          />
      console.log(marker)
  
      setCurrentMark(marker)
      setLat(e.latLng.lat().toFixed(3))
      setLng(e.latLng.lng().toFixed(3))
    }

    useEffect(() => {
      axios.get('http://localhost:4000/companies/get-company/' + id)
      .then( res => {
              console.log(res.data)
              setCompanyName(res.data.companyName)
      })
      .catch((error) => {
          console.log(error)
      })}, [companyName]
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
        <div style={{width:'100vx', height:'50vh'}}>
                  <GoogleMap
                    center={{ lat: 13.756331, lng: 100.501762 }}
                    zoom={15}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    options={options}
                    onLoad={map => setMapRef(map)}
                    onClick={onMapClick}
                  >
                  {currentMark}
                  </GoogleMap>
                
                <div className="form-wrapper mt-5">
              <h1>Add Distribution Center</h1>
              
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
                      Confirm
                  </Button>
              </Form>
          </div>
              </div>
          
      )
  }

