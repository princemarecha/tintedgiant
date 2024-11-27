"use client";

import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

async function getID(params) {
  // Simulate fetching or processing to get the plate ID
  const id = (await params).id
  return id
}

export default function Expense({ params }) {
  const [expense, setExpense] = useState(null); // State to store expense data
  const [error, setError] = useState(null); // State to handle errors
  const [expenseID, setID] = useState(null);


  async function fetchAExpenseData(expenseID) {
    // Fetch truck data from the endpoint
  
    const response = await fetch(`/api/expense/${expenseID}`);
    if (!response.ok) {
      throw new Error("Failed to fetch truck data"+expenseID);
    }
    return response.json();
  }
  
  // Fetch expense data when the component mounts
  useEffect(() => {
    async function fetchID() {
      try {
        const id = await getID(params);
        setID(id);
      } catch (err) {
        setError("Failed to fetch  ID");
      }
    }

    fetchID();
  }, [params]);

  useEffect(() => {
    // Fetch truck data when plateID is available
    if (expenseID) {
      async function fetchAExpense() {
        try {
          const data = await fetchAExpenseData(expenseID);
          setExpense(data);
          console.log("done")
        } catch (err) {
          setError("Failed to fetch truck data");
        }
      }

      fetchAExpense();
    }
  }, [expenseID]);

  // Utility function to format date and time
  const formatDateTime = (dateTimeString) => {
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", options).replace(",", "");
  };

  return (
    <div className="bg-white h-screen relative">
      <Layout>
        <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">
          Expense Details
        </p>
        <p className="text-sm  text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
          <span className="hover:underline">Home </span> <span>&gt;</span>{" "}
          <Link href={"/expenses"} passHref><span className="hover:underline">Expense and Tracking</span></Link> <span>&gt;</span>
          <span>{expense?expense.from:""} - {expense?expense.to:""}</span>
        </p>

        <div className="flex justify-between">
          <p className="text-2xl font-bold text-[#AC0000]">Expense</p>
          <p className="text-xl font-bold text-gray-500">{formatDateTime(expense?expense.departure:"")}</p>
        </div>
        <hr className="border border-black my-2"/>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : expense ? (
          <div className="p-4   text-black text-sm grid grid-cols-2 gap-y-6 mb-4">
    
            <div className="grid grid-cols-1">
              <span className="font-bold">From</span> {expense.from}
            </div>
            <div className="grid grid-cols-1">
              <span className="font-bold">To</span> {expense.to}
            </div>

            <div className="grid grid-cols-1">
              <span className="font-bold">Departure</span>{" "}
              {formatDateTime(expense.departure)}
            </div>
            <div className="grid grid-cols-1">
              <span className="font-bold">Arrival</span>{" "}
              {formatDateTime(expense.arrival)}
            </div>
            <div className="grid grid-cols-1">
              <span className="font-bold">Driver</span> <span className="bg-[#AC0000] py-1 px-2 w-1/2 text-white rounded text-center">{expense.driver}</span>
            </div>
            <div className="grid grid-cols-1">
              <span className="font-bold">Truck</span> <span className="bg-black py-1 px-2 w-1/2 text-white rounded text-center">{expense.truck}</span>
            </div>
            <div className="grid grid-cols-1">
              <span className="font-bold">Status</span> {expense.status}
            </div>
            <div className="grid grid-cols-1">
              <span className="font-bold">Distance</span> {expense.distance} km
            </div>
            <div className="grid grid-cols-1">
              <span className="font-bold">Cargo</span> {"Rice"}
            </div>

          </div>
        ) : (
          <p>Loading expense details...</p>
        )}

        {/* Expenses */}
        <p className="text-xl font-bold text-black mt-6">Expenses</p>
        <hr className="border border-black my-2"/>

        <div className="p-4   text-black grid grid-cols-2 gap-y-6 mb-4 text-sm">
        <div className="grid grid-cols-1">
              <span className="font-bold">Fuel</span> $245.50 USD
            </div>
        </div>

        <hr className="border border-black my-2"/>
         {/* Totals Section */}
         <div className="mt-6 mb-4 text-[#4F4F4F] flex">
          <p className="font-bold text-sm mr-10">totals</p>
          
            <p  className="mr-4">
              <span className="text-xs">USD</span> 
              <span className="font-black text-3xl">567.50</span>
            </p>
        
        </div>
        <hr className="border border-black my-2"/>
        <div className="flex justify-between mt-6 text-sm">
        <p className="font-bold text-[#AC0000] text-sm mr-10">Delete Expense</p>
        <button
                onClick={() => alert("Button clicked!")}
                className="px-4 py-2 rounded text-white bg-[#AC0000] hover:bg-gray-600 focus:outline-none focus:ring-0  transition duration-150"
              >
                <p className="flex justify-between"><span>Print Expense</span><span>
                <Image
                src="/images/icons/print.png"
                alt="Search Icon"
                width={20}
                height={20}
                className="transition duration-75 group-hover:opacity-80 ml-2 sm:w-6 sm:h-6"
              />
                  </span>
                  </p>
          </button>
        </div>
      </Layout>
    </div>
  );
}
