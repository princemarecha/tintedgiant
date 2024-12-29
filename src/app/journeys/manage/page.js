"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";


export default function Manage() {
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [expenseType, setExpenseType] = useState(""); // State for journey type dropdown
  const [journeys, setJourneys] = useState([]); // State for fetched journeys
  const [loading, setLoading] = useState(true); // State to track loading
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Total pages returned from the server

  // Fetch journeys from the API
  useEffect(() => {
    const fetchJourneys = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/journey?page=${currentPage}`);
        const { journeys, pagination } = response.data;

        // Update state with data from the API
        setJourneys(journeys || []);
        setTotalPages(pagination?.totalPages || 1);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching journeys:", error);
        setLoading(false);
      }
    };

    fetchJourneys();
    setIsLoading(false);
  }, [currentPage]); // Re-fetch data when the current page changes

  // Handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle journey type dropdown change
  const handleTypeChange = (e) => {
    setExpenseType(e.target.value);
  };

  // Handle pagination controls
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Function to dynamically get the link for a journey
  const getLink = (journey_id) => `/journeys/${journey_id}`;

  // Format datetime
  function formatDateTime(dateTimeString) {
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", options).replace(",", "");
  }

  function goTo(type, id, e) {
    e.preventDefault(); // Prevent default behavior
    if (type === "truck") {
      router.push(`/trucks/${id}`);
    } else {
      router.push(`/employees/${id}`);
    }
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
        {/* Page Header */}
        <div>
          <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">
            Journeys Management
          </p>
          <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
            <span>Home </span> <span>&gt;</span>
            <Link href="/journeys" passHref>
              <span>Journey Management</span>
            </Link>{" "}
            <span>&gt;</span>
            <span> Manage Journeys </span>
          </p>
        </div>

             {/* Search and Filter Section */}
             <div className="grid grid-cols-12 mb-4">
          {/* Search Bar */}
          <div className="flex flex-col col-span-10 md:col-span-7 justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-l">
            <input
              type="text"
              placeholder="Search Journeys..."
              className="bg-[#AC0000] border-none placeholder-white text-white focus:outline-none focus:ring-0 text-xs md:text-md lg:text-lg"
              value={searchQuery}
              onChange={handleSearch}
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

          {/* Journey Type Dropdown */}
          <div className="flex flex-col col-span-12 md:col-span-4 lg:col-span-3 md:ml-2 lg:ml-0 justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-l ">
            <select
              id="dropdown"
              className="w-full h-full bg-[#AC0000] text-white placeholder-white border-none rounded-l focus:outline-none focus:ring-0 text-xs md:text-md lg:text-lg"
              onChange={handleTypeChange}
              value={expenseType}
            >
              <option value="" defaultValue>
                Journey Type
              </option>
              <option value="Regular">Regular</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>


      {/* Journeys Section */}
      {loading ? (
          <p className="text-center text-gray-500">Loading journeys...</p>
        ) : journeys.length === 0 ? (
          <p className="text-center text-gray-500">No journeys found.</p>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 xl:gap-4 mb-16  md:p-2">
            {journeys.map((journey, index) => (
              <div id="emp" key={index}>
                <Link href= {getLink(journey._id)} passHref>
                <div className="grid grid-cols-4 flex flex-col items-center p-4 xl:p-10  2xl:h-96 rounded bg-white shadow-2xl text-xs lg:text-sm border border-gray-200">
                <div className="col-span-full text-[#AC0000] font-bold text-sm lg:text-xl mb-4">
                {journey.from} - {journey.to}
                </div>
                  <div className=" col-span-4 text-gray-600 grid grid-cols-2 gap-y-3 text-xs lg:text-sm">
                    <div className="grid grid-cols-1 ">
                        <div className="font-bold" >Departure Date</div> <div > {formatDateTime(journey.departure)}</div>
                    </div>
                    <div className="grid grid-cols-1">
                        <div className="font-bold" >Arrival Date</div> <div > {formatDateTime(journey.arrival)}</div>
                    </div>
                    <div className="grid grid-cols-1">
                        <div className="font-bold" >Cargo</div> <div > {journey.cargo?journey.cargo:"No Cargo"}</div>
                    </div>
                    
                    <div className="grid grid-cols-1 text-[#AC0000] font-bold">
                        <div className="font-bold" >Distance</div> <div > {journey.distance} km</div>
                    </div> 

                    <div className="grid grid-cols-1">
                        <div className="font-bold" >Delivered</div> <div > {journey?.status == "Arrived"? "Yes": "No"}</div>
                    </div>
                    
        


                  </div>
                  <div className="col-span-4 bg-[#AC0000] grid grid-cols-10 p-4 rounded-b mt-4 text-md ">
                        <div className="col-span-10 2xl:col-span-2">
                            <p className="2xl:text-lg font-bold">Status</p>
                            <p className="bg-[#126928] border border-[#126928] text-center text-white p-1 m-1 2xl:w-3/4 rounded">{journey.status}</p>
                        </div>
                        <div  className="col-span-5 2xl:col-span-4">
                            <p className="2xl:text-lg font-bold">Truck</p>
                            <p onClick={(e) => goTo("truck", journey.truck ? journey.truck.plate_id : "", e)} className="border border-white text-center text-white p-1 m-1 rounded 2xl:w-3/4">{journey.truck?journey.truck.name:""}</p>
                        </div>

                        <div className="col-span-5 2xl:col-span-4">
                            <p className="2xl:text-lg font-bold">Driver</p>
                            <p onClick={(e) => goTo("driver", journey.driver ? journey.driver.id : "", e)} className="border border-white text-center text-white p-1 m-1 rounded 2xl:w-3/4">{journey.driver?journey.driver.name:""}</p>
                        </div>
                  </div>
                </div>
                </Link>
              </div>
            ))}
          </div>

          

          
        )}


        {/* Pagination Controls */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 flex justify-center sm:justify-end text-xs lg:text-md xl:text-lg">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-2 font-bold text-white rounded ${
              currentPage === 1 ? "bg-gray-400" : "bg-[#AC0000] hover:bg-[#D32F2F]"
            }`}
          >
            Previous
          </button>
          <span className="mx-4 xl:text-lg font-semibold text-[#AC0000] text-xs my-auto">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 mx-2 font-bold text-white rounded ${
              currentPage === totalPages ? "bg-gray-400" : "bg-[#AC0000] hover:bg-[#D32F2F]"
            }`}
          >
            Next
          </button>
        </div>
      </Layout>
    </div>
  );
}
