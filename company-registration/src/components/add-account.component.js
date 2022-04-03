import React, { Component, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'
import axios from 'axios'



export default function AddAccount() {
    const {id} = useParams()
    const [companyName, setCompanyName] = useState()
    const [publicKey, setKey] = useState()

    console.log(id)
    axios.get('http://localhost:4000/companies/get-company/' + id)
    .then( res => {
            console.log(res.data)
            setCompanyName(res.data.companyName)
        
    })
    .catch((error) => {
        console.log(error)
    })

    
    function onSubmit (e) {
        e.preventDefault();
        const companyObject = {
            companyName: companyName,
            publicKey: publicKey.toLowerCase()
        }
    
        axios.put("http://localhost:4000/companies/add-account/" + id, companyObject).then( 
            res => console.log(res.data))

        setKey('')
        setCompanyName('')
    
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
                    <Form.Group controlId="PublicKey">
                        <Form.Label>Public Key</Form.Label>
                        <Form.Control type="text" value={publicKey} 
                        onChange={(e)=>setKey(e.target.value)}/>
                    </Form.Group>

                    <Button variant="success" size="lg" block="block" type="submit">
                        Add Account
                    </Button>
                </Form>
            </div>
        )
    }

