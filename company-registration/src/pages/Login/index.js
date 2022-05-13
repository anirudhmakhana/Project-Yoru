import axios from "axios";
import { el } from "date-fns/locale";
import React, {useState} from "react";
import { Alert } from "react-bootstrap";
import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    InfoWindow,
    Autocomplete,
    DirectionsRenderer,
  } from "@react-google-maps/api";
import {useNavigate} from "react-router-dom"
import {NodeSelectPopup} from "../../components/node_select_popup"
import NodeDataService from "../../services/NodeDataService";
import StaffAccountService from "../../services/StaffAccountService";

import "../../assets/style/login.css"
import "../../assets/style/style.css"

import { useEffect } from "react";
const google = window.google

export const LoginPage = (props) => {

    const [username, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userData, setUserData] = useState(null) 
    const [openPopup, setOpenPopup] = useState(false)
    const [warning, setWarning] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        console.log(localStorage)
        
        if ( eval('('+localStorage.getItem("userData")+')') && localStorage.getItem("userType") == "staff" ) {
            if ( eval('('+localStorage.getItem("currentNode")+')')) {
                navigate('main/overview')
            }
            else {
                setOpenPopup(true)
            }
        }
    }, [])


    async function handleSubmit(e) {
        e.preventDefault()
        if (username.length < 1 ) {
            setWarning('Please enter your username.')
        } else if ( password.length < 1) {
            setWarning("Please enter your password.")
        } 
        else {
            const loginData = {
                username: username,
                password: password
            }
            StaffAccountService.login(loginData)
            .then(res => {
                console.log(res)
                setWarning(null)
                NodeDataService.getActiveNodeByCompany( res.data.companyCode, res.data.token)
                .then( res_node => {
                    localStorage.setItem("userData", JSON.stringify(res.data))
                    localStorage.setItem("userType", "staff")
                    setOpenPopup(true)
    
                })
                .catch( err => {
                    localStorage.setItem("userData", JSON.stringify(res.data))
                    localStorage.setItem("userType", "staff")
                    navigate("main/overview")
                })
                
            })
            .catch( error => {
                setWarning("Invalid username or password!")
            }) 
        }

    }
    function handleChangeUsername(e) {
        setEmail(e.target.value)
    }

    function handleChangePassword(e) {
        setPassword(e.target.value)
    }

    function handlePopupConfirm(currentNode) {
        localStorage.setItem("currentNode", JSON.stringify(currentNode))
        setOpenPopup(false)
        console.log(currentNode)

        navigate("main/overview")
    }

    function handlePopupCancel() {
        localStorage.clear()
        setOpenPopup(false);
    }
    
    return (
        <div className="backgroundLogin">
            <div className="loginContainer">
                <div className="startPageContainer">
                    <div className="logo">
                        <h3>Project Yoru</h3>
                    </div>

                    <h2>Log In to Project Yoru</h2>
                    <p>Enter your username and password below</p>
                    { warning &&
                    <div className="alert alert-danger">
                        {warning}
                    </div>}
                    <form onSubmit={handleSubmit}>
                        <div className="textInputContainerCol">
                            <label className="inputLabel" for="username">Username</label>
                            <input type="text" id="username" name="username" placeholder="Username" onChange={handleChangeUsername} value={username}></input>
                        </div>
                        <div className="textInputContainerCol"> 
                            <label className="inputLabel" for="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="Password" onChange={handleChangePassword} value={password}></input>
                        </div>
                        { openPopup ? 
                        (<input className="signinBtn" type="submit" value="Log In" disabled></input>)
                    :(<input className="signinBtn" type="submit" value="Log In"></input>)}
                        {/* <div className="buttonContainerRow">
                            <label>Don't have an account ?</label>
                            <a href="/register" className="signupBtn">Sign Up</a>
                        </div> */}
                        
                    </form>
                </div>
            </div>
            { openPopup && 
                        <NodeSelectPopup setOpenPopup={setOpenPopup} handleConfirm={handlePopupConfirm} handleCancel={handlePopupCancel} />}
        </div>
        
    );
}