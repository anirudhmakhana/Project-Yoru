import React, {useEffect, useState} from "react";
import {useParams, useLocation} from "react-router-dom"
import { AdminSidebar } from "../../components/admin_sidebar";
import { CustomSidebar } from "../../components/sidebar";
import { ManagerSidebar } from "../../components/manager_sidebar";

export const MainPage = (props) => {
    let location = useLocation()
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const [userType, setUserType] = useState(localStorage.getItem("userType"))

    if ( userType == "admin" ) {
        return (
            <div className="mainPageWrapper">
                <AdminSidebar/>
            </div>
        );
    } else if (userData.positionLevel == "staff"){
        return (
            <div className="mainPageWrapper">
                <CustomSidebar/>
            </div>
        );
    } else if ( userData.positionLevel == "manager") {
        return (
            <div className="mainPageWrapper">
                <ManagerSidebar/>
            </div>
        );
    }
    
}