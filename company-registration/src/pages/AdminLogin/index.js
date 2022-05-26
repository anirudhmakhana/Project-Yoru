import axios from "axios";
import { el } from "date-fns/locale";
import React, {useState, useEffect} from "react";
import { Alert } from "react-bootstrap";
import {useNavigate} from "react-router-dom"

import "../../assets/style/login.css"
import "../../assets/style/style.css"

import AdminAccountService from "../../services/AdminAccountService";

import applogo from "../../assets/icons/applogo.png"

export const AdminLoginPage = (props) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [warning, setWarning] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        console.log(localStorage)
        
        if ( eval('('+localStorage.getItem("userData")+')') && localStorage.getItem("userType") == "admin" ) {
            navigate('main/company-list')
        }
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        if (email.length < 1 ) {
            setWarning('Please enter your username.')
        } else if ( password.length < 1) {
            setWarning("Please enter your password.")
        } else {
            const loginData = {
                username: email,
                password: password
            }
            AdminAccountService.login(loginData)
            .then( res =>{
                setWarning(null)
                localStorage.setItem("userData", JSON.stringify(res.data))
                localStorage.setItem("userType", "admin")
                navigate("main/company-list")
            })
            .catch( error => {
                setWarning("Invalid username or password!")
            }) 
    
        }
        
    }
    function handleChangeEmail(e) {
        setEmail(e.target.value)
    }

    function handleChangePassword(e) {
        setPassword(e.target.value)
    }

    return (
        <div className="backgroundLogin">
            <div className="loginContainer">
                <div className="startPageContainer">
                    <div className="logo mb-lg-5 mb-md-2">
                        <h3>Admin</h3>
                        <img src={applogo} alt="logo" className="login-logo"/>
                    </div>

                    <h2>Log In</h2>
                    <p>Enter your username and password below</p>
                    { warning &&
                        <div className="alert alert-danger">
                            {warning}
                        </div>}
                    <form onSubmit={handleSubmit}>
                        <div className="textInputContainerCol">
                            <label className="inputLabel" for="username">Username</label>
                            <input type="text" id="username" name="username" placeholder="Username" onChange={handleChangeEmail} value={email}></input>
                        </div>
                        <div className="textInputContainerCol"> 
                            <label className="inputLabel" for="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="Password" onChange={handleChangePassword} value={password}></input>
                        </div>
                        <input className="signinBtn" type="submit" value="Log In"></input>
                        
                    </form>
                </div>
            </div>
            
        </div>
    );
}