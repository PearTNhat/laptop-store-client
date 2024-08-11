import {http} from '~/utils/http'

const apiRegister = async (infor) => {
    try {
        const {data} = await http.post('user/register', infor)
        return data
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response
          }
          throw new Error(error.message)
    }
}
const apiLogin = async (infor) => {
    try {
        const {data} = await http.post('user/login', infor)
        return data
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response
          }
          throw new Error(error.message)
    }
}
export { apiRegister,apiLogin}