import React from "react";

import "../../assets/style/login.css"
import "../../assets/style/style.css"

export const LoginPage = () => {
    return (
        <div className="loginBackground">
            <div className="startPageContainer">
                <div className="logo">
                    <h3>Project Yoru</h3>
                </div>

                <h2>Log In to Project Yoru</h2>
                <p>Enter your email and password below</p>
                <form>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="email">Email</label>
                        <input type="text" id="email" name="email" placeholder="Email Address"></input>
                    </div>
                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="password">Password</label>
                        <input type="text" id="password" name="password" placeholder="Password"></input>
                    </div>
                    <input className="signinBtn" type="submit" value="Log In"></input>
                    <div className="buttonContainerRow">
                        <label>Don't have an account ?</label>
                        <input className="signupBtn" type="submit" value="Sign Up"></input> 
                    </div>
                    
                </form>
            </div>
        </div>
    );
}