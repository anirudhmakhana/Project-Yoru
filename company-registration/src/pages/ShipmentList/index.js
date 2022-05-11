import React, { useEffect, useState } from 'react'

import { ShipmentTable } from "../../components/shipment_table";
import { Titlebar } from '../../components/titlebar';
import { Button } from 'react-bootstrap';

import ShipmentService from "../../services/ShipmentService";

import Table from 'react-bootstrap/Table';

import "../../assets/style/shipment.css";
import "../../assets/style/style.css"

export const ShipmentListPage = () => {
    const [allShipments, setAllShipments] = useState(null)
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const [pageSize, setPageSize] = useState(20)
    const [pageNumber, setPageNumber] = useState(1)

    useEffect(() => {
            ShipmentService.getRelatedShipments(userData.companyCode, userData.token)
            .then( res => setAllShipments(res.data))
            .catch(err => {
                setAllShipments([])
                console.log(err)}) 
        }
    ,[] );

    const dataTable = () => {
        return allShipments.slice((pageNumber-1)*pageSize, (pageNumber-1)*pageSize+pageSize).map((res, i) => {
            return <ShipmentTable userData={userData} obj={res} index={i+1} />
        })
    }

    return (
        <div className="shipment content-main-container">
            <Titlebar pageTitle="Shipment"/>
            
            {userData && allShipments ? 
            
            <div className="content-table-container">
                
                <h3 className="content-header">All Shipments</h3>
                <br/>

                { pageNumber == 1 ? null
                : (<Button onClick={() => {setPageNumber(pageNumber-1)}} className="btn-dark" >
                PREV
                </Button>)}
                {(pageNumber)*pageSize >= allShipments.length ? null :
                (<Button onClick={() => {setPageNumber(pageNumber+1)}} className="btn-dark" >
                    NEXT</Button>)
                }
                <Table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Shipment ID</th>
                            <th scope="col">Description</th>
                            <th scope="col">Producer</th>
                            <th scope="col">Current Location</th>

                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    {dataTable() }
                    
                </Table>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <span>Page : <strong>{pageNumber}</strong></span>
                </div>
            </div>
            : (<></>)}
            
        </div>
    );
}