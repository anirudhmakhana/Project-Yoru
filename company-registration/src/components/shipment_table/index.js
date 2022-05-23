import React, { Component, setState } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import StaffAccountService from '../../services/StaffAccountService'
import ShipmentService from '../../services/ShipmentService'
import NodeDataService from '../../services/NodeDataService'

export class ShipmentTable extends Component {

    constructor(props) {
        super(props)
        console.log(this.props)  
        this.state = {
            company: ""
        }
        this.updateTable()

    }
    updateTable = () => {
        NodeDataService.getCompanyOfNode(this.props.obj.originNode, this.props.userData.token)
        .then( res => {
            console.log(res.data)
            this.setState({
                company: res.data
            })
        })
        .catch((error) => {
            console.log(error)
        })
    }
    render() {
        return (
            <tbody>
                <tr>   
                    <td className='td-key'><strong>{this.props.obj.uid}</strong></td>
                    <td>{this.props.obj.description}</td>
                    <td>{this.state.company}</td>
                    <td>{this.props.obj.currentNode}</td>
                    { (this.props.obj.status == "created" || this.props.obj.status == "arrived") && <td>{this.props.obj.status.toUpperCase()} 📦</td>}
                    { (this.props.obj.status == "completed") && <td>{this.props.obj.status.toUpperCase()} ✅ </td>}
                    { (this.props.obj.status == "shipping") && <td>{this.props.obj.status.toUpperCase()} 🚚</td>}

                    <td>
                        {/* <Link to={'view-staff/'+this.props.obj.username}>
                        <Button size="sm" variant="outline-primary">View</Button>
                        </Link>
                        &nbsp;&nbsp; */}
                    
                        <Link to={'view-shipment/'+this.props.obj.uid}>
                        <Button size="sm" variant="dark">VIEW</Button>
                        </Link>
                        
                    </td>       

                </tr>
            
            </tbody>

        )
    }
    
}
