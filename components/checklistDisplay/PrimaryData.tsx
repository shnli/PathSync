import React, { useState } from 'react';
import { useRouter } from "next/router";

export type initialFormData = {
    model: string,
    purchaseOrder: string,
    productName: string,
    orderQuantity: string,
    orderDate: string,
    startDate: string,
    endDate: string,

    orderType: string,
    productType: string,
    }


export default function PrimaryData() {
    
    const router = useRouter();
    
    const handleNextClick = (e:any) => {
        e.preventDefault();
        if (formData.model && formData.purchaseOrder) {
            router.push({
                pathname: "/displayNewProject", // The path to your GraphPage component
                query: formData, // Pass the form data as query parameters
            });
        }
        else {
            alert("Please make sure you filled in the Model Code and Purchase Order Code fields.");
        }
      };

    const [formData, setFormData] = useState({
        model: "",
        purchaseOrder: "",
        productName: "",
        orderQuantity: "",
        orderDate: "",
        startDate: "",
        endDate: "",

        orderType: "",
        productType: "",
    });

///////////////////////////////////////////
    const handleModelChange = (e:any) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
        ...prevFormData,
        model: value,
        }));
    };

    const handlePOChange = (e:any) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
        ...prevFormData,
        purchaseOrder: value,
        }));
    };

    const handleOQChange = (e:any) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
        ...prevFormData,
        orderQuantity: value,
        }));
    };

    const handleODChange = (e:any) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
        ...prevFormData,
        orderDate: value,
        }));
    };

    const handlePNChange = (e:any) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
        ...prevFormData,
        productName: value,
        }));
    };

    const handleSDChange = (e:any) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
        ...prevFormData,
        startDate: value,
        }));
    };

    const handleEDChange = (e:any) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
        ...prevFormData,
        endDate: value,
        }));
    };

    const [selectedProduct, setSelectedProduct] = useState('');

    const handleProductChange = (e:any) => {
      setSelectedProduct(e.target.value);
    };

    

    return (
        <div>
            <div className="container mx-auto max-w-xl py-4 text-gray-500">
                <form>
                <div className="mb-8">
                    <label className="block mb-1 font-medium">
                    Product Model Code
                    </label>
                    <input
                    value={formData.model}
                    name="model"
                    id="model"
                    type="text"
                    className="w-full px-8 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    onChange={handleModelChange}
                    />
                </div>

                <div className="mb-8">
                    <label className="block mb-1 font-medium">
                    Purchase Order Code
                    </label>
                    <input
                    value={formData.purchaseOrder}
                    name="purchaseOrder"
                    id="purchaseOrder"
                    type="text"
                    className="w-full px-8 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    onChange={handlePOChange}
                    />
                </div>

                <div className="mb-8">
                    <label className="block mb-1 font-medium">
                    Order Quantity
                    </label>
                    <input 
                    value={formData.orderQuantity} 
                    id="orderQuantity" 
                    type="number" 
                    className="w-full px-8 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                    onChange={handleOQChange}/>
                </div>

                <div className="mb-8">
                    <label className="block mb-1 font-medium">
                    Order Date
                    </label>
                    <input 
                    value={formData.orderDate} 
                    id="orderDate" 
                    type="date" 
                    className="w-full px-8 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                    onChange={handleODChange}/>
                </div>

                <div className="mb-8">
                    <label className="block mb-1 font-medium">Project Start Date</label>
                    <input 
                    value={formData.startDate} 
                    id="startDate" 
                    type="date" 
                    className="w-full px-8 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                    onChange={handleSDChange}/>
                </div>
                </form>

                <div className="flex justify-center">
                    <button onClick={handleNextClick} className="bg-primary-blue border-[1px] border-primary-blue text-white px-8 py-1 rounded-lg font-small shadow-md hover:shadow-none hover:border-none"> Next</button>
                </div>
            </div>
        </div>
    );
}

