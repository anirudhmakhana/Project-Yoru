import React, {useState, useEffect} from "react";
import { Alert } from "react-bootstrap";
import {useNavigate} from "react-router-dom"
import AdminAccountService from "../../services/AdminAccountService";
import "../../assets/style/login.css"
import "../../assets/style/style.css"
    

export const RegisterAdminPage = (props) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [userData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        if (username.length < 1 ) {
            console.log('Please enter your username.')
        } else if ( password.length < 1) {
            console.log("Please enter your password.")
        } else if (confirm != password)  {
            console.log("Passwords are not matching!")
            setConfirm("")
        } else {
            const newAccount = {
                username: username,
                password: password
            }
            try { 
                const res = await AdminAccountService.registerAdmin(newAccount, userData.token)
                setUsername("")
                setPassword("")
                setConfirm("")
            } catch (err) { 
                console.log(err)
            }
        }
        

    }
    function handleChangeUsername(e) {
        setUsername(e.target.value)
    }

    function handleChangePassword(e) {
        setPassword(e.target.value)
    }

    function handleChangeConfirm(e) {
        setConfirm(e.target.value)
    }

    return (
        <div className="loginBackground">
            <div className="startPageContainer">
            

                <h2>Create Account</h2>
                <p>Enter new username and password below</p>
                <form onSubmit={handleSubmit}>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="username">Username</label>
                        <input type="text" id="username" name="username" placeholder="Username" onChange={handleChangeUsername} value={username}></input>
                    </div>
                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="password">Password</label>
                        <input type="text" id="password" name="password" placeholder="Password" onChange={handleChangePassword} value={password}></input>
                    </div>
                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="confirmPassword">Confirm Password</label>
                        <input type="text" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" onChange={handleChangeConfirm} value={confirm}></input>
                    </div>
                    <input className="signinBtn" type="submit" value="Register"></input>
                    
                    
                </form>
            </div>
        </div>
    );
}