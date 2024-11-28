"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Manage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [journeyType, setJourneyType] = useState("");
  const [cargoEnabled, setCargoEnabled] = useState(false);
  const [trucks, setTrucks] = useState();
  const [drivers, setDrivers] = useState();

  // Form state
  const [formData, setFormData] = useState({
    departure: "",
    arrival: "",
    driver: "",
    truck: "",
    from: "",
    to: "",
    distance: "",
    status: "",
    cargo: "",
  });

  const handleSearch = (e) => setSearchQuery(e.target.value);
  const handleTypeChange = (e) => setJourneyType(e.target.value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const response = await axios.post("/api/journey", formData);
      console.log("Journey saved:", response.data);

      // Clear form fields
      setFormData({
        departure: "",
        arrival: "",
        driver: "",
        truck: "",
        from: "",
        to: "",
        distance: "",
        status: "",
        cargo: "",
      });
      setCargoEnabled(false); // Reset cargo checkbox
      alert("Journey saved successfully!");
    } catch (error) {
      console.error("Error saving journey:", error);
      alert("Failed to save journey. Please try again.");
    }
  };

  return (
    <div className="bg-white h-screen relative">
      <Layout>
        <div>
          <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">
            Journeys Management
          </p>
          <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
            <span>Home </span> <span>&gt;</span>
            <Link href="/journeys" passHref>
              <span>Journeys and Tracking</span>
            </Link>{" "}
            <span>&gt;</span>
            <span> Edit Journey </span>
          </p>
        </div>

        <p className="text-2xl font-bold text-[#AC0000]">Edit Journey</p>
        <hr className="border border-[#AC0000] my-2" />

        {/* Journey Input Form */}
        <div className="mx-auto mt-4 text-black">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Row 1 */}
              <div>
                <label htmlFor="departure" className="block text-sm font-medium text-gray-700">
                  Departure Date
                </label>
                <input
                  type="date"
                  id="departure"
                  name="departure"
                  value={formData.departure}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000]"
                />
              </div>
              <div>
                <label htmlFor="arrival" className="block text-sm font-medium text-gray-700">
                  Arrival Date
                </label>
                <input
                  type="date"
                  id="arrival"
                  name="arrival"
                  value={formData.arrival}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000]"
                />
              </div>

              {/* Row 2 */}
              <div>
                <label htmlFor="driver" className="block text-sm font-medium text-gray-700">
                  Driver
                </label>
                <select
                  id="driver"
                  name="driver"
                  value={formData.driver}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000]"
                >
                  <option value="">Select Driver</option>
                  <option value={1}>Driver 1</option>
                  <option value={2}>Driver 2</option>
                  <option value={3}>Driver 3</option>
                </select>
              </div>
              <div>
                <label htmlFor="truck" className="block text-sm font-medium text-gray-700">
                  Truck
                </label>
                <select
                  id="truck"
                  name="truck"
                  value={formData.truck}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000]"
                >
                  <option value="">Select Truck</option>
                  <option value={1}>Truck 1</option>
                  <option value={2}>Truck 2</option>
                  <option value={3}>Truck 3</option>
                </select>
              </div>

              {/* Row 3 */}
              <div>
                <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                  From
                </label>
                <input
                  type="text"
                  id="from"
                  name="from"
                  value={formData.from}
                  onChange={handleChange}
                  placeholder="City/Town, Country"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000]"
                />
              </div>
              <div>
                <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                  To
                </label>
                <input
                  type="text"
                  id="to"
                  name="to"
                  value={formData.to}
                  onChange={handleChange}
                  placeholder="City/Town, Country"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000]"
                />
              </div>

              {/* Row 4 */}
              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
                  Distance (km)
                </label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  placeholder="Enter distance in km"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000]"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000]"
                >
                  <option value="">Select Status</option>
                  <option value="Departure">Departure</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Breakdown">Breakdown</option>
                  <option value="Arrived">Arrived</option>
                </select>
              </div>

              {/* Row 5 */}
              <div className="col-span-2">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    id="cargo"
                    name="enableCargo"
                    onChange={() => setCargoEnabled(!cargoEnabled)}
                    checked={cargoEnabled}
                    className="h-4 w-4 text-[#AC0000] focus:ring-[#AC0000] border-gray-300 rounded"
                  />
                  <label htmlFor="cargo" className="text-sm font-medium text-gray-700">
                    Cargo
                  </label>
                </div>

                {cargoEnabled && (
                  <div className="mt-4 w-2/5">
                    <input
                      type="text"
                      id="cargoDetails"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      placeholder="Enter cargo details"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000]"
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 px-4 py-2 bg-[#AC0000] text-white font-bold rounded shadow hover:bg-[#8A0000] focus:outline-none"
            >
              Save Journey
            </button>
          </form>
        </div>
      </Layout>
    </div>
  );
}
