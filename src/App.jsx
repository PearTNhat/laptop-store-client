import { Route, Routes } from "react-router-dom"
import { useSelector } from "react-redux"
import { Home, Login, Public } from "./pages/public"
import path from "./constants/path"
import ResetPassword from "./pages/public/Auth/ResetPassword"
import Register from "./pages/public/Auth/Register"
import DetailProduct from "./pages/public/DetailProduct/DetailProduct"
import ProductCategory from "./pages/public/ProductCategory/ProductCategory"
import Modal from "./components/Modal"
import { AdminLayout, DashBoard, ManageOrder, ManageProduct, ManageUser } from "./pages/admin"

function App() {
  const {isShowModal,childrenModal} = useSelector((state) => state.app)
  const {userData} = useSelector((state) => state.user)
  console.log(userData)
  return (
    <div className="relative">
      {isShowModal && <Modal>{childrenModal}</Modal>}
      <Routes>
      <Route path={path.PUBLIC} element={<Public/>}>
          <Route path={path.HOME} element={<Home/>} />
          <Route path={path.LOGIN} element={<Login/>} />
          <Route path={path.REGISTER} element={<Register/>} />
          <Route path={path.PRODUCT_DETAIL} element={<DetailProduct/>} />
          <Route path={path.PRODUCTS_CATEGORY} element={<ProductCategory/>} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword/>} />
      </Route>
      <Route path ={path.ADMIN} element={<AdminLayout/>}>
        <Route path={path.ADMIN_DASHBOARD} element={<DashBoard/>} />
        <Route path={path.ADMIN_MANAGE_USERS} element={<ManageUser/>}/>
        <Route path={path.ADMIN_MANAGE_PRODUCTS} element={<ManageProduct/>}/>
        <Route path={path.ADMIN_MANAGE_PRODUCTS_CREATE} element={<ManageProduct/>}/>
        <Route path={path.ADMIN_MANAGE_ORDERS} element={<ManageOrder/>}/>
      </Route>
      {/* <Route path ={path.FINAL_REGISTER} element={<FinalRegister/>}/> */}
      <Route path="*" element={<h1>Not Found</h1>}/>
      </Routes>
    </div>
  )
}

export default App
