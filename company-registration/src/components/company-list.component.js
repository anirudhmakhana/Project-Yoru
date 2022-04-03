import React, { Component } from 'react'
import axios from 'axios'
import Table from 'react-bootstrap/Table'
import CompanyTableRow from './CompanyTableRow'

export default class CompanyList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            companies: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4000/companies')
            .then( res => {
                this.setState({
                    companies: res.data
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    DataTable = () => {
        return this.state.companies.map((res, i) => {
            return <CompanyTableRow obj={res} key={i}/>
        })
    }

    render() {
        return (
            <div className="table-wrapper mt-5">
                <h1  className="mb-3">Companies</h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Public Keys</th>
                            <th>Action</th>

                        </tr>
                    </thead>

                        {this.DataTable()}

                </Table>
            
            </div>
        )
    }
}
