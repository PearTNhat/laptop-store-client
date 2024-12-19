import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Public } from "./pages/public";
import path from "./constants/path";
import ResetPassword from "./pages/public/Auth/ResetPassword";
import Register from "./pages/public/Auth/Register";
import DetailProduct from "./pages/public/DetailProduct/DetailProduct";
import ProductCategory from "./pages/public/ProductCategory/ProductCategory";
import Modal from "./components/Modal";
import {
  AdminLayout,
  DashBoard,
  ManageOrder,
  ManageProduct,
  ManageUser,
} from "./pages/admin";
import CreateProduct from "./pages/admin/ManageProduct/CreateProduct";
import CreateProductColor from "./pages/admin/ManageProduct/CreateProductColor";
import EditProduct from "./pages/admin/ManageProduct/EditProduct";
import EditProductColor from "./pages/admin/ManageProduct/EditProductColor";
import {
  Order,
  UserInfo,
  WishList,
  UserProfileLayout,
} from "./pages/Member/UserProfile";
import DetailCart from "./components/MyCart/DetailCart";
import Checkout from "./components/Checkout";

function App() {
  const { isShowModal,animation, childrenModal } = useSelector((state) => state.app);
  return (
    <div className="relative h-full w-full overflow-auto">
    {isShowModal && <Modal animation={animation}>{childrenModal}</Modal>}
      <Routes>
        <Route path="/user" element={<UserProfileLayout />}>
          <Route path={path.USER_PROFILE} element={<UserInfo />} />
          <Route path={path.USER_CART} element={<DetailCart />} />
          <Route path={path.USER_ORDER} element={<Order />} />
          <Route path={path.USER_WISHLIST} element={<WishList />} />
        </Route>
        <Route path={path.CHECKOUT} element={<Checkout />} />
        <Route path={path.PUBLIC} element={<Public />}>
          <Route path={path.HOME} element={<Home />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.REGISTER} element={<Register />} />
          <Route path={path.PRODUCT_DETAIL} element={<DetailProduct />} />
          <Route path={path.PRODUCTS_CATEGORY} element={<ProductCategory />} />
          <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>
        <Route path={path.ADMIN} element={<AdminLayout />}>
          <Route index element={<DashBoard />} />
          <Route path={path.ADMIN_MANAGE_USERS} element={<ManageUser />} />
          <Route
            path={path.ADMIN_MANAGE_PRODUCTS}
            element={<ManageProduct />}
          />
          <Route
            path={path.ADMIN_MANAGE_PRODUCTS_CREATE}
            element={<CreateProduct />}
          />
          <Route
            path={path.ADMIN_MANAGE_PRODUCTS_EDIT}
            element={<EditProduct />}
          />
          <Route
            path={path.ADMIN_MANAGE_PRODUCTS_CREATE_COLOR}
            element={<CreateProductColor />}
          />
          <Route
            path={path.ADMIN_MANAGE_PRODUCTS_EDIT_COLOR}
            element={<EditProductColor />}
          />
          <Route path={path.ADMIN_MANAGE_ORDERS} element={<ManageOrder />} />
        </Route>
        {/* <Route path ={path.FINAL_REGISTER} element={<FinalRegister/>}/> */}
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
