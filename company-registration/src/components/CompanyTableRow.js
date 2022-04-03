import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

export default class CompanyTableRow extends Component {
    render() {
        if (this.props.obj.publicKeys.length < 2) {
            return (
                <tbody>
                    <tr>
                    <td>{this.props.obj.companyName}</td>
                    <td>{this.props.obj.publicKeys}</td>
                        
                    <td>
                        
                        <Link to={'/edit-company/'+this.props.obj._id}>
                            <Button size="sm" variant="outline-primary">Edit</Button>
                        </Link>
                        &nbsp;&nbsp;
                        <Link to={'/add-account/'+this.props.obj._id}>
                            <Button size="sm" variant="outline-success">Add Account</Button>
                        </Link>
                        &nbsp;&nbsp;
                        <Button size="sm" variant="outline-danger"> Delete</Button>
                    </td>
    
                </tr>
                </tbody>
                
            )
        }
        else {
            return (
                <tbody>

                <tr>
                    <td>{this.props.obj.companyName}</td>
                    <td>{this.props.obj.publicKeys[0]}</td>
                
                    <td>
                        
                        <Link to={'/edit-company/'+this.props.obj._id}>
                            <Button size="sm" variant="outline-primary">Edit</Button>
                        </Link>
                        &nbsp;&nbsp;
                        <Link to={'/add-account/'+this.props.obj._id}>
                            <Button size="sm" variant="outline-success">Add Account</Button>
                        </Link>
                        &nbsp;&nbsp;
                        <Button size="sm" variant="outline-danger"> Delete</Button>
                    </td>
    
                </tr>
                {this.props.obj.publicKeys.slice(1, this.props.obj.publicKeys.length).map((item, index) => {
                    return (
                        <tr>
                            <td>{this.props.obj.companyName}</td>
                            <td>{item}</td>

                            
                            <td>
                                <Button size="sm" variant="outline-danger"> Delete</Button>
                            </td>
                        </tr>
                        
                    )
                })
                }
                </tbody>

            )
        }
    }
}
