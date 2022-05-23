import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import axios from "axios";
import StaffAccountService from "../../services/StaffAccountService";

import "../../assets/style/style.css"

export const ViewStaffPopup = ({setOpenPopup, username}) => {
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    // const { username } = useParams()
    const [companyCode, setCompanyCode] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [positionLevel, setPositionLevel] = useState('staff')

    useEffect(() => {
        
        StaffAccountService.getStaffByUsername(username, userData.token)
        .then(res => {
            setFullName(res.data.fullName)
            setEmail(res.data.email)
            setCompanyCode(res.data.companyCode)
            setPositionLevel(res.data.positionLevel)
        })
        .catch(err => {
            console.log(err)
        })
        
        // console.log(props.userData)
      }, []);



 
    return (
        <div className="popupBackground">
            <div className="startPageContainer">
                <div className="logo">
                    <h3 className="h3-logo">View Staff Account</h3>
                </div>

                <form>

                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="username">Username</label>
                        <input type="text" id="username" name="username" value={username} disabled></input>
                    </div>
                    
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="fullname">Full Name</label>
                        <input type="text" id="fullname" name="fullname" value={fullName} disabled></input>
                    </div>

                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="positionLevel">Position</label>
                        <input type="text" id="positionLevel" name="positionLevel" placeholder={positionLevel} disabled></input>
                    </div>

                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="companyCode">Company</label>
                        <input type="text" id="companyCode" name="companyCode" placeholder={companyCode} disabled></input>
                    </div>
                    

                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="contact">Email</label>
                        <input type="text" id="contact" name="contact" value={email}  disabled></input>
                    </div>
                    {/* <input className="signinBtn" type="submit" value="Register"></input> */}

                    <input className="cancelBtn" type="button" onClick={()=> {
                        setOpenPopup(false)
                        }} value="Back"></input>
                </form>


            </div>
        </div>
    );
}