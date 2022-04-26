import React, {useState} from "react";
import {useParams, useLocation} from "react-router-dom"
import { CustomSidebar } from "../../components/sidebar";

export const MainPage = (props) => {
    let location = useLocation()
    const [userData, setUserData] = useState(location.state.userData)
    console.log(userData)
    return (
        <div className="mainPageWrapper">
            <CustomSidebar/>
        </div>
    );
}