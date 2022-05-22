import React, { useState, useEffect } from "react";

import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";

import "../../assets/style/overview.css";
import "../../assets/style/style.css";
import NodeDataService from "../../services/NodeDataService";
import GraphService from "../../services/GraphService";

import { Card } from "../../components/card";
import { LineChart } from "../../components/linechart";
import { NodeSelectPopup } from "../../components/node_select_popup";
import { Titlebar } from "../../components/titlebar";
import DateUtils from "../../utils/DateUtils";
import DatePicker from "react-datepicker";
import ShipmentService from "../../services/ShipmentService";
import { EditProfilePopup } from "../../components/edit_profile_popup";
// In this case, January = 0

export const OverviewPage = (props) => {
    const [userData, setUserData] = useState(eval('('+localStorage.getItem("userData")+')'))
    const [currentNodeCode, setCurrentNodeCode] = useState(null)
    const [nodePopup, setNodePopup] = useState(false);
    const [editProfPopup, setEditProfPopup] = useState(false);

    const [dateGraphData, setDateGraphData] = useState(null)
    // const [hourGraphData, setHourGraphData] = useState(null)
    const [currentDate, setCurrentDate] = useState( new Date() )
    const [graphTimeRange, setGraphTimeRange] = useState("day")
    const [graphType, setGraphType] = useState("shipping")
    
    const [completedCount, setCompletedCount] = useState(0)
    const [stockCount, setStockCount] = useState(0)
    const [incompleteCount, setIncompleteCount] = useState(0)
    const [shippingCount, setShippingCount] = useState(0)
    const [primGraphStartDate, setPrimStartDate] = useState('')
    const [primGraphEndDate, setPrimEndDate] = useState('')
    const [primHighest, setPrimHighest] = useState(0)
    const [primAverage, setPrimAverage] = useState(0)
    const [primLowest, setPrimLowest] = useState(0)
    const [primChangePercent, setPrimChangePercent] = useState(0)
    const [primTotal, setTotal] = useState(0)
    // useState(() => {
    //     var node = eval('('+localStorage.getItem("currentNode")+')')
    //     if (node) {
    //         setCurrentNodeCode(node.nodeCode)
    //     } else {
    //         setCurrentNodeCode('-')
    //     }
    // }, [])
    const handleGraphType = (e) => {
        setGraphType(e)        
    };

	// useState(() => {
	//     var node = eval('('+localStorage.getItem("currentNode")+')')
	//     if (node) {
	//         setCurrentNodeCode(node.nodeCode)
	//     } else {
	//         setCurrentNodeCode('-')
	//     }
	// }, [])
	const handleGraphType = (e) => {
		setGraphType(e);
	};

    useEffect(() => {
        if ( eval('('+localStorage.getItem("currentNode")+')')) {
            setCurrentNodeCode(eval('('+localStorage.getItem("currentNode")+')').nodeCode)

        }
    }, [])

    
    useEffect(() => {
        
        ShipmentService.completedCountByCompany(userData.companyCode, userData.token)
        .then( res => {
            setCompletedCount(res.data)
        })
        .catch( err => {
            console.log(err)
        })
        ShipmentService.currentStockCountByCompany(userData.companyCode, userData.token)
        .then( res => {
            console.log(res.data)
            setStockCount(res.data)
        })
        .catch( err => {
            console.log(err)
        })
        ShipmentService.shippingCountByCompany(userData.companyCode, userData.token)
        .then( res => {
            setShippingCount(res.data)
        })
        .catch( err => {
            console.log(err)
        })
        ShipmentService.incompleteCountByCompany(userData.companyCode, userData.token)
        .then( res => {
            setIncompleteCount(res.data)
        })
        .catch( err => {
            console.log(err)
        })
        GraphService.generateGraph( graphType, graphTimeRange, userData.token, userData.companyCode, null)
        .then( res => {
            console.log(res.data)
            setDateGraphData(res.data.graph)
            setPrimStartDate(res.data.startDate)
            setPrimEndDate(res.data.endDate)
            setPrimAverage(res.data.average)
            setPrimHighest(res.data.highest)
            setPrimLowest(res.data.lowest)
            setPrimChangePercent(res.data.percentageChange)
            setTotal(res.data.total)

        })
        
    }, [graphType,graphTimeRange])

		setNodePopup(false);
	}

	function handlePopupCancel() {
		console.log(localStorage);
		setNodePopup(false);
	}

	function handleEditProfConfirm(newProfile) {
		localStorage.setItem("userData", JSON.stringify(newProfile));
		setUserData(eval("(" + localStorage.getItem("userData") + ")"));
		setEditProfPopup(false);
	}

	function handleEditProfCancel() {
		console.log(localStorage);
		setEditProfPopup(false);
	}

        setNodePopup(false)
    }
    
    function handlePopupCancel() {
        console.log(localStorage)
        setNodePopup(false)
    }

    function handleEditProfConfirm(newProfile) {
        localStorage.setItem("userData", JSON.stringify(newProfile))
        setUserData(eval('('+localStorage.getItem("userData")+')'))
        setEditProfPopup(false)

    }
    
    function handleEditProfCancel() {
        console.log(localStorage)
        setEditProfPopup(false)
    }

    function getChartItem( header, stDate, enDate, number = 0, additional = '' ){
        return <div className="chart-item">
                <span><strong>{header}</strong></span>
                {stDate == enDate ? 
                <p>({stDate})</p> :
                <p>({stDate}-{enDate})</p>}
                <h2 style={{"margin-top":"10px"}}>{number}</h2>
                <p>{additional}</p>
            </div>
    }

    return (
        <div className="overview content-main-container">
            {/* <div className="content-title-container">
                <h1>Overview</h1>
                <button onClick={() => setButtonPopup(true)} className="node-select-button">
                    <FontAwesomeIcon icon={faPen} className="node-select-icon"/>Current Node: {currentNodeCode}
                </button>
            </div> */}
			<Titlebar
				pageTitle="Overview"
				setExtNodePopup={setNodePopup}
				setExtProfPopup={setEditProfPopup}
				extNodeCode={currentNodeCode}
			/>
			<div className="body-top">
				<Card title="Incomplete" info={incompleteCount} />
				<Card title="Shipping" info={shippingCount} />
				<Card title="Completed" info={completedCount} />
				<Card title="In-Stock" info={stockCount} />
			</div>
			<div className="body-main">
				<div className="chart-container">
					<div className="chart-title-container">
						{/* <h3 className="chart-title">Stocking Shipments</h3> */}
						<div style={{ display: "flex", "flex-direction": "row" }}>
							<Dropdown
								onSelect={handleGraphType}
								style={{ marginRight: "2%" }}
							>
								<Dropdown.Toggle className="btn btn-secondary dropdown-toggle">
									{GraphService.graphName[graphType]}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									{GraphService.graphTypes.map((type) => (
										<Dropdown.Item eventKey={type}>
											{GraphService.graphName[type]}
										</Dropdown.Item>
									))}
								</Dropdown.Menu>
							</Dropdown>

							<Dropdown onSelect={handleTimeRangeDropdown}>
								<Dropdown.Toggle className="btn btn-secondary dropdown-toggle">
									{graphTimeRange[0].toUpperCase() +
										graphTimeRange.slice(1).toLowerCase()}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									{GraphService.graphTimeRange.map((g) => (
										<Dropdown.Item eventKey={g}>
											{g[0].toUpperCase() + g.slice(1).toLowerCase()}
										</Dropdown.Item>
									))}
									{/* <Dropdown.Item eventKey={"day"}>Day</Dropdown.Item>
                                    <Dropdown.Item eventKey={"week"}>Week</Dropdown.Item>
                                    <Dropdown.Item eventKey={"month"}>Month</Dropdown.Item>
                                    <Dropdown.Item eventKey={"year"}>Year</Dropdown.Item> */}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        {primGraphEndDate == primGraphStartDate ? 
                        <p>{primGraphStartDate}</p> :
                        <p>{primGraphStartDate}-{primGraphEndDate}</p>}
                    </div>
                    <div className="body-chart-container">
                        { dateGraphData && <LineChart chartDataPrim={dateGraphData} indicatorX={GraphService.xAxisLabel[graphTimeRange]} indicatorY={GraphService.yAxisLabel[graphType]}/>}
                    </div>
                </div>
                <div className="chart-info-right">
                    {/* <hr/> */}
                    {getChartItem(`Total Shipment`, primGraphStartDate, primGraphEndDate, primTotal)}
                    {/* <hr/> */}
                    {getChartItem(`Highest ${GraphService.graphName[graphType]}`, primGraphStartDate, primGraphEndDate, primHighest.value,)}
                    {/* <hr/> */}
                    {getChartItem(`Lowest ${GraphService.graphName[graphType]}`, primGraphStartDate, primGraphEndDate, primLowest.value,)}
                    {/* <hr/> */}
                    {getChartItem(`Average ${GraphService.graphName[graphType]}`, primGraphStartDate, primGraphEndDate, primAverage.toPrecision(2))}
                    {/* <hr/> */}
                    {/* {getChartItem(`Percentage Changes`, primGraphStartDate, primGraphEndDate, `${primChangePercent}%`)} */}
                    {/* <hr/> */}

                    {/* <hr/> */}
                </div>
            </div>
            { nodePopup && <NodeSelectPopup setOpenPopup={setNodePopup} handleConfirm={handlePopupConfirm} handleCancel={handlePopupCancel} />}
            { editProfPopup && <EditProfilePopup setOpenPopup={setEditProfPopup} handleConfirm={handleEditProfConfirm} handleCancel={handleEditProfCancel} />}

        </div>
    );
}
