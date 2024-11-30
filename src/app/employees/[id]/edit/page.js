"use client";

import React, { useState } from "react";
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

  const { id } = useParams();
  const router = useRouter()

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
    // Filter out empty fields
    const nonEmptyFields = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value.trim() !== "")
    );

    const response = await axios.patch(`/api/employee/${id}`, nonEmptyFields);

    if (response.status === 200) {
      alert("Employee updated successfully!");

    router.push(`/employees/all`)
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    alert("Failed to update employee.");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="bg-white h-screen relative">

    <Layout>
      <div className="">
      <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">Employees</p>

      <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8"><span>Home </span> <span>&gt;</span> <Link href={"/employees"}><span className="hover:underline"> Employee Management </span></Link> <span>&gt;</span><Link href={"/employees/all"}><span className="hover:underline"> All Employees </span></Link> <span>&gt;</span><span> Edit Employee </span></p>


        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            {[
              { label: "Name", name: "name", type: "text", required: false },
              { label: "Age", name: "age", type: "number", required: false },
              { label: "Phone Number", name: "phoneNumber", type: "text", required: false },
              { label: "Gender", name: "gender", type: "text", required: false },
              { label: "Nationality", name: "nationality", type: "text", required: false },
              { label: "National ID", name: "nationalID", type: "text", required: false },
              { label: "Passport Number", name: "passportNumber", type: "text", required: false },
              { label: "Occupation", name: "occupation", type: "text", required: false },
              { label: "Photo URL", name: "photo", type: "text", required: false },
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="absolute bottom-4 right-4 px-6 py-2  bg-[#AC0000] rounded hover:bg-blue-600 transition shadow-md flex "
          >
            {loading ? "Saving..." : "Save"}
            <Image
            src="/images/icons/save.png" // Replace with your image path
            alt="save Icon"  // Alternative text for the image
            width={20} // Set the width of the image
            height={20} // Set the height of the image
            className="transition duration-75 group-hover:opacity-80 ml-3 w-5 h-5" 
          />
          </button>

        </form>
      </div>
    </Layout>

    </div>
  );
}
