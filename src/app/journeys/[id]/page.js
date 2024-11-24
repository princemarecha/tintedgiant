"use client";

import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

async function getID(params) {
  // Simulate fetching or processing to get the plate ID
  const id = (await params).id
  return id
}

export default function Journey({ params }) {
  const [journey, setJourney] = useState(null); // State to store journey data
  const [error, setError] = useState(null); // State to handle errors
  const [journeyID, setID] = useState(null);

  // Function to fetch the journey by ID
  const fetchJourney = async (id) => {
    try {
      const response = await axios.get(`/api/journey/${id}`);
      setJourney(response.data);
    } catch (err) {
      setError("Failed to load journey details. Please try again.");
    }
  };

  async function fetchAJourneyData(journeyID) {
    // Fetch truck data from the endpoint
  
    const response = await fetch(`/api/journey/${journeyID}`);
    if (!response.ok) {
      throw new Error("Failed to fetch truck data"+journeyID);
    }
    return response.json();
  }
  
  // Fetch journey data when the component mounts
  useEffect(() => {
    async function fetchID() {
      try {
        const id = await getID(params);
        setID(id);
      } catch (err) {
        setError("Failed to fetch  ID");
      }
    }

    fetchID();
  }, [params]);

  useEffect(() => {
    // Fetch truck data when plateID is available
    if (journeyID) {
      async function fetchAJourney() {
        try {
          const data = await fetchAJourneyData(journeyID);
          setJourney(data);
          console.log("done")
        } catch (err) {
          setError("Failed to fetch truck data");
        }
      }

      fetchAJourney();
    }
  }, [journeyID]);

  // Utility function to format date and time
  const formatDateTime = (dateTimeString) => {
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
  };

  return (
    <div className="bg-white h-screen relative">
      <Layout>
        <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">
          Journey Details
        </p>
        <p className="text-sm 2xl:text-lg text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
          <span>Home </span> <span>&gt;</span>{" "}
          <span>Journey and Tracking</span> <span>&gt;</span>{" "}
          <span>Journey</span>
        </p>

        <p className="text-2xl font-bold text-[#AC0000]">Journey</p>
        <hr className="border border-black my-2"/>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : journey ? (
          <div className="p-4   text-black text-sm grid grid-cols-2 gap-y-6 mb-4">
    
            <div className="grid grid-cols-1">
              <span className="font-bold">From</span> {journey.from}
            </div>
            <div className="grid grid-cols-1">
              <span className="font-bold">To</span> {journey.to}
            </div>

            <div className="grid grid-cols-1">
              <span className="font-bold">Departure</span>{" "}
              {formatDateTime(journey.departure)}
            </div>
            <div className="grid grid-cols-1">
              <span className="font-bold">Arrival</span>{" "}
              {formatDateTime(journey.arrival)}
            </div>
            <div className="grid grid-cols-1">
              <span className="font-bold">Driver</span> <span className="bg-[#AC0000] py-1 px-2 w-1/2 text-white rounded text-center">{journey.driver}</span>
            </div>
            <div className="grid grid-cols-1">
              <span className="font-bold">Truck</span> <span className="bg-black py-1 px-2 w-1/2 text-white rounded text-center">{journey.truck}</span>
            </div>
            <div className="grid grid-cols-1">
              <span className="font-bold">Status</span> {journey.status}
            </div>
            <div className="grid grid-cols-1">
              <span className="font-bold">Distance</span> {journey.distance} km
            </div>
            <div className="grid grid-cols-1">
              <span className="font-bold">Cargo</span> {"Rice"}
            </div>

          </div>
        ) : (
          <p>Loading journey details...</p>
        )}

        {/* Expenses */}
        <p className="text-xl font-bold text-black">Expenses</p>
        <hr className="border border-black my-2"/>

        <div className="p-4   text-black grid grid-cols-2 gap-y-6 mb-4 text-sm">
        <div className="grid grid-cols-1">
              <span className="font-bold">Fuel</span> $245.50 USD
            </div>
        </div>

        <hr className="border border-black my-2"/>
         {/* Totals Section */}
         <div className="mt-6 mb-4 text-[#4F4F4F] flex">
          <p className="font-bold text-sm mr-10">totals</p>
          
            <p  className="mr-4">
              <span className="text-xs">USD</span> 
              <span className="font-black text-3xl">567.50</span>
            </p>
        
        </div>
        <hr className="border border-black my-2"/>
        <div className="flex justify-between mt-6 text-sm">
        <p className="font-bold text-[#AC0000] text-sm mr-10">Delete Journey</p>
        <button
                onClick={() => alert("Button clicked!")}
                className="px-4 py-2 rounded text-white bg-[#AC0000] hover:bg-gray-600 focus:outline-none focus:ring-0  transition duration-150"
              >
                <p className="flex justify-between"><span>Print Journey</span><span>
                <Image
                src="/images/icons/print.png"
                alt="Search Icon"
                width={20}
                height={20}
                className="transition duration-75 group-hover:opacity-80 ml-2 sm:w-6 sm:h-6"
              />
                  </span>
                  </p>
          </button>
        </div>
      </Layout>
    </div>
  );
}
