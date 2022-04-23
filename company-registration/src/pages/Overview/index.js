import React from "react";

import axios from 'axios';

import "../../assets/style/overview.css"

import { Card } from "../../components/card";
import { FrequencyChart } from "../../components/chart";

export const OverviewPage = () => {
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
                <FrequencyChart/>
            </div>
        </div>
    );
}