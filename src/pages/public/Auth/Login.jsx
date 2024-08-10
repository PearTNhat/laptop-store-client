import { useState } from "react"
import { Link } from "react-router-dom"
import Button from "~/components/Button"
import InputField from "~/components/InputField"

function Login() {
  const [isRegister,setIsRegister] = useState(false)
  const [payload,setPayload] = useState({
    email: '',
    password: '',
    firstName:'',
    lastName:''
  })
  return (
    <div className="flex justify-center items-center my-16">
      <div className="min-w-[300px] px-2">
        <h3 className="text-center text-main font-semibold text-2xl mb-4 tracking-widest">{isRegister ? 'Resgister':  'Login'}</h3>
        {
          isRegister &&
          <div className="flex gap-4">
            <InputField placeholder={'First name'} value={payload.firstName} onChange={(e)=> setPayload( prev => ({...prev,firstName: e.target.value}))} />
            <InputField placeholder={'Last name'} value={payload.lastName} onChange={(e)=> setPayload( prev => ({...prev,lastName: e.target.value}))} />
          </div>
        } 
        <InputField placeholder={'Email'} value={payload.email} onChange={(e)=> setPayload( prev => ({...prev,email: e.target.value}))} />
        <InputField  placeholder={'Password'} value={payload.password} onChange={(e)=> setPayload( prev => ({...prev,password: e.target.value}))} />
        <div className="mt-4 mb-2">
         <Button wf>{isRegister ? 'Create account' : 'Login'}</Button>
        </div>
        <div className="flex justify-between text-blue-500 text-[13px]">
          {
            isRegister ?
            <button  className="hover:text-main" onClick ={ () => setIsRegister(false)}>Go to Login</button>
            :
            <>
            <Link className="hover:text-main">Forget password</Link>
            <button  className="hover:text-main" onClick ={ () => setIsRegister(true)}>Create account</button>
            </>
          }
        </div>
      </div>

    </div>
  )
}

export default Login