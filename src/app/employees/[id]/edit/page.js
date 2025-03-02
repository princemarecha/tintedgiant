"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import Modal from "@/components/Modal";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function UpdateEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    userId: "",
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
  const nationalities = [
    "South Africa",
    "Botswana",
    "Zimbabwe",
    "Namibia",
    "Lesotho",
    "Swaziland",
    "Zambia",
    "Malawi",
    "Mozambique",
  ];

  const { id } = useParams();
  const router = useRouter();

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form validation
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
      const nonEmptyFields = Object.fromEntries(
        Object.entries(formData).filter(
          ([key, value]) =>
            key !== "_id" &&
            key !== "createdAt" &&
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        )
      );

      const response = await axios.patch(`/api/employee/${id}`, nonEmptyFields);

      if (formData.name){
        const nameData = { 
          name: formData.name,
          occupation: formData.occupation
        }; // Only sending the name field

        
      }

      const updateData = {};
      if (formData.name) updateData.name = formData.name;
      if (formData.email) updateData.email = formData.email;
      if (formData.occupation) updateData.occupation = formData.occupation;

      const responseUser = await axios.patch(`/api/employee/${formData.userId}/update`, updateData);


      if (response.status === 200) {
        alert("Employee updated successfully!");
        router.push(`/employees/all`);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      setModalMessage("Failed to update employee. Please try again.");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  async function fetchEmployeeData(empID) {
    const response = await fetch(`/api/employee/${empID}`);
    if (!response.ok) {
      throw new Error("Failed to fetch employee data" + empID);
    }
    return response.json();
  }

  useEffect(() => {
    if (id) {
      async function fetchEmployee() {
        try {
          const data = await fetchEmployeeData(id);
          setFormData((prevData) => ({
            ...prevData,
            ...data,
          }));
        } catch (err) {
          console.error("Failed to fetch employee data:", err);
          setModalMessage("Failed to fetch employee data.");
          setModalOpen(true);
        } finally {
          setIsLoading(false);
        }
      }

      fetchEmployee();
    }
  }, [id]);

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
          <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">Edit Employee</p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              {[{ label: "Name", name: "name", type: "text" }, { label: "Age", name: "age", type: "number" }, { label: "Phone Number", name: "phoneNumber", type: "text" }, { label: "National ID", name: "nationalID", type: "text" }, { label: "Passport Number", name: "passportNumber", type: "text" }].map(({ label, name, type }) => (
                <div key={name} className="flex flex-col">
                  <label htmlFor={name} className="mb-2 font-medium text-[#AC0000]">{label}</label>
                  <input id={name} name={name} type={type} value={formData[name]} onChange={handleChange} className="p-2 border border-[#AC0000] rounded w-full text-sm text-black" />
                </div>
              ))}

              <div className="flex flex-col">
                <label htmlFor="gender" className="mb-2 font-medium text-[#AC0000]">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="p-2 border border-[#AC0000] rounded w-full text-sm text-black">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="nationality" className="mb-2 font-medium text-[#AC0000]">Nationality</label>
                <select id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} className="p-2 border border-[#AC0000] rounded w-full text-sm text-black">
                  <option value="">Select Nationality</option>
                  {nationalities.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="occupation" className="mb-2 font-medium text-[#AC0000]">Occupation</label>
                <select id="occupation" name="occupation" value={formData.occupation} onChange={handleChange} className="p-2 border border-[#AC0000] rounded w-full text-sm text-black">
                  <option value="">Select Occupation</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Driver">Driver</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="md:absolute md:bottom-4 my-4 md:my-0 right-4 px-6 py-2 bg-[#AC0000] rounded hover:bg-blue-600 transition shadow-md flex">
              {loading ? "Saving..." : "Save"}
              <Image src="/images/icons/save.png" alt="save Icon" width={20} height={20} className="transition duration-75 group-hover:opacity-80 ml-3 w-5 h-5" />
            </button>
          </form>

          <Modal isOpen={isModalOpen} toggleModal={toggleModal} type={modalType} message={modalMessage} color="gray" onCancel={toggleModal} />
        </div>
      </Layout>
    </div>
  );
}
