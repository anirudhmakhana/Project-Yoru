import CompanyService from "../services/CompanyService"
import NodeDataService from "../services/NodeDataService"

const google = window.google

class NodeRecommender {

    constructor() {
        
    }
    

    async recommendNextNode( shipment, token, filterCompany = null) {
        const service = new google.maps.DistanceMatrixService();

        var allNodes = []
        var currentNodeCoord = await NodeDataService.getCoordinateByNode(shipment.currentNode, token)
        currentNodeCoord = currentNodeCoord.data
        var destinationCoord = await NodeDataService.getCoordinateByNode(shipment.destinationNode, token)
        destinationCoord = destinationCoord.data
        var passedNode = await NodeDataService.getRelatedNodeToShipment(shipment.uid, token)
        if (!passedNode) {
            passedNode = []
        } else {
            passedNode = passedNode.data
        }
        var sameDestinationNodes = await NodeDataService.getNodeWithStockSameDest(shipment.destinationNode, token)
        if (!sameDestinationNodes) {
            sameDestinationNodes = []
        } else {
            sameDestinationNodes = sameDestinationNodes.data
        }
        if (filterCompany) {
            allNodes= await NodeDataService.getActiveNodeByCompany(filterCompany, token).data
            allNodes =  allNodes.data
        } else {
            allNodes = await NodeDataService.getAllActiveNode(token)
            allNodes =  allNodes.data
        }
        console.log(allNodes)
        
        console.log('passed', passedNode)
        console.log('same dest', sameDestinationNodes)

        var allConsiderNodesCoord = []
        var allConsiderNodes = []
        var origins_request = []
        allNodes.forEach( (aNode, ind )=> {
            if ( !passedNode.includes(aNode.nodeCode) && sameDestinationNodes.includes(aNode.nodeCode)) {
                console.log( aNode, !passedNode.includes(aNode.nodeCode) && sameDestinationNodes.includes(aNode.nodeCode))
                allConsiderNodesCoord.push({lat:allNodes[ind].lat, lng:allNodes[ind].lng})
                allConsiderNodes.push(allNodes[ind].nodeCode)
                origins_request.push(currentNodeCoord)
            }
        })
        console.log('origin requests', origins_request)
        console.log('considering', allConsiderNodesCoord)
        if ( origins_request.length > 0 && allConsiderNodesCoord.length > 0) {
            const requestConsiderNode = {
                origins: origins_request,
                destinations: allConsiderNodesCoord,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false,
            };
    
            const requestDestination = {
                origins: [currentNodeCoord],
                destinations: [destinationCoord],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false,
            };
    
            const response = await service.getDistanceMatrix(requestConsiderNode)
            console.log(response)
            let distNodeCode = []
            response.rows[0].elements.forEach( (elem, ind) => {
                distNodeCode.push({index: ind, distance: elem.distance.value, nodeCode: allConsiderNodes[ind]})
            })
            let allDist = response.rows[0].elements.sort((a,b) => a.distance.value - b.distance.value)
            let nearestDist = allDist[0].distance.value
            console.log(distNodeCode)
            console.log(nearestDist)
            let nearestNode = null
            distNodeCode.forEach( (data, ind)=> {
                if ( data.distance == nearestDist) {
                    nearestNode = distNodeCode[ind].nodeCode
                }
            })
            console.log(nearestNode)

            const res_destination = await service.getDistanceMatrix(requestDestination)
            let destDist = res_destination.rows[0].elements[0].distance.value
            console.log(destDist)
            if ( nearestNode && nearestDist < destDist) {
                return nearestNode
            }
            else {
                return null
            }
        }
        
        else {
            return null
        }


    }
}

export default new NodeRecommender()