"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import BarChart from "@/components/Bar";

export default function Dashboard() {

const [journeys, setJourneys] = useState([]);
const [chartData, setChartData] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [expenses, setExpenses] = useState([]);
const maxExpenses = 9; // Total number of divs to display (including placeholders)
const [summary, setSummary] = useState(null); // State to store summary data
const [error, setError] = useState(null); // State to handle errors
 
useEffect(() => {
  const fetchJourneys = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/home/journeys");
      if (!response.ok) {
        throw new Error("Failed to fetch journeys");
      }
      const data = await response.json();
      setJourneys(data.journeys);
    } catch (error) {
      console.error("Error fetching journeys:", error);
    }
  };

  fetchJourneys();
}, []);


useEffect(() => {
  // Fetch data from the API endpoint
  const fetchChartData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/home/journeys/stats');
      const result = await response.json();

      if (result.journeys) {
        // Extract the months and journey counts from the response
        const months = Object.keys(result.journeys); // Get the months (keys)
        const journeyCounts = Object.values(result.journeys); // Get the journey counts (values)

        setChartData({
          data: {
            labels: months,
            datasets: [
              {
                label: 'Journeys',
                data: journeyCounts,
                backgroundColor: '#AC0000',
                borderColor: '#AC0000',
                borderWidth: 1,
                borderRadius: 10,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchChartData();
}, []);


useEffect(() => {
  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/home/expenses");
      const data = await response.json();
      const expensesArray = Object.entries(data.expenses || {}).map(
        ([name, amount]) => ({ name, amount })
      ); // Convert object to an array of { name, amount } objects
      setExpenses(expensesArray);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]); // Fallback to an empty array on error
    }
  };

  fetchExpenses();
}, []);

useEffect(() => {
  const fetchSummary = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/home/summary");
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setSummary(data); // Set the summary data to state
    } catch (err) {
      console.error("Error fetching summary data:", err);
      setError(err.message); // Set error message to state
    }
  };

  fetchSummary();
}, []);

function truncateString(str, maxLength = 10) {
  if (!str) return ""; // Handle null or undefined by returning an empty string
  if (str.length > maxLength) {
    return str.substring(0, maxLength); // Truncate if string exceeds maxLength
  }
  return str; // Return original string if it's within maxLength
}


// Prepare combined data (expenses + placeholders)
const displayData = [
  ...expenses,
  ...Array(Math.max(0, maxExpenses - expenses.length)).fill(null),
].slice(0, maxExpenses);

  return (
    <div className="bg-white h-screen relative">
      <Layout>
        <div>
          <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">Welcome to our Dashboard!</p>

          <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8"><span>Home </span> <span>&gt;</span> <span>Dashboard</span> </p>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4 bg-[#5A4F05] h-96 rounded-lg">
              <p className="text-white text-end mx-6 mt-6 text-xl font-bold">Now Traveling</p>
              <div className="justify-end flex mx-6 mt-2">
              <p className="text-white text-end  text-xl font-bold">5<span className="text-sm"> Journeys</span></p>
              <div>
                <Image
                  src="/images/icons/share.png" // Replace with your image path
                  alt="Truck Icon"  // Alternative text for the image
                  width={20} // Set the width of the image
                  height={20} // Set the height of the image
                  className="transition duration-75 group-hover:opacity-80 ml-2" // Apply hover effect, for example, reduce opacity
                />
              </div>
              
              </div>

              {/* Active Journeys */}

              <div className="grid grid-cols-1 overflow-y-scroll h-72 scrollbar scrollbar-thumb-white scrollbar-track-[#5A4F05]">
              {journeys.map((journey, index) => (
                 <Link key={index} href={`/journeys/${journey._id}`}>
                <div  className="bg-white h-24 mx-6 mt-2 grid grid-cols-3">
                  
                    <div className="mx-2 mt-2">
                        <p className="text-[#AC0000] text-xs font-black">From</p>
                        <p className="text-[#AC0000] text-xs 2xl:hidden">{truncateString(journey.from) || "Loading"}</p>
                        <p className="text-[#AC0000] text-xs hidden 2xl:inline">{journey.from}</p>
                      </div>
                      <div className="mx-2 mt-2">
                        <p className="text-[#AC0000] text-xs font-black">To</p>
                        <p className="text-[#AC0000] text-xs 2xl:hidden">{truncateString(journey.to) || "Loading"}</p>
                        <p className="text-[#AC0000] text-xs hidden 2xl:inline">{journey.to}</p>
                      </div>
                      <div className="mx-2 mt-2">
                        <p className="text-[#AC0000] text-xs font-bold">Driver</p>
                        <p className="text-white rounded-sm text-xs bg-[#4D4D4D] text-center 2xl:hidden">{truncateString(journey.driver?.name) || "Loading..."}</p>
                        <p className="text-white rounded-sm text-xs bg-[#4D4D4D] text-center hidden 2xl:inline">{journey.driver?.name || "Loading..."}</p>
                      </div>
                      <div className="mx-2 mt-2 col-span-2">
                        <p className="text-[#AC0000] text-xs font-black">Departure</p>
                        <p className="rounded-sm text-xs text-[#AC0000] 2xl:hidden">{truncateString(journey.departure) || "Loading"}</p>
                        <p className="rounded-sm text-xs text-[#AC0000] hidden 2xl:inline">{journey.departure || "Loading"}</p>
                      </div>
                      <div className="mx-2 mt-2 col-span-1">
                        <p className="text-[#126928] text-md text-end font-black">
                          {journey.distance || "-"} km
                        </p>
                      </div>

                </div>
                </Link>
              ))}
            
              </div>


            </div>
            <div className="col-span-8 shadow-lg p-4 rounded-lg">
              <div className="flex justify-between mx-4">
                  <p className="text-[#AC0000] mx-6 mt-4 text-xl font-black">Journeys</p>
                  <p className="text-[#AC0000] mx-6 mt-4 text-lg font-black">2024</p>
              </div>
          
            <hr className=""/>
            <div>
              {chartData ? <BarChart data={chartData.data} options={chartData.options} /> : <p>Loading chart...</p>}
            </div>

                
            </div>
            <div className="col-span-8 bg-[#5A4F05]   grid grid-cols-8 rounded-lg">
            <div className="col-span-2 flex flex-col justify-between h-full">
                <div className="flex justify-between">
                  <p className="text-white mx-6 mt-4 text-md font-black">Expenses</p>
                  <div className="mt-6">
                    <Link href={`/expenses/manage`}>
                      <Image
                        src="/images/icons/share.png" // Replace with your image path
                        alt="Truck Icon"  // Alternative text for the image
                        width={20} // Set the width of the image
                        height={20} // Set the height of the image
                        className="transition duration-75 group-hover:opacity-80 ml-2" // Apply hover effect, for example, reduce opacity
                      />
                      </Link>
                  </div>
                
                </div>

                <div className="appendDown">
                  <div>
                    <p className="text-white mx-6 mt-4 text-xs font-semibold">Year</p>
                    <p className="text-white mx-6 text-md font-black">2024</p>
                  </div>

                  <div>
                    <p className="text-white mx-6 mt-4 text-xs font-semibold">Total Amount</p>
                    <p className="text-white mx-6 text-2xl font-black mb-2">$245<span className="text-xs">.00</span></p>
                  </div>
                </div>
              </div>
              <div className="col-span-6 grid grid-cols-3 gap-3 m-6 ">
              {displayData.map((expense, index) => (
        <div
          key={index}
          className={`bg-white h-20 rounded flex-col justify-between ${
            expense ? "" : "opacity-50" // Apply reduced opacity for placeholders
          }`}
        >
          {expense ? (
            <>
              <div className="flex justify-between m-2">
                <p className="text-[#126928] text-xs font-bold">
                  {expense.name || "Unknown"}
                </p>
                <div>
                  <Image
                    src="/images/icons/down.png"
                    alt="Expense Icon"
                    width={20}
                    height={20}
                    className="transition duration-75 group-hover:opacity-80 ml-2"
                  />
                </div>
              </div>
              <p className="text-[#126928] mx-2 text-xl font-black">
                {expense.amount || "$0.00"}
              </p>
            </>
          ) : (
            <>
              <div className="flex justify-between m-2">
                <p className="text-gray-400 text-xs font-bold">Expense</p>
              </div>
              <p className="text-gray-400 mx-2 text-xl font-black">$0.00</p>
            </>
          )}
        </div>
      ))}
              
              </div>

            </div>
            <div className="col-span-4 bg-[#AC0000] flex-col justify-between flex rounded-lg">
      <div>
        <p className="text-white mx-6 mt-4 text-xl font-black">Summary</p>
      </div>
      <div className="appendDown">
        {/* Top Cargo */}
        <div>
          <p className="text-white mx-6 mt-4 text-xl font-semibold">Top Cargo</p>
          <div className="flex">
             <p className="text-white mx-6 text-xs font-semibold">{summary?.topCargo?.name}</p>
          <p className="text-white mx-6 text-xs font-semibold">Trips: {summary?.topCargo?.trips}</p>
          </div>
         
        </div>

        {/* Top Destination */}
        <div>
          <p className="text-white mx-6 mt-4 text-xl font-semibold">Top Destination</p>
          <div className="flex">
            <p className="text-white mx-6 text-xs font-semibold mb-2">{summary?.topDestination?.name}</p>
          <p className="text-white mx-6 text-xs font-semibold">Trips: {summary?.topDestination?.trips}</p>
          </div>
          
        </div>
      </div>

      <div className="appendDown mb-6">
        {/* Top Driver */}
        <div>
          <p className="text-white mx-6 mt-4 text-lg font-semibold">Top Driver</p>
          <div className="grid grid-cols-3">
            <p className="text-white mx-6 text-xs">{summary?.topDriver?.name?.name}</p>
            <p className="text-white mx-6 text-xs">{summary?.topDriver?.trips} Trips</p>
            <p className="text-white mx-6 text-xs">{summary?.topDriver?.kmTravelled} km travelled</p>
          </div>
        </div>

        {/* Top Truck */}
        <div>
          <p className="text-white mx-6 mt-4 text-lg font-semibold">Top Truck</p>
          <div className="grid grid-cols-3">
            <p className="text-white mx-6 text-xs">{summary?.topTruck?.name?.name}</p>
            <p className="text-white mx-6 text-xs">{summary?.trips} Trips</p>
            <p className="text-white mx-6 text-xs">{summary?.topTruck?.kmTravelled} km travelled</p>
          </div>
        </div>
      </div>
    </div>

          </div>

     
        </div>
      </Layout>

     
    </div>
  );
}
