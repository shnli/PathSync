import React from "react";
import Navbar from "../components/Navbar/Navbar"
import InfoGrid from "../components/checklistDisplay/infoGrid";

export default function displayNewProject({ query }) {
  const formData = query; // Retrieve the form data from the query parameters
  // const email = localStorage.getItem("email");

  return (

  <div className="h-screen bg-gray-50 overflow-x-hidden">
       <Navbar ></Navbar> 

       <div className="pt-16">
          <div className= "flex px-16 font-bold text-gray-500 pt-12 w-screen text-xl">
              <p>Project Information</p>
          </div>
          
          <InfoGrid formData={formData} />
        </div>


  </div>
  )
}

export async function getServerSideProps({ query }) {
  return {
    props: {
      query,
    },
  };
}
