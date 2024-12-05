"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import BarChart from "@/components/Bar";

export default function Dashboard() {


 

  return (
    <div className="bg-white h-screen relative">
      <Layout>
        <div>
          <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">Welcome to our Dashboard!</p>

          <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8"><span>Home </span> <span>&gt;</span> <span>Dashboard</span> </p>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 bg-[#5A4F05] h-96 rounded-lg">
              <p className="text-white text-end mx-6 mt-6 text-xl font-bold">Now Traveling</p>
              <div className="justify-end flex mx-6 mt-2">
              <p className="text-white text-end  text-xl font-bold">5<span className="text-sm"> Journeys</span></p>
              <div>
                <Image
                  src="/images/icons/share.png" // Replace with your image path
                  alt="Truck Icon"  // Alternative text for the image
                  width={20} // Set the width of the image
                  height={20} // Set the height of the image
                  className="transition duration-75 group-hover:opacity-80 ml-2" // Apply hover effect, for example, reduce opacity
                />
              </div>
              
              </div>

              {/* Active Journeys */}

              <div className="grid grid-cols-1 overflow-y-scroll h-72 scrollbar scrollbar-thumb-white scrollbar-track-[#5A4F05]">
                <div className="bg-white h-20 mx-6 mt-2 grid grid-cols-3">
                <div className="mx-2 mt-2">
                    <p className="text-[#AC0000]  text-xs font-black">From</p>
                    <p className="text-[#AC0000]  text-xs ">Harare</p>
                  </div>
                  <div className="mx-2 mt-2">
                    <p className="text-[#AC0000]  text-xs font-black">To</p>
                    <p className="text-[#AC0000]  text-xs ">Lusaka</p>
                  </div>
                  <div className="mx-2 mt-2">
                    <p className="text-[#AC0000]  text-xs font-bold">Driver</p>
                    <p className="text-white rounded-sm  text-xs bg-[#4D4D4D] text-center">P. Marecha</p>
                  </div>
                  <div className="mx-2 mt-2 col-span-2">
                    <p className="text-[#AC0000]  text-xs font-black">Departure</p>
                    <p className="rounded-sm  text-xs text-[#AC0000] ">30 October 2024</p>
                  </div>
                  <div className="mx-2 mt-2 col-span-1">
                    <p className="text-[#126928]  text-xl text-end font-black">$720</p>
                  </div>

                </div>
                <div className="bg-white h-20 mx-6 mt-2"></div>
                <div className="bg-white h-20 mx-6 mt-2"></div>
                <div className="bg-white h-20 mx-6 mt-2"></div>
                <div className="bg-white h-20 mx-6 mt-2"></div>
              </div>


            </div>
            <div className="col-span-8 shadow-lg p-4 rounded-lg">
              <div className="flex justify-between mx-4">
                  <p className="text-[#AC0000] mx-6 mt-4 text-xl font-black">Journeys</p>
                  <p className="text-[#AC0000] mx-6 mt-4 text-lg font-black">2024</p>
              </div>
          
            <hr className=""/>
            <div className="flex justify-center xl:h-76">
              <BarChart />
            </div>
                
            </div>
            <div className="col-span-8 bg-[#5A4F05]   grid grid-cols-8 rounded-lg">
            <div className="col-span-2 flex flex-col justify-between h-full">
                <div className="flex justify-between">
                  <p className="text-white mx-6 mt-4 text-md font-black">Expenses</p>
                  <div className="mt-6">
                      <Image
                        src="/images/icons/share.png" // Replace with your image path
                        alt="Truck Icon"  // Alternative text for the image
                        width={20} // Set the width of the image
                        height={20} // Set the height of the image
                        className="transition duration-75 group-hover:opacity-80 ml-2" // Apply hover effect, for example, reduce opacity
                      />
                  </div>
                
                </div>

                <div className="appendDown">
                  <div>
                    <p className="text-white mx-6 mt-4 text-xs font-semibold">Year</p>
                    <p className="text-white mx-6 text-md font-black">2024</p>
                  </div>

                  <div>
                    <p className="text-white mx-6 mt-4 text-xs font-semibold">Total Amount</p>
                    <p className="text-white mx-6 text-2xl font-black mb-2">$245<span className="text-xs">.00</span></p>
                  </div>
                </div>
              </div>
              <div className="col-span-6 grid grid-cols-3 gap-3 m-6 ">
                  <div className="bg-white h-20 rounded flex-col justify-between">
                    <div className="flex justify-between m-2">
                        <p className="text-[#126928] text-xs font-bold">Fuel</p>
                        <div>
                            <Image
                            src="/images/icons/down.png" // Replace with your image path
                            alt="Truck Icon"  // Alternative text for the image
                            width={20} // Set the width of the image
                            height={20} // Set the height of the image
                            className="transition duration-75 group-hover:opacity-80 ml-2" // Apply hover effect, for example, reduce opacity
                          />
                        </div>
                    </div>
                    <p className="text-[#126928] mx-2 text-xl font-black">$5664.00</p>
                  </div>
                  <div className="bg-white h-20 rounded flex-col justify-between">
                    <div className="flex justify-between m-2">
                        <p className="text-[#126928] text-xs font-bold">Gate Pass</p>
                        <div>
                            <Image
                            src="/images/icons/down.png" // Replace with your image path
                            alt="Truck Icon"  // Alternative text for the image
                            width={20} // Set the width of the image
                            height={20} // Set the height of the image
                            className="transition duration-75 group-hover:opacity-80 ml-2" // Apply hover effect, for example, reduce opacity
                          />
                        </div>
                    </div>
                    <p className="text-[#126928] mx-2 text-xl font-black">$5664.00</p>
                  </div>
                  <div className="bg-white h-20 rounded flex-col justify-between">
                    <div className="flex justify-between m-2">
                        <p className="text-[#AC0000] text-xs font-bold">EMA</p>
                        <div>
                            <Image
                            src="/images/icons/up.png" // Replace with your image path
                            alt="Truck Icon"  // Alternative text for the image
                            width={20} // Set the width of the image
                            height={20} // Set the height of the image
                            className="transition duration-75 group-hover:opacity-80 ml-2" // Apply hover effect, for example, reduce opacity
                          />
                        </div>
                    </div>
                    <p className="text-[#AC0000] mx-2 text-xl font-black">$5664.00</p>
                  </div>
                  <div className="bg-white h-20 rounded flex-col justify-between">
                    <div className="flex justify-between m-2">
                        <p className="text-[#126928] text-xs font-bold">Fuel</p>
                        <div>
                            <Image
                            src="/images/icons/down.png" // Replace with your image path
                            alt="Truck Icon"  // Alternative text for the image
                            width={20} // Set the width of the image
                            height={20} // Set the height of the image
                            className="transition duration-75 group-hover:opacity-80 ml-2" // Apply hover effect, for example, reduce opacity
                          />
                        </div>
                    </div>
                    <p className="text-[#126928] mx-2 text-xl font-black">$5664.00</p>
                  </div>
                  <div className="bg-white h-20 rounded flex-col justify-between">
                    <div className="flex justify-between m-2">
                        <p className="text-[#126928] text-xs font-bold">Fuel</p>
                        <div>
                            <Image
                            src="/images/icons/down.png" // Replace with your image path
                            alt="Truck Icon"  // Alternative text for the image
                            width={20} // Set the width of the image
                            height={20} // Set the height of the image
                            className="transition duration-75 group-hover:opacity-80 ml-2" // Apply hover effect, for example, reduce opacity
                          />
                        </div>
                    </div>
                    <p className="text-[#126928] mx-2 text-xl font-black">$5664.00</p>
                  </div>
                  <div className="bg-white h-20 rounded flex-col justify-between">
                    <div className="flex justify-between m-2">
                        <p className="text-[#126928] text-xs font-bold">Fuel</p>
                        <div>
                            <Image
                            src="/images/icons/down.png" // Replace with your image path
                            alt="Truck Icon"  // Alternative text for the image
                            width={20} // Set the width of the image
                            height={20} // Set the height of the image
                            className="transition duration-75 group-hover:opacity-80 ml-2" // Apply hover effect, for example, reduce opacity
                          />
                        </div>
                    </div>
                    <p className="text-[#126928] mx-2 text-xl font-black">$5664.00</p>
                  </div>
                  <div className="bg-white h-20 rounded flex-col justify-between">
                    <div className="flex justify-between m-2">
                        <p className="text-[#126928] text-xs font-bold">Fuel</p>
                        <div>
                            <Image
                            src="/images/icons/down.png" // Replace with your image path
                            alt="Truck Icon"  // Alternative text for the image
                            width={20} // Set the width of the image
                            height={20} // Set the height of the image
                            className="transition duration-75 group-hover:opacity-80 ml-2" // Apply hover effect, for example, reduce opacity
                          />
                        </div>
                    </div>
                    <p className="text-[#126928] mx-2 text-xl font-black">$5664.00</p>
                  </div>
                  <div className="bg-white h-20 rounded flex-col justify-between">
                    <div className="flex justify-between m-2">
                        <p className="text-[#126928] text-xs font-bold">Fuel</p>
                        <div>
                            <Image
                            src="/images/icons/down.png" // Replace with your image path
                            alt="Truck Icon"  // Alternative text for the image
                            width={20} // Set the width of the image
                            height={20} // Set the height of the image
                            className="transition duration-75 group-hover:opacity-80 ml-2" // Apply hover effect, for example, reduce opacity
                          />
                        </div>
                    </div>
                    <p className="text-[#126928] mx-2 text-xl font-black">$5664.00</p>
                  </div>
                  <div className="bg-white h-20 rounded flex-col justify-between">
                    <div className="flex justify-between m-2">
                        <p className="text-[#126928] text-xs font-bold">Fuel</p>
                        <div>
                            <Image
                            src="/images/icons/down.png" // Replace with your image path
                            alt="Truck Icon"  // Alternative text for the image
                            width={20} // Set the width of the image
                            height={20} // Set the height of the image
                            className="transition duration-75 group-hover:opacity-80 ml-2" // Apply hover effect, for example, reduce opacity
                          />
                        </div>
                    </div>
                    <p className="text-[#126928] mx-2 text-xl font-black">$5664.00</p>
                  </div>
              </div>

            </div>
            <div className="col-span-4 bg-[#AC0000] flex-col justify-between flex rounded-lg">
                <div>
                  <p className="text-white mx-6 mt-4 text-xl font-black">Summary</p>
                </div>
                <div className="appendDown">
                  <div>
                    <p className="text-white mx-6 mt-4 text-xl font-semibold">Top Cargo</p>
                    <p className="text-white mx-6 text-xs font-semibold">Petroleum</p>
                  </div>

                  <div>
                    <p className="text-white mx-6 mt-4 text-xl font-semibold">Top Destination</p>
                    <p className="text-white mx-6 text-xs font-semibold mb-2">Kampala, Uganda</p>
                  </div>
                </div>

                <div className="appendDown mb-6">
                  <div>
                    <p className="text-white mx-6 mt-4 text-lg font-semibold">Top Driver</p>
                 <div className="flex justify-between">
                  <p className="text-white mx-6 text-xs ">Prince Marecha</p>
                    <p className="text-white mx-6 text-xs ">57 Trips</p>
                    <p className="text-white mx-6 text-xs ">450 km travelled</p>
                 </div>
                    
                  </div>

                  <div>
                    <p className="text-white mx-6 mt-4 text-lg font-semibold">Top Truck</p>
                  <div className="flex justify-between">
                  <p className="text-white mx-6 text-xs ">Nissan Humper</p>
                    <p className="text-white mx-6 text-xs ">57 Trips</p>
                    <p className="text-white mx-6 text-xs ">450 km travelled</p>
                 </div>
                  </div>
                </div>
            </div>

          </div>

     
        </div>
      </Layout>

     
    </div>
  );
}
