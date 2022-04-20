import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent } from "react-pro-sidebar";
import { Routes, Route, Link } from "react-router-dom";

import Login from "../loginScreen"
import CreateCompany from "../create-company.component"
import EditCompany from "../edit-company.component"
import CompanyList from "../company-list.component"
import AddStaff from "../add-account.component"
import MapPage from "../map/map.component"
import AddDistCenter from "../add-dist-center.component"
import ViewStaff from "../view-staff.component"
import { OverviewPage } from "../../pages/Overview";
import { ShipmentPage } from "../../pages/Shipment";
import CreateShipment from "../create-shipment.component"
import ViewShipment from "../view-shipment.component"
import 'react-pro-sidebar/dist/css/styles.css';
import "../../assets/style/sidebar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faTicket, faCirclePlus, faPen, faBan, faLocationDot } from "@fortawesome/free-solid-svg-icons";

// import { SidebarData } from "./sidebarData";

import { useState } from "react";



export const CustomSidebar = () => {

    const [activeItemIndex, setActiveItemIndex] = useState(() => {
        const initialIndex = 
            window.location.pathname === "/overview" ? 0 
            : window.location.pathname === "/shipment" ? 1 
            : window.location. pathname === '/' ? 2 
            : window.location. pathname === '/' ? 3 
            : window.location. pathname === '/' ? 4
            : window.location. pathname === '/' ? 5 
            : window.location. pathname === '/map' ? 6 
            : window.location. pathname === '/create-company' ? 7 
            : window.location. pathname === '/company-list' ? 8 
            : 0; 
        return initialIndex;
    });
    
    return (
        <>
            <ProSidebar id="sideNavBar">
                <SidebarHeader className="sidebarHeaderContainer">
                    <Link to={"/overview"} onClick={() => {setActiveItemIndex(0)}} className="headerLink">
                        <p>Project Yoru</p>
                    </Link>
                </SidebarHeader>
                <Menu iconShape="square">
                    <MenuItem active={activeItemIndex === 0} icon={<FontAwesomeIcon icon={faChartPie}/>}>
                        <Link to={"/overview"} onClick={() => {setActiveItemIndex(0)}}>Overview</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 1} icon={<FontAwesomeIcon icon={faTicket}/>}>
                        <Link to={"/shipment"} onClick={() => {setActiveItemIndex(1)}}>Shipment</Link>
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
                        <Link to={"/"} onClick={() => {setActiveItemIndex(5)}}>Place & Location</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 6} >
                        <Link to={"/map"} onClick={() => {setActiveItemIndex(6)}}>Map(Temporary Link)</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 7} >
                        <Link to={"/create-company"} onClick={() => {setActiveItemIndex(7)}}>Create Company(Temporary Link)</Link>
                    </MenuItem>
                    <MenuItem active={activeItemIndex === 8} >
                        <Link to={"/company-list"} onClick={() => {setActiveItemIndex(8)}}>Company List(Temporary Link)</Link>
                    </MenuItem>
                </Menu>
            </ProSidebar>

            <Routes>
                <Route exact path="/" element={<Login/>}/>
                <Route path="/create-company" element={<CreateCompany/>}/>
                <Route path="/edit-company/:id" element={<EditCompany/>}/>
                <Route path="/company-list" element={<CompanyList/>}/>
                <Route path="/add-staff/:id" element={<AddStaff/>}/>
                <Route path="/view-staff/:id" element={<ViewStaff/>}/>
                <Route path="/add-dist-center/:id" element={<AddDistCenter/>}/>
                <Route path="/map/" element={<MapPage/>}/>
                <Route path="/overview" element={<OverviewPage/>}/>
                <Route path="/shipment" element={<ViewShipment/>}/>     {/* DON'T FORGET TO CHANGE IT BACK TO SHIPMENT PAGE*/ }
                <Route path="/create-shipment" element={<CreateShipment/>}/>

            </Routes>
        </>
        
    );
}
