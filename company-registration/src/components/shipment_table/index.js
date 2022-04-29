import React, { Component, setState } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import StaffAccountService from '../../services/StaffAccountService'

export class ShipmentTable extends Component {

    constructor(props) {
        super(props)
        console.log(this.props)  

    }

    render() {
        return (
            <tbody>
             <tr>   
             <td className='td-key'>{this.props.obj._uid}</td>
                <td>{this.props.obj.productName}</td>
                <td>{this.props.obj.producer}</td>
                <td>{this.props.obj.status}</td>
                <td>
                    {/* <Link to={'view-staff/'+this.props.obj.username}>
                    <Button size="sm" variant="outline-primary">View</Button>
                    </Link>
                    &nbsp;&nbsp; */}
                
                    <Link to={'view-shipment/'+this.props.obj._uid}>
                    <Button size="sm" variant="dark">VIEW</Button>
                    </Link>
                    
                </td>       

            </tr>
            
            </tbody>

        )
    }
    
}
