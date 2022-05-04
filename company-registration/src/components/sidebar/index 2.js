import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent } from "react-pro-sidebar";
import { Routes, Route, Link } from "react-router-dom";

import { OverviewPage } from "../../pages/Overview";
import { ShipmentListPage } from "../../pages/ShipmentList";
import { RegisterPage} from "../../pages/Register"
import { AddStaffPage } from "../../pages/AddStaff";
import { StaffListPage } from "../../pages/StaffList";
import { ViewStaffPage } from "../../pages/ViewStaff"
import { EditStaffPage } from "../../pages/EditStaff";
import { useEffect } from "react"

import 'react-pro-sidebar/dist/css/styles.css';
import "../../assets/style/sidebar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faTicket, faCirclePlus, faPen, faBan, faLocationDot, faAddressBook, faAddressCard, faLockOpen } from "@fortawesome/free-solid-svg-icons";


import { useState } from "react";

import TempViewShipment from "../view-shipment.component"
import { NodeListPage } from "../../pages/NodeList";



export const CustomSidebar = (props) => {
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    // useEffect(() => {
    //     setUserData(props.userData)
    //   }, [userData]);
    const [activeItemIndex, setActiveItemIndex] = useState(() => {
        const initialIndex = 
            window.location.pathname === "overview" ? 0 
            : window.location.pathname === "shipment" ? 1 
            : window.location.pathname === '/' ? 2 
            : window.location.pathname === '/' ? 3 
            : window.location.pathname === '/' ? 4
            : window.location.pathname === 'node' ? 5 
            : window.location.pathname === 'edit-staff' ? 6 
            : window.location.pathname === 'staff-list' ? 7 
            : window.location.pathname === '/' ? 8 
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
                    <MenuItem active={activeItemIndex === 0} icon={<FontAwesomeIcon icon={faChartPie}/>}>
                        <Link to={"overview"} onClick={() => {setActiveItemIndex(0)}}>Overview</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 1} icon={<FontAwesomeIcon icon={faTicket}/>}>
                        <Link to={"shipment"} onClick={() => {setActiveItemIndex(1)}}>Shipment</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 2} icon={<FontAwesomeIcon icon={faCirclePlus}/>}>
                        <Link to={"/"} onClick={() => {setActiveItemIndex(2)}}>Create Shipment</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 3} icon={<FontAwesomeIcon icon={faPen}/>}>
                        <Link to={"/"} onClick={() => {setActiveItemIndex(3)}}>Update Shipment</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 4} icon={<FontAwesomeIcon icon={faBan}/>}>
                        <Link to={"/"} onClick={() => {setActiveItemIndex(4)}}>Cancel Shipment</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 5} icon={<FontAwesomeIcon icon={faLocationDot}/>}>
                        <Link to={"node"} onClick={() => {setActiveItemIndex(5)}}>Place & Location</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 6} icon={<FontAwesomeIcon icon={faAddressCard}/>}>
                        <Link to={"edit-staff/"+userData.companyCode+"/"+userData.username} onClick={() => {setActiveItemIndex(6)}}>Edit Account</Link>
                    </MenuItem>
                    {/* <MenuItem active={activeItemIndex === 7} icon={<FontAwesomeIcon icon={faAddressBook}/>}>
                        <Link to={"staff-list/"+userData.companyCode} onClick={() => {setActiveItemIndex(7)}}>Staff List</Link>
                    </MenuItem> */}
                    <MenuItem active={activeItemIndex === 8} icon={<FontAwesomeIcon icon={faLockOpen}/>}>
                        <Link to={"/"} onClick={() => {
                            //TODO: clear local storage here
                            localStorage.clear()
                            setActiveItemIndex(8)}}>Log Out</Link>
                    </MenuItem>

                </Menu>
                
            </ProSidebar>

            <Routes>
                <Route path="overview" element={<OverviewPage/>}/>
                <Route path="shipment" element={<ShipmentListPage/>}/>
                <Route path="edit-staff/:companyCode/:username" element={<EditStaffPage/>}/>
                <Route path="node" element={<NodeListPage/>}/>
                {/* <Route path="node/view-node/:nodeCode" element={<ViewNodePage/>}/> */}
                {/* <Route path="register-staff/:companyCode" element={<AddStaffPage />}/> 
                <Route path="staff-list/:companyCode" element={<StaffListPage />}/> 
                <Route path="staff-list/:companyCode/view-staff/:username" element={<ViewStaffPage/>}/> */}

                {/* Need to improve pages style and may change to other register page */}

            </Routes>
        </>
        
    );
}