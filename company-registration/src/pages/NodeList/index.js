import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table'

import "../../assets/style/style.css"

import NodeDataService from '../../services/NodeDataService';
import { NodeTable } from '../../components/node_table';

export const NodeListPage = () => {
    const [allNodes, setAllNodes] = useState(null)
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const [showAddNode, setShowAddNode] = useState(false)
    useEffect(() => {
        NodeDataService.getAllNode(userData.token)
        .then( res => setAllNodes(res.data))
        .catch( err => {
            setAllNodes([])
            console.log(err)
        })
    }
    ,[] );

    const dataTable = () => {
        return allNodes.map((res, i) => {
            return <NodeTable userData={userData} obj={res} index={i+1} />
        })
    }

    return (
        <div className="content-main-container">
            <div className="content-title-container">
                <h1>Node</h1>
                <Button onClick={() => {setShowAddNode(true)}} className="btn-dark" >
                    ADD NODE
                </Button>
            </div>
            <div className="content-table-container">
                <Table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Node</th>
                            <th scope="col">Address</th>
                            <th scope="col">Company</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>

                        </tr>
                    </thead>
                
                        {userData && allNodes ? (dataTable()) : (<></>)}

                </Table>
            </div>
            
        </div>
    );
}