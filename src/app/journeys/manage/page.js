"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function Manage() {
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [expenseType, setExpenseType] = useState(""); // State for journey type dropdown
  const [journeys, setJourneys] = useState([]); // State for fetched journeys
  const [loading, setLoading] = useState(true); // State to track loading

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

  return (
    <div className="bg-white h-screen relative">
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
              className="bg-[#AC0000] border-none placeholder-white text-white focus:outline-none focus:ring-0"
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
              className="transition duration-75 group-hover:opacity-80 sm:w-8 sm:h-8"
            />
          </div>

          <div></div>

          {/* Journey Type Dropdown */}
          <div className="flex flex-col col-span-8 md:col-span-3 justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-l">
            <select
              id="dropdown"
              className="w-full h-full bg-[#AC0000] text-white placeholder-white border-none rounded-l focus:outline-none focus:ring-0"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16  md:p-2">
            {journeys.map((journey, index) => (
              <div id="emp" key={index}>
                <Link href= {getLink(journey._id)} passHref>
                <div className="grid grid-cols-4 flex flex-col items-center p-10 h-20 md:h-24 xl:h-32 2xl:h-96 rounded bg-white shadow-2xl">
                <div className="col-span-full text-[#AC0000] font-bold text-xl mb-4">
                {journey.from} - {journey.to}
                </div>
                  <div className=" col-span-4 text-gray-600 grid grid-cols-2 gap-y-3 text-sm">
                    <div className="grid grid-cols-1 ">
                        <div className="font-bold" >Departure Date</div> <div > {formatDateTime(journey.departure)}</div>
                    </div>
                    <div className="grid grid-cols-1">
                        <div className="font-bold" >Arrival Date</div> <div > {formatDateTime(journey.arrival)}</div>
                    </div>
                    <div className="grid grid-cols-1">
                        <div className="font-bold" >Cargo</div> <div > {journey.cargo?"Wheat":"No Cargo"}</div>
                    </div>
                    
                    <div className="grid grid-cols-1 text-[#AC0000] font-bold">
                        <div className="font-bold" >Total Cost</div> <div > {journey.cargo?"$400.00 USD":"$560.00 USD"}</div>
                    </div> 

                    <div className="grid grid-cols-1">
                        <div className="font-bold" >Delivered</div> <div > {formatDateTime(journey.delivered)}</div>
                    </div>
                    
        


                  </div>
                  <div className="col-span-4 bg-[#AC0000] grid grid-cols-5 p-4 rounded-b mt-4 text-md">
                        <div>
                            <p className="2xl:text-lg font-bold">Status</p>
                            <p className="bg-[#126928] border border-[#126928] text-center text-white p-1 m-1 w-3/4 rounded">{journey.status}</p>
                        </div>
                        <div  className="col-span-2">
                            <p className="2xl:text-lg font-bold">Truck</p>
                            <p className="border border-white text-center text-white p-1 m-1 rounded w-3/4">Toyota Streamliner</p>
                        </div>

                        <div className="col-span-2">
                            <p className="2xl:text-lg font-bold">Driver</p>
                            <p className="bg-white border border-white text-center text-[#AC0000] p-1 m-1 rounded w-3/4">Prince Marecha</p>
                        </div>
                  </div>
                </div>
                </Link>
              </div>
            ))}
          </div>

          

          
        )}


        {/* Pagination Controls */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 flex justify-center sm:justify-end">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-2 font-bold text-white rounded ${
              currentPage === 1 ? "bg-gray-400" : "bg-[#AC0000] hover:bg-[#D32F2F]"
            }`}
          >
            Previous
          </button>
          <span className="mx-4 text-lg font-semibold text-[#AC0000]">
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
