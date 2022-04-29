import axios from "axios";
import { el } from "date-fns/locale";
import React, {useState} from "react";
import { Alert } from "react-bootstrap";
import {useNavigate} from "react-router-dom"

import StaffAccountService from "../../services/StaffAccountService";
import "../../assets/style/login.css"
import "../../assets/style/style.css"
    

export const LoginPage = (props) => {

    const [username, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userData, setUserData] = useState(null) 
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        if (username.length < 1 ) {
            console.log('Please enter your email address.')
        } else if ( password.length < 1) {
            console.log("Please enter your password.")
        } 
        const loginData = {
            username: username,
            password: password
        }
        try { 
            const res = await StaffAccountService.login(loginData)
            setUserData(res.data)
            localStorage.setItem("userData", JSON.stringify(res.data))
            localStorage.setItem("userType", "staff")
            navigate("main/overview")
        } catch (err) { 
            console.log("Invalid username or password!")
        }

    }
    function handleChangeUsername(e) {
        setEmail(e.target.value)
    }

    function handleChangePassword(e) {
        setPassword(e.target.value)
    }
    
    return (
        <div className="loginBackground">
            <div className="startPageContainer">
                <div className="logo">
                    <h3>Project Yoru</h3>
                </div>

                <h2>Log In to Project Yoru</h2>
                <p>Enter your username and password below</p>
                <form onSubmit={handleSubmit}>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="username">Username</label>
                        <input type="text" id="username" name="username" placeholder="Username" onChange={handleChangeUsername} value={username}></input>
                    </div>
                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Password" onChange={handleChangePassword} value={password}></input>
                    </div>
                    <input className="signinBtn" type="submit" value="Log In"></input>
                    {/* <div className="buttonContainerRow">
                        <label>Don't have an account ?</label>
                        <a href="/register" className="signupBtn">Sign Up</a>
                    </div> */}
                    
                </form>
            </div>
        </div>
    );
}