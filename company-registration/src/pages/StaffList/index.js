import React, { Component, useEffect, useState } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'
import StaffTableRow from './StaffTableRow'
import { Routes, Route, Link, useParams } from "react-router-dom";

import { CreateCompanyPage } from '../CreateCompany'
import { RegisterAdminPage } from '../RegisterAdmin'
import "../../assets/style/companyList.css";

export function StaffListPage(props) {
    const { companyCode } = useParams()

    const [staffs, setStaffs] = useState([])
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const [companyName, setCompanyName] = useState(null)
    useEffect(() => {
        // setUserData(props.userData)
        console.log(localStorage.getItem("userData"))
        console.log(userData)
        axios.get('http://localhost:4000/company/'+companyCode,{headers:{"x-access-token":userData.token}})
        .then( res => {
            setCompanyName(res.data.companyName)
            console.log(res.data)
        })
        .catch((error) => {
            console.log(error)
        })
        updateData()
        // console.log(props.userData)
    }, [userData]);

    const updateData = () => {
        axios.get('http://localhost:4000/staff/getByCompany/'+companyCode,{headers:{"x-access-token":userData.token}})
        .then( res => {
            setStaffs(res.data)
            console.log(res.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }
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
        return staffs.map((res, i) => {
            console.log(i)
            return <StaffTableRow userData={userData} obj={res} index={i+1} refresh={updateData}/>
        })
    }

    return (
        <div className="table-wrapper" style={{width:"100vw"}} id={"companyList"}>
            {companyName ? (<h1  className="adminPageHeader">{companyName}</h1>)
            : (<h1  className="adminPageHeader">{companyCode}</h1>)}
            
            <Table className="table table-bordered table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Action</th>
                        
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

