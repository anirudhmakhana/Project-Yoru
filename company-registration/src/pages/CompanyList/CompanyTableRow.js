import React, { Component, setState } from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import axios from 'axios'

export default class CompanyTableRow extends Component {

    constructor(props) {
        super(props)
        console.log(this.props)
        this.state = {
            users: []
        }
        this.updateTable()
              
    }

    updateTable = () => {
        axios.get('http://localhost:4000/staff/getByCompany/' + this.props.obj.companyCode ,
        {headers:{"x-access-token":this.props.userData.token}})
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
        axios.delete('http://localhost:4000/company/' + this.props.obj.companyCode,
         {headers:{"x-access-token":this.props.userData.token}})
        .catch((error) => {
            console.log(error)
        })
        .then(res => {
            console.log(res)
            this.props.refresh()
        })
        // window.location.reload(false)

    }

    deleteStaff = (staff) => {
        console.log(staff)
        axios.delete('http://localhost:4000/staff/' + staff.username,
         {headers:{"x-access-token":this.props.userData.token}})
        .catch((error) => {
            console.log(error)
        })
        .then(res => {
            console.log(res)
            this.updateTable()
        })
    }

    render() {
        return (
            <tbody>
             <tr>   
             <th scope="row">{this.props.obj.companyCode}</th>
                <td>{this.props.obj.companyName}</td>
                <td>
                    
                    <Link to={'edit-company/'+this.props.obj.companyCode}>
                        <Button size="sm" variant="primary">EDIT</Button>
                    </Link>
                    &nbsp;&nbsp;
                    <Link to={'add-staff/'+this.props.obj.companyCode}>
                        <Button size="sm" variant="success">ADD STAFF</Button>
                    </Link>
                    &nbsp;&nbsp;
                    <Button size="sm" onClick={this.deleteCompany} variant="outline-danger"> DELETE</Button>
                </td>
                <td align="center">
                        {this.state.users.slice(0, this.state.users.length).map((item, index) => {
                        return (
                            <tr>
                                <td>{item.fullName}</td>
                                <td>
                                    &nbsp;&nbsp;
                                    <Link to={'view-staff/'+item.username}>
                                    <Button size="sm" variant="secondary">VIEW</Button>
                                    </Link>
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
