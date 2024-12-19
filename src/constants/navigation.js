import path from "./path";
export const navigation = [
    {
        id: 1,
        name: 'Trang chủ',
        path: `/${path.HOME}`
    },
    {
        id:2 ,
        name:'Laptop',
        path: `/${path.PRODUCTS_CATEGORY}`
    },
]
import { AiOutlineDashboard } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FiShoppingCart } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";
export const adminNavigation = [
    {
        id: 1,
        text: 'Thống kê',
        type:'SINGLE',
        icon: AiOutlineDashboard,
        path: `${path.ADMIN}`
    },
    {
        id: 2,
        text: 'Quản lý người dùng',
        type:'SINGLE',
        path: `${path.ADMIN}/${path.ADMIN_MANAGE_USERS}`,
        icon: HiOutlineUserGroup ,
    },
    {   
        id: 3,
        text: 'Quản lý sản phẩm',
        type:'PARENT',
        icon: RiProductHuntLine,
        submenus: [
            {
                text: 'Danh sách sản phẩm',
                path: `${path.ADMIN}/${path.ADMIN_MANAGE_PRODUCTS}`,
            },
            {
                text: 'Tạo sản phẩm',
                path: `${path.ADMIN}/${path.ADMIN_MANAGE_PRODUCTS_CREATE}`,
            }
        ]
    },
    {
        id: 4,
        text: 'Quản lý đơn hàng',
        type:'SINGLE',
        path: `${path.ADMIN}/${path.ADMIN_MANAGE_ORDERS}`,
        icon: FiShoppingCart,
    }

]
import { FaRegUserCircle } from "react-icons/fa"
import { MdOutlineHistory } from "react-icons/md";
import { LuHeart } from "react-icons/lu";
export const userProfilesNavigation = [
    {
        id: 1,
        text: 'Thông tin cá nhân',
        type:'SINGLE',
        path: `${path.USER_PROFILE}`,
        icon: FaRegUserCircle,
    },
    {
        id: 2,
        text: 'Lịch sử mua hàng',
        type:'SINGLE',
        path: `${path.USER_ORDER}`,
        icon: MdOutlineHistory,
    },
    {
        id: 3,
        text: 'Giỏ hàng',
        type:'SINGLE',
        path: `${path.USER_CART}`,
        icon: FiShoppingCart,
    },
    {
        id: 4,
        text: 'Danh sách ưu thích',
        type:'SINGLE',
        path: `${path.USER_WISHLIST}`,
        icon: LuHeart,
    }
]