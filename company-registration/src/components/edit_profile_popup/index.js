import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import axios from "axios";

import "../../assets/style/style.css"

import StaffAccountService from "../../services/StaffAccountService";
import { AddStaffPopup } from "../add_staff_popup";
import { ChangePasswordPopup } from "./changePassword";
import StringValidator from "../../utils/StringValidator";

export const EditProfilePopup = ({setOpenPopup, handleConfirm, handleCancel }) => {
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const [companyCode, setCompanyCode] = useState(eval('('+localStorage.getItem("userData")+')').companyCode)

    const [username, setUsername] = useState(eval('('+localStorage.getItem("userData")+')').username)
    const [password, setPassword] = useState(eval('('+localStorage.getItem("userData")+')').password)
    const [fullName, setFullName] = useState(eval('('+localStorage.getItem("userData")+')').fullName)
    const [contact, setContact] = useState(eval('('+localStorage.getItem("userData")+')').email)
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const [warning, setWarning] = useState(null)

    const navigate = useNavigate()


    const handleChangeUsername = (e) => {
        setUsername( e.target.value )
     }
 
     const handleChangeContact = (e) => {
         setContact(e.target.value)
     }

     const handleChangeFullName = (e) => {
        setFullName(e.target.value)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        var invalidName = StringValidator.validateFullname(fullName);
        var invalidUsername = StringValidator.validateUsername(username);
        var invalidEmail = StringValidator.validateEmail(contact);
        
        
        if ( invalidUsername ) {
            setWarning(invalidUsername)
        } else if (invalidName ) {
            setWarning(invalidName)
        }
        else if (invalidEmail) {
            setWarning(invalidEmail)
        }
         else {
            const newAccount = {
                username: username,
                password: password,
                fullName: fullName,
                email: contact,
                companyCode: companyCode
            }
            console.log(newAccount)
            StaffAccountService.updateStaff(username, newAccount, userData.token)
            .then( res => {console.log("Account updated!")
                    const edittedData = res.data
                    edittedData.token = userData.token
                    localStorage.setItem("userData", JSON.stringify(edittedData))
                    console.log(edittedData)
                    setUsername("")
                    setPassword("")
                    setContact("")
                    setFullName("") 
                    handleConfirm(edittedData)})
            .catch(error => console.log(error))
        }
        

    }
 
    return (
        
        <div className="popupBackground">
            <div className="startPageContainer">

                <div className="logo">
                    <h3 className="h3-logo">Edit Account</h3>
                </div>
                
                { warning &&
                 <div className="alert alert-danger">
                    {warning}
                </div>}
                <form onSubmit={handleSubmit}>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="companyCode">Company</label>
                        <input type="text" id="companyCode" name="companyCode" placeholder={companyCode} disabled></input>
                    </div>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="username">Username</label>
                        <input type="text" id="username" name="username" placeholder={username} value={username} onChange={handleChangeUsername} disabled></input>
                    </div>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="fullname">Full Name</label>
                        <input type="text" id="fullname" name="fullname" placeholder="e.g. Adam Eve" value={fullName} onChange={handleChangeFullName}></input>
                    </div>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="contact">Email</label>
                        <input type="text" id="contact" name="contact" placeholder="e.g. adam.eve@eden.com" value={contact} onChange={handleChangeContact}></input>
                    </div>

                    <input className="signinBtn" type="submit" value="Update"></input>
                    <input className="changePwdBtn" type="button" onClick={()=> {
                        setOpenChangePassword(true)
                        }} value="Change Password"></input>
                    
                    <input className="cancelBtn" type="button" onClick={()=> {
                        setWarning(null)
                        // setOpenPopup(false)
                        handleCancel()
                        }} value="Cancel"></input>
                    
                </form>
            </div>
            { openChangePassword && <ChangePasswordPopup setOpenPopup={setOpenChangePassword} setParentPassword={setPassword}/>}
        </div>
    );
}