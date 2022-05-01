import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'
import { useParams } from "react-router-dom";
import { StaffTable } from "../../components/staff_table"
import StaffAccountService from '../../services/StaffAccountService';
import CompanyService from '../../services/CompanyService';

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
        CompanyService.getCompanyByCode(companyCode, userData.token)
        .then( company => setCompanyName(company.data.companyName))
        .catch(err => console.log(err))        

        updateData()
        // console.log(props.userData)
    }, [userData]);

    const updateData = () => {
        StaffAccountService.getStaffByCompany(companyCode, userData.token )
        .then(res => setStaffs(res.data))
        .catch(err => console.log(err))        
    }


    const dataTable = () => {
        return staffs.map((res, i) => {
            console.log(i)
            return <StaffTable userData={userData} obj={res} index={i+1} refresh={updateData}/>
        })
    }

    return (
        <div id="shipment">
            <div className="title-container">
            {companyName ? (<h1  className="adminPageHeader">{companyName}</h1>)
            : (<h1  className="adminPageHeader">{companyCode}</h1>)}
            </div>
            
            
            <Table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Action</th>
                        
                    </tr>
                </thead>

                {userData ? (dataTable()) : (<></>)}

            </Table>
        </div>
        
    )
}

