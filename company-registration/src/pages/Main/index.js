import React, {useEffect, useState} from "react";
import {useParams, useLocation} from "react-router-dom"
import { CustomSidebar } from "../../components/sidebar";

export const MainPage = (props) => {
    let location = useLocation()
    const [userData, setUserData] = useState()
    useEffect(() => {
        setUserData(location.state.userData)
        console.log(location.state.userData)
      }, [userData]);
    // console.log(location.state.userData)
    return (
        <div className="mainPageWrapper">
            <CustomSidebar userData = {userData}/>
        </div>
    );
}