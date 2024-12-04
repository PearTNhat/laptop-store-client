import { http } from '~/utils/http'

const apiCreateOrder = async ({ accessToken, body }) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }
        const { data } = await http.post('order', body, config)
        return data
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data
        }
        throw new Error(error.message)
    }
}
const apiGetOrdersUser = async ({ accessToken, params }) => {
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
const apiGetAllOrders = async ({ accessToken, params }) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            params
        }
        const { data } = await http.get('order/get-all', config)
        return data
    }
    catch (error) {
        if (error.response && error.response.data) {
            return error.response.data
        }
        throw new Error(error.message)
    }
}
const apiUpdateInfoOrder = async ({ accessToken, body, orderId }) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }
        const { data } = await http.put(`order/${orderId}`, body, config)
        return data
    }
    catch (error) {
        if (error.response && error.response.data) {
            return error.response.data
        }
        throw new Error(error.message)
    }
}
const apiUpdateStatusOrderProduct = async ({ accessToken, status, orderId, productId }) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }
        const { data } = await http.put(`order/${orderId}/${productId}`,{status}, config)
        return data
    }
    catch (error) {
        if (error.response && error.response.data) {
            return error.response.data
        }
        throw new Error(error.message)
    }
}
const apiDeleteOrder = async ({ accessToken, orderId }) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        }
        const { data } = await http.delete(`order/${orderId}`, config)
        return data
    }
    catch (error) {
        if (error.response && error.response.data) {
            return error.response.data
        }
        throw new Error(error.message)
    }
}
const apiDeleteProductOrder = async ({ accessToken, orderId, productId }) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },

        }
        const { data } = await http.delete(`order/${orderId}/${productId}`, config)
        return data
    }
    catch (error) {
        if (error.response && error.response.data) {
            return error.response.data
        }
        throw new Error(error.message)
    }
}
export {
    apiCreateOrder,
    apiGetOrdersUser,
    apiGetAllOrders, apiDeleteOrder,
    apiDeleteProductOrder, apiUpdateInfoOrder,
    apiUpdateStatusOrderProduct
}