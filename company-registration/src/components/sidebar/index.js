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


export const CustomSidebar = () => {
    return (
        <ProSidebar>
            <SidebarHeader>
                Project Yoru
            </SidebarHeader>
            <Menu iconShape="square">
                <MenuItem>Overview</MenuItem>
                <MenuItem>Shipment</MenuItem>
                <MenuItem>Edit Shipment</MenuItem>
                <MenuItem>Update Shipment</MenuItem>
                <MenuItem>Cancel Shipment</MenuItem>
                <MenuItem>Place & Location</MenuItem>
            </Menu>
        </ProSidebar>
    );
}
