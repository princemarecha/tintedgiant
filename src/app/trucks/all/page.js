"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ViewTrucks() {
  const [trucks, setTrucks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [make, setMake] = useState(""); // State for selected make
  const itemsPerPage = 4; // Items to show per page

  // Fetch truck data
  const fetchEmployees = async (page = 1, search = "", make = "") => {
    try {
      const response = await axios.get(`/api/trucks`, {
        params: {
          page,
          limit: itemsPerPage,
          search,
          make, // Pass the selected make to the backend side
        },
      });
      setTrucks(response.data.trucks);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching trucks:", error);
    }
  };

  useEffect(() => {
    fetchEmployees(currentPage, searchTerm, make);
    setIsLoading(false)
  }, [currentPage, searchTerm, make]); // Fetch data when search or make changes

  // Handle Search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to the first page for new search
  };

  // Handle make Change
  const handleMakeChange = (e) => {
    setMake(e.target.value);
    setCurrentPage(1); // Reset to the first page for new make selection
  };

  // Pagination Controls
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getLink = (id)=>{
    let link = `/trucks/${id}`
    return link
  }

  return (
    <div className="bg-white h-screen relative">
                {isLoading && (
      <div className="absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-yellow-300"></div>
          <img src="/images/logo.png" alt="Loading Logo" className="rounded-full h-22 w-28" />
        </div>
      </div>
    )}
      <Layout>
        <div>
        <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">Trucks</p>

        <p className="text-sm 2xl:text-lg text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
        <Link href="/" passHref><span>Home </span></Link> <span>&gt;</span>  <Link href="/trucks" passHref><span>Truck Management</span></Link> <span>&gt;</span>
        <Link href="/trucks/all" passHref><span>Trucks </span></Link></p>

          {/* Search and Filter Section */}
          <div className="grid grid-cols-12 mb-4">
            {/* Search Bar */}
            <div className="flex flex-col col-span-10 md:col-span-7 justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-l">
              <input
                type="text"
                placeholder="Search Trucks....."
                className="bg-[#AC0000] border-none placeholder-white text-white focus:outline-none focus:ring-0 text-xs md:text-md lg:text-lg"
                onKeyUp={handleSearch}
              />
            </div>
            <div className="col-span-2 md:col-span-1 flex items-center justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-r">
              <Image
                src="/images/icons/search.png"
                alt="Search Icon"
                width={30}
                height={30}
                className="transition duration-75 group-hover:opacity-80 w-4 lg:w-6 xl:w-8"
              />
            </div>
            <div className="hidden lg:block"></div>

            {/* make Dropdown */}
            <div className="flex flex-col col-span-12 md:col-span-4 lg:col-span-3 md:ml-2 lg:ml-0 justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-l ">
              <select
                id="dropdown"
                className="w-full h-full bg-[#AC0000] text-white placeholder-white border-none rounded-l focus:outline-none focus:ring-0 text-xs md:text-md lg:text-lg"
                onChange={handleMakeChange} // Update make on change
                value={make}
              >
                <option value=""  defaultValue>
                  Select Make...
                </option>
                <option value="Toyota">Toyota</option>
                <option value="Mitsubishi">Miysubishi</option>
                <option value="Nissan">Nissan</option>
                <option value="Mercedes">Mercedes</option>
                <option value="Honda">Honda</option>
              </select>
            </div>
          </div>

          {/* Trucks Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-16  md:p-2 text-xs lg:text-xs xl:text-md">
            {trucks.map((truck, index) => (
              <div id="emp" key={index}>
                <Link href= {getLink(truck.plate_id)} passHref>
                <div className="grid border border-gray-300 grid-cols-4 gap-1 flex flex-col items-center  md:h-full xl:h-full 2xl:h-96 rounded bg-white shadow-2xl">
                  <div className="col-span-2 flex items-center justify-center  2xl:p-8">
                    <Image
                      src="/images/truck.png" // Use truck image or default
                      alt={`${truck.name} Profile`}
                      width={320}
                      height={320}
                      className="mb-2 transition duration-75 group-hover:opacity-80 rounded 2xl:w-200 2xl:h-200  ml-1"
                    />
                  </div>
                  <div className=" col-span-2 text-gray-600 grid grid-cols-2 gap-y-1 pt-2">
                    <div className="col-span-2 font-black"> {truck.name}</div> 
                    <div className="font-bold" >Status</div> <div className="col-span-1"> {truck.status}</div> 
                    <div className="font-bold" >Location </div> <div className="col-span-1"> {truck.location}</div>
                    <div className="font-bold" >Travelling</div> <div className="col-span-1"> {truck.travelling}</div> 
                    <div className="font-bold" >Trailer </div> <div className="col-span-1"> {truck.trailer?"Yes":"No"}</div>
                    <div className="font-bold" >Colour</div> <div className="col-span-1"> {truck.colour}</div> 
                    <div className="font-bold" >Plate Id </div> <div className="col-span-1"> {truck.plate_id}</div>
                    <div className="font-bold" >Make</div> <div className="col-span-1"> {truck.make}</div>
        


                  </div>
                  <div className="col-span-4 bg-[#AC0000] grid grid-cols-3 p-4 rounded-b gap-x-3 sm:gap-x-1">
                        <div>
                            <p className="2xl:text-lg font-bold">From</p>
                            <p >Harare,Zimbabwe</p>
                        </div>
                        <div>
                            <p className="2xl:text-lg font-bold">To</p>
                            <p>Pretoria,South Africa</p>
                        </div>

                        <div>
                            <p className="2xl:text-lg font-bold">Driver</p>
                            <p className="bg-white text-center text-[#AC0000] p-1 rounded">Prince Marecha</p>
                        </div>
                  </div>
                </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Layout>

      {/* Pagination Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 flex justify-center sm:justify-end text-xs md:text-md">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-2 font-bold text-white rounded ${currentPage === 1 ? "bg-gray-400" : "bg-[#AC0000] hover:bg-[#D32F2F]"}`}
        >
          Previous
        </button>
        <span className="mx-4 text-lg font-semibold text-[#AC0000] text-xs md:text-md my-auto">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-2 font-bold text-white rounded ${currentPage === totalPages ? "bg-gray-400" : "bg-[#AC0000] hover:bg-[#D32F2F]"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
