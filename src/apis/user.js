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
const apiLogin = async (info) => {
  try {
    const { data } = await http.post("user/login", info);
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw new Error(error.message);
  }
};
export { apiRegister, apiLogin };
