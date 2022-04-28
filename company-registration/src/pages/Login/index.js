import axios from "axios";
import { el } from "date-fns/locale";
import React, {useState} from "react";
import { Alert } from "react-bootstrap";
import {useNavigate} from "react-router-dom"

import "../../assets/style/login.css"
import "../../assets/style/style.css"
    

export const LoginPage = (props) => {

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

        axios.post("http://localhost:4000/staff/login", loginData)
        .catch( error => {
            console.log("Invalid username or password!")
        }) 
        .then( res =>{
            console.log(res.data)
            setUserData(res.data)
            localStorage.setItem("userData", JSON.stringify(res.data))
            localStorage.setItem("userType", "staff")
            navigate("main/overview")
        }
        )

    }
    function handleChangeEmail(e) {
        setEmail(e.target.value)
    }

    function handleChangePassword(e) {
        setPassword(e.target.value)
    }

    const forTestOnly = () => {
        navigate("main/overview")
    }

    return (
        <div className="loginBackground">
            <div className="startPageContainer">
                <div className="logo">
                    <h3>Project Yoru</h3>
                </div>

                <h2>Log In to Project Yoru</h2>
                <p>Enter your email and password below</p>
                <form onSubmit={handleSubmit}>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="email">Email</label>
                        <input type="text" id="email" name="email" placeholder="Email Address" onChange={handleChangeEmail} value={email}></input>
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