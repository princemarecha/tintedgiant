// pages/employee.js
"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";


export default function Expenses() {

  const [occupation, setOccupation] = useState("");

  useEffect(() => {
    const fetchOccupation = async () => {
     
      const storedOccupation = localStorage.getItem("occupation") || "Guest";
      setOccupation(storedOccupation);
    };
    fetchOccupation();
  }, []); 
  

  return (
    <div className="bg-white h-screen">
        <Layout>
        <div>
          <div className="">
          
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {occupation != "Driver"?<Link href="/expenses/manage" passHref>
                <div className="flex flex-col items-center justify-center h-40 md:h-56 sm:h-48 font-bold rounded bg-[#AC0000] dark:bg-gray-800">
                  <Image
                    src="/images/icons/expenses.png" // Replace with your image path
                    alt="Dashboard Icon" // Alternative text for the image
                    width={80} // Default width
                    height={80} // Default height
                    className="mb-2 transition duration-75 group-hover:opacity-80 sm:w-16 sm:h-16" // Scales image on smaller screens
                  />
                  <p className="text-xs lg:text-xl ">
                    Manage Expenses
                  </p>
                </div>
              </Link>:""}

              {occupation != "Accounting"?<Link href="/expenses/log" passHref>
                <div className="flex flex-col items-center justify-center h-40 md:h-56 sm:h-48 font-bold rounded bg-[#AC0000] dark:bg-gray-800 opacity-75">
                  <Image
                    src="/images/icons/add.png" // Replace with your image path
                    alt="Dashboard Icon" // Alternative text for the image
                    width={80} // Default width
                    height={80} // Default height
                    className="mb-2 transition duration-75 group-hover:opacity-80 sm:w-16 sm:h-16" // Scales image on smaller screens
                    
                  />
                  <p className="text-xs lg:text-xl ">
                    Log Expense
                  </p>
                </div>
              </Link>:""}
              <div>

               {occupation != "Driver"?<Link href="/expenses/add" passHref>
                 <div className="flex flex-col items-center justify-center h-40 md:h-56 sm:h-48 font-bold rounded bg-[#AC0000] dark:bg-gray-800 opacity-75">
                <Image
                  src="/images/icons/add.png" // Replace with your image path
                  alt="Dashboard Icon" // Alternative text for the image
                  width={80} // Default width
                  height={80} // Default height
                  className="mb-2 transition duration-75 group-hover:opacity-80 sm:w-16 sm:h-16" // Scales image on smaller screens
                  
                />
                <p className="text-xs lg:text-xl ">
                  Add New Expense
                </p>
              </div>
              </Link>:""}
              </div>
             

              </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
