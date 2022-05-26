import axios from "axios";

class RfidService {
	async makeScan(rfidURL) {
		const response = await axios.get(rfidURL + '/radioData').catch((error) => {
			throw error;
		});
		return response;
		// return {data:{statusCode:200, data:{uid:'SHP004'}}}
	}
}

export default new RfidService();
