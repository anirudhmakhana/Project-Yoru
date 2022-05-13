import React from "react";

import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'

import { Line } from "react-chartjs-2"

const data1 = [
    { a: new Date(1982, 1, 9), b: 125 },
    { a: new Date(1987, 2, 8), b: 257 },
    { a: new Date(1993, 3, 7), b: 345 },
    { a: new Date(1997, 4, 6), b: 515 },
    { a: new Date(2001, 5, 5), b: 132 },
    { a: new Date(2005, 6, 4), b: 305 },
    { a: new Date(2011, 8, 3), b: 270 },
    { a: new Date(2015, 9, 2), b: 470 }
  ]

export const LineChart = ({chartDataPrim, chartDataSec, indicatorX, indicatorY}) => {
    return (
        <div style={{width: "80%", height: "80%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Line
                data={{
                    datasets: [{
                        label: `Shipment Per ${indicatorX}`,
                        data: chartDataPrim,
                        fill: false,
                        borderColor: '#2b42d8',
                        tension: 0.1,
                    },
                    {
                        label: `Dataset 2`,
                        data: chartDataSec,
                        fill: false,
                        borderColor: '#DFE0EB',
                        tension: 0.1,
                    }]
                }}
                options={{
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0
                            },
                            suggestedMax: 20,
                        }
                    }
                }}
            />
        </div>
    )    
}