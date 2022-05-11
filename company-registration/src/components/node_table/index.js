import React, { Component, setState } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import StaffAccountService from '../../services/StaffAccountService'
import NodeDataService from '../../services/NodeDataService'

export class NodeTable extends Component {

    constructor(props) {
        super(props)
        console.log(this.props)  
        this.state = {
            setEditNodePopup: this.props.setEditNodePopup,
            setEditNode: this.props.setEditNode,
        }
    }

    render() {
        return (
            <tbody>
             <tr>   
             <td className='td-key'>{this.props.obj.nodeCode}</td>
                <td style={{"text-align":"left"}}>{this.props.obj.address}</td>
                <td>{this.props.obj.companyCode}</td>
                <td>{this.props.obj.status.toUpperCase()}</td>
                <td>
                    {/* <Link to={'view-staff/'+this.props.obj.username}>
                    <Button size="sm" variant="outline-primary">View</Button>
                    </Link>
                    &nbsp;&nbsp; */}
                
                    <Link to={'view-node/'+this.props.obj.nodeCode}>
                    <Button size="sm" variant="dark">VIEW</Button>
                    </Link>
                    &nbsp;&nbsp;
                    <Button size="sm" variant="outline-primary" onClick={() =>{
                        this.state.setEditNode(this.props.obj.nodeCode)
                        this.state.setEditNodePopup(true)
                    }}>EDIT</Button>
                    &nbsp;&nbsp;
                    { this.props.obj.status.toLowerCase() == "active" ? 
                    <Button size="sm" variant="outline-danger" onClick={() =>{
                        this.props.obj.status = "inactive"
                        NodeDataService.updateNodeStatus( this.props.obj.nodeCode, {
                            nodeCode: this.props.obj.nodeCode,
                            status:"inactive"
                        }, this.props.userData.token)
                        .then( res => {
                            this.props.updateTable()
                        })
                    }}>INACTIVE</Button>
                    : <Button size="sm" variant="outline-success" onClick={() =>{
                        this.props.obj.status = "active"
                        NodeDataService.updateNodeStatus( this.props.obj.nodeCode, {
                            nodeCode: this.props.obj.nodeCode,
                            status:"active"
                        }, this.props.userData.token)
                        .then( res => {
                            this.props.updateTable()
                        })

                    }}>ACTIVE</Button>}
                </td>       

            </tr>
            
            </tbody>

        )
    }
    
}
