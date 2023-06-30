import React, { useState } from 'react';
import { useRouter } from "next/router";
import ConfigDropdown from './configDropdown';
import ConfigDropDownContent from "./configDropContent";

interface MyComponentProps {
    name: string;
    content: any;
  }
  
  const MyComponent: React.FC<MyComponentProps> = ({ name, content }) => {
    return (
      <div>
        <h1>{name}</h1>
        {content}
      </div>
    );
  };

export default function ConfigWholeDropdown2() {

    return(
        <div>
            <div className="grid gap-4">
                <div className="text-gray-500 font-  w-screen text-md shadow-md">Engineering Timeline</div>
                <ConfigDropdown
                name="Power Amplifier"
                content={
                    "Power Config"
                }
                />


                <ConfigDropdown
                    name="Low Noise Amplifier"
                    content=
                    {<ConfigDropDownContent></ConfigDropDownContent>}
                />
                
                <ConfigDropdown
                    name="EMC"
                    content={
                    "EMC Config"
                    }
                />

                <ConfigDropdown
                    name="EC Box"
                    content={
                    <p>
                        EC Box config
                    </p>
                    }
                />

                <ConfigDropdown
                    name="Non EMC Combiner"
                    content={
                    "Non EMC Config"
                    }
                    />      
            </div>
        </div>
        )
}