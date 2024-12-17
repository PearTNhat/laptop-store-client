import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userActions } from "~/store/slice/userSlice";
import Swal from "sweetalert2";
import { apiForgetPassword, apiLogin } from "~/apis/user";
import Button from "~/components/Button";
import InputField from "~/components/InputField";
import path from "~/constants/path";
import { Toast } from "~/utils/alert";
import { validateForm } from "~/utils/helper";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [invalidField, setInvalidField] = useState([]);
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    emailResetPassword: "", // forgot password
  });
  // useCallBack tránh tạo lại hàm mới mỗi lần render (nếu dependencies không thay đổi)
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { email, password } = payload;
    const invalid =  validateForm({ email, password }, setInvalidField);
    if (invalid>0) return;
      const response = await apiLogin({ email, password });
      if (!response.success) {
        Swal.fire("Oops!", response.message, "error");
      } else {
        dispatch(
          userActions.login({
            accessToken: response.accessToken,
            userData: response.userData,
          })
        );
        Toast.fire({
          icon: "success",
          title: "Login successfully",
        });
        navigate(`/${path.HOME}`);
      }
    
  }, [payload]);
  //reset payload khi chuyển tính năng
  useEffect(() => {
    setPayload({
      email: "",
      password: "",
      emailResetPassword:"",
    });
    setInvalidField([])
  }, [isForgetPassword]);
  const handleForgetPassword = async (email) => {
    let invalid = validateForm({ emailResetPassword :email }, setInvalidField);
    if(invalid>0) return;
    const res = await apiForgetPassword(email);
    if (res.success) {
      Swal.fire("Success", res.message, "success");
    } else {
      Swal.fire("Oops!", res.message, "error");
    }
  };
  return (
    <div className="relative">
  <div
        className={`absolute inset-0 bg-white z-20 flex items-center justify-center ${
          isForgetPassword
            ? "translate-x-[0] opacity-100"
            : "translate-x-[-1000px] opacity-0"
        } transition-all duration-500`}
      >
        <div className="w-[300px] md:w-[400px]">
          <h3 className="text-center text-main font-semibold text-2xl mb-4 tracking-widest">
            Quên mật khẩu
          </h3>
              <InputField
                setInvalidField={setInvalidField}
                placeholder={"Email"}
                nameKey={"emailResetPassword"}
                value={payload.emailResetPassword}
                setPayload={setPayload}
                invalidField={invalidField}
              />
          <div className="flex gap-2 justify-end mt-3">
            <Button
              className="!py-2"
              onClick={() => setIsForgetPassword(false)}
            >
              Trở lại
            </Button>
            <Button
              type="submit"
              className="!bg-blue-700 !py-2"
              onClick={() => handleForgetPassword(payload.emailResetPassword)}
            >
              Gửi mail
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center my-16 ">
        <form className="min-w-[300px] md:w-[400px] px-2" onSubmit={(e)=>handleSubmit(e)}>
          <h3 className="text-center text-main font-semibold text-2xl mb-4 tracking-widest">
           Đăng nhập
          </h3>
          <InputField
            setInvalidField={setInvalidField}
            cssDiv="mb-2"
            placeholder={"Email"}
            value={payload.email}
            nameKey={"email"}
            type='email'
            setPayload={setPayload}
            invalidField={invalidField}
          />
          <InputField
            setInvalidField={setInvalidField}
            cssDiv="mb-2"
            placeholder={"Mật khẩu"}
            type={`${isShowPassword ? "text" : "password"}`}
            value={payload.password}
            nameKey={"password"}
            invalidField={invalidField}
            setPayload={setPayload}
            icon={
              isShowPassword ? (
                <IoEyeSharp onClick={() => setIsShowPassword(false)} />
              ) : (
                <FaEyeSlash onClick={() => setIsShowPassword(true)} />
              )
            }
          />
          <div className="mt-4 mb-2">
            <Button wf type="submit">
             Đăng nhập
            </Button>
          </div>
          <div className="flex justify-between text-blue-500 text-[13px]">
              <>
                <Button
                  style={"hover:text-main"}
                  onClick={() => setIsForgetPassword(true)}
                >
                  Quên mật khẩu
                </Button>
                <Button
                  to={`${path.PUBLIC}${path.REGISTER}`}
                  style="hover:text-main"
                >
                  Tạo tài khoản
                </Button>
              </>
            </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
