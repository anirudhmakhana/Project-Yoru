import React, { Component, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import axios from 'axios'
import { Alert } from 'react-bootstrap'
import CompanyService from '../../services/CompanyService'

export function CreateCompanyPage(props) {
    const [userData] = useState(eval('('+localStorage.getItem("userData")+')'))

    const [companyCode, setCompanyCode] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [managerContact, setManagerContact] = useState('')
    const [publicKey, setPublicKey] = useState('')
    const [privateKey, setPrivateKey] = useState('')

    // useEffect(() => {
    //     setUserData(props.userData)
    //     // console.log(props.userData)
    //   }, [userData]);

    const handleChangeCompanyName = (e) => {
       setCompanyName( e.target.value )
    }

    const handleChangeContact = (e) => {
        setManagerContact(e.target.value)
    }

    const handleChangeCode = (e) => {
        if (e.target.value.length < 7)
            setCompanyCode(e.target.value)
    }
    const handleChangePublicKey = (e) => {
        setPublicKey(e.target.value)
    }

    const handleChangePrivateKey = (e) => {
        setPrivateKey(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (companyName.length < 1) {
            alert("Please enter company name.")
        }
        else if (companyCode.length < 1) {
            alert("Please enter company code.")
        }
        else if (managerContact.length < 1) {
            alert("Please enter contact of the manager of the company.")
        }
        else if (publicKey.length < 1) {
            alert("Please enter wallet public key for making transaction.")
        }
         else if (privateKey.length < 1) {
            alert("Please enter wallet private key for making transaction.")
        } else {
            const companyObject = { 
                companyCode: companyCode, 
                companyName: companyName, 
                managerContact: managerContact, 
                walletPublicKey: publicKey, 
                walletPrivateKey: privateKey}

            CompanyService.createCompany(companyObject, userData.token)
            .catch( error => {
                console.log(error)
            }) 
            .then( 
                res => console.log(res.data))
    
            // console.log("created success")
            // console.log('Name:' + this.state.companyName)
            // console.log('Public Key: '+this.state.publicKey)
            setCompanyCode("")
            setCompanyName("")
            setManagerContact("")
            setPublicKey("")
            setPrivateKey("")
        }
    }

    return (
        <div className="loginBackground">
            <div className="startPageContainer">
            

                <h2>Create Company</h2>
                <p>Enter new company information below.</p>
                <form onSubmit={handleSubmit}>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="companyName">Company Name</label>
                        <input type="text" id="companyName" name="companyName" placeholder="e.g. Smart Tech Co.,Ltd." onChange={handleChangeCompanyName} value={companyName}></input>
                    </div>

                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="companyCode">Company Code</label>
                        <input type="text" id="companyCode" name="companyCode" placeholder="e.g. SMTECH" onChange={handleChangeCode} value={companyCode}></input>
                    </div>

                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="contact">Manager Contact</label>
                        <input type="text" id="contact" name="contact" placeholder="e.g. adam.b@smtech.com" onChange={handleChangeContact} value={managerContact}></input>
                    </div>

                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="walletPublicKey">Wallet Public Key(Address)</label>
                        <input type="text" id="walletPublicKey" name="walletPublicKey" placeholder="e.g. 0xf4ab5c..." onChange={handleChangePublicKey} value={publicKey}></input>
                    </div>

                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="walletPrivateKey">Wallet Private Key</label>
                        <input type="text" id="walletPrivateKey" name="walletPrivateKey" placeholder="e.g. af444ab5c..." onChange={handleChangePrivateKey} value={privateKey}></input>
                    </div>
                    <input className="signinBtn" type="submit" value="Create"></input>
                    
                    
                </form>
            </div>
        </div>
    )
}
