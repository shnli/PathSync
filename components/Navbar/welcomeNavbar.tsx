import React from 'react'
import Link from 'next/link'
import { useRouter } from "next/router";
import PropTypes from "prop-types"; // Import PropTypes to specify prop types
// import { emailData } from '@/pages';
// import type { emailData } from '@/pages';

// export type emailData = {
//   email: string;
// };



export default function WelcomeNavbar() {
  
    return (
      <div className='absolute left-0 right-0 bg-white'>
        <div className="flex justify-between items-center px-16 pt-4">
        <div className='flex justify-center items-center'>
            <Link href="/"><img src="/logo.png" alt = "..." className='max-w-[45px]'></img></Link>
            <Link href="/" className="text-xl font-OP text-[#222b6e] font-bold linear-wipe">PathSync</Link>
          </div>
          <div className='flex justify-center w-full md:w-auto gap-6 text-[#222b6e]'>

            <Link href="/login">
              <div className='text-sm hidden md:flex border-[#222b6e] border-[1px] px-8 py-2 rounded-md bg-[#222b6e] hover:bg-white hover:text-[#222b6e] text-white'>
                  Log In
              </div>
            </Link>
            
            <Link href="/login">
              <div className='text-sm hidden md:flex border-[#222b6e] border-[1px] px-8 py-2 rounded-md hover:bg-[#222b6e] hover:text-white'>
                  Sign Up
              </div>
            </Link>

          </div>
        </div>
        <hr className="mt-4  border-opacity-60 border-[#222b6e]" />
      </div>
    );

}

