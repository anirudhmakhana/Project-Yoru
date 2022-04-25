import React from "react";

import "../../assets/style/style.css"

export const RegisterPage = () => {
    return (
        <div className="loginBackground">
            <div className="startPageContainer">
                <div className="logo">
                    <h3>Project Yoru</h3>
                </div>

                <form>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="email">Email</label>
                        <input type="text" id="email" name="email" placeholder="Email Address"></input>
                    </div>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="fullname">Fullname</label>
                        <input type="text" id="fullname" name="fullname" placeholder="Fullname"></input>
                    </div>
                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="password">Password</label>
                        <input type="text" id="password" name="password" placeholder="Password"></input>
                    </div>
                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="confirmPassword">Confirm Password</label>
                        <input type="text" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password"></input>
                    </div>
                    <input className="signinBtn" type="submit" value="Register"></input>
                    <div className="buttonContainerRow">
                        <label>Don't have an account ?</label>
                        <a href="/" className="signupBtn">Sign In</a>
                        {/* <input className="signupBtn" type="submit" value="Sign In"></input>  */}
                    </div>
                </form>
            </div>
        </div>
    );
}