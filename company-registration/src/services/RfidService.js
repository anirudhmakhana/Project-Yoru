import axios from "axios";
import { rfidURL } from "../utils/ApiUrl";

class RfidService {



    async makeScan() { 
        // const response = await axios.get(rfidURL)
        // .catch((error) => {
        //     throw error
        // })
        // return response
        return {data:{statusCode:200, data:{uid:'SHP006'}}}
    }

}

export default new RfidService()