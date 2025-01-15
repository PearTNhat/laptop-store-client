import axios from 'axios'
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';
import { apiRefreshToken } from '~/apis/user';
import { store } from '~/store';
import { appActions } from '~/store/slice/app';
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
  if(decodeAccessToken.exp < currentTime){
    const dispatch= store.dispatch
    console.log('Token expired')
    dispatch(
      appActions.toggleModal({ isShowModal: false, childrenModal: null })
    );
    const res = await apiRefreshToken()
    if(res?.success){
      config.headers.Authorization = `Bearer ${res.accessToken}`
      dispatch(userActions.setAccessToken({accessToken:res.accessToken}))
    }else{
      await Swal.fire("Oops!", "Đăng nhập đã hết hạn vui lòng đăng nhập lại", "info").then(()=>{
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