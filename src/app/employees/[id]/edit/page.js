"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function UpdateEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phoneNumber: "",
    gender: "",
    nationality: "",
    nationalID: "",
    passportNumber: "",
    occupation: "",
    photo: "",
  });

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState([]);

  const { id } = useParams();
  const router = useRouter();

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const nonEmptyFields = Object.fromEntries(
        Object.entries(formData).filter(
          ([key, value]) =>
            key !== "_id" && key !== "createdAt" && // Exclude _id and createdAt
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        )
      );
      
      

      const response = await axios.patch(`/api/employee/${id}`, nonEmptyFields);

      if (response.status === 200) {
        alert("Employee updated successfully!");
        router.push(`/employees/all`);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee.");
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
          setEmployeeData(data);
          setFormData((prevData) => ({
            ...prevData,
            ...data,
          }));
        } catch (err) {
          console.error("Failed to fetch employee data:", err);
          alert("Failed to fetch employee data.");
        }
      }

      fetchEmployee();
      setIsLoading(false);
    }
  }, [id]);

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
        <div className="">
          <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">
            Employees
          </p>

          <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
            <span>Home </span>
            <span>&gt;</span>
            <Link href={"/employees"}>
              <span className="hover:underline"> Employee Management </span>
            </Link>
            <span>&gt;</span>
            <Link href={"/employees/all"}>
              <span className="hover:underline"> All Employees </span>
            </Link>
            <span>&gt;</span>
            <span> Edit Employee </span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              {/* Name Field */}
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-2 font-medium text-[#AC0000]">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-2 border border-[#AC0000] rounded w-full text-sm text-black"
                />
              </div>

              {/* Age Field */}
              <div className="flex flex-col">
                <label htmlFor="age" className="mb-2 font-medium text-[#AC0000]">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  className="p-2 border border-[#AC0000] rounded w-full text-sm text-black"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col">
                <label
                  htmlFor="phoneNumber"
                  className="mb-2 font-medium text-[#AC0000]"
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="p-2 border border-[#AC0000] rounded w-full text-sm text-black"
                />
              </div>

              {/* Gender Field */}
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
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Occupation Field */}
              <div className="flex flex-col">
                <label
                  htmlFor="occupation"
                  className="mb-2 font-medium text-[#AC0000]"
                >
                  Occupation
                </label>
                <select
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="p-2 border border-[#AC0000] rounded w-full text-sm text-black"
                >
                  <option value="">Select Occupation</option>
                  <option value="Driver">Driver</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Manager">Manager</option>
                  <option value="General">General</option>
                </select>
              </div>

              {/* Nationality */}
              <div className="flex flex-col">
                <label
                  htmlFor="nationality"
                  className="mb-2 font-medium text-[#AC0000]"
                >
                  Nationality
                </label>
                <input
                  id="nationality"
                  name="nationality"
                  type="text"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="p-2 border border-[#AC0000] rounded w-full text-sm text-black"
                />
              </div>

              {/* National ID */}
              <div className="flex flex-col">
                <label
                  htmlFor="nationalID"
                  className="mb-2 font-medium text-[#AC0000]"
                >
                  National ID
                </label>
                <input
                  id="nationalID"
                  name="nationalID"
                  type="text"
                  value={formData.nationalID}
                  onChange={handleChange}
                  className="p-2 border border-[#AC0000] rounded w-full text-sm text-black"
                />
              </div>

              {/* Passport Number */}
              <div className="flex flex-col">
                <label
                  htmlFor="passportNumber"
                  className="mb-2 font-medium text-[#AC0000]"
                >
                  Passport Number
                </label>
                <input
                  id="passportNumber"
                  name="passportNumber"
                  type="text"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  className="p-2 border border-[#AC0000] rounded w-full text-sm text-black"
                />
              </div>

         
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:absolute md:bottom-4 my-4 md:my-0 right-4 px-6 py-2 bg-[#AC0000] rounded hover:bg-blue-600 transition shadow-md flex"
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
      </Layout>
    </div>
  );
}
