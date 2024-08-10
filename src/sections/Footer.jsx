/* eslint-disable react/no-unescaped-entities */
import { FaPhoneAlt } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
function Footer() {
    return (
        <div className=''>
            <div className=" px-4 text-[#b7b7b7] py-[50px] bg-[#191919]">
                <div className="grid grid-cols-12">
                    <div className="md:col-span-4 col-span-12 max-md:mb-[10px]">
                        <div className="uppercase border-l-[3px] border-l-main text-white text-[15px] mb-5 font-semibold pl-3">About us</div>
                        <ul className="text-[13px]">
                            <li className="flex items-center mb-[10px] hover:text-white cursor-pointer">
                                <FaMapMarkerAlt className="w-[10px]" />
                                <strong className="ml-2 mr-1">
                                    Address:
                                </strong>
                                9 District, Ho Chi Minh City
                            </li>
                            <li className="flex items-center mb-[10px] hover:text-white cursor-pointer">
                                <FaPhoneAlt />
                                <strong className="mx-1">
                                    Phone:
                                </strong>
                                +84 4444 4444
                            </li>
                            <li className="flex items-center mb-[10px] hover:text-white cursor-pointer">
                                <MdMail />
                                <strong className="mx-1">
                                    Mail:
                                </strong>
                                letuannhat105@gmail.com
                            </li>
                        </ul>
                        <ul className="flex items-center gap-2">
                            <li className="flex items-center justify-center text-white w-10 h-10 rounded-[3px] bg-[#303030] cursor-pointer"><FaFacebookF /></li>
                            <li className="flex items-center justify-center text-white w-10 h-10 rounded-[3px] bg-[#303030] cursor-pointer"><FaXTwitter /></li>
                            <li className="flex items-center justify-center text-white w-10 h-10 rounded-[3px] bg-[#303030] cursor-pointer"><FaGoogle /></li>
                            <li className="flex items-center justify-center text-white w-10 h-10 rounded-[3px] bg-[#303030] cursor-pointer"><FaLinkedinIn /></li>
                        </ul>
                    </div>
                    <div className="md:col-span-4 col-span-12">
                        <div className="uppercase border-l-[3px] border-l-main text-white text-[15px] mb-5 font-semibold pl-3">Information</div>
                        <ul className="text-[13px]">
                            <li className="mb-[10px] hover:text-white cursor-pointer">
                                <a href="">
                                    Typography
                                </a>
                            </li>
                            <li className="mb-[10px] hover:text-white cursor-pointer">
                                <a href="">
                                    Gallery
                                </a>
                            </li>
                            <li className="mb-[10px] hover:text-white cursor-pointer">
                                <a href="">
                                    Store Location
                                </a>
                            </li>
                            <li className="mb-[10px] hover:text-white cursor-pointer">
                                <a href="">
                                    Today's Deals
                                </a>
                            </li>
                            <li className="mb-[10px] hover:text-white cursor-pointer">
                                <a href="">
                                    Contact
                                </a>
                            </li>
                        </ul>

                    </div>
                    <div className="md:col-span-4 col-span-12">
                        <div className="uppercase border-l-[3px] border-l-main text-white text-[15px] mb-5 font-semibold pl-3">Who we are</div>
                        <ul className="text-[13px]">
                            <li className="mb-[10px] hover:text-white cursor-pointer">
                                <a href="">
                                    Help
                                </a>
                            </li>
                            <li className="mb-[10px] hover:text-white cursor-pointer">
                                <a href="">
                                    Free Shipping
                                </a>
                            </li>
                            <li className="mb-[10px] hover:text-white cursor-pointer">
                                <a href="">
                                    FAQs
                                </a>
                            </li>
                            <li className="mb-[10px] hover:text-white cursor-pointer">
                                <a href="">
                                    Return & Exchange
                                </a>
                            </li>
                            <li className="mb-[10px] hover:text-white cursor-pointer">
                                <a href="">
                                    Testimonials
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-t-[#2e2e2e] pt-4">
                    <div className="uppercase border-l-[3px] border-l-main text-white text-[15px] mb-5 font-semibold pl-3">Product tags</div>
                    <ul className="text-[13px] flex items-center gap-2">
                        <li className="mb-[10px] hover:text-white cursor-pointer">
                            <a href="">
                                Dell
                            </a>
                        </li>
                        <li className="mb-[10px] hover:text-white cursor-pointer">
                            <a href="">
                                Acer
                            </a>
                        </li>
                        <li className="mb-[10px] hover:text-white cursor-pointer">
                            <a href="">
                                Hp
                            </a>
                        </li>
                    </ul>

                </div>
            </div>
        </div>
    )
}

export default Footer