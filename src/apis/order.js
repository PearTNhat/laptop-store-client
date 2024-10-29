import { http } from '~/utils/http'

const apiCreateOrder = async ({ accessToken, body }) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }
        const { data } = await http.post('order',body, config)
        return data
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data
        }
        throw new Error(error.message)
    }
}
const apiGetOrdersUser = async ({ accessToken,params }) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params
        }
        const { data } = await http.get('order/user', config)
        return data
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data
        }
        throw new Error(error.message)
    }
}
export { apiCreateOrder,apiGetOrdersUser }