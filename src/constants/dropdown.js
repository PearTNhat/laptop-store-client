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
        role: 'user',
    },
    {
        title: 'Quản lý',
        navigation: `${path.ADMIN}`,
        icon: React.createElement(GrUserAdmin),
        role: 'admin',
    },
    {
        title: 'Đăng xuất',
        icon:  React.createElement(CiLogout),
        role: 'user',
        onClick: (func) => {
            return func()
        }
    }
]