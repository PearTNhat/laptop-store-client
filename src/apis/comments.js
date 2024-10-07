import {http} from '../utils/http'

const apiCreateComment = async ({content,rating,parentId,pId,replyOnUser,token}) => {
    try {
        const config ={
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
        const {data} = await http.post(`comment`,{content,rating,parentId,product:pId,replyOnUser},config)
        return data
    } catch (error) {
        if(error.response && error.response.data){
            throw new Error(error.response.data.message)
        }
        throw new Error(error.message)
    }
}
const apiUpdateComment = async ({content,rating,commentId,token}) => {
    try {
        const config ={
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
        const {data} = await http.put(`comment/${commentId}`,{content,rating},config)
        return data
    } catch (error) {
        if(error.response && error.response.data){
            throw new Error(error.response.data.message)
        }
        throw new Error(error.message)
    }
}
const apiDeleteComment = async ({commentId,token}) => {
    try {
        const config ={
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
        const {data} = await http.delete(`comment/${commentId}`,config) 
        return data
    } catch (error) {
        if(error.response && error.response.data){
            throw new Error(error.response.data.message)
        }
        throw new Error(error.message)
    }
}
const apiLikeComment = async ({commentId,token}) => {
    try {
        const config ={
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
        const {data} = await http.put(`comment/like/${commentId}`,{},config)    
        return data
    } catch (error) {
        if(error.response && error.response.data){
            throw new Error(error.response.data.message)
        }
        throw new Error(error.message)
    }
}
export {apiCreateComment,apiUpdateComment,apiDeleteComment,apiLikeComment}