import React, { Component, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'
import MetaMaskAuth from '../metamask-auth'



export default function Login() {
    return (
        <div className="form-wrapper">
            <h1>Login Using Metamask</h1>
            <MetaMaskAuth onAddressChanged={address => {}}/>
        </div>
    )
}

