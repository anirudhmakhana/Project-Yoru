import React, { Component, useEffect, useState } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'
import CompanyTableRow from './CompanyTableRow'
import { Routes, Route, Link } from "react-router-dom";

import { CreateCompany } from '../CreateCompany'
import { RegisterAdmin } from '../RegisterAdmin'
import "../../assets/style/companyList.css";

export function CompanyList(props) {

    const [companies, setCompanies] = useState([])
    const [userData, setUserData] = useState(null) 
    useEffect(() => {
        setUserData(props.userData)
        console.log(props.userData)

        axios.get('http://localhost:4000/company',{headers:{"x-access-token":props.userData.token}})
        .then( res => {
            setCompanies(res.data)
            console.log(res.data)
        })
        .catch((error) => {
            console.log(error)
        })
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


    const dataTable = () => {
        return companies.map((res, i) => {
            return <CompanyTableRow userData={userData} obj={res} key={i}/>
        })
    }

    return (
        <div className="table-wrapper" style={{width:"100vw"}} id={"companyList"}>
            <h1  className="adminPageHeader">Companies</h1>
            <Table className="table table-bordered table-dark">
                <thead>
                    <tr>
                        <th scope="col">Code</th>
                        <th scope="col">Name</th>
                        <th scope="col">Action</th>
                        <th scope="col">Staff(s)</th>
                        
                    </tr>
                </thead>

                    {dataTable()}

            </Table>
            {/* <Routes>
                <Route path="edit-company" element={<RegisterAdmin userData={props.userData}/>} />
                <Route path="add-staff" element={<CreateCompany userData={props.userData}/>}/>
            </Routes> */}
        </div>
        
    )
}

