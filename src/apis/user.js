import { http } from "~/utils/http";

const apiRegister = async (info) => {
  try {
    const config = {
      withCredentials: true
    };
    const { data } = await http.post("user/register", info, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
};
const apiFinalRegister = async ({ email, OTP }) => {
  try {
    const { data } = await http.post('user/final-register', { email, OTP });
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
    const { data } = await http.post("user/login", info, config);
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
const apiResetPassword = async ({ newPassword, resetToken }) => {
  try {
    const { data } = await http.put(`user/reset-password/${resetToken}`, { newPassword });
    return data
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
}
const getCurrentUser = async ({ token }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const { data } = await http.get("user", config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.log('Error', error.message)
    throw new Error(error.message);
  }
};
const apiUpdateCurrentUser = async ({ accessToken, formData }) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}`
      }
    }
    const { data } = await http.put(`user`, formData, config)
    return data
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data
    }
    throw new Error(error.message)
  }
}

const apiGetAllUsers = async ({ accessToken, ...params }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params
    }
    const { data } = await http.get("user/get-users", config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
}
const apiRefreshToken = async () => {
  const config = {
    withCredentials: true
  }
  try {
    const { data } = await http.post("user/refresh-token", config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
}
const apiUpdateCart = async ({ accessToken, body }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    const { data } = await http.put("user/cart", body, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    console.log(error.message)
  }
}
const apiRemoveCartItem = async ({ accessToken, body }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      data: body
    }
    const { data } = await http.delete("user/cart", config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
}
const apiUpdateWishlist = async ({ accessToken, product }) => {
  try {
    console.log(accessToken)
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    }
    const { data } = await http.put("user/wish-list",{product}, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
}

const apiUpdateRole = async ({ accessToken, role,userId }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    const { data } = await http.put("user/admin",{role,userId} ,config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
}
const apiUpdateBlock = async ({ accessToken, userId,isBlocked }) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
    const { data } = await http.put("user/admin/block", { userId,isBlocked }, config);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
}
export {
  apiRegister,
  apiLogin,
  apiForgetPassword,
  apiResetPassword,
  apiFinalRegister,
  getCurrentUser,
  apiRefreshToken,
  apiGetAllUsers,
  apiUpdateCurrentUser,
  apiUpdateCart,
  apiRemoveCartItem,
  apiUpdateWishlist,
  apiUpdateRole,
  apiUpdateBlock
};
