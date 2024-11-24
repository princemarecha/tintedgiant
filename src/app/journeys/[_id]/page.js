"use client";

import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Journey({ params }) {
  const [journey, setJourney] = useState(null); // State to store journey data
  const [error, setError] = useState(null); // State to handle errors

  // Function to fetch the journey by ID
  const fetchJourney = async (id) => {
    try {
      const response = await axios.get(`/api/journeys/${id}`);
      setJourney(response.data);
    } catch (err) {
      setError("Failed to load journey details. Please try again.");
    }
  };

  // Fetch journey data when the component mounts
  useEffect(() => {
    const journeyId = params?.id || "defaultId"; // Replace with dynamic ID from the route or context
    fetchJourney(journeyId);
  }, [params]);

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

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : journey ? (
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-[#AC0000]">
              Journey ID: {journey.journey_id}
            </h2>
            <p>
              <span className="font-bold">From:</span> {journey.from}
            </p>
            <p>
              <span className="font-bold">To:</span> {journey.to}
            </p>
            <p>
              <span className="font-bold">Departure:</span>{" "}
              {formatDateTime(journey.departure)}
            </p>
            <p>
              <span className="font-bold">Arrival:</span>{" "}
              {formatDateTime(journey.arrival)}
            </p>
            <p>
              <span className="font-bold">Status:</span> {journey.status}
            </p>
            <p>
              <span className="font-bold">Distance:</span> {journey.distance} km
            </p>
            <p>
              <span className="font-bold">Driver ID:</span> {journey.driver}
            </p>
            <p>
              <span className="font-bold">Truck ID:</span> {journey.truck}
            </p>
          </div>
        ) : (
          <p>Loading journey details...</p>
        )}
      </Layout>
    </div>
  );
}
