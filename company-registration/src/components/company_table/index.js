import React, { Component, setState } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import StaffAccountService from '../../services/StaffAccountService'
import CompanyService from '../../services/CompanyService'

export class CompanyTable extends Component {

    constructor(props) {
        super(props)
        console.log(this.props)
        this.state = {
            users: [],
            setEditCompPopup: this.props.setEditCompPopup,
            setCompanyCode: this.props.setCompanyCode,
            setViewStaffPopup: this.props.setViewStaffPopup,
            setViewStaffUsername: this.props.setViewStaffUsername,
            setAddStaffPopup: this.props.setAddStaffPopup
        }
        this.updateTable()
              
    }

    updateTable = () => {
        StaffAccountService.getStaffByCompany(this.props.obj.companyCode, this.props.userData.token)
        .then( res => {
            this.setState({
                users: res.data
            })
        })
        .catch((error) => {
            console.log(error)
        })
    }

    deleteCompany = () => {
        console.log('delete Company')
        CompanyService.deleteCompany(this.props.obj.companyCode, this.props.userData.token)
        .then(res => {
            console.log(res)
            this.props.refresh()
        })
        .catch((error) => {
            console.log(error)
        })
        // window.location.reload(false)

    }

    deleteStaff = (staff) => {
        console.log(staff)
        StaffAccountService.deleteStaff(staff.username, this.props.userData.token)
        .then(res => {
            console.log(res)
            this.updateTable()
        })
        .catch((error) => {
            console.log(error)
        })
    }
    handleEditCompany = () => {
        this.state.setCompanyCode(this.props.obj.companyCode)
        this.state.setViewStaffPopup(false)
        this.state.setAddStaffPopup(false)
        this.state.setEditCompPopup(true)
    }

    handleAddStaff = () => {
        console.log(this.state)
        this.state.setCompanyCode(this.props.obj.companyCode)
        this.state.setViewStaffPopup(false)
        this.state.setEditCompPopup(false)
        this.state.setAddStaffPopup(true)

    }

    render() {
        return (
            <tbody>
             <tr>   
             <th scope="row">{this.props.obj.companyCode}</th>
                <td>{this.props.obj.companyName}</td>
                <td>
                    
                    <Button size="sm" variant="dark" onClick={this.handleEditCompany}>EDIT</Button>
                    &nbsp;&nbsp;
                        <Button size="sm" variant="primary" onClick={this.handleAddStaff}>ADD STAFF</Button>
                    &nbsp;&nbsp;
                    <Button size="sm" onClick={this.deleteCompany} variant="outline-danger"> DELETE</Button>
                </td>
                <td align="center">
                        {this.state.users.slice(0, this.state.users.length).map((item, index) => {
                        return (
                            <tr>
                                <td>{item.fullName}</td>
                                <td style={{width:'55%'}}>
                                    &nbsp;&nbsp;
                                    <Button size="sm" variant="dark" onClick={() =>{
                                        this.state.setViewStaffUsername(item.username)
                                        this.state.setEditCompPopup(false)
                                        this.state.setAddStaffPopup(false)
                                        this.state.setViewStaffPopup(true)
                                    }}>VIEW</Button>
                                    &nbsp;&nbsp;
                                    <Button size="sm" onClick={() => {
                                        this.deleteStaff(item)
                                    }}variant="outline-danger"> DELETE</Button>
                                </td>
                                
                            </tr>
                            
                        )
                    })
                    }
                </td>

            </tr>
            
            </tbody>

        )
    }
    
}
