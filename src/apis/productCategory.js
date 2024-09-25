import { http } from "~/utils/http"

const apiGetAllCategories = async() => {
    try {
       const {data}  = await http.get('product-category')
       return data
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message)
          }
          console.log(error);
          throw new Error(error.message)
    }
}
const apiGetProductCategory = async({slug}) => {
    try {
        const {data} = await http.get(`product-category/${slug}`)
        return data
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message)
          }
          console.log(error);
          throw new Error(error.message)
    }
}
export {apiGetAllCategories,apiGetProductCategory}