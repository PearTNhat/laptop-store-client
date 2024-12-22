import { http } from "~/utils/http"

const getAllProducts = async ({ params }) => {
    try {
        const configs={
            timeout: 50000,
            params
        }
        const { data } = await http.get('product',configs)
        return data
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data
        }
        throw new Error(error.message)
    }
}
const getProduct = async ({ slug }) => {
    try {
        const { data } = await http.get(`product/${slug}`)
        return data
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message)
        }
        throw new Error(error.message)
    }
}
const createProduct = async ({ accessToken, formData }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`
            }
        }
        const { data } = await http.post('product', formData, config)
        return data
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data
        }
        return error.message
    }
}
const createProductColor = async ({ accessToken, slug, formData }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`
            },
            timeout: 50000
        }
        const { data } = await http.post(`product/create-color/${slug}`, formData, config)
        return data
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message)
        }
        throw new Error(error.message)
    }
}
const updateProduct = async ({ accessToken, slug, formData }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`
            }
        }
        const { data } = await http.put(`product/update/${slug}`, formData, config)
        return data
    }
    catch (error) {
        if (error.response && error.response.data) {
            return (error.response.data)
        }
        throw new Error(error.message)
    }
}
const updateProductColor = async ({ accessToken, slug, formData, params }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`
            },
            params
        }
        const { data } = await http.put(`product/update-product-color/${slug}`, formData, config)
        return data
    }
    catch (error) {
        if (error.response && error.response.data) {
            return (error.response.data)
        }
        throw new Error(error.message)
    }
}
const apiDeleteProduct = async ({ accessToken, pId }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`
            },
        }
        const { data } = await http.delete(`product/${pId}`, config)
        return data
    }
    catch (error) {
        if (error.response && error.response.data) {
            return (error.response.data)
        }
        throw new Error(error.message)
    }
}
const apiDeleteProductColor = async ({ accessToken, pId, cId }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`
            },
        }
        const { data } = await http.delete(`product/${pId}/${cId}`, config)
        return data
    }
    catch (error) {
        if (error.response && error.response.data) {
            return (error.response.data)
        }
        throw new Error(error.message)
    }
}
export {
    getAllProducts, getProduct, createProduct,
    createProductColor, updateProduct,
    updateProductColor, apiDeleteProduct, apiDeleteProductColor
}