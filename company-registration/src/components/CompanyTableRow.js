import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import axios from 'axios'

export default class CompanyTableRow extends Component {

    deleteCompany = () => {
        console.log('delete Company')
        axios.delete('http://localhost:4000/companies/delete-company/' + this.props.obj._id)
        .catch((error) => {
            console.log(error)
        })
        window.location.reload(false)

    }

    deleteStaff = (staff) => {
        console.log(staff)
        // axios.put('http://localhost:4000/companies/delete-key/' + this.props.obj._id + '/' + key)
        // .catch((error) => {
        //     console.log(error)
        // })
        // window.location.reload(false)
    }

    viewStaff = (staff) => {

    }

    render() {
        return (
            <tbody>

            <tr>
                <td>{this.props.obj.companyName}</td>
                <td></td>
                <td>
                    
                    <Link to={'/edit-company/'+this.props.obj._id}>
                        <Button size="sm" variant="outline-primary">Edit</Button>
                    </Link>
                    &nbsp;&nbsp;
                    <Link to={'/add-staff/'+this.props.obj._id}>
                        <Button size="sm" variant="outline-success">Add Account</Button>
                    </Link>
                    &nbsp;&nbsp;

                    <Link to={'/add-dist-center/'+this.props.obj._id}>
                        <Button size="sm" variant="outline-success">Add Dist Center</Button>
                    </Link>
                    &nbsp;&nbsp;
                    <Button size="sm" onClick={this.deleteCompany} variant="outline-danger"> Delete</Button>
                </td>

            </tr>
            {this.props.obj.staffs.slice(0, this.props.obj.staffs.length).map((item, index) => {
                return (
                    <tr>
                        <td>{this.props.obj.companyName}</td>
                        <td>{item.firstName} {item.lastName}</td>
                        
                        <td>
                            
                            <Link to={'/view-staff/'+item._id}>
                            <Button size="sm" variant="outline-primary">View</Button>
                             </Link>
                            &nbsp;&nbsp;
                            <Button size="sm" onClick={() => {
                                this.deleteStaff(item)
                            }}variant="outline-danger"> Delete</Button>
                        </td>
                        
                    </tr>
                    
                )
            })
            }
            </tbody>

        )
    }
    
}
