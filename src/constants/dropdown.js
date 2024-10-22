import path from './path';
import React from 'react';
import { CiLogout } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
export const userDropdown = [
    {
        title: 'Profile',
        navigation: `/${path.PROFILE}`,
        icon: React.createElement(FaUserCircle),
    },
    {
        title: 'Admin',
        navigation: `${path.ADMIN}`,
        icon: React.createElement(GrUserAdmin),
    },
    {
        title: 'Logout',
        icon:  React.createElement(CiLogout),
        onClick: (func) => {
            return func()
        }
    }
]