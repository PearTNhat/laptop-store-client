import {http} from '~/utils/http'

const apiGetAllBrands =async () => {
    try {
        const { data } = await http.get('brand')
        return data
    } catch (error) {
        if (error.response && error.response.data) {
        return error.response.data
        }
        throw new Error(error.message)
    }
}
export {apiGetAllBrands}