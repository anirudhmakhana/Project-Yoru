import React, { useState, useEffect } from "react";

import axios from 'axios';

import "../../assets/style/overview.css"

import { Card } from "../../components/card";
import { FrequencyChart } from "../../components/chart";

export const OverviewPage = (props) => {
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    // useEffect(() => {
    //     setUserData(props.userData)
    //     console.log(props.userData)
    //   }, [userData]);
    return (
        <div id="overview">
            <div className="title-container">
                <h1>Overview</h1>
            </div>
            <div className="body-top">
                <Card title="In transit" info="0"/>
                <Card title="Shipped" info="0"/>
                <Card title="Delayed" info="0"/>
                <Card title="On hold" info="0"/>
            </div>
            <div className="body-main">
                <div className="chart-container">
                    <div className="chart-title-container">
                        <h3 className="chart-title">Today's shipping</h3>
                        <p>25 May 2022</p>
                    </div>
                    <div className="body-chart-container">
                        <FrequencyChart/>
                    </div>
                </div>
                <div className="chart-info-right">
                    <hr/>
                    <div className="chart-item">
                        <p>Hello</p>
                    </div>
                    <hr/>
                    <div className="chart-item">
                        <p>Hello 2</p>
                    </div>
                    <hr/>
                    <div className="chart-item">
                        <p>Hello 3</p>
                    </div>
                    <hr/>
                </div>
            </div>
        </div>
    );
}