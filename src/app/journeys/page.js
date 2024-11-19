// pages/employee.js
"use client";

import Layout from "@/components/Layout";
import Image from "next/image";

export default function Employee() {
  return (
    <div className="bg-white h-screen">
    <Layout>
    <div>
      <div className="">
      
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">

          <div className="flex flex-col items-center justify-center h-40 md:h-56 sm:h-48 font-bold rounded bg-[#AC0000] dark:bg-gray-800">
            <Image
              src="/images/icons/journey.png" // Replace with your image path
              alt="Dashboard Icon" // Alternative text for the image
              width={80} // Default width
              height={80} // Default height
              className="mb-2 transition duration-75 group-hover:opacity-80 sm:w-16 sm:h-16" // Scales image on smaller screens
            />
            <p className="text-xs lg:text-xl ">
              Manage Journeys
            </p>
          </div>


          <div className="flex flex-col items-center justify-center h-40 md:h-56 sm:h-48 font-bold rounded bg-[#AC0000] dark:bg-gray-800 opacity-75">
            <Image
              src="/images/icons/add.png" // Replace with your image path
              alt="Dashboard Icon" // Alternative text for the image
              width={80} // Default width
              height={80} // Default height
              className="mb-2 transition duration-75 group-hover:opacity-80 sm:w-16 sm:h-16" // Scales image on smaller screens
              
            />
            <p className="text-xs lg:text-xl ">
              Add New Journey
            </p>
          </div>

          </div>
      </div>
    </div>
  </Layout>
</div>
  );
}
