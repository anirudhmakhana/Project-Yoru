import React, { Component, useEffect, useState } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'
import CompanyTableRow from './CompanyTableRow'

export function CompanyList(props) {

    const [companies, setCompanies] = useState([])
    const [userData, setUserData] = useState(null) 
    useEffect(() => {
        setUserData(props.userData)
        // console.log(props.userData)
      }, [userData]);
    // useEffect(() => {
    //     axios.get('http://localhost:4000/companies')
    //         .then( res => {
    //             setCompanies(res.data)
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })
        
    // }, )


    // const dataTable = () => {
    //     return companies.map((res, i) => {
    //         return <CompanyTableRow obj={res} key={i}/>
    //     })
    // }

    return (
        <div className="table-wrapper" style={{width:"100vw"}}>
            <h1  className="mb-3">Companies</h1>
            {/* <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Staff</th>
                        <th>Action</th>

                    </tr>
                </thead>

                    {dataTable()}

            </Table>
         */}
        </div>
    )
}

