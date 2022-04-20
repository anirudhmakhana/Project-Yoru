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

import { SidebarData } from "./sidebarData";

import { useState } from "react";



export const CustomSidebar = () => {

    const [activeItem, setActiveItem] = useState(null);
    
    const handleActive = (event) => {
        if (!event.target.value.includes("active")) {
            event.target.toggle('active') ;
            if (activeItem)
                activeItem.remove("active") ;
            setActiveItem(event.target) ;
            }
    }
    
    return (
        <>
            <ProSidebar id="sideNavBar">
                <SidebarHeader className="sidebarHeaderContainer">
                    <Link to={"/"} className="headerLink">
                        <p>Project Yoru</p>
                    </Link>
                </SidebarHeader>
                <Menu iconShape="square">
                    <MenuItem icon={<FontAwesomeIcon icon={faChartPie}/>}>
                        <Link to={"/overview"} onClick={handleActive}>Overview</Link>
                    </MenuItem>
                    <MenuItem icon={<FontAwesomeIcon icon={faTicket}/>}>
                        <Link to={"/shipment"} onClick={handleActive}>Shipment</Link>
                    </MenuItem>
                    <MenuItem icon={<FontAwesomeIcon icon={faCirclePlus}/>}>
                        <Link to={"/"} onClick={handleActive}>Create Shipment</Link>
                    </MenuItem>
                    <MenuItem icon={<FontAwesomeIcon icon={faPen}/>}>
                        <Link to={"/"} onClick={handleActive}>Update Shipment</Link>
                    </MenuItem>
                    <MenuItem icon={<FontAwesomeIcon icon={faBan}/>}>
                        <Link to={"/"} onClick={handleActive}>Cancel Shipment</Link>
                    </MenuItem>
                    <MenuItem icon={<FontAwesomeIcon icon={faLocationDot}/>}>
                        <Link to={"/"} onClick={handleActive}>Place & Location</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to={"/map"} onClick={handleActive}>Map(Temporary Link)</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to={"/create-company"} onClick={handleActive}>Create Company(Temporary Link)</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to={"/company-list"} onClick={handleActive}>Company List(Temporary Link)</Link>
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
