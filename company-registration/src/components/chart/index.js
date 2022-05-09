import { render } from 'react-dom';
import { 
    VictoryLine, 
    VictoryChart, 
    VictoryTooltip, 
    VictoryVoronoiContainer, 
    VictoryGroup,
    VictoryScatter,
    VictoryAxis
} from "victory";

const data1 = [
    { x: "0", y: 2 },
    { x: "1", y: 3 },
    { x: "2", y: 5 },
    { x: "3", y: 4 },
    { x: "4", y: 6 },
    { x: "5", y: 10 },
    { x: "6", y: 8 },
    { x: "7", y: 12 },
    { x: "8", y: 14 },
    { x: "9", y: 18 },
    { x: "10", y: 14 },
    { x: "11", y: 20 },
    ]

const data2 = [
    { x: "0", y: 5 },
    { x: "1", y: 2 },
    { x: "2", y: 6 },
    { x: "3", y: 1 },
    { x: "4", y: 20 },
    { x: "5", y: 21 },
    { x: "6", y: 22 },
    { x: "7", y: 25 },
    { x: "8", y: 26 },
    { x: "9", y: 30 },
    { x: "10", y: 24 },
    { x: "11", y: 20 },
    ]

export const FrequencyChart = ({chartDataPrim, chartDataSec, indicator}) => {
    return (
        <>
           <VictoryChart containerComponent={<VictoryVoronoiContainer/>}>
               <VictoryGroup  color="#3751FF"
                labels={({ datum }) => `${indicator}: ${datum.y}`}
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
               </VictoryGroup>
               { chartDataSec && 
               <VictoryGroup color="#DFE0EB"
               labels={({ datum }) => `${indicator}: ${datum.y}`}
               labelComponent={
                   <VictoryTooltip
                       style={{ fontSize: 10, 'z-index': 1  }}
                   />
               }
               data={chartDataSec && chartDataPrim ? chartDataSec : data2}>
                   <VictoryLine
                       interpolation="monotoneX"
                       scale={{x:"time"}} 
                   />
                   <VictoryScatter
                       size={({ active }) => active ? 4 : 2}
                   /> 
              </VictoryGroup>
               }
               
            </VictoryChart> 
        </>
    );
}