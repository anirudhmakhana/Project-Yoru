import React, { Component, useEffect, useState } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'
import CompanyTableRow from './CompanyTableRow'

export default function CompanyList() {

    const [companies, setCompanies] = useState([])

    
    useEffect(() => {
        axios.get('http://localhost:4000/companies')
            .then( res => {
                setCompanies(res.data)
            })
            .catch((error) => {
                console.log(error)
            })
        
    }, )


    const dataTable = () => {
        return companies.map((res, i) => {
            return <CompanyTableRow obj={res} key={i}/>
        })
    }

    return (
        <div className="table-wrapper">
            <h1  className="mb-3">Companies</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Staff</th>
                        <th>Action</th>

                    </tr>
                </thead>

                    {dataTable()}

            </Table>
        
        </div>
    )
}

