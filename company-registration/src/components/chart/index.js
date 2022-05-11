import { render } from 'react-dom';
import { 
    VictoryLine, 
    VictoryChart, 
    VictoryTooltip, 
    VictoryZoomContainer, 
    VictoryVoronoiContainer,
    VictoryGroup,
    VictoryScatter,
    VictoryAxis
} from "victory";

const data1 = [
    { a: new Date(1982, 1, 1), b: 125 },
    { a: new Date(1987, 1, 1), b: 257 },
    { a: new Date(1993, 1, 1), b: 345 },
    { a: new Date(1997, 1, 1), b: 515 },
    { a: new Date(2001, 1, 1), b: 132 },
    { a: new Date(2005, 1, 1), b: 305 },
    { a: new Date(2011, 1, 1), b: 270 },
    { a: new Date(2015, 1, 1), b: 470 }
  ]

export const FrequencyChart = ({chartDataPrim, chartDataSec, indicatorX, indicatorY}) => {
    return (
        <>
            <VictoryChart containerComponent={<VictoryVoronoiContainer/>}>
                <VictoryGroup  color="#3751FF"
                    labels={({ datum }) => `${indicatorX}: ${datum.x}\n${indicatorY}: ${datum.y}`}
                    labelComponent={
                        <VictoryTooltip
                            style={{ fontSize: 10 }}
                        />
                    }
                    data={chartDataPrim ? chartDataPrim : data1}>
                    {/* <VictoryAxis></VictoryAxis> */}
                    <VictoryLine  
                        interpolation="monotoneX"
                        scale={{x:"time"}}
                    />
                    <VictoryScatter
                        size={({ active }) => active ? 4 : 2}
                    /> 
                    <VictoryAxis crossAxis tickFormat={(x) => new Date(x).getMonth()}/>
                    <VictoryAxis dependentAxis crossAxis tickFormat={(y) => `${Math.round(y)}`}/>
                </VictoryGroup>
                { chartDataSec && 
                <VictoryGroup color="#DFE0EB"
                    labels={({ datum }) => `${indicatorY}: ${datum.y}`}
                    labelComponent={
                        <VictoryTooltip
                            style={{ fontSize: 10, 'z-index': 1  }}
                        />
                    }
                    data={chartDataSec && chartDataPrim ? chartDataSec : data1}>
                    <VictoryLine
                        interpolation="monotoneX"
                        scale={{x:"time"}} 
                    />
                    <VictoryScatter
                        size={({ active }) => active ? 4 : 2}
                    /> 
                    <VictoryAxis crossAxis tickFormat={(x) => new Date(x).getFullYear()}/>
                    <VictoryAxis dependentAxis crossAxis tickFormat={(t) => `${Math.round(t)}`}/>
                </VictoryGroup>
                }
               
            </VictoryChart> 
        </>
    );
}