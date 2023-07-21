import NewChecklist from "./newChecklist";
import React, { useState } from 'react';
import { initialFormData } from "./PrimaryData";

export type engineerData = {
    SDRE: "",
    QO: "",
    MECH: ""
}

export default function InfoGrid(props:{ formData:initialFormData }) {
  
  const [showChecklist, setShowChecklist] = useState(false); 

  const handleNextClick = () => {
    if (engineerData.SDRE && engineerData.QO) {
      setShowChecklist(true);
    } else {
      alert('Please fill out both "Hardware Lead" and "Manufacturer Lead" fields.');
    }  
  };


  const wordMappings: { [key: string]: string } = {
    model: "Product Model Code:",
    purchaseOrder: "Purchase Order Code:",
    orderQuantity: "Order Qty:",
    orderDate: "Order Date:",
    startDate: "Start Date:",
  };

  
  const [engineerData, setEngineerData] = useState({ SDRE: '', QO: '' });

  const handleSDREChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEngineerData((prevData) => ({
      ...prevData,
      SDRE: e.target.value,
    }));
  };
  
  const handleQOChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEngineerData((prevData) => ({
      ...prevData,
      QO: e.target.value,
    }));
  };


  const [selectedTracker, setSelectedTracker] = useState('');

  const handleTrackerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTracker(e.target.value);
  };

  return (
    <div>
      <div className="flex justify-center px-16 w-screen pt-4">
        <div className="grid grid-cols-3 w-screen rounded-lg overflow-hidden border shadow-md bg-white">
          {Object.entries(props.formData).map(([field, value]) => (
            <div className="flex space-x-4 pt-2 px-4 " key={field}>
              <div className="font-bold">{wordMappings[field]}</div>
              <div className="">{value}</div>
            </div>
          ))}
          
        </div>         
      </div>

    <div>
      
      <div className="flex space-x-12 px-16">
        
        <div className="pt-4 w-[400px]">
          <label className="block mb-1 font-medium text-gray-500">
            Technician A
          </label>
          <input
            value={engineerData.SDRE}
            name="SDRE"
            id="SDRE"
            type="text"
            className="w-full px-8 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            onChange={handleSDREChange}
          />
        </div>

          <div className="pt-4 w-[400px]">
            <label className="block mb-1 font-medium text-gray-500">
              Technician B
            </label>
            <input
              value={engineerData.QO}
              name="QO"
              id="QO"
              type="text"
              className="w-full px-8 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              onChange={handleQOChange}
            />
          </div>

            <div className='pt-3'>
              <label htmlFor="purchase-order" className="block mb-1 font-medium text-gray-500">
                Select Tracker
              </label>
              <select
                  id="savedTracker"
                  onChange={handleTrackerChange}
                  className="w-full w-[200px] mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500">
                  <option value="text-xs text-gray-500">Create New</option>
              </select>
          </div>
          
          <div className="pt-3">
            <button className="rounded-lg mx-2 my-8 bg-gra border-2 hover:bg-gray-500">
              <div onClick={handleNextClick} className="px-4 py-2 text-sm text-gray-500 hover:text-white font-semibold">
                Generate Task List
              </div>
            </button>
          </div>

        </div>


        {showChecklist && (
          
          <NewChecklist
            formData = {props.formData}
            engineerData={engineerData}
            hardwareLeads={[engineerData.SDRE]} // Pass the value from the "Hardware Lead" input field
            manufacturerLeads={[engineerData.QO]} // Pass the value from the "Manufacturer Lead" input field
          />
        )}
    </div>
    </div>
  );
}
