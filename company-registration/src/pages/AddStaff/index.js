import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";

import "../../assets/style/style.css"
import StaffAccountService from "../../services/StaffAccountService";
import StringValidator from "../../utils/StringValidator";

export const AddStaffPage = (props) => {
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const { companyCode } = useParams()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [fullName, setFullName] = useState('')
    const [contact, setContact] = useState('')
    const [positionLevel, setPositionLevel] = useState('Staff')
    const [warning, setWarning] = useState(null)
    // useEffect(() => {
        
    //     setUserData(props.userData)
    //     // console.log(props.userData)
    //   }, [userData]);


    const handleChangeUsername = (e) => {
        setUsername( e.target.value )
     }
 
     const handleChangeContact = (e) => {
         setContact(e.target.value)
     }
 
    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }
 
    const handleChangeConfirm = (e) => {
        setConfirm(e.target.value)
    }

     const handleChangeFullName = (e) => {
        setFullName(e.target.value)
    }

    const handleNodeDropdown = (e) => {
        setPositionLevel(e)
      };

    

    async function handleSubmit(e) {
        e.preventDefault()
        
        if ( fullName.length < 1) {
            setWarning("Please enter your full name.")
        }
        else if ( !StringValidator.validateFullname(fullName) ) {
            setWarning("Full name cannot contain special character and must contain first name and last name!")
        }
        else if ( contact.length < 1) {
            setWarning("Please enter your contact email.")
            
        }else if ( !StringValidator.validateEmail(contact)) {
            console.log(contact)
            setWarning("Invalid email format!")
        }
        else if (username.length < 5 || username.length > 18) {
            setWarning('Username should between 5 to 18 characters long!')
        } 
        else if ( !StringValidator.validateUsername(username)) {
            console.log(username)
            setWarning("Username cannot contain special character, only '_' and '.' are allowed!")
        }
        else if ( password.length < 5) {
            setWarning("Password should be at least 6 characters.")
        } else if (confirm != password)  {
            console.log("Passwords are not matching!")
            setConfirm("")
        } 
        else {
            const newAccount = {
                username: username,
                password: password,
                fullName: fullName,
                email: contact,
                positionLevel: positionLevel.toLowerCase(),
                companyCode: companyCode
            }
            console.log(newAccount)
            StaffAccountService.registerStaff(newAccount, userData.token)
            .then( res =>{
                console.log("New account created!")
                setUsername("")
                setPassword("")
                setConfirm("")
                setContact("")
                setFullName("")
                setWarning(null)
            })
            .catch( error => {
                console.log(error.response.status)
                if (error.response.status == 403) {
                    setWarning("Username is already taken!")
                    console.log(error)
                }
            }) 
            
        }
        

    }
 
    return (
        <div className="loginBackground">
            <div className="startPageContainer">
                <div className="logo">
                    <h3 className="h3-logo">Add Staff Account</h3>
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
                        <label className="inputLabel" for="companyCode">Position</label>
                        <Dropdown onSelect={handleNodeDropdown} >
                            <Dropdown.Toggle className="btn btn-secondary dropdown-toggle">
                                {positionLevel}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey={"Staff"}>Staff</Dropdown.Item>
                                <Dropdown.Item eventKey={"Manager"}>Manager</Dropdown.Item>

                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    
                    
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="fullname">Full Name</label>
                        <input type="text" id="fullname" name="fullname" placeholder="e.g. Adam Eve" value={fullName} onChange={handleChangeFullName}></input>
                    </div>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="contact">Email</label>
                        <input type="text" id="contact" name="contact" placeholder="e.g. adam.eve@eden.com" value={contact} onChange={handleChangeContact}></input>
                    </div>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="username">Username</label>
                        <input type="text" id="username" name="username" placeholder="Username" value={username} onChange={handleChangeUsername}></input>
                    </div>
                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={handleChangePassword}></input>
                    </div>
                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password"
                        value={confirm} onChange={handleChangeConfirm}></input>
                    </div>
                    <input className="signinBtn" type="submit" value="Register"></input>
                    
                </form>
            </div>
        </div>
    );
}