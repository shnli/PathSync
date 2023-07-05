import React from "react";
import Navbar from "../components/Navbar/Navbar"
import InfoGrid from "../components/checklistDisplay/infoGrid";
import { initialFormData } from "@/components/checklistDisplay/PrimaryData";


interface DisplayNewProjectProps {
  query: { [key: string]: string | string[] };
}

export default function DisplayNewProject({ query }: DisplayNewProjectProps) {
    const {
    model,
    purchaseOrder,
    productName,
    orderQuantity,
    orderDate,
    startDate,
    endDate,
    orderType,
    productType,
  } = query;

//instand of initial form data
  const formData: initialFormData = {
    model: model as string,
    purchaseOrder: purchaseOrder as string,
    productName: productName as string,
    orderQuantity: orderQuantity as string,
    orderDate: orderDate as string,
    startDate: startDate as string,
    endDate: endDate as string,
    orderType: orderType as string,
    productType: productType as string,
  };
  // const formData: initialFormData = query;

  return (

  <div className="h-screen bg-gray-50 overflow-x-hidden">
       <Navbar userEmail=""></Navbar> 

       <div className="pt-16">
          <div className= "flex px-16 font-bold text-gray-500 pt-12 w-screen text-xl">
              <p>Project Information</p>
          </div>
          
          <InfoGrid formData={formData} />
        </div>

  </div>
  )
}

export async function getServerSideProps({
  query,
    }: {
      query: { [key: string]: string | string[] };
    }) {
  return {
    props: {
      query,
    },
  };
}
