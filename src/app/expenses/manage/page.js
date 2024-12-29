"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Manage() {
  const [expenses, setExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const rowsPerPage = 9; // Matches backend limit
  const [totalPages, setTotalPages] = useState(0);

  // Fetch expenses data
  const fetchExpenses = async (page = 1, search = "", type = "") => {
    try {
      const response = await axios.get("/api/expense", {
        params: { page, limit: rowsPerPage, search, type },
      });

      const data = response.data;
      setExpenses(data.expenses);
      setTotalPages(data.totalPages); // Total pages from backend
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1
    fetchExpenses(1, query, expenseType);
  };

  // Handle dropdown change for expense type
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setExpenseType(selectedType);
    setCurrentPage(1); // Reset to page 1
    fetchExpenses(1, searchQuery, selectedType);
  };

  // Handle page change for pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchExpenses(page, searchQuery, expenseType);
  };

  useEffect(() => {
    fetchExpenses(currentPage, searchQuery, expenseType); // Initial fetch
    setIsLoading(false);
  }, []);

  // Add empty rows if necessary to fill up to rowsPerPage
  const rowsToRender = [
    ...expenses,
    ...Array.from({ length: rowsPerPage - expenses.length }).map(() => ({
      date: "",
      expense: "",
      type: "",
      trip: "",
      driver: "",
      amount: "",
    })),
  ];

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
            Expenses Management
          </p>
          <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
            <span>Home </span> <span>&gt;</span>
            <Link href="/expenses" passHref>
              <span>Expenses Management</span>
            </Link>{" "}
            <span>&gt;</span>
            <span> Manage Expenses </span>
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="grid grid-cols-12 mb-4">
          {/* Search Bar */}
          <div className="flex flex-col col-span-10 md:col-span-7 justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-l">
            <input
              type="text"
              placeholder="Search Expenses..."
              className="bg-[#AC0000] border-none placeholder-white text-white focus:outline-none focus:ring-0 text-xs md:text-md lg:text-lg"
              value={searchQuery}
              onChange={handleSearch} 
            />
          </div>
          <div className="col-span-2 md:col-span-1 flex items-center justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-r">
            <Image
              src="/images/icons/search.png"
              alt="Search Icon"
              width={30}
              height={30}
              className="transition duration-75 group-hover:opacity-80 w-4 lg:w-6 xl:w-8"
            />
          </div>

          <div className="hidden lg:block"></div>
          {/* Expense Type Dropdown */}
          <div className="flex flex-col col-span-12 md:col-span-4 lg:col-span-3 md:ml-2 lg:ml-0 justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-l">
            <select
              id="dropdown"
              className="w-full h-full bg-[#AC0000] text-white placeholder-white border-none rounded-l focus:outline-none focus:ring-0 text-xs md:text-md lg:text-lg"
              onChange={handleTypeChange}
              value={expenseType}
            >
              <option value="" defaultValue>
                Expense Type
              </option>
              <option value="Trip">Trip</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-4 min-w-[800px] w-full">
            <thead className="bg-[#AC0000] font-bold text-sm">
              <tr>
                <th>Date</th>
                <th>Expenses</th>
                <th>Type</th>
                <th>Trip</th>
                <th>Amt (USD)</th>
                <th>Amt (ZAR)</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody className="text-[#AC0000] text-xs">
              {rowsToRender.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100 bg-gray-200">
                  <td>{row.date || ""}</td>
                  <td>{row.expenses ? row.expenses.length : ""}</td>
                  <td>{row.type || ""}</td>
                  <td>{row.trip ? row.trip.route : ""}</td>
                  <td>
                    {row.total_amount
                      ? `$${row.total_amount.find((item) => item.currency === "USD")?.amount || "0.00"}`
                      : ""}
                  </td>
                  <td>
                    {row.total_amount
                      ? `ZAR${row.total_amount.find((item) => item.currency === "ZAR")?.amount || "0.00"}`
                      : ""}
                  </td>
                  <td className="text-center">
                    {row.date ? (
                      <Link href={`/expenses/${row._id}`} passHref>
                        <Image
                          src="/images/icons/eye.png"
                          alt="View Details"
                          width={20}
                          height={20}
                          className="mx-auto"
                        />
                      </Link>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-1 ${
              currentPage === 1 ? "bg-gray-400" : "bg-[#AC0000] text-white"
            } rounded`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`px-4 py-2 mx-1 ${
                currentPage === index + 1 ? "bg-[#AC0000] text-white" : "bg-gray-200 text-[#AC0000]"
              } rounded`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 mx-1 ${
              currentPage === totalPages ? "bg-gray-400" : "bg-[#AC0000] text-white"
            } rounded`}
          >
            Next
          </button>
        </div>
      </Layout>
    </div>
  );
}
