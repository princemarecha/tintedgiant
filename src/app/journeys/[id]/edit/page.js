"use client";

import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";



export default function Driver({params}) {

  const defaultForm = {
    departure: "",
    arrival: "",
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
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("error");
  const [modalMessage, setModalMessage] = useState("");

  const toggleModal = () => setModalOpen(!isModalOpen);

  const router  = useRouter();


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

  // Fetch journey details
  useEffect(() => {
    const fetchJourneyDetails = async () => {
      if (!journeyID) return; // Wait until journeyID is set
      try {
        const response = await axios.get(`/api/journey/${journeyID}`);
        const journey = response.data;

        // Update formData with fetched journey data
        setFormData({
          departure: journey.departure || "",
          arrival: journey.arrival || "",
          from: journey.from || "",
          to: journey.to || "",
          distance: journey.distance || "",
          status: journey.status || "",
          cargo: journey.cargo || "",
        });
      } catch (error) {
        console.error("Error fetching journey details:", error);
      }
    };

    fetchJourneyDetails();
    setIsLoading(false)
  }, [journeyID]);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };
  
      const departureDate = new Date(updated.departure);
      const arrivalDate = new Date(updated.arrival);
  
      // If updating arrival and it's earlier than departure, reset to match departure
      if (name === "arrival" && arrivalDate < departureDate) {
        updated.arrival = updated.departure;
      }
  
      // If updating departure and it's after arrival, reset to match arrival
      if (name === "departure" && arrivalDate < departureDate) {
        updated.departure = updated.arrival;
      }
  
      return updated;
    });
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

    // Validate "From" and "To" fields
    const validateLocation = (location) => {
      if (!location || location.length < 8) {
        return false; // Must be at least 8 characters long
      }
      const isValidFormat = /^.+,.+$/.test(location); // At least one character before and after a single comma
      return isValidFormat;
    };
  
    if (!validateLocation(formData.from)) {
      setModalMessage("The 'From' field must be at least 8 characters long and contain a single comma separating two parts.");
      toggleModal();
      setIsLoading(false);
      return;
    }
  
    if (!validateLocation(formData.to)) {
      setModalMessage("The 'To' field must be at least 8 characters long and contain a single comma separating two parts.");
      toggleModal();
      setIsLoading(false);
      return;
    }

    if (formData.cargo==""){
      setModalMessage("Please fill in the cargo fields.");
      toggleModal();
      setIsLoading(false);
      return;
    }

    if (formData.cargo.length <=2){
      setModalMessage("Cargo should be more than 2 letters long");
      toggleModal();
      setIsLoading(false);
      return;
    }
  
    setIsLoading(true)
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
      const response = await axios.patch(`/api/journey/${journeyID}`, filteredData);
      console.log("Journey updated:", response.data);
      router.push(`/journeys/${journeyID}`)
      // Reset form
      setFormData(defaultForm);
      setIsLoading(false)
      alert("Journey updated successfully!");
    } catch (error) {
      setIsLoading(false)
      console.error("Error updating journey:", error);
      alert("Failed to update journey. Please try again.");
    }
  };

  function getURL(){
    return `/journeys/${journeyID}`
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
              <span>Journeys and Tracking</span>
            </Link>{" "}
            <span>&gt;</span>
            <Link href="/journeys/manage" passHref>
              <span>Manage Journeys</span>
            </Link>{" "}
            <span>&gt;</span>
            <Link href={getURL()} passHref>
              <span>Journey Details</span>
            </Link>{" "}
            <span>&gt;</span>
            <span> Edit Journey </span>
          </p>
        </div>

        <p className="text-2xl font-bold text-[#AC0000]">Edit Journey</p>
        <hr className="border border-[#AC0000] my-2" />

   

          <div className="mx-auto mt-4 text-black">
          <form onSubmit={handleSubmit}>
            <div className="md:grid md:grid-cols-2 gap-6">
              {/* Row 1 */}
              <div className="mb-2 lg:mb-0 ">
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
              <div className="mb-2 lg:mb-0">
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
  
              {/* Row 3 */}
              <div className="mb-2 lg:mb-0">
                <label htmlFor="from" className="block text-sm font-medium text-gray-700">
                  From
                </label>
                <input
                  type="text"
                  id="from"
                  name="from"
                  maxLength="40" 
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
                  maxLength="40" 
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
                  max="1000000" 
                  value={formData.distance}
                  onChange={(e) => {
                    if (e.target.value.length <= 7) {
                      handleChange(e); // Allow only up to 7 digits
                    }
                  }}
                  required
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
              <div className="col-span-2" >
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
                      maxLength="20" 
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
              Save Update
            </button>
          </form>
        </div>
        <Modal
                isOpen={isModalOpen}
                toggleModal={toggleModal}
                type={modalType}
                message={modalMessage}
                color="gray"
                onCancel={toggleModal}
              />
      </Layout>
    </div>
  );
}
