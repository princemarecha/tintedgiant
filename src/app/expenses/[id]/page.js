"use client";

import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function Expense() {
  const { id } = useParams();
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
      // Parse the selectedJourney JSON string back to an object
      const data = selectedJourney;
      console.log("Parsed Selected Journey Data:", data);
  
      // Construct the payload with the proper structure
      const payload = {
        trip: {
          id: data.id, // MongoDB _id
          route: data.route, // Route description
        },
      };
  
      console.log("Payload:", payload);
  
      // Make the PATCH request
      const response = await axios.patch(`/api/expense/${id}`, payload);
      console.log("Journey updated successfully:", response.data);
  
      //alert("Journey attached successfully!" + JSON.stringify(payload));
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

  // Fetch expense and journey details
  useEffect(() => {
    async function fetchExpense() {
      try {
        if (!id) return;
        const expenseData = await fetchExpenseData(id);
        setExpense(expenseData);

        if (expenseData.trip && expenseData.trip.route !== "N/A") {
          const journeyData = await fetchJourneyDetails(expenseData.trip.id);
          setJourneyDetails(journeyData);
        }

        await fetchJourneys();
      } catch (err) {
        setError(err.message);
      }
    }

    fetchExpense();
  }, [id]);

  const handleJourneyChange = (event) => {
    const selectedOptionValue = event.target.value; // Raw JSON string
    console.log("Selected Option Value (JSON):", selectedOptionValue);
  
    try {
      const selectedJourney = JSON.parse(selectedOptionValue); // Parse JSON
      console.log("Parsed Journey Object:", selectedJourney);
  
      // Access the route and id
      console.log("Route:", selectedJourney.route);
      console.log("ID:", selectedJourney.id); // This will be the string version of `_id`
  
      setSelectedJourney(selectedJourney); // Store the parsed object in state
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
          <span>
            {expense ? expense.from : ""} - {expense ? expense.to : ""}
          </span>
        </p>

        <div className="flex justify-between">
          <p className="text-2xl font-bold text-[#AC0000]">Journey</p>
          <p className="text-xl font-bold text-gray-500">
            {formatDateTime(journeyDetails ? journeyDetails.departure : "")}
          </p>
        </div>
        <hr className="border border-black my-2" />

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1">
            <select
  id="journeyDropdown"
  className="w-full h-full bg-[#AC0000] text-white placeholder-white border-none rounded-l focus:outline-none focus:ring-0"
  onChange={handleJourneyChange}
  value={selectedJourney}
>
  <option className="text-xs" value="">
    Select a Journey
  </option>
  {journeys.map((journey) => (
    <option
      key={journey._id} // Ensure this matches the MongoDB field
      value={JSON.stringify({
        route: `${journey.from} - ${journey.to}`,
        id: journey._id.toString(), // Convert `_id` to a string
      })}
      className="text-xs"
    >
      {journey.from} - {journey.to} - [
      {formatDateTime(journey.departure)} - {formatDateTime(journey.arrival)}]
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
          </>
        )}
      </Layout>
    </div>
  );
}
