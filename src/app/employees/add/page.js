"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import Modal from "@/components/modal";
import Image from "next/image";

export default function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phoneNumber: "",
    gender: "Male",
    nationality: "",
    nationalID: "",
    passportNumber: "",
    occupation: "",
  });

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("error");
  const [modalMessage, setModalMessage] = useState("");

  const nationalities = ["South Africa", "Botswana", "Zimbabwe", "Namibia", "Lesotho", "Swaziland", "Zambia", "Malawi", "Mozambique"]; // Southern Africa countries

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form validation
  const validateForm = () => {
    if (formData.name.length < 4 || formData.name.length > 50) {
      setModalMessage("Name must be between 4 and 50 characters long.");
      return false;
    }

    if (+formData.age < 18 || +formData.age > 75) {
      setModalMessage("Age must be between 18 and 75.");
      return false;
    }

    if (formData.phoneNumber.length !== 10) {
      setModalMessage("Phone number must be exactly 10 characters long.");
      return false;
    }

    if (formData.nationalID.length !== 13 || formData.passportNumber.length !== 13) {
      setModalMessage("National ID and Passport Number must be exactly 13 characters long.");
      return false;
    }

    if (!formData.nationality) {
      setModalMessage("Please select a nationality.");
      return false;
    }

    if (!formData.occupation) {
      setModalMessage("Please select an occupation.");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      setModalOpen(true);
      return;
    }

    try {
      const response = await axios.post("/api/employee/", formData);

      if (response.status === 200) {
        alert("Employee added successfully!");

        // Clear form fields
        setFormData({
          name: "",
          age: "",
          phoneNumber: "",
          gender: "Male",
          nationality: "",
          nationalID: "",
          passportNumber: "",
          occupation: "",
        });
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      setModalMessage("Failed to add employee. Please try again.");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Handle modal
  const toggleModal = () => setModalOpen(!isModalOpen);

  return (
    <div className="bg-white h-screen relative">
      {(isLoading || loading) && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative flex justify-center items-center">
            <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-yellow-300"></div>
            <img src="/images/logo.png" alt="Loading Logo" className="rounded-full h-22 w-28" />
          </div>
        </div>
      )}
      <Layout>
        <div>
          <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">Employees</p>

          <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
            <span>Home </span> <span>&gt;</span> <span> Employee Management </span> <span>&gt;</span>
            <span> Add Employee </span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              {[
                { label: "Name", name: "name", type: "text", required: true },
                { label: "Age", name: "age", type: "number", required: true },
                { label: "Phone Number", name: "phoneNumber", type: "text", required: true },
                { label: "National ID", name: "nationalID", type: "text", required: true },
                { label: "Passport Number", name: "passportNumber", type: "text", required: true },
              ].map(({ label, name, type, required }) => (
                <div key={name} className="flex flex-col">
                  <label htmlFor={name} className="mb-2 font-medium text-[#AC0000]">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    required={required}
                    className="p-2 border border-[#AC0000] rounded w-full text-sm text-black"
                  />
                </div>
              ))}

              <div className="flex flex-col">
                <label htmlFor="gender" className="mb-2 font-medium text-[#AC0000]">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="p-2 border border-[#AC0000] rounded w-full text-sm text-black"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="nationality" className="mb-2 font-medium text-[#AC0000]">
                  Nationality
                </label>
                <select
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                  className="p-2 border border-[#AC0000] rounded w-full text-sm text-black"
                >
                  <option value="">Select Nationality</option>
                  {nationalities.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="occupation" className="mb-2 font-medium text-[#AC0000]">
                  Occupation
                </label>
                <select
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                  className="p-2 border border-[#AC0000] rounded w-full text-sm text-black"
                >
                  <option value="">Select Occupation</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Driver">Driver</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:absolute md:bottom-4 my-4 md:my-0 right-4 px-6 py-2  bg-[#AC0000] rounded hover:bg-blue-600 transition shadow-md flex "
            >
              {loading ? "Saving..." : "Save"}
              <Image
                src="/images/icons/save.png"
                alt="save Icon"
                width={20}
                height={20}
                className="transition duration-75 group-hover:opacity-80 ml-3 w-5 h-5"
              />
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
