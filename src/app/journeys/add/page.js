"use client";

import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Journeys from "../page";



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
  const [truckID, setTruckID] = useState(null);
  const [driverID, setDriverID] = useState(null);
  const [cargoEnabled, setCargoEnabled] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [isLoading, setIsLoading] = useState(true);


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
        // Initialize IDs safely
        setDriverID(response.data?.employees?.length ? response.data.employees[0]._id : null);
        setTruckID(responseTrucks.data?.trucks?.length ? responseTrucks.data.trucks[0].plate_id : null);


        setFormData(prev => ({
          ...prev,
          driver: response.data?.employees?.length > 0 ? {"name":response.data.employees[0].name, "id":response.data.employees[0]._id} : "",
          truck: responseTrucks.data?.trucks?.length > 0 ? responseTrucks.data.trucks[0] : "",
        }));
      } catch (error) {
        console.error("Error fetching drivers and trucks", error);
      }
    };

    fetchTruckDrivers(); // Fetch only on initial render
    setIsLoading(false)
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
    if (value!="")
      {setFormData((prev) => ({
        ...prev,
        [name]: JSON.parse(value),
      }));}
  else{return}
  };

  const handleTruckChange = (e) => {
    const { name, value } = e.target;
    if (value!="")
      {setFormData((prev) => ({
        ...prev,
        [name]: JSON.parse(value),
      }));}
  else{return}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Filter formData to only include non-empty fields and valid values
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === "object" && Object.keys(value).length === 0) return false;
  
        return true; // Include the field if none of the above conditions are met
      })
    );
  
    // Safeguards for truckID and journeyID
    if (!truckID) {
      console.error("Truck ID is missing!");
      alert("Please select a valid truck before submitting.");
      return;
    }

  

  
    try {
      // Log data being sent
      console.log("Filtered data:", filteredData);
  
      const response = await axios.post(`/api/journey`, filteredData);

      const payload = {
        current_journey: (response.data?.newJourney?._id),
      };

      const responseTruck = await axios.patch(`/api/trucks/${truckID}`, payload);
      const responseDriver = await axios.patch(`/api/employee/${driverID}`, payload);
  
      console.log("Journey added:", response.data);
      console.log("Truck updated:", responseTruck.data);
      console.log("Truck updated:", responseDriver.data);
  
      // Reset form
      setFormData(defaultForm);
      setIsLoading(false)
  
      alert("Journey added successfully!");
    } catch (error) {
      setIsLoading(false)
      console.error("Error adding journey:", error);
      alert("Failed to add journey. Please try again.");
    }
  };
  

  function getTruck(thisTruck) {
    let truck  = JSON.parse(thisTruck)
    setTruckID(truck.plate_id); // Update state with the selected truck ID
    console.log("Selected truck ID:", truck.plate_id);
  }
  
  function getDriver(thisDriver) {
    let driver  = JSON.parse(thisDriver)
    setDriverID(driver.id); // Update state with the selected driver ID
    console.log("Selected driver ID:", driver.id);
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

        <p className="text-md lg:text-2xl font-bold text-[#AC0000]">New Journey</p>
        <hr className="border border-[#AC0000] my-2" />

   

          <div className="mx-auto mt-4 text-black">
          <form onSubmit={handleSubmit}>
            <div className="md:grid md:grid-cols-2 gap-6">
              {/* Row 1 */}
              <div className="mb-2 lg:mb-0">
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
              </div >
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
              <div className="mb-2 lg:mb-0">
                <label htmlFor="driver" className="block text-sm font-medium text-gray-700">
                  Driver
                </label>
                <select
                  id="driver"
                  name="driver"
                  value={formData.name}
                  onChange={(e) => {
                    const selectedTruckID = e.target.value; // Get the selected truck ID
                    getDriver(selectedTruckID); // Call getTruck with the selected ID
                    handleDriverChange(e); // Maintain your existing functionality
                  }}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000]"
                >
                  {/* <option value="" disabled>Select Driver</option> */}
                  {drivers.map((driver, index) => (
                    <option key={driver.id || index} value={JSON.stringify({ name: driver.name, id: driver._id })}>
                      {driver.name}
                    </option>
                  ))}
                </select>

              </div>

              <div className="mb-2 lg:mb-0">
                <label htmlFor="driver" className="block text-sm font-medium text-gray-700">
                  Truck
                </label>
                <select
                  id="truck"
                  name="truck"
                  value={formData.plate_id}
                  onChange={(e) => {
                    const selectedTruckID = e.target.value; // Get the selected truck ID
                    getTruck(selectedTruckID); // Call getTruck with the selected ID
                    handleTruckChange(e); // Maintain your existing functionality
                  }}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000]"
                >
                  {/* <option value="" disabled>Select Truck</option> */}
                  {trucks.map((truck, index) => (
                    <option onClick={(e)=>getTruck(e, truck.id)} key={truck.id || index} value={JSON.stringify({ name: truck.name, plate_id: truck.plate_id })}>
                      {truck.name}
                    
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 3 */}
              <div className="mb-2 lg:mb-0">
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
              <div className="mb-2 lg:mb-0">
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
              <div className="mb-2 lg:mb-0">
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
              <div className="mb-2 lg:mb-0">
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


                  <div className="mt-4 lg:w-2/5">
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
