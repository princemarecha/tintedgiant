// pages/employee.js
"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Employee() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      // Generate the download link
      const link = document.createElement("a");
      link.href = "/api/customs/report"; // Direct link to the report generation API
      link.target = "_blank"; // Open the link in a new tab
      link.rel = "noopener noreferrer"; // Security for external links
      link.click();

      // Simulate download completion with a timeout
      // Replace this with actual logic if your backend can provide a callback or status
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Adjust the timeout as needed
    } catch (error) {
      console.error("Error downloading the file:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white h-screen">
          {isLoading && (
      <div className="absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-red-500"></div>
          <img src="/images/logo.png" alt="Loading Logo" className="rounded-full h-28 w-28" />
        </div>
      </div>
    )}
        <Layout>
        <div>
          <div className="">
          
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <Link href={"/customs/manage"} passHref>
                <div className="flex flex-col items-center justify-center h-40 md:h-56 sm:h-48 font-bold rounded bg-[#AC0000] dark:bg-gray-800">
                  <Image
                    src="/images/icons/customs.png" // Replace with your image path
                    alt="Dashboard Icon" // Alternative text for the image
                    width={80} // Default width
                    height={80} // Default height
                    className="mb-2 transition duration-75 group-hover:opacity-80 sm:w-16 sm:h-16" // Scales image on smaller screens
                  />
                  <p className="text-xs lg:text-xl ">
                    Manage Clearances
                  </p>
                </div>
                </Link>

                <Link href={"/customs/add"} passHref>
              <div className="flex flex-col items-center justify-center h-40 md:h-56 sm:h-48 font-bold rounded bg-[#AC0000] dark:bg-gray-800 opacity-80">
                <Image
                  src="/images/icons/add.png" // Replace with your image path
                  alt="Dashboard Icon" // Alternative text for the image
                  width={80} // Default width
                  height={80} // Default height
                  className="mb-2 transition duration-75 group-hover:opacity-80 sm:w-16 sm:h-16" // Scales image on smaller screens
                  
                />
                <p className="text-xs lg:text-xl ">
                  Add New Clearance
                </p>
              </div>
              </Link>

              
              <div
                onClick={handleDownload}
                className="flex flex-col items-center justify-center h-40 md:h-56 sm:h-48 font-bold rounded bg-[#AC0000] dark:bg-gray-800 opacity-75 cursor-pointer"
              >
                <Image
                  src="/images/icons/print.png"
                  alt="Dashboard Icon"
                  width={80}
                  height={80}
                  className="mb-2 transition duration-75 group-hover:opacity-80 sm:w-16 sm:h-16"
                />
                <p className="text-xs lg:text-xl">Generate Report</p>
              </div>



              </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
