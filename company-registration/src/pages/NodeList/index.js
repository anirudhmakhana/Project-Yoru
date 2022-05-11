import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table'

import "../../assets/style/style.css"

import NodeDataService from '../../services/NodeDataService';
import { NodeTable } from '../../components/node_table';
import { AddNodePopup } from '../../components/add_node_popup';
import { EditNodePopup } from '../../components/edit_node_popup';

export const NodeListPage = () => {
    const [allNodes, setAllNodes] = useState(null)
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const [pageNumber, setPageNumber] = useState(1)
    const [showAddNode, setShowAddNode] = useState(false)
    const [pageSize, setPageSize] = useState(20)
    const [editNode, setEditNode] = useState(null)
    const [showEditNode, setShowEditNode] = useState(false)
    useEffect(() => {
        NodeDataService.getAllNode(userData.token)
        .then( res => setAllNodes(res.data))
        .catch( err => {
            setAllNodes([])
            console.log(err)
        })
    }
    ,[showAddNode, showEditNode] );

    const dataTable = () => {
        return allNodes.slice((pageNumber-1)*pageSize, (pageNumber-1)*pageSize+pageSize).map((res, i) => {
            return <NodeTable userData={userData} obj={res} index={i+1} setEditNodePopup={setShowEditNode} setEditNode={setEditNode}/>
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
            
            {userData && allNodes ?
            <div className="content-table-container">
                <span>Page : <strong>{pageNumber}</strong></span>
                { pageNumber == 1 ? null
                : (<Button onClick={() => {setPageNumber(pageNumber-1)}} className="btn-dark" >
                PREV
                </Button>)}
                {(pageNumber)*pageSize >= allNodes.length ? null :
                (<Button onClick={() => {setPageNumber(pageNumber+1)}} className="btn-dark" >
                    NEXT</Button>)
                }
            
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
                
                    {dataTable()} 

                </Table>
                
            </div>
            : null}
            {showAddNode && <AddNodePopup setOpenPopup={setShowAddNode}/>}
            {showEditNode && editNode && <EditNodePopup setOpenPopup={setShowEditNode} initNodeCode={editNode}/>}

        </div>
    );
}