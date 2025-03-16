import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function FinalRegister() {
  const navigate = useNavigate();
  const {status} = useParams();
  useEffect(() => {
    if(status === 'success') {
      Swal.fire('Success', "Go to login", 'success').then(() => {
        navigate('/login');
      });
    }else{
      Swal.fire('Oops!', "Register failed", 'error').then(() => {
        navigate('/login');
      });
    }
  }, []);
  return <div className="bg-white h-screen"></div>;
}

export default FinalRegister;
