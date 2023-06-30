import React, { useState } from 'react';
import ConfigDropDownContent from './configDropContent';

export default function ConfigDropdown(props:{ name:string, content:string }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownId = `collapseWithScrollbar-${props.name.replace(/\s/g, '')}`;

  function toggleDropdown(event:any) {
    event.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  }

  return (
    <div>
      <div className='relative'>
        <a
          className="inline-block rounded bg-primary-blue px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          href="#"
          role="button"
          aria-expanded={isDropdownOpen ? "true" : "false"}
          aria-controls={dropdownId}
          onClick={toggleDropdown}
        >
          <div className='flex gap-4'>
            {props.name}

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </a>
        
      </div>


      {isDropdownOpen && (
        <div
          className="mt-4 "
          id={dropdownId}
          style={{ maxWidth: '500px' }}
        >
          {props.content}
        </div>
      )}
    </div>
  );
};
