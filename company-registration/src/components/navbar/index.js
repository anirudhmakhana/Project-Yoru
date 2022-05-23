import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent } from "react-pro-sidebar";
import { Routes, Route, Link } from "react-router-dom";

import { OverviewPage } from "../../pages/Overview";
import { ShipmentListPage } from "../../pages/ShipmentList";
import { AddStaffPage } from "../../pages/AddStaff";
import { StaffListPage } from "../../pages/StaffList";
import { ViewStaffPage } from "../../pages/ViewStaff"
import { EditCompanyPage } from "../../pages/EditCompany";
import { EditStaffPage } from "../../pages/EditStaff";
import { useEffect } from "react"

import 'react-pro-sidebar/dist/css/styles.css';
import "../../assets/style/navbar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars, faLockOpen } from "@fortawesome/free-solid-svg-icons";


import { useState } from "react";

import { NodeListPage } from "../../pages/NodeList";
import { ViewNodePage } from "../../pages/ViewNode";
import { ViewShipmentPage } from "../../pages/ViewShipment";
import { CreateSHP } from "../../pages/CreateShipment";
import { CancelSHP } from "../../pages/CancelShipment";
import { ScanSHP } from "../../pages/ScanShipment";

import { navbarManagerData } from "./navbarData";

import applogo from "../../assets/icons/applogo.png"


export const Navbar = (props) => {
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const [menuCollapse, setMenuCollapse] = useState(false)
    
    // const [activeItemIndex, setActiveItemIndex] = useState(() => {
    //     const initialIndex = 
    //         window.location.pathname === "overview" ? 0 
    //         : window.location.pathname === "shipment" ? 1 
    //         : window.location.pathname === 'create' ? 2 
    //         : window.location.pathname === 'scan' ? 3 
    //         : window.location.pathname === 'cancel' ? 4
    //         : window.location.pathname === 'node' ? 5 
    //         : window.location.pathname === 'register-staff' ? 6 
    //         : window.location.pathname === 'staff-list' ? 7 
    //         : window.location.pathname === 'edit-company' ? 8
    //         : window.location.pathname === '/' ? 9
    //         : 0; 
    //     return initialIndex;
    // });

    const menuCollapseToggle = () => setMenuCollapse(!menuCollapse);

    const sidebarData = navbarManagerData
    
    return (
        <>
            <div className="navbar">
                <img src={applogo} alt="logo" className="navbar-title"/>
                <Link to='#' className='menu-bars'>
                    <FontAwesomeIcon icon={faBars} onClick={menuCollapseToggle}/>
                </Link>
                
            </div>
            <nav className={menuCollapse ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' onClick={menuCollapseToggle}>
                    <li className='navbar-toggle' style={{justifyContent: "flex-end"}}>
                        <Link to='#' className='menu-bars'>
                            <FontAwesomeIcon icon={faXmark} onClick={menuCollapseToggle}/>
                        </Link>
                    </li>
                    {sidebarData.map((item, index) => {
                    return (
                        <li key={index} className={item.cName}>
                            <Link to={item.path}>
                                {item.icon}
                                <span>{item.title}</span>
                            </Link>
                        </li>
                    );
                    })}
                    <li className='nav-footer'>
                        <Link to='/'>
                            <FontAwesomeIcon icon={faLockOpen} />
                            <span>Logout</span>
                        </Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="overview" element={<OverviewPage/>}/>
                <Route path="shipment" element={<ShipmentListPage/>}/>
                <Route path="shipment/view-shipment/:shipmentId" element={<ViewShipmentPage/>}/>
                <Route path="register-staff/:companyCode" element={<AddStaffPage/>}/> 
                <Route path="staff-list/:companyCode" element={<StaffListPage />}/>
                <Route path="staff-list/:companyCode/view-staff/:username" element={<ViewStaffPage/>}/>
                <Route path="edit-company/:companyCode" element={<EditCompanyPage/>}/>
                <Route path="staff-list/:companyCode/edit-staff/:username" element={<EditStaffPage/>}/>
                <Route path="node" element={<NodeListPage/>}/>
                <Route path="node/view-node/:nodeCode" element={<ViewNodePage/>}/>
                <Route path="create" element={<CreateSHP/>}/>

                {/* CHANGE TO scan/update/:shipmentId */}
                <Route path="cancel" element={<CancelSHP/>}/>
                <Route path="scan" element={<ScanSHP/>}/>

                {/* Need to improve pages style and may change to other register page */}

            </Routes>
        </>
        
    );
}
