import React, { Component, useEffect, useState } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'
import {CompanyTable} from '../../components/company_table'
import { Routes, Route, Link } from "react-router-dom";

import { CreateCompanyPage } from '../CreateCompany'
import { RegisterAdminPage } from '../RegisterAdmin'
import "../../assets/style/companyList.css";

export function CompanyListPage(props) {

    const [companies, setCompanies] = useState([])
    const [userData] = useState(eval('('+localStorage.getItem("userData")+')'))
    useEffect(() => {
        // setUserData(localStorage.getItem("userData"))
        console.log(userData)
        updateData()
        
        // console.log(props.userData)
      }, [userData]);
    
    const updateData = () => {

        axios.get('http://localhost:4000/company',{headers:{"x-access-token":userData.token}})
        .then( res => {
            setCompanies(res.data)
            // console.log(res.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }


    const dataTable = () => {
        return companies.map((res, i) => {
            return <CompanyTable userData={userData} obj={res} key={i} refresh={updateData}/>
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
            
                    {userData ? (dataTable()) : (<></>)}

            </Table>
            {/* <Routes>
                <Route path="edit-company" element={<RegisterAdmin userData={props.userData}/>} />
                <Route path="add-staff" element={<CreateCompany userData={props.userData}/>}/>
            </Routes> */}
        </div>
        
    )
}

