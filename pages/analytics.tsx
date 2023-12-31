import React from "react";
import Navbar from "../components/Navbar/Navbar"
import NavbarSide from "../components/Navbar/NavbarSide"
import Link from "next/link"
import { useEffect, useState } from 'react';
import axios from 'axios';


export default function Analytics() {
    
    const [userId, setUserId] = useState<number | null>(null);
  
    
    const getUserData = async () => {
      try {
        const storedEmail = localStorage.getItem("email");
        const storedPassword = localStorage.getItem("password");

        if (!storedEmail) {
        } else {
          const response = await axios.post('/api/auth/me', { email: storedEmail , password: storedPassword });
          const userData = response.data;
          console.log(userData.id);
          setUserId(userData.id);
        }
      } catch (error) {
        console.error('Hello Error fetching user data:', error);
      }
    };

    const [projectCount, setProjectCount] = useState(0);

    useEffect(() => {
      getUserData();
    }, []);
    

    useEffect(() => {
        if (userId !== null) {
            fetchProjectCount();
          }
    }, [userId]);
  
    const fetchProjectCount = async () => {
      try {
        const response = await axios.get(`/api/getProjectCount?userId=${userId}`);
        const { count } = response.data;
        setProjectCount(count);
      } catch (error) {
        console.error("Error retrieving project count:", error);
      }
    };

    const [projectCountAll, setProjectCountAll] = useState(0);

  
    const fetchProjectCountAll = async () => {
      try {
        const response = await axios.get(`/api/getProjectCountTotal`);
        const { count } = response.data;
        setProjectCountAll(count);
      } catch (error) {
        console.error('Error retrieving project count for all users:', error);
      }
    };
  
    useEffect(() => {
      getUserData();
    }, []);
  
    useEffect(() => {
      if (userId !== null) {
        fetchProjectCount();
        fetchProjectCountAll(); // Call the function to get the project count for all users
      }
    }, [userId]);


  return (
    <div className="h-screen bg-gray-50 overflow-x-hidden ">
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

        <div className="sm:ml-64">
        <div className="flex justify-center gap-12">
        <div className="flex p-4  justify-center py-24 ">

          <div className="flex flex-col justify-center align-center w-auto bg-white pb-8 w-[500px] rounded-xl shadow-md border-2 w-[500px]">
              <div className="flex justify-center text-[300px] linear-wipe">{projectCount}</div>
              <div className="flex justify-center text-[20px] italic pb-8">Total Projects Created By You</div>
              <div className="justify-center flex mb-8 p-4 mx-24 rounded-lg bg-primary-blue font-bold text-white">
                  <Link href={'/myTrackers'}> See My Tracker Details</Link>
              </div>
          </div>


        </div>
        <div className="flex p-4  justify-center py-24 w-[500px]">
                <div className="flex flex-col justify-center align-center w-auto bg-white pb-8  rounded-xl shadow-md border-2 w-[500px]">
                    <div className="flex justify-center text-[300px] linear-wipe">{projectCountAll}</div>
                    <div className="flex justify-center text-[20px] italic pb-8 px-24 text-center">Total Projects Created By All PathSync Users, Ever.  </div>
                    <div className="justify-center flex mb-8 p-4 mx-24 rounded-lg bg-white font-bold text-white">
                        <div className="text-white"> See Analytics for My Trackers</div>
                    </div>
                </div>
        </div>
        </div>
        </div>
    </div>

  )

}