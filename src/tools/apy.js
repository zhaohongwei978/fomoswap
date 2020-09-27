import axios from "axios"

class APY {
    async requestData() {
        try {
            const response = await axios.get('http://0.0.0.0:8011/')

            return {
                code:     0,
                justswap: response.data.data.justswap.Value,
                tronscan: response.data.data.tronscan.Value,
                price:    response.data.data.price.Value,
            }
        } catch (error) {
            return {
                code: -1,
                msg: error,
            }
        }


    }
}


export default new APY()
