import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TableOfContents, ShoppingCart, ClockArrowUp, HandCoins, LogOut } from 'lucide-react';

export default function Sidebar() {
    const navigate = useNavigate();

    return (
        <div className="sticky top-0 left-0 bottom-0 h-screen py-0 px-4 text-white bg-black transition-all duration-500 w-20 sm:w-[344px]">
            <div className="logo flex items-center p-4 mt-4">
                <img src="/logo.png" alt="RightCliq Creator Logo" className="h-12 sm:h-12 object-contain" />
                <span className='text-white font-bold text-xl sm:text-lg hidden sm:block ml-2'>Super Market</span>
            </div>
            <ul className="menu h-[88vh] relative list-none p-0">
                <li className={`p-3 my-2 rounded-lg transition duration-500 ease-in-out ${location.pathname === '/dashboard' ? 'bg-white' : ''} hover:bg-white group`}>
                    <Link to='/dashboard' className="text-white text-base no-underline flex items-center gap-3 group-hover:text-black">
                        <LayoutDashboard className={`${location.pathname === '/dashboard' ? 'text-black' : ''} group-hover:text-black`} />
                        <span className={`overflow-hidden text-sm ${location.pathname === '/dashboard' ? 'text-black' : 'text-white'} justify-between gap-24 items-center hidden lg:flex group-hover:text-black`}>
                            Dashboard
                        </span>
                    </Link>
                </li>
                <li className={`p-3 my-2 rounded-lg transition duration-500 ease-in-out ${location.pathname === '/category' ? 'bg-white' : ''} hover:bg-white group`}>
                    <Link to='/category' className="text-white text-base no-underline flex items-center gap-3 group-hover:text-black">
                        <TableOfContents className={`${location.pathname === '/category' ? 'text-black' : ''} group-hover:text-black`} />
                        <span className={`overflow-hidden text-sm ${location.pathname === '/category' ? 'text-black' : 'text-white'} justify-between gap-24 items-center hidden lg:flex group-hover:text-black`}>
                            Categories
                        </span>
                    </Link>
                </li>
                <li className={`p-3 my-2 rounded-lg transition duration-500 ease-in-out ${location.pathname === '/product' ? 'bg-white' : ''} hover:bg-white group`}>
                    <Link to='/product' className="text-white text-base no-underline flex items-center gap-3 group-hover:text-black">
                        <ShoppingCart className={`${location.pathname === '/product' ? 'text-black' : ''} group-hover:text-black`} />
                        <span className={`overflow-hidden text-sm ${location.pathname === '/product' ? 'text-black' : 'text-white'} justify-between gap-24 items-center hidden lg:flex group-hover:text-black`}>
                            Products
                        </span>
                    </Link>
                </li>
                <li className={`p-3 my-2 rounded-lg transition duration-500 ease-in-out ${location.pathname === '/orders' ? 'bg-white' : ''} hover:bg-white group`}>
                    <Link to='/orders' className="text-white text-base no-underline flex items-center gap-3 group-hover:text-black">
                        <ClockArrowUp className={`${location.pathname === '/orders' ? 'text-black' : ''} group-hover:text-black`} />
                        <span className={`overflow-hidden text-sm ${location.pathname === '/orders' ? 'text-black' : 'text-white'} justify-between gap-24 items-center hidden lg:flex group-hover:text-black`}>
                            Orders
                        </span>
                    </Link>
                </li>
                <li className={`p-3 my-2 rounded-lg transition duration-500 ease-in-out ${location.pathname === '/payments' ? 'bg-white' : ''} hover:bg-white group`}>
                    <Link to='/payments' className="text-white text-base no-underline flex items-center gap-3 group-hover:text-black">
                        <HandCoins className={`${location.pathname === '/payments' ? 'text-black' : ''} group-hover:text-black`} />
                        <span className={`overflow-hidden text-sm ${location.pathname === '/payments' ? 'text-black' : 'text-white'} justify-between gap-24 items-center hidden lg:flex group-hover:text-black`}>
                            Payments
                        </span>
                    </Link>
                </li>
                <li className={`p-3 my-2 rounded-lg transition duration-500 ease-in-out ${location.pathname === '/logout' ? 'bg-white' : ''} hover:bg-white group`}>
                    <Link to='/logout' className="text-white text-base no-underline flex items-center gap-3 group-hover:text-black">
                        <LogOut className={`${location.pathname === '/logout' ? 'text-black' : ''} group-hover:text-black`} />
                        <span className={`overflow-hidden text-sm ${location.pathname === '/logout' ? 'text-black' : 'text-white'} justify-between gap-24 items-center hidden lg:flex group-hover:text-black`}>
                            Logout
                        </span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}