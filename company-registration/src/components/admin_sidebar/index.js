import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent } from "react-pro-sidebar";
import { Routes, Route, Link } from "react-router-dom";

import { useEffect } from "react"

import 'react-pro-sidebar/dist/css/styles.css';
import "../../assets/style/sidebar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faTicket, faCirclePlus, faPen, faBan, faLocationDot, faAddressBook, faAdd, faLockOpen } from "@fortawesome/free-solid-svg-icons";


import { useState } from "react";

import TempViewShipment from "../view-shipment.component"
import { CompanyListPage } from "../../pages/CompanyList";
import { CreateCompanyPage } from "../../pages/CreateCompany"
import { RegisterAdminPage } from "../../pages/RegisterAdmin"
import { EditCompanyPage} from "../../pages/EditCompany"
import { AddStaffPage } from "../../pages/AddStaff";
import { ViewStaffPage } from "../../pages/ViewStaff";

export const AdminSidebar = (props) => {
    const userData = useState(eval('('+localStorage.getItem("userData")+')'))
    // useEffect(() => {
    //     setUserData(localStorage.getItem("userData"))
    //   }, [userData]);
    const [activeItemIndex, setActiveItemIndex] = useState(() => {
        const initialIndex = 
             window.location.pathname === 'company-list' ? 0
            : window.location.pathname === 'create-company' ? 1
            : window.location.pathname === 'register-admin' ? 2
            : window.location.pathname === '/admin' ? 3
            : 0; 
        return initialIndex;
    });
    
    return (
        <>
            <ProSidebar id="sideNavBar">
                <SidebarHeader className="sidebarHeaderContainer">
                    <Link to={"company-list"} onClick={() => {setActiveItemIndex(0)}} className="headerLink">
                        <p>Project Yoru</p>
                    </Link>
                </SidebarHeader>
                <Menu iconShape="square">
                    <MenuItem active={activeItemIndex === 0} icon={<FontAwesomeIcon icon={faCirclePlus}/>}>
                        <Link to={"company-list"} onClick={() => {setActiveItemIndex(0)}}>Companies List</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 1} icon={<FontAwesomeIcon icon={faBan}/>}>
                        <Link to={"create-company"} onClick={() => {setActiveItemIndex(1)}}>Create Company</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 2} icon={<FontAwesomeIcon icon={faAddressBook}/>}>
                        <Link to={"register-admin"} onClick={() => {setActiveItemIndex(2)}}>Register Admin</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 3} icon={<FontAwesomeIcon icon={faLockOpen}/>}>
                        <Link to={"/admin"} onClick={() => {
                            //TODO: clear local storage here
                            localStorage.clear()
                            setActiveItemIndex(3)}}>Log Out</Link>
                    </MenuItem>
                </Menu>
            </ProSidebar>

            <Routes>
                <Route path="company-list" element={<CompanyListPage/>} />
                <Route path="create-company" element={<CreateCompanyPage/>}/>
                <Route path="register-admin" element={<RegisterAdminPage/>}/>
                <Route path="company-list/edit-company/:companyCode" element={<EditCompanyPage/>}/>
                <Route path="company-list/add-staff/:companyCode" element={<AddStaffPage/>}/>
                <Route path="company-list/view-staff/:username" element={<ViewStaffPage/>}/>

            </Routes>
        </>
        
    );
}
