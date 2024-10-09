import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';
import { apiRefreshToken } from '~/apis/user';
import { store } from '~/store';
import { userActions } from '~/store/slice/userSlice';
export const http = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
// Add a request interceptor
http.interceptors.request.use(async function (config) {

  const accessToken = config.headers?.Authorization?.startsWith('Bearer') && config.headers?.Authorization.split(' ')[1]
  if(!accessToken) return config
  const decodeAccessToken = jwtDecode(accessToken)
  const currentTime = Date.now()/1000
  const dispatch= store.dispatch
  if(decodeAccessToken.exp < currentTime){
    console.log('Token expired')
    const res = await apiRefreshToken(accessToken)
    if(res?.success){
      config.headers.Authorization = `Bearer ${res.accessToken}`
      dispatch(userActions.setAccessToken({accessToken:res.accessToken}))
    }else{
      Swal.fire("Oops!", "Login expired, Please login again", "info").then(()=>{
        dispatch(userActions.logout())
        window.location.href = '/login'
      })
    }
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
http.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response;
}, function (error) {
  return Promise.reject(error);
});