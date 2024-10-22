import path from "./path";
export const navigation = [
    {
        id: 1,
        name: 'Home',
        path: `/${path.HOME}`
    },
    {
        id:2 ,
        name:'Products',
        path: `/${path.PRODUCTS}`
    },
    {
        id:3,
        name:'Blogs',
        path: `/${path.BLOGS}`,
    },
    {
        id:4,
        name:'Our services',
        path: `/${path.OUR_SERVICES}`,
    },
    {
        id:5,
        name:'FAQs',
        path: `/${path.FAQ}`,
    }
]
import { AiOutlineDashboard } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FiShoppingCart } from "react-icons/fi";
import { RiProductHuntLine } from "react-icons/ri";
export const adminNavigation = [
    {
        id: 1,
        text: 'Dashboard',
        type:'SINGLE',
        icon: AiOutlineDashboard,
        path: `${path.ADMIN}/${path.ADMIN_DASHBOARD}`
    },
    {
        id: 2,
        text: 'Manage users',
        type:'SINGLE',
        path: `${path.ADMIN}/${path.ADMIN_MANAGE_USERS}`,
        icon: HiOutlineUserGroup ,
    },
    {   
        id: 3,
        text: 'Manage products',
        type:'PARENT',
        icon: RiProductHuntLine,
        submenus: [
            {
                text: 'Create products',
                path: `${path.ADMIN}/${path.ADMIN_MANAGE_PRODUCTS_CREATE}`,
            },
            {
                text: 'Manage products',
                path: `${path.ADMIN}/${path.ADMIN_MANAGE_PRODUCTS}`,
            }
        ]
    },
    {
        id: 4,
        text: 'Manage order',
        type:'SINGLE',
        path: `${path.ADMIN}/${path.ADMIN_MANAGE_ORDERS}`,
        icon: FiShoppingCart,
    }

]