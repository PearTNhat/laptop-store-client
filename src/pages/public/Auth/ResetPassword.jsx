import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import { apiResetPassword } from "~/apis/user"
import Button from "~/components/Button"
import InputField from "~/components/InputField"
import path from "~/constants/path"
import { validateForm } from "~/utils/helper"

function ResetPassword() {
  const {resetToken} = useParams()
  const navigate = useNavigate()
  const [payload,setPayload] = useState({password:'',confirmPassword:''})
  const [invalidField,setInvalidField] =useState([])
  const handleSubmit =async ({newPassword,resetToken}) => {
    const invalid = validateForm(payload,setInvalidField)
    if(invalid>0) return
    const res = await apiResetPassword({newPassword,resetToken})
    if(res.success){
      Swal.fire("Success", "Change password successfully. Go to login", "success");
      navigate('/'+path.LOGIN)
    }else{
      Swal.fire("Oops!", res.message, "error");
    }
  }
  return (
    <div className=" my-16">

    <div className="w-[300px] md:w-[400px] mx-auto">
            <h3 className="text-center text-main font-semibold text-2xl mb-4 tracking-widest">
              Reset password
            </h3>
            <InputField
                type="password"
                setInvalidField={setInvalidField}
                placeholder={"Password"}
                nameKey={"password"}
                value={payload.password}
                setPayload={setPayload}
                invalidField={invalidField}
              />
           <InputField
                type="password"
                setInvalidField={setInvalidField}
                placeholder={"ConfirmPassword"}
                nameKey={"confirmPassword"}
                value={payload.confirmPassword}
                setPayload={setPayload}
                invalidField={invalidField}
              />
            <div className="flex justify-end">
              <Button className="!bg-blue-700 !py-2" onClick={()=>handleSubmit({newPassword:payload.password,resetToken})}>Submit </Button>
            </div>
          </div>
    </div>
  )
}

export default ResetPassword