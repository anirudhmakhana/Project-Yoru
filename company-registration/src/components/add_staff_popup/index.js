import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";

import "../../assets/style/style.css"
import "../../assets/style/login.css"

import StaffAccountService from "../../services/StaffAccountService";
import StringValidator from "../../utils/StringValidator";
import { Button } from "react-bootstrap";

export const AddStaffPopup = ({setOpenPopup, updateTable, companyCode}) => {
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    // const { companyCode } = useParams()
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
        var invalidName = StringValidator.validateFullname(fullName);
        var invalidUsername = StringValidator.validateUsername(username);
        var invalidEmail = StringValidator.validateEmail(contact);
        var invalidPassword =StringValidator.validatePassword(password, confirm);
        
        if (invalidName ) {
            setWarning(invalidName)
        }
        else if ( invalidUsername ) {
            setWarning(invalidUsername)
        }
        else if (invalidEmail) {
            setWarning(invalidEmail)
        }
        else if ( invalidPassword ) {
            setWarning(invalidPassword)
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
                setWarning(null)
                console.log("New account created!")
                setUsername("")
                setPassword("")
                setConfirm("")
                setContact("")
                setFullName("")
                console.log(updateTable)
                updateTable()
                setOpenPopup(false)
            })
            .catch( error => {

                if (error.response.status == 403) {
                    setWarning("Username is already taken!")
                    console.log(error)
                }
            }) 
            
        }
        

    }
 
    return (
        <div className="popupBackground">
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
                    <input className="cancelBtn" type="button" onClick={()=> {
                        setWarning(null)
                        setUsername("")
                        setPassword("")
                        setConfirm("")
                        setContact("")
                        setFullName("")
                        setOpenPopup(false)
                        }} value="Cancel"></input>
                    {/* <Button style={{width:"100%"}} variant="secondary" onClick={() => setOpenPopup(false)}>Cancel</Button> */}
                </form>
            </div>
        </div>
    );
}