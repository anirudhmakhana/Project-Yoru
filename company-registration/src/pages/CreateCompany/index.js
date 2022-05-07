import React, { Component, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import axios from 'axios'
import { Alert } from 'react-bootstrap'
import CompanyService from '../../services/CompanyService'
import StringValidator from '../../utils/StringValidator'
const google = window.google
export function CreateCompanyPage(props) {
    const [userData] = useState(eval('('+localStorage.getItem("userData")+')'))

    const [companyCode, setCompanyCode] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [publicKey, setPublicKey] = useState('')
    const [privateKey, setPrivateKey] = useState('')
    const [warning, setWarning] = useState(null)

    // useEffect(() => {
    //     setUserData(props.userData)
    //     // console.log(props.userData)
    //   }, [userData]);

    const handleChangeCompanyName = (e) => {
       setCompanyName( e.target.value )
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
        var invalidName = StringValidator.validateCompanyName(companyName);
        var invalidCode = StringValidator.validateCompanyCode(companyCode);
        var invalidPublic = StringValidator.validateWalletPublicKey(publicKey);
        var invalidPrivate =StringValidator.validateWalletPrivateKey(privateKey);
        if (invalidName) {
            setWarning(invalidName)
        }
        else if (invalidCode) {
            setWarning(invalidCode)
        }
        else if (invalidPublic) {
            setWarning(invalidPublic)
        }
         else if (invalidPrivate) {
            setWarning(invalidPrivate)
        }
         else {
            const companyObject = { 
                companyCode: companyCode, 
                companyName: companyName, 
                walletPublicKey: publicKey, 
                walletPrivateKey: privateKey}

            CompanyService.createCompany(companyObject, userData.token)
            .then( res => {
                setWarning(null)
                console.log(res.data)
                setCompanyCode("")
                setCompanyName("")
                setPublicKey("")
                setPrivateKey("")
            })
            .catch( error => {
                console.log(error)
                setWarning("Company code name is already taken!")
            }) 
            
    
            // console.log("created success")
            // console.log('Name:' + this.state.companyName)
            // console.log('Public Key: '+this.state.publicKey)
            
        }
    }

    return (
        <div className="loginBackground">
            <div className="startPageContainer">
            

                <h2>Create Company</h2>
                <p>Enter new company information below.</p>
                { warning &&
                    <div className="alert alert-danger">
                        {warning}
                    </div>}
                <form onSubmit={handleSubmit}>
                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="companyName">Company Name</label>
                        <input type="text" id="companyName" name="companyName" placeholder="e.g. Smart Tech Co.,Ltd." onChange={handleChangeCompanyName} value={companyName}></input>
                    </div>

                    <div className="textInputContainerCol">
                        <label className="inputLabel" for="companyCode">Company Code Name</label>
                        <input type="text" id="companyCode" name="companyCode" placeholder="e.g. SMTECH" onChange={handleChangeCode} value={companyCode}></input>
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
