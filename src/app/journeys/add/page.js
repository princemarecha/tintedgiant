"use client";

import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";



export default function Driver({params}) {

  const defaultForm = {
    departure: "",
    arrival: "",
    driver: "",
    truck: "",
    from: "",
    to: "",
    distance: "",
    status: "",
    cargo: "",
  }

  const [drivers, setDrivers] = useState([]); // Holds driver data
  const [trucks, setTrucks] = useState([]); // Holds driver data
  const [journeyID, setID] = useState(null);
  const [cargoEnabled, setCargoEnabled] = useState(null);
  const [formData, setFormData] = useState(defaultForm);


   // Unwrap params using React.use()
   useEffect(() => {
    async function fetchParams() {
      // Unwrap params promise and set the plateId
      const resolvedParams = await params;
      console.log(resolvedParams.id)
      setID(resolvedParams.id); // assuming the plate_id is in the params
    }

    fetchParams();
  }, [params]);
  


  useEffect(() => {
    const fetchTruckDrivers = async () => {
      try {
        const response = await axios.get("/api/employee/drivers");
        console.log("Fetched drivers:", response.data.employees);
        const responseTrucks = await axios.get("/api/trucks/list");
        console.log("Fetched trucks:", responseTrucks.data.trucks);
        setDrivers(response.data.employees || []);
        setTrucks(responseTrucks.data.trucks || []);
      } catch (error) {
        console.error("Error fetching drivers and trucks", error);
      }
    };

    fetchTruckDrivers(); // Fetch only on initial render
  }, []); // Empty dependency array ensures it runs once

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDriverChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: JSON.parse(value),
    }));
  };

  const handleTruckChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: JSON.parse(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Filter formData to only include non-empty fields and valid values
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => {
        // Exclude empty strings, null, undefined, empty arrays, or objects with no keys
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === "object" && Object.keys(value).length === 0) return false;

        return true; // Include the field if none of the above conditions are met
      })
    );

  
    try {
      const response = await axios.post(`/api/journey`, filteredData);
      console.log("Journey added:", response.data);
  
      // Reset form
      setFormData(defaultForm);
  
      alert("Journey adding successfully!");
    } catch (error) {
      console.error("Error adding journey:", error);
      alert("Failed to addd journey. Please try again.");
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
              <span>Journeys and Tracking </span>
            </Link>{" "}
            <span>&gt;</span>
            <Link href="/journeys/manage" passHref>
              <span>Manage Journeys </span>
            </Link>{" "}
            <span>&gt;</span>
            <span>New Journey </span>
          </p>
        </div>

        <p className="text-2xl font-bold text-[#AC0000]">New Journey</p>
        <hr className="border border-[#AC0000] my-2" />

   

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
                  value={formData.name}
                  onChange={handleDriverChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000]"
                >
                  <option value="">Select Driver</option>
                  {drivers.map((driver, index) => (
                    <option key={driver.id || index} value={JSON.stringify({ name: driver.name, id: driver._id })}>
                      {driver.name}
                    </option>
                  ))}
                </select>

              </div>

              <div>
                <label htmlFor="driver" className="block text-sm font-medium text-gray-700">
                  Truck
                </label>
                <select
                  id="truck"
                  name="truck"
                  value={formData.plate_id}
                  onChange={handleTruckChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000]"
                >
                  <option value="">Select Truck</option>
                  {trucks.map((truck, index) => (
                    <option key={truck.id || index} value={JSON.stringify({ name: truck.name, plate_id: truck.plate_id })}>
                      {truck.name}
                    </option>
                  ))}
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
  
                  <label htmlFor="cargo" className="text-sm font-medium text-gray-700">
                    Cargo
                  </label>
                </div>


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
