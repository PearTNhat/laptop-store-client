import { DefaultUser, Logo } from '~/assets/images'
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import path from '~/constants/path';
function Header() {
  return (
    <div className='main-container py-[35px]'>
      <div className="flex justify-between items-center">
        <div className="">
          <Link to={`/${path.HOME}`}>
           <img src={Logo} alt="logo-digital" />
          </Link>
        </div>

        <div className="flex justify-center items-center">
          {/* phone */}
          <div className="max-lg:hidden text-[13px] px-[20px] border-r border-r-gray-300">
            <div className="flex justify-center items-center ">
              <FaPhoneAlt className='text-main mr-4 text-[10px]'/>
              <span className='font-semibold'>1800900</span>
            </div>
            <div className="text-[12px]">
              Mon-sat 9:00AMM - 6:00PM
            </div>
          </div>
          {/* mail */}
          <div className="max-lg:hidden text-[13px] px-[20px] border-r border-r-gray-300">
            <div className="flex justify-center items-center ">
              <MdEmail className='text-main mr-4'/>
              <span className='font-semibold'>abc.support@gmail.com</span>
            </div>
            <div className="text-[12px] text-center">
              Online support 24/7
            </div>
          </div>
          {/* wishlist */}
          <div className="px-[20px] border-r border-r-gray-300 flex h-[37.5px] items-center">
            <FaRegHeart className='text-main cursor-pointer' />
          </div>
          {/* cart */}
          <div className="px-[20px] border-r border-r-gray-300 text-main cursor-pointer flex h-[37.5px] items-center">
            <i>
              <FaShoppingCart/>
            </i>
          </div>
          {/* User */}
          <div className="pl-[20px]">
            <div className="w-[30px] h-[30px] rounded cursor-pointer">
              <img src={DefaultUser} alt="name" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header