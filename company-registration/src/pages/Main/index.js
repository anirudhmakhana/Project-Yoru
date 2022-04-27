import React, {useEffect, useState} from "react";
import {useParams, useLocation} from "react-router-dom"
import { AdminSidebar } from "../../components/admin_sidebar";
import { CustomSidebar } from "../../components/sidebar";

export const MainPage = (props) => {
    let location = useLocation()
    const [userData, setUserData] = useState()
    const [userType, setUserType] = useState()
    useEffect(() => {
        setUserData(location.state.userData)
        setUserType(location.state.userType)
        console.log(location.state.userData)
      }, [userData, userType]);
    // console.log(location.state.userData)

    if ( userType == "admin" ) {
        return (
            <div className="mainPageWrapper">
                <AdminSidebar userData = {userData}/>
            </div>
        );
    }
    return (
        <div className="mainPageWrapper">
            <CustomSidebar userData = {userData}/>
        </div>
    );
}