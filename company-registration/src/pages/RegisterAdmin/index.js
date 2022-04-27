import axios from "axios";
import { el } from "date-fns/locale";
import React, {useState, useEffect} from "react";
import { Alert } from "react-bootstrap";
import {useNavigate} from "react-router-dom"

import "../../assets/style/login.css"
import "../../assets/style/style.css"
    

export const RegisterAdmin = (props) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [userData, setUserData] = useState(null) 
    const navigate = useNavigate()
    useEffect(() => {
        setUserData(props.userData)
        // console.log(props.userData)
      }, [userData]);
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
    
            axios.post("http://localhost:4000/admin/register", newAccount,  {headers:{"x-access-token":userData.token}})
            .catch( error => {
                console.log(error)
            }) 
            .then( res =>{
                console.log("New account created!")
                setUsername("")
                setPassword("")
                setConfirm("")
            }
            )
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