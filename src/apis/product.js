import { http } from "~/utils/http"

const getAllProducts = async ({params}) => {
    try {
        const { data } = await http.get('product', { params })
        return data
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message)
        }
        throw new Error(error.message)
    }
}
export { getAllProducts }