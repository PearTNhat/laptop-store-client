import http from './http'

const register = async (infor) => {
    try {
        const {data} = await http.post('user/register', infor)
        return data
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message)
          }
          throw new Error(error.message)
    }
}
const login = async (infor) => {
    try {
        const {data} = await http.post('user/login', infor)
        return data
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message)
          }
          throw new Error(error.message)
    }
}
export { register,login}