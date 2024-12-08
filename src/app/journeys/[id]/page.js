"use client";

import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

async function getID(params) {
  // Simulate fetching or processing to get the plate ID
  const id = (await params).id
  return id
}

export default function Journey({ params }) {
  const [journey, setJourney] = useState(null); // State to store journey data
  const [error, setError] = useState(null); // State to handle errors
  const [journeyID, setID] = useState(null);
  const [expenseData, setExpenseData] = useState({})

  const router = useRouter();

  // Function to fetch expense details
  const fetchExpense = async (expenseID) => {
    try {
      const response = await axios.get(`/api/expense/${expenseID}`);
      setExpenseData(response.data);
    } catch (err) {
      setError("Failed to fetch expense details");
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
          setError("Failed to fetch journey data");
        }
      }

      fetchAJourney();

    }
  }, [journeyID]);

  // Fetch expense data when journey data is loaded
  useEffect(() => {
    if (journey?.expenses) {
      fetchExpense(journey.expenses?.id);
    }
  }, [journey]);
  

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

  const handleDeleteJourney = async () => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this journey?");
      if (!confirmDelete) return;
  
      const payload = {
        trip:{route: "N/A", id: "N/A" }
      }

      await axios.delete(`/api/journey/${journeyID}`);
      alert("journey deleted successfully!");
      await axios.patch(`/api/expense/${expenseData._id}`, payload)
      
      // Optionally, redirect to another page or refresh the list
      router.push("/journeys/manage");
    } catch (error) {
      console.error("Error deleting journey:", error);
      alert("Failed to delete journey. Please try again.");
    }
  };

  
  

  return (
    <div className="bg-white h-screen relative">
      <Layout>
        <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">
          Journey Details
        </p>
        <p className="text-sm  text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
          <span className="hover:underline">Home </span> <span>&gt;</span>{" "}
          <Link href={"/journeys"} passHref><span className="hover:underline">Journey and Tracking</span></Link> <span>&gt;</span>
          <span>{journey?journey.from:""} - {journey?journey.to:""}</span>
        </p>

        <div className="flex justify-between">
          <p className="text-2xl font-bold text-[#AC0000]">Journey</p>
          <p className="text-xl font-bold text-gray-500">{formatDateTime(journey?journey.departure:"")}</p>
        </div>
        <hr className="border border-black my-2"/>

        {!journey ? (
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
              <span className="font-bold">Driver</span> <span className="bg-[#AC0000] py-1 px-2 w-1/2 text-white rounded text-center">{journey.driver.name}</span>
            </div>
            <div className="grid grid-cols-1">
              <span className="font-bold">Truck</span> <span className="bg-black py-1 px-2 w-1/2 text-white rounded text-center">{journey.truck.name}</span>
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
        {expenseData?.expenses ? <div>
          <p className="text-xl font-bold text-black">Expenses</p>
          <hr className="border border-black my-2"/>
        </div>:""}

        {expenseData?.expenses ? (
            <div className="p-4 text-black grid grid-cols-6 gap-y-6 mb-4 text-sm">
              {expenseData.expenses.map((expense) => (
                <div key={expense._id} className="grid grid-cols-1">
                  <span className="font-bold">{expense.name}</span> ${expense.amount} USD
                </div>
              ))}
            </div>
          ) : (
            <p>No Expense Attached</p>
          )}


        {expenseData?.total_amount ?<hr className="border border-black my-2"/>:""}
         {/* Totals Section */}
         {expenseData?.total_amount ? (
            <div className="mt-6 mb-4 text-[#4F4F4F] flex">
              <p className="font-bold text-sm mr-10">totals</p>
              <div className="flex">
                {expenseData.total_amount.map((total) => (
                  <div key={total._id} className="mr-4">
                    <span className="text-xs">{total.currency}</span>
                    <span className="font-black text-3xl"> {total.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>Loading totals...</p>
          )}

        {journey?.total_amount ?<hr className="border border-black my-2"/>:""}
        <div className="flex justify-between mt-6 text-sm">
        <p
          className="font-bold text-[#AC0000] text-sm mr-10 cursor-pointer hover:underline"
          onClick={handleDeleteJourney}
        >
          Delete Journey
        </p>

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

        <div className="flex justify-end mt-6 text-sm">
          <Link href={`/journeys/${journeyID}/edit`}>
        <button
                className="px-4 py-2 rounded text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-0  transition duration-150 "
              >
                <p className="flex justify-between"><span>Edit</span><span>
                <Image
                src="/images/icons/edit.png"
                alt="Search Icon"
                width={20}
                height={20}
                className="transition duration-75 group-hover:opacity-80 ml-2 sm:w-6 sm:h-6"
              />
                  </span>
                  </p>
          </button>
          </Link>
        </div>
      </Layout>
    </div>
  );
}
