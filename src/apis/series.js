import {http} from '~/utils/http'

const apiGetSeriesBrand =async ({brandId}) => {
    try {
        const { data } = await http.get(`series/brand/${brandId}`)
        return data
    } catch (error) {
        if (error.response && error.response.data) {
        return error.response.data
        }
        throw new Error(error.message)
    }
}
export {apiGetSeriesBrand}