import axios from "axios";

class RfidService {

    constructor() {
        this.scanUrl = 'http://17cd-2001-fb1-ff-d847-f401-1d3a-fd3d-fa2c.ngrok.io/radioData'
    }


    async makeScan() { 
        // const response = await axios.get(this.scanUrl)
        // .catch((error) => {
        //     throw error
        // })
        // return response
        return {data:{statusCode:200, data:{uid:'C7F45AD6'}}}
    }

}

export default new RfidService()