import path from './path';
import React from 'react';
import { CiLogout } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
export const userDropdown = [
    {
        title: 'Thông tin',
        navigation: `${path.USER_PROFILE}`,
        icon: React.createElement(FaUserCircle),
    },
    {
        title: 'Quản lý',
        navigation: `${path.ADMIN}`,
        icon: React.createElement(GrUserAdmin),
    },
    {
        title: 'Đăng xuất',
        icon:  React.createElement(CiLogout),
        onClick: (func) => {
            return func()
        }
    }
]