import React from "react";
import NavbarSide from "../Navbar/NavbarSide"
import Link from "next/link"

//NOT IN USE RIGHT NOW
//SEARCH FUNCTION

export default function DisplayOldProjects(props: {trackerSearch: { PMSearch: string; POSearch: string }; productModel: string[]; purchaseOrder: string[];}) {

  return (
    <div className="">

        <div className="text-gray-400 italic pb-2 w-screen text-md"> Results </div>
          <div className="grid gap-2 shadow-sm ">
              <Link href={"/myTrackerSubpage"} className="flex justify-between items-center justify-start px-8 py-2 rounded border-[1px] bg-white ">
                  <p className="text-gray-400 dark:text-gray-500">Purchase Order: </p>
                  <p className="text-gray-400 dark:text-gray-500">Product Model: </p>
                  <p className="text-gray-400 dark:text-gray-500">Start Date: </p>
              </Link>
          </div>

    </div>
  )

}