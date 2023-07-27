import React from 'react'
import Link from 'next/link'
import { useRouter } from "next/router";
import PropTypes from "prop-types"; // Import PropTypes to specify prop types
// import { emailData } from '@/pages';
// import type { emailData } from '@/pages';

// export type emailData = {
//   email: string;
// };

type NavbarProps = {
  userEmail: string; // Change the prop type to string
};

export default function Navbar(props: NavbarProps) {
  const router = useRouter();

  function handleSignOut() {
    localStorage.removeItem("email");
    // Redirect user to the login page
    router.push("/welcome");
  }

  if (!props.userEmail) {
    return (
      <div className='absolute left-0 right-0 bg-white'>
        <div className="flex justify-between items-center px-16 pt-4">
          <div className='flex justify-center items-center'>
            <Link href="/"><img src="/logo.png" alt = "..." className='max-w-[45px]'></img></Link>
            <Link href="/" className="text-xl font-OP text-primary-blue font-bold linear-wipe">PathSync</Link>
          </div>
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
        <div className='flex justify-center items-center'>
            <Link href="/"><img src="/logo.png" alt = "..." className='max-w-[45px]'></img></Link>
            <Link href="/" className="text-xl font-OP text-primary-blue font-bold linear-wipe">PathSync</Link>
          </div>
          <div className='flex justify-center w-full md:w-auto gap-6 text-primary-blue'>
            <div className='text-sm'>
              <Link href="/analytics">
                <button className='no-underline hover:underline'>Analytics</button>
              </Link>
            </div>

            <div className='text-sm hidden md:flex'>
              <button onClick={handleSignOut} className="no-underline hover:underline text-red-500 ">Sign Out</button>
            </div>

            <p className="text-sm hidden md:flex text-primary-blue ">Welcome, {props.userEmail}</p>
          </div>
        </div>
        <hr className="mt-4 border-[1px] border-opacity-60 border-primary-blue" />
      </div>
    );
  }
}

