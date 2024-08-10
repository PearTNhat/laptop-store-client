import React from 'react'
import { NavLink } from 'react-router-dom'
import { navigation } from '~/constants/navigation'

function Navigation() {
    return (
        <div className='main-container text-[#1d1d1d]'>
            <div className="border-y py-2 border-y-gray-300 ">
            {
                navigation.map((item) =>
                    <NavLink key={item.id} className={({isActive})=>{
                        const style =  isActive ? 'text-main' : 'hover:text-main'
                        return style + ' pr-7'
                    }} to={item.path}>
                        {item.name}
                    </NavLink>
                    )
            }
            </div>
            
        </div>
    )
}

export default Navigation