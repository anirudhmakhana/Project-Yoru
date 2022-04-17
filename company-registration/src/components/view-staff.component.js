import React, { Component, useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'
import axios from 'axios'



export default function ViewStaff() {
    const {id} = useParams()
    const [staff, setStaff] = useState(null)

    console.log(staff)
    
    useEffect(
        React.useCallback(() => {
            axios.get('http://localhost:4000/companies/get-staff/' + id)
            .then( res => {
                    console.log(res.data)
                    setStaff(res.data)
            })
            .catch((error) => {
                console.log(error)
            })
        })
    );
    
    return (
        <div className="form-wrapper mt-5">
            <h1>{staff["firstName"]} {staff["lastName"]}</h1>
            <h2>{staff["walletAddress"]}</h2>
        </div>
    )
}

