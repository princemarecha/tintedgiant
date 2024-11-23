"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Manage() {
  const [regularCosts, setRegularCosts] = useState([]);
  const [otherCosts, setOtherCosts] = useState([]);
  const [newCost, setNewCost] = useState("");
  const [isInputVisible, setIsInputVisible] = useState({ regular: false, other: false });

  // Fetch expenses data
  const fetchExpenses = async () => {
    try {
      const response = await axios.get("/api/expense/manage");
      const { frameworks } = response.data;

      if (frameworks.length > 0) {
        const { regular, other } = frameworks[0];
        setRegularCosts(regular || []);
        setOtherCosts(other || []);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    if (e.target.value.length <= 25) {
      setNewCost(e.target.value);
    }
  };

  // Add a new cost to the respective list
  const addNewCost = async (type) => {
    if (!newCost.trim()) {
      alert("Please enter a valid expense name.");
      return;
    }

    try {
      const updatedCosts = type === "regular" ? [...regularCosts, newCost] : [...otherCosts, newCost];

      const payload = {
        [type]: updatedCosts, // Replace the array with the updated one
      };

      const response = await axios.post("/api/expense/manage", payload);

      if (response.status === 200) {
        if (type === "regular") {
          setRegularCosts(updatedCosts);
        } else {
          setOtherCosts(updatedCosts);
        }

        setNewCost(""); // Reset input field
        setIsInputVisible((prev) => ({ ...prev, [type]: false })); // Hide input field
      }
    } catch (error) {
      console.error("Error adding new cost:", error);
      alert("Failed to add new cost.");
    }
  };

  // Delete a cost from the respective list
  const deleteCost = async (type, cost) => {
    try {
      const updatedCosts =
        type === "regular" ? regularCosts.filter((item) => item !== cost) : otherCosts.filter((item) => item !== cost);

      const payload = {
        [type]: updatedCosts, // Replace the array with the updated one
      };

      const response = await axios.post("/api/expense/manage", payload);

      if (response.status === 200) {
        if (type === "regular") {
          setRegularCosts(updatedCosts);
        } else {
          setOtherCosts(updatedCosts);
        }
      }
    } catch (error) {
      console.error("Error deleting cost:", error);
      alert("Failed to delete cost.");
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="bg-white h-screen relative">
      <Layout>
        <div>
          <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">Expenses Management</p>
          <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
            <span>Home </span> <span>&gt;</span>     <Link href="/expenses" passHref><span>Expenses Management</span></Link> <span>&gt;</span>
            <span> Add Expenses </span>
          </p>

          {/* Regular Costs */}
          <p className="text-xl lg:text-xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">
            <span>Regular Costs</span>
            <span className="text-sm"> ({regularCosts.length})</span>
          </p>
          <hr className="my-2 2xl:my-4 border-[#AC0000]" />
          <div className="grid grid-cols-7 gap-2 text-sm font-bold">
            {regularCosts.map((cost, index) => (
              <div key={index} className="bg-[#AC0000] flex justify-between p-2 rounded">
                <span>{cost}</span>
                <span
                  className="my-auto cursor-pointer"
                  onClick={() => deleteCost("regular", cost)}
                >
                  <Image
                    src="/images/icons/delete.png"
                    alt="Delete Icon"
                    width={16}
                    height={16}
                    className="transition duration-75 group-hover:opacity-80"
                  />
                </span>
              </div>
            ))}
            <div
              className={`bg-white text-[#AC0000] shadow-xl border border-red-100 flex justify-between p-2 rounded cursor-pointer ${
                isInputVisible.other ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => !isInputVisible.other && setIsInputVisible((prev) => ({ ...prev, regular: !prev.regular }))}
            >
              <span>Add New</span>
              <span className="my-auto">
                <Image
                  src="/images/icons/plus.png"
                  alt="Plus Icon"
                  width={12}
                  height={12}
                  className="transition duration-75 group-hover:opacity-80"
                />
              </span>
            </div>
          </div>

          {isInputVisible.regular && (
            <div className="mt-4">
              <input
                type="text"
                maxLength={25}
                value={newCost}
                onChange={handleInputChange}
                placeholder="Enter new cost..."
                className="p-2 border border-gray-300 rounded w-full text-[#AC0000]"
              />
              <button
                onClick={() => addNewCost("regular")}
                className="mt-2 px-4 py-2 bg-[#AC0000] text-white rounded hover:bg-gray-700 transition"
              >
                Submit
              </button>
            </div>
          )}

          {/* Other Costs */}
          <p className="text-xl lg:text-xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">
            <span>Other Costs</span>
            <span className="text-sm"> ({otherCosts.length})</span>
          </p>
          <hr className="my-2 2xl:my-4 border-[#AC0000]" />
          <div className="grid grid-cols-7 gap-2 text-sm font-bold">
            {otherCosts.map((cost, index) => (
              <div key={index} className="bg-[#AC0000] flex justify-between p-2 rounded">
                <span>{cost}</span>
                <span
                  className="my-auto cursor-pointer"
                  onClick={() => deleteCost("other", cost)}
                >
                  <Image
                    src="/images/icons/delete.png"
                    alt="Delete Icon"
                    width={16}
                    height={16}
                    className="transition duration-75 group-hover:opacity-80"
                  />
                </span>
              </div>
            ))}
            <div
              className={`bg-white text-[#AC0000] shadow-xl border border-red-100 flex justify-between p-2 rounded cursor-pointer ${
                isInputVisible.regular ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => !isInputVisible.regular && setIsInputVisible((prev) => ({ ...prev, other: !prev.other }))}
            >
              <span>Add New</span>
              <span className="my-auto">
                <Image
                  src="/images/icons/plus.png"
                  alt="Plus Icon"
                  width={12}
                  height={12}
                  className="transition duration-75 group-hover:opacity-80"
                />
              </span>
            </div>
          </div>

          {isInputVisible.other && (
            <div className="mt-4">
              <input
                type="text"
                maxLength={25}
                value={newCost}
                onChange={handleInputChange}
                placeholder="Enter new cost..."
                className="p-2 border border-gray-300 rounded w-full text-[#AC0000]"
              />
              <button
                onClick={() => addNewCost("other")}
                className="mt-2 px-4 py-2 bg-[#AC0000] text-white rounded hover:bg-gray-700 transition"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
}
