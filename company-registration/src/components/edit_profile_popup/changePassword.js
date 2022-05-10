import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";

import "../../assets/style/style.css"
import "../../assets/style/login.css"

import StaffAccountService from "../../services/StaffAccountService";
import StringValidator from "../../utils/StringValidator";
import { Button } from "react-bootstrap";

export const ChangePasswordPopup = ({setOpenPopup, setParentPassword}) => {
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    // const { companyCode } = useParams()
    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [warning, setWarning] = useState(null)
    // useEffect(() => {
        
    //     setUserData(props.userData)
    //     // console.log(props.userData)
    //   }, [userData]);


    const handleChangeOldPassword = (e) => {
        setOldPassword( e.target.value )
     }
 
 
    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }
 
    const handleChangeConfirm = (e) => {
        setConfirm(e.target.value)
    }



    

    async function handleSubmit(e) {
        e.preventDefault()
        var invalidPassword =StringValidator.validatePassword(password, confirm);
        
        if ( invalidPassword ) {
            setWarning(invalidPassword)
        } 
        else {
            StaffAccountService.checkPassword({username:userData.username, password: oldPassword}, userData.token)
            .then( res => {
                setParentPassword(password)
                setOpenPopup(false)
                
            })
            .catch( err =>
                setWarning("Incorrect old password!")    
            )
        }
        

    }
 
    return (
        <div className="popupBackground">
            <div className="startPageContainer">
                <div className="logo">
                    <h3 className="h3-logo">Change Password</h3>
                </div>
                

                { warning &&
                 <div className="alert alert-danger">
                    {warning}
                </div>}
                <form onSubmit={handleSubmit}>
                    
                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="oldPassword">Old Password</label>
                        <input type="password" id="oldPassword" name="oldPassword" placeholder="Old Password" value={oldPassword} onChange={handleChangeOldPassword}></input>
                    </div>

                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="password">New Password</label>
                        <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={handleChangePassword}></input>
                    </div>
                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password"
                        value={confirm} onChange={handleChangeConfirm}></input>
                    </div>
                    <input className="signinBtn" type="submit" value="Confirm"></input>
                    <input className="cancelBtn" type="button" onClick={()=> {
                        setWarning(null)
                        setOldPassword("")
                        setPassword("")
                        setConfirm("")
                        setOpenPopup(false)
                        }} value="Cancel"></input>
                    {/* <Button style={{width:"100%"}} variant="secondary" onClick={() => setOpenPopup(false)}>Cancel</Button> */}
                </form>
            </div>
        </div>
    );
}