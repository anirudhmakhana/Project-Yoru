import React, { Component, setState } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import StaffAccountService from '../../services/StaffAccountService'

export class NodeTable extends Component {

    constructor(props) {
        super(props)
        console.log(this.props)  

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
                    
                </td>       

            </tr>
            
            </tbody>

        )
    }
    
}
