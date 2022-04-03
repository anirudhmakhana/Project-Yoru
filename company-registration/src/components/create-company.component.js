import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import axios from 'axios'

export default class CreateCompany extends Component {

    constructor(props) {
        super(props)

        this.state = {
            companyName: '',
            publicKey: '',
        }
    }

    onChangeCompanyName = (e) => {
        this.setState ( {companyName: e.target.value } )
    }

    onChangePublicKey = (e) => {
        this.setState ( {publicKey: e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault();
        const companyObject = {
            companyName: this.state.companyName,
            publicKeys: [this.state.publicKey.toLowerCase()]
        }

        axios.post("http://localhost:4000/companies/create-company", companyObject).then( 
            res => console.log(res.data))

        // console.log("created success")
        // console.log('Name:' + this.state.companyName)
        // console.log('Public Key: '+this.state.publicKey)

        this.setState( {
            companyName: '',
            publicKey: ''
        })
    }
    
    render() {
        return (
            <div className="form-wrapper mt-5">
                <h1>Create Company</h1>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group controlId="CompanyName">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control type="text" value={this.state.companyName} 
                        onChange={this.onChangeCompanyName} />
                    </Form.Group>

                    <Form.Group controlId="PublicKey">
                        <Form.Label>Public Key</Form.Label>
                        <Form.Control type="text" value={this.state.publicKey} 
                        onChange={this.onChangePublicKey}/>
                    </Form.Group>

                    <Button variant="success" size="lg" block="block" type="submit">
                        Create Company
                    </Button>
                </Form>
            </div>
        )
    }
}
