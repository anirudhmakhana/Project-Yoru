import React, { Component, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { ethers } from "ethers";

import abi from "../utils/TrackingContract.json"

export default function CreateShipment() {
    const [allShipments, setAllShipments] = useState([])
    const [uid, setUid] = useState("")
    const [productName, setProductName] = useState("")
    const [producerName, setProducerName] = useState("")
    const [shipmentStatus, setShipmentStatus] = useState("delivering")

    //contract variables
    const contractAddress = "0xD3Dd4FD11B1Bad20E32436140532869BE2542554"
    const contractABI = abi
    
    async function createShipment() {
        if(typeof window.ethereum !== undefined) {
    
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner()
          const shipmentContract = new ethers.Contract(contractAddress, contractABI.abi, signer);
        
          try {
    
            const tx = await shipmentContract.insert(uid, productName, producerName, shipmentStatus)
            alert(`You can view your transaction at https://rinkeby.etherscan.io/tx/${tx.hash}`)
    
            await tx.wait()
    
            setUid("")
            setProducerName("")
            setProducerName("")
            
          } catch(err) {
            alert(err.message)
          }
    
        }
      }


    const onSubmit = (e) => {
        e.preventDefault();
        if (uid.length < 1) {
            alert("Please enter product Uid.")
        } else if (productName.length < 1) {
            alert("Please enter name of the product.")
        } else if (producerName.length < 1 ) {
            alert('Please enter name of the producer of the product.')
        }
         else {
    
            createShipment()
    
            // console.log("created success")
            // console.log('Name:' + this.state.companyName)
            // console.log('Public Key: '+this.state.publicKey)
    
            setUid("")
            setProductName("")
            setProducerName("")
        }
    }
    return (
        <div className="form-wrapper">
            <Form onSubmit={onSubmit}>
                <Form.Group controlId="Uid">
                    <Form.Label>UID</Form.Label>
                    <Form.Control type="text" value={uid} 
                    onChange={(e) => setUid(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="ProductName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control type="text" value={productName} 
                    onChange={(e) => setProductName(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="ProducerName">
                    <Form.Label>Producer Name</Form.Label>
                    <Form.Control type="text" value={producerName} 
                    onChange={(e) => setProducerName(e.target.value)} />
                </Form.Group>

                <Button variant="success" size="lg" block="block" type="submit" style={{marginTop: 30}}>
                    Create New Shipment
                </Button>
            </Form>
        </div>
    )
}

