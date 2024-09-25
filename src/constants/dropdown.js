import path from './path';
import React from 'react';
import { CiLogout } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
export const userDropdown = [
    {
        title: 'Profile',
        navigation: `/${path.PROFILE}`,
        icon: React.createElement(FaUserCircle),
    },
    {
        title: 'Logout',
        icon:  React.createElement(CiLogout),
        onClick: (func) => {
            return func()
        }
    }
]