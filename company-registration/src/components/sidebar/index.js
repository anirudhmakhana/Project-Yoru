import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent } from "react-pro-sidebar";
import 'react-pro-sidebar/dist/css/styles.css';


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
