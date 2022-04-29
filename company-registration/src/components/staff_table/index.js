import React, { Component, setState } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import StaffAccountService from '../../services/StaffAccountService'

export class StaffTable extends Component {

    constructor(props) {
        super(props)
        console.log(this.props)  

    }

    deleteStaff = (staff) => {
        console.log(staff)
        if ( staff.username == this.props.userData.username) {
            console.log("You cannot delete your own account!")
        } else {
            StaffAccountService.deleteStaff(staff.username, this.props.userData.token)
           .catch((error) => {
               console.log(error)
           })
           .then(res => {
               console.log(res)
               this.props.refresh()
           })
        }
        
    }

    render() {
        return (
            <tbody>
             <tr>   
             <th scope="row">{this.props.index}</th>
                <td>{this.props.obj.fullName}</td>
                <td>{this.props.obj.username}</td>
                <td>{this.props.obj.email}</td>
                <td>
                    {/* <Link to={'view-staff/'+this.props.obj.username}>
                    <Button size="sm" variant="outline-primary">View</Button>
                    </Link>
                    &nbsp;&nbsp; */}
                    {this.props.obj.username == this.props.userData.username ?(
                        <Link to={'edit-staff/'+this.props.userData.username}>
                        <Button size="sm" variant="primary">EDIT</Button>
                        </Link>
                    ): (
                    <Button size="sm" onClick={() => {
                        this.deleteStaff(this.props.obj)
                    }}variant="outline-danger"> DELETE</Button>) }
                    
                </td>       

            </tr>
            
            </tbody>

        )
    }
    
}