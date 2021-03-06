import React from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChartPie, 
    faCirclePlus, 
    faPen, 
    faBan, 
    faLocationDot, 
    faAddressBook, 
    faInstitution, 
    faCubes, 
    faHistory
} from "@fortawesome/free-solid-svg-icons";



export const navbarManagerData = [
    {
        title: 'Overview',
        path: '/main/overview',
        icon: <FontAwesomeIcon icon={faChartPie}/>,
        cName: 'nav-text'
    },
    {
        title: 'Shipment',
        path: '/main/shipment',
        icon: <FontAwesomeIcon icon={faCubes}/>,
        cName: 'nav-text'
    },
    {
        title: 'Create Shipment',
        path: '/main/create',
        icon: <FontAwesomeIcon icon={faCirclePlus}/>,
        cName: 'nav-text'
    },
    {
        title: 'Update Shipment',
        path: '/main/scan',
        icon: <FontAwesomeIcon icon={faPen}/>,
        cName: 'nav-text'
    },
    {
        title: 'Cancel Shipment',
        path: '/main/cancel',
        icon: <FontAwesomeIcon icon={faBan}/>,
        cName: 'nav-text'
    },
    {
        title: 'Place & Location',
        path: '/main/node',
        icon: <FontAwesomeIcon icon={faLocationDot}/>,
        cName: 'nav-text'
    },
    {
        title: 'Company & Staff',
        path: '/main/staff-list/',
        icon: <FontAwesomeIcon icon={faAddressBook}/>,
        cName: 'nav-text'
    },
    {
        title: 'Audit Transaction',
        path: '/main/audit',
        icon: <FontAwesomeIcon icon={faHistory}/>,
        cName: 'nav-text'
    },
]

export const navbarStaffData = [
    {
        title: 'Overview',
        path: '/main/overview',
        icon: <FontAwesomeIcon icon={faChartPie}/>,
        cName: 'nav-text'
    },
    {
        title: 'Shipment',
        path: '/main/shipment',
        icon: <FontAwesomeIcon icon={faCubes}/>,
        cName: 'nav-text'
    },
    {
        title: 'Create Shipment',
        path: '/main/create',
        icon: <FontAwesomeIcon icon={faCirclePlus}/>,
        cName: 'nav-text'
    },
    {
        title: 'Update Shipment',
        path: '/main/scan',
        icon: <FontAwesomeIcon icon={faPen}/>,
        cName: 'nav-text'
    },
    {
        title: 'Cancel Shipment',
        path: '/main/cancel',
        icon: <FontAwesomeIcon icon={faBan}/>,
        cName: 'nav-text'
    },
    {
        title: 'Place & Location',
        path: '/main/node',
        icon: <FontAwesomeIcon icon={faLocationDot}/>,
        cName: 'nav-text'
    },
    {
        title: 'Audit Transaction',
        path: '/main/audit',
        icon: <FontAwesomeIcon icon={faHistory}/>,
        cName: 'nav-text'
    },
]

export const navbarAdminData = [
    {
        title: 'Company List',
        path: '/main/company-list',
        icon: <FontAwesomeIcon icon={faInstitution}/>,
        cName: 'nav-text'
    },
    {
        title: 'Create Company',
        path: '/main/create-company',
        icon: <FontAwesomeIcon icon={faCirclePlus}/>,
        cName: 'nav-text'
    },
    {
        title: 'Register Admin',
        path: '/main/register-admin',
        icon: <FontAwesomeIcon icon={faAddressBook}/>,
        cName: 'nav-text'
    },
]