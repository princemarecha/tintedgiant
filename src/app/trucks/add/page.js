"use client";

import Layout from "@/components/Layout";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MyComponent({ params }) {
  const router = useRouter();

  const initialFormData = {
    name: "",
    status: "N/A",
    location: "",
    travelling: "N/A",
    trailer: false,
    trailerPlate: "",
    colour: "",
    plate_id: "",
    mileage: "",
    fuel: "",
    journeys: "",
    avg_km: "",
    opCosts: "",
    avg_opCosts: "",
    photos: "",
  };

  // Form state
  const [formData, setFormData] = useState(initialFormData);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Compare form data with initial data and return only the changed fields
  const getChangedFields = () => {
    const updatedFields = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== initialFormData[key]) {
        updatedFields[key] = formData[key];
      }
    });
    return updatedFields;
  };

  // Submit the form
  const handleSubmit = async () => {
    try {
      const updatedFields = getChangedFields();  // Get only the changed fields
      if (Object.keys(updatedFields).length === 0) {
        alert("No changes detected!");
        return;
      }

      const response = await axios.post("/api/trucks", updatedFields);
      if (response.status === 200) {
        alert("Truck information updated successfully!");
        setFormData(initialFormData);  // Reset form to initial state
      }
    } catch (error) {
      console.error("Error submitting truck information:", error);
      alert("Failed to submit truck information.");
    }
  };

  return (
    <div className="bg-white h-screen relative">
      <Layout>
        <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">Trucks</p>

        <p className="text-sm 2xl:text-lg text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
          <Link href="/" passHref><span>Home </span></Link> <span>&gt;</span> 
          <Link href="/trucks" passHref><span>Truck Management</span></Link> <span>&gt;</span>
          <Link href="/trucks/all" passHref><span>Trucks </span></Link>
          <span>&gt;</span>
          <span>Add New</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            "Name",
            "Make",
            "Plate ID",      
            "Fuel", 
            "Mileage", 
            "Colour",
            "Trailer",
            "Trailer Plate",
            "Location",
          ].map((fieldName, index) => (
            <div key={index} className="mb-4">
              <label
                htmlFor={fieldName.toLowerCase().replace(/\s+/g, "-")}
                className="block text-lg font-bold text-gray-700 mb-2"
              >
                {fieldName}
              </label>
              {fieldName === "Trailer" ? (
                <select
                  id={fieldName.toLowerCase().replace(/\s+/g, "-")}
                  name="trailer"
                  value={formData.trailer || false}
                  onChange={handleChange}
                  className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
                >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              ) : (
                <input
                  id={fieldName.toLowerCase().replace(/\s+/g, "-")}
                  type="text"
                  name={fieldName
                    .toLowerCase()
                    .replace(/ /g, "_")
                    .replace("avg ", "avg_")
                    .replace("operational costs", "opCosts")
                    .replace("avg operational costs", "avg_opCosts")}
                  placeholder={`Enter ${fieldName.toLowerCase()}...`}
                  value={formData[
                    fieldName
                      .toLowerCase()
                      .replace(/ /g, "_")
                      .replace("avg ", "avg_")
                      .replace("operational costs", "opCosts")
                      .replace("avg operational costs", "avg_opCosts")
                  ] || ""}
                  onChange={handleChange}
                  className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded text-white bg-[#AC0000] hover:bg-gray-600 focus:outline-none transition duration-150"
          >
            Submit
          </button>
        </div>
      </Layout>
    </div>
  );
}
