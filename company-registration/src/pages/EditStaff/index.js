import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import axios from "axios";

import "../../assets/style/style.css"
import StaffAccountService from "../../services/StaffAccountService";

export const EditStaffPage = (props) => {
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const { companyCode } = useParams()
    const [username, setUsername] = useState(eval('('+localStorage.getItem("userData")+')').username)
    const [password, setPassword] = useState(eval('('+localStorage.getItem("userData")+')').password)
    const [fullName, setFullName] = useState(eval('('+localStorage.getItem("userData")+')').fullName)
    const [contact, setContact] = useState(eval('('+localStorage.getItem("userData")+')').email)
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
        if (username.length < 1 ) {
            console.log('Please enter your username.')
        } else if ( password.length < 5) {
            console.log("Password should be at least 6 characters.")
        }
        else if ( fullName.length < 1) {
            console.log("Please enter your full name.")
        }
        else if ( contact.length < 1) {
            console.log("Please enter your contact email.")
        } else {
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
                    // navigate("/main/staff-list/"+companyCode)
                    navigate(-1)
                    setUsername("")
                    setPassword("")
                    setContact("")
                    setFullName("") })
            .catch(error => console.log(error))
        }
        

    }
 
    return (
        <div className="loginBackground">
            <div className="startPageContainer">
                <div className="logo">
                    <h3>Add Staff Account</h3>
                </div>

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
                    
                </form>
            </div>
        </div>
    );
}