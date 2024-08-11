import { useCallback, useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { userActions } from "~/store/slice/userSlice"
import Swal from "sweetalert2"
import { apiLogin, apiRegister } from "~/apis/user"
import Button from "~/components/Button"
import InputField from "~/components/InputField"
import path from "~/constants/path"
import { Toast } from "~/utils/alert"

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [payload, setPayload] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  // useCallBack tránh tạo lại hàm mới mỗi lần render (nếu dependencies không thay đổi)
  const handleSubmit = useCallback(async () => {
    const { email, password } = payload
    if (isRegister) {
      // register
      const response = await apiRegister(payload)
      if (!response.success) {
        Swal.fire({
          title: "Opps!",
          text: response.data.message,
          icon: "error"
        });
      } else {
        dispatch(userActions.login({accessToken:response.accessToken, userData:response.data}))
        Toast.fire({
          icon: "success",
          title: "Create account successfully"
        });
        navigate(`/${path.HOME}`)
      }
    } else {
         // login
      const response = await apiLogin({ email, password })
      console.log('response', response);
      if (!response.success) {
        Swal.fire({
          title: "Opps!",
          text: response.data.message,
          icon: "error"
        });
      } else {
  
        dispatch(userActions.login({accessToken:response.accessToken, userData:response.data}))
        Toast.fire({
          icon: "success",
          title: "Login successfully"
        });
        navigate(`/${path.HOME}`)
      }
    }

  }, [payload, isRegister])
  return (
    <div className="flex justify-center items-center my-16">
      <div className="min-w-[300px] px-2">
        <h3 className="text-center text-main font-semibold text-2xl mb-4 tracking-widest">{isRegister ? 'Resgister' : 'Login'}</h3>
        {
          isRegister &&
          <div className="flex gap-4">
            <InputField placeholder={'First name'} value={payload.firstName} onChange={(e) => setPayload(prev => ({ ...prev, firstName: e.target.value }))} />
            <InputField placeholder={'Last name'} value={payload.lastName} onChange={(e) => setPayload(prev => ({ ...prev, lastName: e.target.value }))} />
          </div>
        }
        <InputField placeholder={'Email'} value={payload.email} onChange={(e) => setPayload(prev => ({ ...prev, email: e.target.value }))} />
        <InputField placeholder={'Password'} value={payload.password} onChange={(e) => setPayload(prev => ({ ...prev, password: e.target.value }))} />
        <div className="mt-4 mb-2">
          <Button wf onClick={handleSubmit}>{isRegister ? 'Create account' : 'Login'}</Button>
        </div>
        <div className="flex justify-between text-blue-500 text-[13px]">
          {
            isRegister ?
              <button className="hover:text-main" onClick={() => setIsRegister(false)}>Go to Login</button>
              :
              <>
                <Link className="hover:text-main">Forget password</Link>
                <button className="hover:text-main" onClick={() => setIsRegister(true)}>Create account</button>
              </>
          }
        </div>
      </div>

    </div>
  )
}

export default Login