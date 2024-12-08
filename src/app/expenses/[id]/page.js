"use client";

import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams,useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Expense() {
  const { id } = useParams();
  const router = useRouter();
  const [expense, setExpense] = useState(null);
  const [journeyDetails, setJourneyDetails] = useState(null);
  const [journeys, setJourneys] = useState([]);
  const [selectedJourney, setSelectedJourney] = useState("");
  const [error, setError] = useState(null);

  // Fetch expense data
  async function fetchExpenseData(expenseID) {
    try {
      const response = await axios.get(`/api/expense/${expenseID}`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching expense data: " + error.message);
    }
  }

  // Fetch journey details
  async function fetchJourneyDetails(tripID) {
    try {
      const response = await axios.get(`/api/journey/${tripID}`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching journey details: " + error.message);
    }
  }

  // Attach journey to expense
  const handlePatchRequest = async () => {
    if (!selectedJourney) {
      alert("Please select a journey first.");
      return;
    }

    try {
      const data = selectedJourney;
      const payload = {
        trip: {
          id: data.id, // MongoDB _id
          route: data.route, // Route description
        },
      };

      const payloadJourney = {
        expenses: {"id":id,"totals": expense?.total_amount}
      };

      const response = await axios.patch(`/api/expense/${id}`, payload);
      const journeyResponse = await axios.patch(`/api/journey//${data.id}`, payloadJourney);
      fetchExpense()
      console.log("Journey and Expense updated successfully:", response.data, journeyResponse.data);
    } catch (error) {
      console.error("Error attaching journey:", error);
      alert("Failed to attach journey. Please try again.");
    }
  };

  // Fetch all journeys for the dropdown
  async function fetchJourneys() {
    try {
      const response = await axios.get("/api/journey");
      setJourneys(response.data.journeys || []);
    } catch (error) {
      setError("Error fetching journey list: " + error.message);
    }
  }

  async function fetchExpense() {
    try {
      if (!id) return;

      // Fetch expense data
      const expenseData = await fetchExpenseData(id);
      setExpense(expenseData);

      // Check if trip ID exists and is valid
      if (expenseData.trip && expenseData.trip.id && expenseData.trip.id !== "N/A") {
        const journeyData = await fetchJourneyDetails(expenseData.trip.id);
        console.log(journeyData)
        setJourneyDetails(journeyData);
      }
  
    } catch (err) {
      setError(err.message);
    }
  }

  // Fetch expense and journey details
  useEffect(() => {


    fetchExpense();
    fetchJourneys();
  }, [id]);

  const handleJourneyChange = (event) => {
    const selectedOptionValue = event.target.value;

    try {
      const selectedJourney = JSON.parse(selectedOptionValue);
      setSelectedJourney(selectedJourney);
    } catch (error) {
      console.error("Failed to parse selected option value:", error);
    }
  };

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

  const deleteImage = (publicID)=>{


    axios
          .delete("/api/customs/upload", {
            data: {
              publicId: publicID, // Replace with your actual public ID
            },
          })
          .then((response) => {
            console.log("Response:", response.data);
      
          })
          .catch((error) => {
            console.error("Error:", error);
          });
  }

  const handleDeleteExpense = async () => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
      if (!confirmDelete) return;

      const payload = {
        expenses:"N/A"
      }
  
      await axios.delete(`/api/expense/${id}`);
      journeyDetails?await axios.patch(`/api/journey/${journeyDetails._id}`, payload):""

      if (expense.attachments && expense.attachments.length > 0) {
        expense.attachments.forEach((attachment) => {
          try {
            deleteImage(attachment.publicId);
          } catch (error) {
            console.error(`Failed to delete image with publicId ${attachment.publicId}`, error);
          }
        });
      }
      


      alert("Expense deleted successfully!");
      // Optionally, redirect to another page or refresh the list
      router.push("/expenses/manage");
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. Please try again.");
    }
  };
  

  return (
    <div className="bg-white h-screen relative">
      <Layout>
        <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">
          Expense Details
        </p>
        <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
          <span className="hover:underline">Home </span> <span>&gt;</span>{" "}
          <Link href={"/expenses"} passHref>
            <span className="hover:underline">Expense and Tracking</span>
          </Link>{" "}
          <span>&gt;</span>
          <span>{" " + id}</span>
        </p>

        <div className="flex justify-between">
          <p className="text-2xl font-bold text-[#AC0000]">Journey</p>
          <p className="text-xl font-bold text-gray-500">
            {formatDateTime(journeyDetails ? journeyDetails.departure : "")}
          </p>
        </div>
        <hr className="border border-black my-2" />

        {journeyDetails?<div className="p-4   text-black text-sm grid grid-cols-2 gap-y-6 mb-4">
    
              <div className="grid grid-cols-1">
                <span className="font-bold">From</span> {journeyDetails.from}
              </div>
              <div className="grid grid-cols-1">
                <span className="font-bold">To</span> {journeyDetails.to}
              </div>

              <div className="grid grid-cols-1">
                <span className="font-bold">Departure</span>{" "}
                {formatDateTime(journeyDetails.departure)}
              </div>
              <div className="grid grid-cols-1">
                <span className="font-bold">Arrival</span>{" "}
                {formatDateTime(journeyDetails.arrival)}
              </div>
              <div className="grid grid-cols-1">
                <span className="font-bold">Driver</span> <span className="bg-[#AC0000] py-1 px-2 w-1/2 text-white rounded text-center">{journeyDetails.driver?.name}</span>
              </div>
              <div className="grid grid-cols-1">
                <span className="font-bold">Truck</span> <span className="bg-black py-1 px-2 w-1/2 text-white rounded text-center">{journeyDetails.truck?.name}</span>
              </div>
              <div className="grid grid-cols-1">
                <span className="font-bold">Status</span> {journeyDetails.status}
              </div>
              <div className="grid grid-cols-1">
                <span className="font-bold">Distance</span> {journeyDetails.distance} km
              </div>
              <div className="grid grid-cols-1">
                <span className="font-bold">Cargo</span> {"Rice"}
              </div>

        </div>:""}

          {/* Add Journey */}
        <div className="grid grid-cols-1">
          <select
            id="journeyDropdown"
            className="w-full h-full bg-[#AC0000] text-white placeholder-white border-none rounded-l focus:outline-none focus:ring-0"
            onChange={handleJourneyChange}
            value={selectedJourney?.from}

          >
            <option className="text-xs" value="">
              Select a Journey
            </option>
            {journeys.map((journey) => (
              <option
                key={journey._id}
                value={JSON.stringify({
                  route: `${journey.from} - ${journey.to}`,
                  id: journey._id.toString(),
                })}
                className="text-xs"
              >
                {journey.from} - {journey.to} - [
                {formatDateTime(journey.departure)} -{" "}
                {formatDateTime(journey.arrival)}]
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <button
            onClick={handlePatchRequest}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Attach Journey
          </button>
        </div>

             {/* Expenses */}
       
        <p className="text-xl font-bold text-black  mb-4 mt-20">Expenses</p>
        <hr className="border border-black my-2"/>

        {expense?
        <div className="grid grid-cols-7  text-black mb-10 p-4   text-black  gap-y-6 mb-4 text-sm">
        {expense?.expenses?.map((expenseItem) => (
        
          <div key={expenseItem._id} className="grid grid-cols-1">
          <span className="font-bold">{expenseItem.name}</span> {expenseItem.currency == "USD"? expenseItem.currency +" $":expenseItem.currency}{expenseItem.amount}
          </div>
        
        ))}
        </div>
      
        :""}
        
        <hr className="border border-black my-2"/>
         {/* Totals Section */}
         <div className="mt-6 mb-4 text-[#4F4F4F] flex mb-10">
          <p className="font-bold text-sm mr-10">totals</p>
          
          {expense?.total_amount?.map((total) => (
          <p key={total._id} className="mr-4">
          <span className="text-xs">{total.currency}</span>
          <span className="font-black text-3xl"> {total.amount}</span>
            </p>
          ))}
        
        </div>
        <hr className="border border-black my-2"/>
        <div className="flex justify-between mt-6 text-sm">
        <p
            className="font-bold text-[#AC0000] text-sm mr-10 cursor-pointer hover:underline"
            onClick={handleDeleteExpense}
          >
            Delete Expense
          </p>

        <button
                onClick={() => alert("Button clicked!")}
                className="px-4 py-2 rounded text-white bg-[#AC0000] hover:bg-gray-600 focus:outline-none focus:ring-0  transition duration-150"
              >
                <p className="flex justify-between"><span>Print Expense</span><span>
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
        <div className="flex justify-end my-4 text-sm">
            <button
                className="px-4 py-2 rounded text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-0  transition duration-150 "
              >
                <p className="flex justify-between"   onClick={(event) => {
                      event.preventDefault(); // Prevent the default form or button behavior
                      router.push(`/expenses/${id}/edit`);
                    }}><span>Edit</span><span>
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
        </div>
          

        <div>
        <p className="font-black text-[#AC0000] text-md mr-10 mt-10">Attached Media</p>
        <div className="grid grid-cols-5 mt-4">
        
          {expense?.attachments.map((src, index) => (
                <div key={index} className="relative h-60 cursor-pointer group">
                  <Link href= {`${src.url}`} target="_blank" rel="noopener noreferrer">
                    <Image
                    src={src.url}
                    alt={`Truck Thumbnail ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover rounded-xl"
                    />
                    </Link>
                    
                </div>
                ))}

            
     
        </div>
        </div>
    
      </Layout>
    </div>
  );
}
