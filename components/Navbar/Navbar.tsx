import React from 'react'
import Link from 'next/link'
import { useRouter } from "next/router";

export default function Navbar({ email }) {
  const router = useRouter();

  function handleSignOut() {
    // Clear the email from localStorage or perform any other necessary sign-out actions
    localStorage.removeItem("email");
    // Redirect the user to the login page
    router.push("/login");
  }

  if (email == null) {
    return (
      <div className='absolute left-0 right-0 bg-white'>
        <div className="flex justify-between items-center px-16 pt-4">
          <Link href="/" className="text-xl font-OP text-primary-blue font-bold">JDM M.S.</Link>

          <div className='flex justify-center w-full md:w-auto gap-6 text-primary-blue'>
            <div className='text-sm'>
              <Link href="/analytics">
                <button className='no-underline hover:underline'>Analytics</button>
              </Link>
            </div>

            <div className='text-sm hidden md:flex'>
              <button onClick={handleSignOut} className="no-underline hover:underline text-red-500 ">Sign Out</button>
            </div>

            <p className="text-sm hidden md:flex text-primary-blue "></p>
          </div>
        </div>
        <hr className="mt-4 border-[1px] border-opacity-60 border-primary-blue" />
      </div>
    );
  } 
  
  else {
    return (
      <div className='absolute left-0 right-0 bg-white'>
        <div className="flex justify-between items-center px-16 pt-4">
          <Link href="/" className="text-xl font-OP text-primary-blue font-bold">JDM M.S.</Link>

          <div className='flex justify-center w-full md:w-auto gap-6 text-primary-blue'>
            <div className='text-sm'>
              <Link href="/analytics">
                <button className='no-underline hover:underline'>Analytics</button>
              </Link>
            </div>

            <div className='text-sm hidden md:flex'>
              <button onClick={handleSignOut} className="no-underline hover:underline text-red-500 ">Sign Out</button>
            </div>

            <p className="text-sm hidden md:flex text-primary-blue ">Welcome, {email}</p>
          </div>
        </div>
        <hr className="mt-4 border-[1px] border-opacity-60 border-primary-blue" />
      </div>
    );
  }
}

