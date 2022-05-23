import React, { Component, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'

import axios from 'axios'
import { Alert } from 'react-bootstrap'
import CompanyService from '../../services/CompanyService'
import StringValidator from '../../utils/StringValidator'

export function EditCompanyPopup({setOpenPopup, companyCode, updateTable}) {
    const [userData] = useState(eval('('+localStorage.getItem("userData")+')'))
    // const { companyCode } = useParams()
    // const [companyCode, setCompanyCode] = useParams().companyCode
    const [companyName, setCompanyName] = useState('')
    const [publicKey, setPublicKey] = useState('')
    const [privateKey, setPrivateKey] = useState('')
    const [warning, setWarning] = useState(null)

    useEffect(() => {
        
        // setUserData(props.userData)

        CompanyService.getCompanyByCode(companyCode, userData.token)
        .then( res => {
            setCompanyName(res.data.companyName)
            setPublicKey(res.data.walletPublicKey)
            setPrivateKey(res.data.walletPrivateKey)
        })
        .catch((error) => {
            console.log(error)
        })
        // console.log(props.userData)
      }, [ companyCode]);

    const handleChangeCompanyName = (e) => {
       setCompanyName( e.target.value )
    }

    const handleChangePublicKey = (e) => {
        setPublicKey(e.target.value)
    }

    const handleChangePrivateKey = (e) => {
        setPrivateKey(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(userData)
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
        } else {
            const companyObject = { 
                companyCode: companyCode, 
                companyName: companyName, 
                walletPublicKey: publicKey, 
                walletPrivateKey: privateKey}
            CompanyService.updateCompany(companyCode, companyObject, userData.token)
            .then(res => {
                setWarning(null)
                if ( updateTable) {
                    updateTable()
                }
                setOpenPopup(false)

                console.log(res.data)})
            .catch( error => {
                console.log(error)
            }) 
            
    
            // console.log("created success")
            // console.log('Name:' + this.state.companyName)
            // console.log('Public Key: '+this.state.publicKey)
            // setCompanyCode("")
            // setCompanyName("")
            // setManagerContact("")
            // setPublicKey("")
            // setPrivateKey("")
        }
    }

    return (
        <div className="popupBackground">
            <div className="editCompanyContainer">
            

                <h2>Edit Company</h2>
                <p>Update company information below.</p>
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
                        <label className="inputLabel" for="companyCode">Company Code</label>
                        <input type="text" id="companyCode" name="companyCode" placeholder={companyCode} value={""} disabled></input>
                    </div>

                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="walletPublicKey">Wallet Public Key(Address)</label>
                        <input type="text" id="walletPublicKey" name="walletPublicKey" placeholder="e.g. 0xf4ab5c..." onChange={handleChangePublicKey} value={publicKey}></input>
                    </div>

                    <div className="textInputContainerCol"> 
                        <label className="inputLabel" for="walletPrivateKey">Wallet Private Key</label>
                        <input type="text" id="walletPrivateKey" name="walletPrivateKey" placeholder="e.g. af444ab5c..." onChange={handleChangePrivateKey} value={privateKey}></input>
                    </div>
                    <input className="signinBtn" type="submit" value="Update"></input>
                    
                    <input className="cancelBtn" type="button" onClick={()=> {
                        setWarning(null)
                        setOpenPopup(false)
                        }} value="Cancel"></input>
                </form>
            </div>
        </div>
    )
}
