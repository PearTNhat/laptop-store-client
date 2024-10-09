import { http } from "~/utils/http";

const apiRegister = async (info) => {
  try {
    const config = {
        withCredentials:true
    };
    const { data } = await http.post("user/register", info,config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
};
const apiFinalRegister = async ({email,OTP}) => {
  try {
    const {data} = await http.post('user/final-register',{email,OTP});
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
  }

const apiLogin = async (info) => {
  try {
    const config = {
      withCredentials: true
    }
    const { data } = await http.post("user/login", info,config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
};
const apiForgetPassword = async (email) => {
  try {
    const { data } = await http.get(`user/forgot-password?email=${email}`);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
}
const apiResetPassword = async ({newPassword, resetToken}) => {
  try {
    const {data} = await http.put(`user/reset-password/${resetToken}`,{newPassword});
    return data
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
}
const getCurrentUser = async ({token}) => {
  try {
    const config ={
      headers:{
        Authorization: `Bearer ${token}`,
      },
      }
    const { data } = await http.get("user",config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.log('Error',error.message)
    throw new Error(error.message);
  }
};
const apiRefreshToken = async (accessToken) => {
  const config = {
    withCredentials: true
  }
  try {
    const { data } = await http.post("user/refresh-token", { accessToken },config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
}
export { apiRegister, apiLogin ,apiForgetPassword,apiResetPassword,apiFinalRegister,getCurrentUser,apiRefreshToken};
