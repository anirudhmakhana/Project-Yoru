import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent } from "react-pro-sidebar";
import { Routes, Route, Link } from "react-router-dom";

import { OverviewPage } from "../../pages/Overview";
import { ShipmentPage } from "../../pages/Shipment";
import { useEffect } from "react"

import 'react-pro-sidebar/dist/css/styles.css';
import "../../assets/style/sidebar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faTicket, faCirclePlus, faPen, faBan, faLocationDot } from "@fortawesome/free-solid-svg-icons";


import { useState } from "react";

import TempViewShipment from "../view-shipment.component"
import CompanyList from "../company-list.component";


export const AdminSidebar = (props) => {
    const [userData, setUserData] = useState(null)
    useEffect(() => {
        setUserData(props.userData)
      }, [userData]);
    const [activeItemIndex, setActiveItemIndex] = useState(() => {
        const initialIndex = 
            // window.location.pathname === "overview" ? 0 
            // : window.location.pathname === "shipment" ? 1 
            // : window.location. pathname === '/' ? 2 
            // : window.location. pathname === '/' ? 3 
            // : window.location. pathname === '/' ? 4
            // : window.location. pathname === '/' ? 5 
             window.location. pathname === 'map' ? 0
            : window.location. pathname === 'create-company' ? 1
            : window.location. pathname === '/company-list' ? 2
            : 0; 
        return initialIndex;
    });
    
    return (
        <>
            <ProSidebar id="sideNavBar">
                <SidebarHeader className="sidebarHeaderContainer">
                    <Link to={"overview"} onClick={() => {setActiveItemIndex(0)}} className="headerLink">
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
                    <MenuItem active={activeItemIndex === 0} >
                        <Link to={"map"} onClick={() => {setActiveItemIndex(0)}}>Map(Temporary Link)</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 1} >
                        <Link to={"add-dist-center"} onClick={() => {setActiveItemIndex(1)}}>Create Company(Temporary Link)</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 2} >
                        <Link to={"company-list"} onClick={() => {setActiveItemIndex(2)}}>Company List(Temporary Link)</Link>
                    </MenuItem>
                </Menu>
            </ProSidebar>

            <Routes>
                <Route path="company-list" element={<CompanyList userData={userData}/>} />
            </Routes>
        </>
        
    );
}
