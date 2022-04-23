import React from "react";

import "../../assets/style/login.css"
import "../../assets/style/style.css"

export const LoginPage = () => {
    return (
        <div className="loginBackground">
            <div className="startPageContainer">
                <h1>Project Yoru</h1>

                <h2>Log In to Project Yoru</h2>
                <p>Enter your email and password below</p>
                <form>
                    <div className="textInputContainer">
                        <label for="email">Email</label>
                        <input type="text" id="email" name="email" placeholder="Email"></input>
                    </div>
                    <div className="textInputContainer"> 
                        <label for="password">Password</label>
                        <input type="text" id="password" name="password" placeholder="Password"></input>
                    </div>
                    <input type="submit" value="Log In"></input>
                </form>
            </div>
        </div>
    );
}