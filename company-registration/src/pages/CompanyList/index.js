import React, { Component, useEffect, useState } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'
import {CompanyTable} from '../../components/company_table'
import { Routes, Route, Link } from "react-router-dom";

import { CreateCompanyPage } from '../CreateCompany'
import { RegisterAdminPage } from '../RegisterAdmin'
import { EditCompanyPopup } from '../../components/edit_company_popup';

import "../../assets/style/companyList.css";
import "../../assets/style/style.css";

import { ViewStaffPopup } from '../../components/view_staff_popup';
import { AddStaffPopup } from '../../components/add_staff_popup';
import CompanyService from '../../services/CompanyService';

export function CompanyListPage(props) {

    const [companies, setCompanies] = useState([])
    const [userData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const [showEditComp, setShowEditComp] = useState(false);
    const [showViewStaff, setShowViewStaff] = useState(false);
    const [showAddStaff, setShowAddStaff] = useState(false);
    const [viewStaffUsername, setViewStaffUsername] = useState(null)
    const [companyCode, setCompanyCode] = useState(null)
    useEffect(() => {
        // setUserData(localStorage.getItem("userData"))
        console.log(userData)
        updateData()
        
        // console.log(props.userData)
      }, [userData]);
    
    const updateData = () => {
        CompanyService.getAllCompany( userData.token)
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
            return <CompanyTable userData={userData} obj={res} key={i} refresh={updateData}
            setEditCompPopup={setShowEditComp} setViewStaffPopup={setShowViewStaff} setViewStaffUsername={setViewStaffUsername} 
             setCompanyCode={setCompanyCode} setAddStaffPopup={setShowAddStaff}/>
        })
    }

    return (
        <div className="content-main-container">
            <div className="content-title-container">
                <h1  className="adminPageHeader">Companies</h1>
            </div>
            <div className="content-table-container">
                <Table className="table table-hover company-table">
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
                
            </div>
            {showEditComp && companyCode && <EditCompanyPopup setOpenPopup={setShowEditComp} companyCode={companyCode} updateTable={updateData}/>}
            {showViewStaff && viewStaffUsername && <ViewStaffPopup setOpenPopup={setShowViewStaff} username={viewStaffUsername}/>}
            {showAddStaff && companyCode && <AddStaffPopup setOpenPopup={setShowAddStaff} companyCode={companyCode} updateTable={() => {
                window.location.reload(false);
            }}/>}
            

            {/* <Routes>
                <Route path="edit-company" element={<RegisterAdmin userData={props.userData}/>} />
                <Route path="add-staff" element={<CreateCompany userData={props.userData}/>}/>
            </Routes> */}
        </div>
        
    )
}

