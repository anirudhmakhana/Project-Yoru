import React, { useEffect, useState } from 'react'

import { ShipmentTable } from "../../components/shipment_table";
import ShipmentService from '../../services/ShipmentService';
import Table from 'react-bootstrap/Table'

import "../../assets/style/shipment.css"

export const ShipmentListPage = () => {
    const [allShipments, setAllShipments] = useState(null)
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))

    useEffect(() => {
            ShipmentService.getAllShipments()
            .then( res => setAllShipments(res))
            .catch(err => {
                setAllShipments([])
                console.log(err)})
        }
    ,[] );

    const dataTable = () => {
        return allShipments.map((res, i) => {
            return <ShipmentTable userData={userData} obj={res} index={i+1} />
        })
    }

    return (
        <div id="shipment">
            <div className="title-container">
                <h1>Shipment</h1>
            </div>
            <Table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Shipment ID</th>
                        <th scope="col">Shipment Name</th>
                        <th scope="col">Producer</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>

                    </tr>
                </thead>
            
                    {userData && allShipments ? (dataTable()) : (<></>)}

            </Table>
        </div>
    );
}