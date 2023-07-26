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

export default function NavbarSideIndex(props: NavbarProps) {
  const router = useRouter();

  function handleSignOut() {
    localStorage.removeItem("email");
    // Redirect user to the login page
    router.push("/login");
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
      <div >
        <div className="flex justify-between items-center px-16 pt-4">
          <div className='flex justify-center items-center '>
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

      <div className='flex justify-end py-2 px-12'>
        <div className='flex gap-4'>
                    
            <div>
                <Link href="/analytics" className="flex items-center p-2 text-gray-500 rounded-lg hover:bg-gray-500 hover:text-white">
                <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                <span className="ml-3">Dashboard</span>
                </Link>
            </div>
            <div>
                <Link href="/myTrackers" className="flex items-center p-2 text-gray-500 rounded-lg hover:bg-gray-500 hover:text-white">
                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                <span className="ml-3">My Projects</span>
                </Link>
            </div>

            <div>
                <Link href="/config" className="flex items-center p-2 text-gray-500 rounded-lg hover:bg-gray-500 hover:text-white">
                <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clip-rule="evenodd"></path></svg>
                <span className="ml-3">Configurations</span>
                </Link>
            </div>
                

        </div>
    </div>

</div>
    );
  }
}

