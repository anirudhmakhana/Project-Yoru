import React, { Component, useFocusEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import axios from 'axios'
import { Alert } from 'react-bootstrap'

export default function CreateCompany() {

    const [companyName, setCompanyName] = useState('')
    const [managerContact, setManagerContact] = useState('')
    const initStaffs = useState([])
    const initDistCenters = useState([])

    const onChangeCompanyName = (e) => {
       setCompanyName( e.target.value )
    }

    const onChangeContact = (e) => {
        setManagerContact(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (companyName.length < 1) {
            alert("Please enter company name.")
        } else if (managerContact.length < 1) {
            alert("Please enter contact of the manager of the company.")
        } else {
            const companyObject = {
                companyName: companyName,
                staffs: initStaffs,
                distCenters: initDistCenters,
                managerContact: managerContact
            }
    
            axios.post("http://localhost:4000/companies/create-company", companyObject).then( 
                res => console.log(res.data))
    
            // console.log("created success")
            // console.log('Name:' + this.state.companyName)
            // console.log('Public Key: '+this.state.publicKey)
    
            setCompanyName("")
            setManagerContact("")
        }
    }

    return (
        <div className="form-wrapper mt-5">
            <h1>Create Company</h1>
            <Form onSubmit={onSubmit}>
                <Form.Group controlId="CompanyName">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control type="text" value={companyName} 
                    onChange={onChangeCompanyName} />
                </Form.Group>

                <Form.Group controlId="ManagerContact">
                    <Form.Label>Manager Contact</Form.Label>
                    <Form.Control type="text" value={managerContact} 
                    onChange={onChangeContact}/>
                </Form.Group>

                <Button variant="success" size="lg" block="block" type="submit" style={{marginTop: 30}}>
                    Create Company
                </Button>
            </Form>
        </div>
    )
}
