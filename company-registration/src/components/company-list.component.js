import React, { Component, useFocusEffect, useState } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'
import CompanyTableRow from './CompanyTableRow'

export default function CompanyList() {

    const [companies, setCompanies] = useState([])

    useFocusEffect(
        // Update the document title using the browser API
        axios.get('http://localhost:4000/companies')
            .then( res => {
                setCompanies(res.data)
            })
            .catch((error) => {
                console.log(error)
            })
    );


    const dataTable = () => {
        return companies.map((res, i) => {
            return <CompanyTableRow obj={res} key={i}/>
        })
    }

    return (
        <div className="table-wrapper mt-5">
            <h1  className="mb-3">Companies</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Public Keys</th>
                        <th>Action</th>

                    </tr>
                </thead>

                    {dataTable()}

            </Table>
        
        </div>
    )
}

