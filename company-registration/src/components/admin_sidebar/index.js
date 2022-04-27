import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent } from "react-pro-sidebar";
import { Routes, Route, Link } from "react-router-dom";

import { OverviewPage } from "../../pages/Overview";
import { ShipmentPage } from "../../pages/Shipment";
import { useEffect } from "react"

import 'react-pro-sidebar/dist/css/styles.css';
import "../../assets/style/sidebar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faTicket, faCirclePlus, faPen, faBan, faLocationDot, faAddressBook, faAdd } from "@fortawesome/free-solid-svg-icons";


import { useState } from "react";

import TempViewShipment from "../view-shipment.component"
import {CompanyList} from "../../pages/CompanyList";
import {CreateCompany} from "../../pages/CreateCompany"
import {RegisterAdmin} from "../../pages/RegisterAdmin"

export const AdminSidebar = (props) => {
    const [userData, setUserData] = useState(null)
    useEffect(() => {
        setUserData(props.userData)
      }, [userData]);
    const [activeItemIndex, setActiveItemIndex] = useState(() => {
        const initialIndex = 
             window.location. pathname === 'company-list' ? 0
            : window.location. pathname === 'create-company' ? 1
            : window.location. pathname === 'register-admin' ? 2
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
                    {/* <MenuItem active={activeItemIndex === 0} icon={<FontAwesomeIcon icon={faChartPie}/>}>
                        <Link to={"overview"} onClick={() => {setActiveItemIndex(0)}}>Overview</Link>
                    </MenuItem> */}
                    {/* <MenuItem active={activeItemIndex === 1} icon={<FontAwesomeIcon icon={faTicket}/>}>
                        <Link to={"shipment"} onClick={() => {setActiveItemIndex(1)}}>Shipment</Link>
                    </MenuItem> */}
                    {/* <MenuItem active={activeItemIndex === 2} icon={<FontAwesomeIcon icon={faCirclePlus}/>}>
                        <Link to={"/"} onClick={() => {setActiveItemIndex(2)}}>Create Shipment</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 3} icon={<FontAwesomeIcon icon={faPen}/>}>
                        <Link to={"/"} onClick={() => {setActiveItemIndex(3)}}>Update Shipment</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 4} icon={<FontAwesomeIcon icon={faBan}/>}>
                        <Link to={"/"} onClick={() => {setActiveItemIndex(4)}}>Cancel Shipment</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 5} icon={<FontAwesomeIcon icon={faLocationDot}/>}>
                        <Link to={"/"} onClick={() => {setActiveItemIndex(5)}}>Place & Location</Link>
                    </MenuItem> */}
                    <MenuItem active={activeItemIndex === 0} icon={<FontAwesomeIcon icon={faCirclePlus}/>}>
                        <Link to={"company-list"} onClick={() => {setActiveItemIndex(0)}}>Companies List</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 1} icon={<FontAwesomeIcon icon={faBan}/>}>
                        <Link to={"create-company"} onClick={() => {setActiveItemIndex(1)}}>Create Company</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 2} icon={<FontAwesomeIcon icon={faAddressBook}/>}>
                        <Link to={"register-admin"} onClick={() => {setActiveItemIndex(2)}}>Register Admin</Link>
                    </MenuItem>
                </Menu>
            </ProSidebar>

            <Routes>
                <Route path="company-list" element={<CompanyList userData={props.userData}/>} />
                <Route path="create-company" element={<CreateCompany userData={props.userData}/>}/>
                <Route path="register-admin" element={<RegisterAdmin userData={props.userData}/>}/>
            </Routes>
        </>
        
    );
}
