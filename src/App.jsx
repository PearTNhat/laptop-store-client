import { Route, Routes } from "react-router-dom"
import { Home, Login, Public } from "./pages/public"
import path from "./constants/path"
import FinalRegister from "./pages/public/Auth/FinalRegister"
import ResetPassword from "./pages/public/Auth/ResetPassword"
import Register from "./pages/public/Auth/Register"

function App() {
  return (
    <Routes>
     <Route path={path.PUBLIC} element={<Public/>}>
        <Route path={path.HOME} element={<Home/>} />
        <Route path={path.LOGIN} element={<Login/>} />
        <Route path={path.REGISTER} element={<Register/>} />
        <Route path={path.RESET_PASSWORD} element={<ResetPassword/>} />
     </Route>
    <Route path ={path.FINAL_REGISTER} element={<FinalRegister/>}/>
    <Route path="*" element={<h1>Not Found</h1>}/>
    </Routes>
  )
}

export default App
