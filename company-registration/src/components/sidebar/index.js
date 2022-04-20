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

export const CustomSidebar = () => {
    return (
        <>
            <ProSidebar id="sideNavBar">
                <SidebarHeader className="sidebarHeaderContainer">
                    <Link to={"/"} className="headerLink">
                        <p>Project Yoru</p>
                    </Link>
                </SidebarHeader>
                <Menu iconShape="square">
                    <MenuItem active={true}>
                        <Link to={"/overview"}>Overview</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to={"/shipment"}>Shipment</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to={"/create-shipment"}>Create Shipment</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to={"/"}>Update Shipment</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to={"/"}>Cancel Shipment</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to={"/"}>Place & Location</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to={"/map"}>Map</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to={"/create-company"}>Create Company</Link>
                    </MenuItem>
                    <MenuItem>
                        <Link to={"/company-list"}>Company List</Link>
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
