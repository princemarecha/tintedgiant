"use client"

import Layout from '@/components/Layout'
import Image from 'next/image'
import React from 'react'

export default function ViewEmployees() {
  return (
    <div className="bg-white h-screen">
    <Layout>
      <div>
        <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">Employees</p>
        <div className="">

            <div className="grid grid-cols-12   mb-4">
              <div className='flex flex-col col-span-10 md:col-span-7 justify-center h-12  font-bold bg-[#AC0000] mb-4 rounded-l '>
                <input
                  type="text"
                  id="input"
                  
                  onChange={console.log("nice")}
                  placeholder="Search Employees....."
                  className='bg-[#AC0000] border-none placeholder-white text-white focus:outline-none focus:ring-0'
                />
              </div>
              <div className="col-span-2 md:col-span-1 flex items-center justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-r">
              <Image
                src="/images/icons/search.png" // Replace with your image path
                alt="Dashboard Icon" // Alternative text for the image
                width={30} // Default width
                height={30} // Default height
                className="transition duration-75 group-hover:opacity-80  sm:w-8 sm:h-8" // Scales image on smaller screens
              />
              </div>

              <div className='hidden md:block'></div>

              <div className="flex flex-col col-span-8 md:col-span-3 justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-l">
                <select
                  id="dropdown"
                  className="w-full h-full bg-[#AC0000] text-white placeholder-white border-none rounded-l focus:outline-none focus:ring-0  "
                >
                  <option value="" disabled selected className="text-white">
                    Select Role...
                  </option>
                  <option value="driver">Driver</option>
                  <option value="accountant">Accountant</option>
                  <option value="manager">Manager</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>


            </div>
        
            <div className="grid  grid-cols-2 md:grid-cols-3 gap-4 mb-2 md:mb-4 font-bold md:p-2">
              <div>
                  <div className="grid grid-cols-4 flex flex-col items-center  h-20 md:h-24 xl:h-32 2xl:h-40 rounded bg-white  shadow-2xl">
                    <div className='col-span-1 flex items-center justify-center font-bold '>
                      <Image
                        src="/images/employee.jpg" // Replace with your image path
                        alt="Dashboard Icon" // Alternative text for the image
                        width={100} // Default width
                        height={100} // Default height
                        className="mb-2 transition duration-75 group-hover:opacity-80 sm:w-16 sm:h-16 xl:w-20 xl:h-20 2xl:w-28 2xl:h-28 rounded rounded-full ml-1" // Scales image on smaller screens
                      />
                    </div>
                    <div className='col-span-3 text-[#5F5F5F]'>
                      <p className="text-xs xl:text-lg 2xl:text-xl ml-1">
                            Prince Marecha
                      </p>
                      <p className="text-xs xl:text-lg 2xl:text-xl mt-1 2xl:mt-3 ml-1">
                            (+263) 778 345 213
                      </p>
                      <div className='flex justify-between mt-1 2xl:mt-3 ml-1'>
                        <div className='flex'>
                          <Image
                            src="/images/icons/driver.png" // Replace with your image path
                            alt="Dashboard Icon" // Alternative text for the image
                            width={30} // Default width
                            height={30} // Default height
                            className=" transition duration-75 group-hover:opacity-80 my-auto w-4 h-4 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8" // Scales image on smaller screens
                          />
                          <span className="text-xs xl:text-lg 2xl:text-xl  my-auto ml-2">
                                Driver
                          </span>
                        </div>
                        <div >
                          <Image
                            src="/images/icons/eye.png" // Replace with your image path
                            alt="Dashboard Icon" // Alternative text for the image
                            width={30} // Default width
                            height={30} // Default height
                            className=" mr-4 transition duration-75 group-hover:opacity-80 w-4 h-4  xl:w-8 xl:h-8" // Scales image on smaller screens
                          />
                        </div>
                      </div>
                        
                    

                    </div>
                </div>
            
              </div>

            </div>
        </div>
      </div>
    </Layout>
  </div>
  )
}
