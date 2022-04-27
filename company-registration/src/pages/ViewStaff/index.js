import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import axios from "axios";

import "../../assets/style/style.css"

export const ViewStaff = (props) => {
    const [userData, setUserData] = useState(null)
    const { username } = useParams()
    const [companyCode, setCompanyCode] = useState('')
    const [fullName, setFullName] = useState('')
    const [contact, setContact] = useState('')

    useEffect(() => {
        
        setUserData(props.userData)
        axios.get('http://localhost:4000/staff/' + username ,
        {headers:{"x-access-token":props.userData.token}})
        .then( res => {
            console.log(res.data)
            setFullName(res.data.fullName)
            setContact(res.data.contactNumber)
            setCompanyCode(res.data.companyCode)
        })
        .catch((error) => {
            console.log(error)
        })
        // console.log(props.userData)
      }, [userData]);



 
    return (
        <div className="loginBackground">
            <div className="startPageContainer">
                <div className="logo">
                    <h3>View Staff Account</h3>
                </div>

                <form>
                    
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="fullname">Full Name</label>
                        <input type="text" id="fullname" name="fullname" value={fullName} disabled></input>
                    </div>

                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="username">Username</label>
                        <input type="text" id="username" name="username" value={username} disabled></input>
                    </div>

                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="contact">Contact</label>
                        <input type="text" id="contact" name="contact" value={contact}  disabled></input>
                    </div>
                    

                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="companyCode">Company</label>
                        <input type="text" id="companyCode" name="companyCode" placeholder={companyCode} disabled></input>
                    </div>
                    
                    {/* <input className="signinBtn" type="submit" value="Register"></input> */}
                    
                </form>
            </div>
        </div>
    );
}