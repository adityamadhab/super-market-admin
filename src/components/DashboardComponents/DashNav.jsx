import { Link } from "react-router-dom";

export default function DashNav() {
    return (
        <div className="border-b-2 border-[#E7CBA3] bg-white w-full sm:w-[1200px] mb-6">
            <div className="bg-white mb-3 flex justify-between items-center">
                <Link to={'/dashboard'} className="header--title cursor-pointer flex gap-4">
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-1">
                        <path d="M5.5249 17.6375V5.52499H13.8124V17.6375H5.5249Z" fill="black" />
                        <path d="M20.1874 9.98749V5.52499H28.4749V9.98749H20.1874Z" fill="black" />
                        <path d="M20.1874 28.475V16.3625H28.4749V28.475H20.1874Z" fill="black" />
                        <path d="M5.5249 28.475V24.0125H13.8124V28.475H5.5249Z" fill="black" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M18.0624 4.24999C18.0624 3.78055 18.443 3.39999 18.9124 3.39999H29.7499C30.2193 3.39999 30.5999 3.78055 30.5999 4.24999V11.2625C30.5999 11.7319 30.2193 12.1125 29.7499 12.1125H18.9124C18.443 12.1125 18.0624 11.7319 18.0624 11.2625V4.24999ZM20.1874 5.52499V9.98749H28.4749V5.52499H20.1874ZM18.0624 15.0875C18.0624 14.6181 18.443 14.2375 18.9124 14.2375H29.7499C30.2193 14.2375 30.5999 14.6181 30.5999 15.0875V29.75C30.5999 30.2194 30.2193 30.6 29.7499 30.6H18.9124C18.443 30.6 18.0624 30.2194 18.0624 29.75V15.0875ZM20.1874 16.3625V28.475H28.4749V16.3625H20.1874Z" fill="black" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M15.0874 3.39999H4.2499C3.78046 3.39999 3.3999 3.78055 3.3999 4.24999V18.9125C3.3999 19.3819 3.78046 19.7625 4.2499 19.7625H15.0874C15.5568 19.7625 15.9374 19.3819 15.9374 18.9125V4.24999C15.9374 3.78055 15.5568 3.39999 15.0874 3.39999ZM5.5249 5.52499V17.6375H13.8124V5.52499H5.5249Z" fill="black" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M15.0874 21.8875H4.2499C3.78046 21.8875 3.3999 22.2681 3.3999 22.7375V29.75C3.3999 30.2194 3.78046 30.6 4.2499 30.6H15.0874C15.5568 30.6 15.9374 30.2194 15.9374 29.75V22.7375C15.9374 22.2681 15.5568 21.8875 15.0874 21.8875ZM5.5249 24.0125V28.475H13.8124V24.0125H5.5249Z" fill="black" />
                    </svg>
                    <h2 className="text-lg font-extrabold text-black hidden sm:block">Dashboard</h2>
                    <h2 className="text-sm font-bold text-black sm:hidden mt-1">Dashboard</h2>
                </Link>
                <div className="user--info flex items-center gap-3">
                    <div className="search--box border border-black rounded-lg items-center gap-2 px-3 py-1 hidden sm:flex">
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
                            <circle cx="16.0415" cy="16.0417" r="8.75" stroke="black" />
                            <path d="M29.1665 29.1667L24.7915 24.7917" stroke="black" strokeLinecap="round" />
                        </svg>
                        <input type="text" placeholder="Search" className="bg-transparent focus:outline-none" />
                    </div>
                </div>
            </div>
        </div>
    )
}