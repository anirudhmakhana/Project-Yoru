import axios from "axios";
import { el } from "date-fns/locale";
import React, {useState} from "react";
import { Alert } from "react-bootstrap";
import {useNavigate} from "react-router-dom"

import "../../assets/style/login.css"
import "../../assets/style/style.css"
    

export const AdminLoginPage = (props) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userData, setUserData] = useState(null) 
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        if (email.length < 1 ) {
            console.log('Please enter your email address.')
        } else if ( password.length < 1) {
            console.log("Please enter your password.")
        } 
        const loginData = {
            username: email,
            password: password
        }

        axios.post("http://localhost:4000/admin/login", loginData)
        .catch( error => {
            console.log("Invalid username or password!")
        }) 
        .then( res =>{
            console.log(res.data)
            setUserData(res.data)
            navigate("main/company-list", {state:{userData:res.data, userType:"admin"}})
        }
        )

    }
    function handleChangeEmail(e) {
        setEmail(e.target.value)
    }

    function handleChangePassword(e) {
        setPassword(e.target.value)
    }

    return (
        <div className="loginBackground">
            <div className="startPageContainer">
                <div className="logo">
                    <h3>Admin</h3>
                </div>

                <h2>Log In to Project Yoru</h2>
                <p>Enter your username and password below</p>
                <form onSubmit={handleSubmit}>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="username">Username</label>
                        <input type="text" id="username" name="username" placeholder="Username" onChange={handleChangeEmail} value={email}></input>
                    </div>
                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="password">Password</label>
                        <input type="text" id="password" name="password" placeholder="Password" onChange={handleChangePassword} value={password}></input>
                    </div>
                    <input className="signinBtn" type="submit" value="Log In"></input>
                    <div className="buttonContainerRow">
                        <label>Don't have an account ?</label>
                        <a href="/register" className="signupBtn">Sign Up</a>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}