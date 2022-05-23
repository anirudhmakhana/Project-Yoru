import React, {useEffect, useState} from "react";
import {useParams, useLocation} from "react-router-dom"
import { AdminSidebar } from "../../components/admin_sidebar";
import { CustomSidebar } from "../../components/sidebar";
// import { ManagerSidebar } from "../../components/manager_sidebar";

import { Navbar } from "../../components/navbar";

export const MainPage = (props) => {
    let location = useLocation()
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const [userType, setUserType] = useState(localStorage.getItem("userType"))

    return (
        <div className="mainPageWrapper">
            <Navbar/>
        </div>
    );
    
}