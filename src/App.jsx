import { Route, Routes } from "react-router-dom"
import { Home, Login, Public } from "./pages/public"
import path from "./constants/path"
import FinalRegister from "./pages/public/Auth/FinalRegister"

function App() {
  return (
    <Routes>
     <Route path={path.PUBLIC} element={<Public/>}>
        <Route path={path.HOME} element={<Home/>} />
        <Route path={path.LOGIN} element={<Login/>} />
     </Route>
    <Route path ={path.FINAL_REGISTER} element={<FinalRegister/>}/>
    <Route path="*" element={<h1>Not Found</h1>}/>
    </Routes>
  )
}

export default App
