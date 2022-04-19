import React, { Component, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'
import axios from 'axios'



export default function AddStaff() {
    const {id} = useParams()
    const [companyName, setCompanyName] = useState()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [walletAddress, setWalletAddress] = useState('')

    console.log(id)
    
    useEffect(
        React.useCallback(() => {
            axios.get('http://localhost:4000/companies/get-company/' + id)
            .then( res => {
                    console.log(res.data)
                    setCompanyName(res.data.companyName)
            })
            .catch((error) => {
                console.log(error)
            })
        })
    );
    
    function onSubmit (e) {
        e.preventDefault();
        const newStaff = {
            firstName: firstName,
            lastName: lastName,
            walletAddress: walletAddress.toLowerCase()
        }
    
        axios.put("http://localhost:4000/companies/add-staff/" + id, newStaff).then( 
            res => console.log(res.data))

        setCompanyName('')
        setFirstName('')
        setLastName('')
        setWalletAddress('')
        // console.log("created success")
        // console.log('Name:' + this.state.companyName)
        // console.log('Public Key: '+this.state.publicKey)
    
    }
        return (
            <div className="form-wrapper mt-5">
                <h1>Add Account to the Company</h1>

                <Form onSubmit={onSubmit}>
                    <Form.Group controlId="CompanyName">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control type="text" value={companyName} />
                    </Form.Group>

                    <Form.Group controlId="First Name">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" value={firstName} 
                        onChange={(e)=>setFirstName(e.target.value)}/>
                    </Form.Group>
                    
                    <Form.Group controlId="Last Name">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" value={lastName} 
                        onChange={(e)=>setLastName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group controlId="WalletAddress">
                        <Form.Label>Wallet Address</Form.Label>
                        <Form.Control type="text" value={walletAddress} 
                        onChange={(e)=>setWalletAddress(e.target.value)}/>
                    </Form.Group>

                    <Button variant="success" size="lg" block="block" type="submit">
                        Add Staff
                    </Button>
                </Form>
            </div>
        )
    }

