import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userActions } from "~/store/slice/userSlice";
import Swal from "sweetalert2";
import { apiForgetPassword, apiLogin, apiRegister } from "~/apis/user";
import Button from "~/components/Button";
import InputField from "~/components/InputField";
import path from "~/constants/path";
import { Toast } from "~/utils/alert";
import { validateForm } from "~/utils/helper";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgetPassword, setIsForgetPassword] = useState(false);
  const [invalidField, setInvalidField] = useState([]);
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    emailResetPassword: "", // forgot password
  });
  // useCallBack tránh tạo lại hàm mới mỗi lần render (nếu dependencies không thay đổi)
  const handleSubmit = useCallback(async () => {
    const { email, password } = payload;
    const invalid = isRegister ? validateForm(payload, setInvalidField) : validateForm({ email, password }, setInvalidField);
    if (invalid>0) return;
    if (isRegister) {
      // register
      
      const response = await apiRegister(payload);
      if (!response.success) {
        Swal.fire("Oops!", response.message, "error");
      } else {
        Swal.fire("Success", response.message, "success");
      }
    } else {
      // login
      const response = await apiLogin({ email, password });
      if (!response.success) {
        Swal.fire("Oops!", response.message, "error");
      } else {
        dispatch(
          userActions.login({
            accessToken: response.accessToken,
            userData: response.data,
          })
        );
        Toast.fire({
          icon: "success",
          title: "Login successfully",
        });
        navigate(`/${path.HOME}`);
      }
    }
  }, [payload, isRegister]);
  //reset payload khi chuyển tính năng
  useEffect(() => {
    setPayload({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      emailResetPassword:"",
    });
    setInvalidField([])
  }, [isForgetPassword, isRegister]);
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
            Forget password
          </h3>
            <InputField
                setInvalidField={setInvalidField}
                placeholder={"Email"}
                nameKey={"emailResetPassword"}
                value={payload.emailResetPassword}
                setPayload={setPayload}
                invalidField={invalidField}
              />
          <div className="flex gap-2 justify-end">
            <Button
              className="!py-2"
              onClick={() => setIsForgetPassword(false)}
            >
              Back
            </Button>
            <Button
              className="!bg-blue-700 !py-2"
              onClick={() => handleForgetPassword(payload.emailResetPassword)}
            >
              Send mail
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center my-16 ">
        <div className="min-w-[300px] md:w-[400px] px-2">
          <h3 className="text-center text-main font-semibold text-2xl mb-4 tracking-widest">
            {isRegister ? "Register" : "Login"}
          </h3>
          {isRegister && (
            <div className="flex gap-4">
              <InputField
                setInvalidField={setInvalidField}
                placeholder={"First name"}
                nameKey={"firstName"}
                value={payload.firstName}
                setPayload={setPayload}
                invalidField={invalidField}
              />
              <InputField
                setInvalidField={setInvalidField}
                placeholder={"Last name"}
                nameKey={"lastName"}
                value={payload.lastName}
                setPayload={setPayload}
                invalidField={invalidField}
              />
            </div>
          )}
          <InputField
            setInvalidField={setInvalidField}
            placeholder={"Email"}
            value={payload.email}
            nameKey={"email"}
            setPayload={setPayload}
            invalidField={invalidField}
          />
          <InputField
            setInvalidField={setInvalidField}
            placeholder={"Password"}
            type={"password"}
            value={payload.password}
            nameKey={"password"}
            invalidField={invalidField}
            setPayload={setPayload}
          />
          {isRegister && (
            <InputField
              setInvalidField={setInvalidField}
              placeholder={"Confirm password"}
              type={"password"}
              value={payload.confirmPassword}
              nameKey={"confirmPassword"}
              setPayload={setPayload}
              invalidField={invalidField}
            />
          )}
          <div className="mt-4 mb-2">
            <Button wf onClick={handleSubmit}>
              {isRegister ? "Create account" : "Login"}
            </Button>
          </div>
          <div className="flex justify-between text-blue-500 text-[13px]">
            {isRegister ? (
              <button
                className="hover:text-main"
                onClick={() => setIsRegister(false)}
              >
                Go to Login
              </button>
            ) : (
              <>
                <Button
                  style={"hover:text-main"}
                  onClick={() => setIsForgetPassword(true)}
                >
                  Forget password
                </Button>
                <button
                  className="hover:text-main"
                  onClick={() => setIsRegister(true)}
                >
                  Create account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
