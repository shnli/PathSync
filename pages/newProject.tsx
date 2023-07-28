import React from "react";
import Navbar from "../components/Navbar/Navbar"
import PrimaryData from "../components/checklistDisplay/PrimaryData"
import Link from "next/link"


export default function NewProject() {
  // const email = localStorage.getItem("email");

  return (
    <div className="h-screen bg-gray-50 w-full">
      <Navbar userEmail=""></Navbar> 
      {/* email={email} */}
      <div className="pt-16 pb-12">
        <div className="bg-white mx-96 my-8 py-4 rounded-lg shadow-md">
            <div className= "flex justify-center font-bold text-gray-500 pt-8 text-xl pb-4">
                <p> Basic Project Information</p>
            </div>
            <PrimaryData></PrimaryData>
            </div>
        </div>
    </div>
  )

}
