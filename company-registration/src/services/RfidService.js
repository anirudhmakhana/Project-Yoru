import axios from "axios";

class RfidService {

    constructor() {
        this.scanUrl = 'https://c435-2001-fb1-fe-b80c-f42d-a092-d8d0-6ba.ngrok.io/radioData'
    }


    async makeScan() { 
        // const response = await axios.get(this.scanUrl)
        // .catch((error) => {
        //     throw error
        // })

        return {data:{statusCode:200, data:{uid:'SHP005'}}}
    }

}

export default new RfidService()