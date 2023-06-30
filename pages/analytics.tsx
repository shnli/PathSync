import React from "react";
import Navbar from "../components/Navbar/Navbar"
import NavbarSide from "../components/Navbar/NavbarSide"
import Link from "next/link"


export default function Analytics() {

  return (
    <div className="h-screen bg-gray-50 overflow-x-hidden">
       <div className="flex pt-12 pl-72">
            <div className="pr-2">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-10 h-10 text-primary-blue">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"></path>
                </svg>
            </div>

            <div className="font-bold text-primary-blue  w-screen text-4xl">
                <p>Analytics Dashboard</p>
            </div>
        </div>

        <NavbarSide></NavbarSide>

        
        <div className="p-4 sm:ml-64">
            <div className="p-4 rounded-lg ">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center justify-center h-24 rounded bg-gray-200">
                        <p className="text-2xl text-gray-400 dark:text-gray-500">Number of Completed Projects</p>
                    </div>
                    <div className="flex items-center justify-center h-24 rounded bg-gray-200">
                        <p className="text-2xl text-gray-400 dark:text-gray-500">Most Recent Project</p>
                    </div>
                </div>

                <div className="text-gray-400 font-bold text-xl py-4">Summary</div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center justify-center h-24 rounded bg-gray-200">
                        <p className="text-2xl text-gray-400 dark:text-gray-500">Avg. RFSD Lead Time Accuracy</p>
                    </div>
                    <div className="flex items-center justify-center h-24 rounded bg-gray-200">
                        <p className="text-2xl text-gray-400 dark:text-gray-500">Avg. Qotana Lead Time Accuracy</p>
                    </div>
                </div>

                <div className="flex items-center justify-center h-96 mb-4 rounded bg-gray-200">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
                </div>
            
            </div>
        </div>
    </div>
  )

}