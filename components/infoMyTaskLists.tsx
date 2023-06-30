import React, { useState } from 'react';



export default function InfoMyTaskLists() {
  

  const wordMappings = {
    model: "Product Model:",
    purchaseOrder: "PO Code:",
    productName: "Product Name:",
    orderQuantity: "Order Qty:",
    orderDate: "Order Date:",
    startDate: "Start Date:",
    endDate: "End Date:",
  };


  return (
    <div>
      <div className="flex justify-center px-16 w-auto pt-4">
        <div className="grid grid-cols-4 w-screen rounded-lg overflow-hidden border shadow-md bg-white">
            <div className='flex space-x-4 py-4 px-4 font-bold'>
              Product Model:
            </div>

            <div className='flex space-x-4 py-4 px-4 font-bold'>
              PO Code:
            </div>

            <div className='flex space-x-4 py-4 px-4 font-bold'>
              Product Name:
            </div>

            <div className='flex space-x-4 py-4 px-4 font-bold'>
              Order Qty:
            </div>

            <div className='flex space-x-4 py-4 px-4 font-bold'>
              Start Date:   
            </div>

            <div className='flex space-x-4 py-4 px-4 font-bold'>
              End Date:
            </div>
          
        </div>         
      </div>

    <div>
      
      </div> 
    </div>
  );
}
