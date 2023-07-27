
import React from "react";
import NavbarSide from "../components/Navbar/NavbarSide"
import Link from "next/link";
import SearchTracker from "../components/myTrackerComponents/trackerSearch";


export default function MyTrackers() {

  return (
    <div className="h-screen bg-gray-50 overflow-x-hidden">
        <div className= "flex justify-start pl-72 font-bold text-gray-500 pt-12 w-screen text-4xl ">
            <div className="pr-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10 text-primary-blue">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
            </div>

            <div className="flex flex-row justify-start gap-4">
                <p className="text-primary-blue">My Projects</p>
                    <Link href="/newProject" className="bg-white font-medium text-sm text-primary-blue flex align-center items-center px-4 rounded-full cursor-pointer hover:shadow-none border-2 border-primary-blue hover:border-[1px]">
                        <span className="mr-2">New</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </Link>
                </div>


        </div>
        
        <NavbarSide></NavbarSide>

       
        <div className="p-4 sm:ml-64">
            <div className="p-4 rounded-lg ">
                <SearchTracker></SearchTracker>

            </div>
        </div>
    </div>
  )

}