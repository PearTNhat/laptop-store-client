import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiFinalRegister, apiRegister } from "~/apis/user";
import Button from "~/components/Button";
import InputField from "~/components/InputField";
import path from "~/constants/path";
import { validateForm } from "~/utils/helper";

function Register() {
  const navigate = useNavigate();
  const [invalidField, setInvalidField] = useState([]);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isShowPassword, setIsShowPassword] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault()
    const invalid = validateForm(payload, setInvalidField);
    if (invalid > 0) return;
    const response = await apiRegister(payload);
    if (!response.success) {
      setVerifyOtp(false);
      Swal.fire("Oops!", response.message, "error");
    } else {
      setVerifyOtp(true);
    }
  };
  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    const {email,OTP} = payload;
    const response = await apiFinalRegister({email,OTP});
    if (!response.success) {
      Swal.fire("Oops!", response.message, "error");
    } else {
      Swal.fire("Success!", response.message, "Đăng ký thành công. Vui lòng đăng nhập");
      navigate(`${path.PUBLIC}${path.LOGIN}`);
    }
  }
  return (
    <>
    {
        verifyOtp && ( <div className="absolute bg-[rgba(0,0,0,0.1)] inset-0 z-20" onClick={(e)=>{
            e.stopPropagation()
            // setVerifyOtp(false)
        }}>
            <div className="flex items-center h-screen justify-center ">
                <form className="max-lg:w-[40%] w-[500px] bg-white py-4 rounded-md relative" onSubmit={handleSubmitOtp}>
                    <span className="flex justify-center items-center absolute top-0 right-0 w-[20px] h-[20px] rounded-full m-1 hover:bg-gray-300">
                      <IoCloseSharp onClick={()=>setVerifyOtp(false)} className="text-xl text-black cursor-pointer" />
                    </span>
                    <p className="font-bold text-lg text-center">Xác thực email</p>
                    <p className="text-center">{`Nhập OPT đã gửi đến email ${payload.email}`} </p>
                    <input 
                    type="text" placeholder="Nhập OTP" 
                    className="my-4 py-1 px-2 w-[80%] mx-auto block border-gray-00 border rounded-md outline-none" 
                    onChange={ (e) => setPayload({...payload,OTP:e.target.value})}
                    />
                    <div className="w-[80%] mx-auto">
                        <Button className={'text-main !py-2 w-full'} type="submit">Xác thực</Button>
                    </div>
                </form>
            </div>
        </div>)
    }
   
    <div className="flex justify-center items-center my-16 ">
      <form className="min-w-[300px] md:w-[400px] px-2">
        <h3 className="text-center text-main font-semibold text-2xl mb-4 tracking-widest">
          Đăng ký
        </h3>
        <div className="flex gap-4">
          <InputField
            setInvalidField={setInvalidField}
            cssDiv="mb-2"
            placeholder={"Họ"}
            nameKey={"firstName"}
            value={payload.firstName}
            setPayload={setPayload}
            invalidField={invalidField}
          />
          <InputField
            setInvalidField={setInvalidField}
            cssDiv="mb-2"
            placeholder={"Tên"}
            nameKey={"lastName"}
            value={payload.lastName}
            setPayload={setPayload}
            invalidField={invalidField}
          />
        </div>
        <InputField
          setInvalidField={setInvalidField}
          cssDiv="mb-2"
          placeholder={"Email"}
          value={payload.email}
          nameKey={"email"}
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
        <InputField
          setInvalidField={setInvalidField}
          cssDiv="mb-2"
          placeholder={"Xác nhận mật khẩu"}
          type={`${isShowPassword ? "text" : "password"}`}
          value={payload.confirmPassword}
          nameKey={"confirmPassword"}
          setPayload={setPayload}
          invalidField={invalidField}
          icon={
            isShowPassword ? (
              <IoEyeSharp onClick={() => setIsShowPassword(false)} />
            ) : (
              <FaEyeSlash onClick={() => setIsShowPassword(true)} />
            )
          }
        />

        <div className="mt-4 mb-2">
          <Button wf onClick={handleSubmit} type="submit">
            Tạo tài khoản
          </Button>
        </div>
        <div className="flex justify-between text-blue-500 text-[13px]">
          <Button style={"hover:text-main"} to={`${path.PUBLIC}${path.LOGIN}`}>
            Đi tới đăng nhập
          </Button>
        </div>
      </form>
    </div>
    </>
  );
}

export default Register;
