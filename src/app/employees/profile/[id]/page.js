"use client";

import React, {use, useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import Modal from "@/components/Modal";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AddEmployee({params}) {
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

  const router = useRouter()

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("error");
  const [modalMessage, setModalMessage] = useState("");

  const { id } = use(params); // Extract 'id' from the URL
  const [employee, setEmployee] = useState(null);

  const nationalities = ["South Africa", "Botswana", "Zimbabwe", "Namibia", "Lesotho", "Swaziland", "Zambia", "Malawi", "Mozambique"]; // Southern Africa countries

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form validation
  const validateForm = () => {


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
      // Prepare formData
      const dataToSubmit = { ...formData, userId: id, name: employee.fullName, email: employee.email };
  
      // First, attempt to create the employee (POST)
      const postResponse = await axios.post("/api/employee/", dataToSubmit);
  
      if (postResponse.status === 200) {
        // If POST is successful, make the PATCH request
        const patchData = { occupation: formData.occupation };
        const patchResponse = await axios.patch(`/api/employee/user/${id}`, patchData);
  
        if (patchResponse.status === 200) {
          setModalMessage("Employee added and updated successfully!");
          setModalType("success");
        } else {
          setModalMessage("Employee added, but failed to update.");
          setModalType("warning");
        }
      } else {
        setModalMessage("Failed to add employee. Please try again.");
        setModalType("error");
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setModalMessage("An error occurred. Please try again.");
      setModalType("error");
    } finally {
      setModalOpen(true);
      setLoading(false);
  
      // Optionally clear the form
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
      router.push(`/employees`)
    }
  };
  

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (id) {
      // Fetch user information by ID
      const fetchEmployee = async () => {
        try {
          const response = await axios.get(`/api/employee/user/${id}`);
          setEmployee(response.data.user);
        } catch (err) {
          console.error("Error fetching employee data:", err);
          setError("Failed to fetch employee information.");
        } finally {
          setLoading(false);
        }
      };

      fetchEmployee();
    }
  }, [id]);

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
          <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">Employee Profile{employee? <span className="text-gray-400"> [{`${employee.fullName}`}]</span>:""}</p>

          <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
            <span>Home </span> <span>&gt;</span> <span> Employee Management </span> <span>&gt;</span>
            <span> Add Employee Profile </span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              {[
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
