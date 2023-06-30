import Navbar from "../components/Navbar/Navbar"
import Link from "next/link"
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from 'react';
import { useEffect } from "react";





export default function Home() {
    
  const router = useRouter();
  const [email, setEmail] = useState("");

  
  useEffect(() => {
    // Check if the user is logged out or doesn't have an account
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      // Redirect the user to the login page
      router.push("/login");
    }
    else {
      setEmail(storedEmail);
    }
  }, [router]);


  return (
    <>
      
      <Navbar userEmail={email}></Navbar>



      <div className="flex flex-col justify-center items-center w-screen  h-screen ">     
        <div className="text-7xl text-blue-600 font-semibold linear-wipe">
          <p>Project Development Tracker</p>
        </div>
        <div className="text-lg text-blue-600  pt-8">
          <p>A prototype task management tool designed for a more efficient and transparent joint development process.</p>
        </div>
        

        <div className="mt-12">
          <Link href="/newProject" className="bg-primary-blue font-medium text-md text-white px-16 py-4 rounded-lg cursor-pointer shadow-md hover:shadow-none border-2 border-primary-blue hover:border-[1px]">Start New Project</Link>
          <Link href="/myTrackers" className="bg-white border-2 hover:border-[1px] ml-8 border-primary-blue font-medium placeholder:text-md text-primary-blue px-16 py-4 shadow-md hover:shadow-none rounded-lg cursor-pointer">Project History</Link>
        </div>  


      </div>
      
   </>
  )
}
