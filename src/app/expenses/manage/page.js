"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Manage() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch expenses data
  const fetchExpenses = async () => {
    try {
      const response = await axios.get("/api/expense/manage");
      const { frameworks } = response.data;

      if (frameworks.length > 0) {
        const { regular, other } = frameworks[0];
        const allExpenses = [
          ...regular.map((item) => ({
            type: "Regular",
            date: "2024-11-21", // Sample date
            trip: "Trip #1234",
            driver: "John Doe",
            amount: "$200.00",
            expense: item,
          })),
          ...other.map((item) => ({
            type: "Other",
            date: "2024-11-22",
            trip: "Trip #1235",
            driver: "Jane Doe",
            amount: "$150.00",
            expense: item,
          })),
        ];
        setExpenses(allExpenses);
        setFilteredExpenses(allExpenses);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterExpenses(query, expenseType);
  };

  // Handle dropdown change
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setExpenseType(selectedType);
    filterExpenses(searchQuery, selectedType);
  };

  // Filter expenses based on search and dropdown
  const filterExpenses = (query, type) => {
    const filtered = expenses.filter(
      (expense) =>
        expense.expense.toLowerCase().includes(query) &&
        (type === "" || expense.type === type)
    );
    setFilteredExpenses(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Handle pagination
  const totalPages = Math.ceil(filteredExpenses.length / rowsPerPage);
  const currentRows = filteredExpenses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Add empty rows if necessary to fill up to rowsPerPage
  const rowsToRender = [
    ...currentRows,
    ...Array.from({ length: rowsPerPage - currentRows.length }).map(() => ({
      date: "",
      expense: "",
      type: "",
      trip: "",
      driver: "",
      amount: "",
    })),
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="bg-white h-screen relative">
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
              className="bg-[#AC0000] border-none placeholder-white text-white focus:outline-none focus:ring-0"
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
              className="transition duration-75 group-hover:opacity-80 sm:w-8 sm:h-8"
            />
          </div>
            <div></div>
          {/* Expense Type Dropdown */}
          <div className="flex flex-col col-span-8 md:col-span-3 justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-l">
            <select
              id="dropdown"
              className="w-full h-full bg-[#AC0000] text-white placeholder-white border-none rounded-l focus:outline-none focus:ring-0"
              onChange={handleTypeChange}
              value={expenseType}
            >
              <option value="" defaultValue>
                Expense Type
              </option>
              <option value="Regular">Regular</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto ">
        <table className="w-full text-left border-separate border-spacing-y-4 min-w-[800px] w-full">
        <thead className="text-[#AC0000] font-bold">
            <tr>
            <th>Date</th>
            <th>Expenses</th>
            <th>Type</th>
            <th>Trip</th>
            <th>Driver</th>
            <th>Amount</th>
            <th>Action</th>
            </tr>
        </thead>

        {/* Styled <hr /> */}
        <tbody>
           <tr>
                <td colSpan="7">
                <hr className="border-t border-[#AC0000] my-2" />
                </td>
            </tr>
        </tbody>
           

        <tbody className="text-[#AC0000] text-sm">
            {rowsToRender.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
                <td>{row.date || ""}</td>
                <td>{row.expense || ""}</td>
                <td>{row.type || ""}</td>
                <td>{row.trip || ""}</td>
                <td>{row.driver || ""}</td>
                <td>{row.amount || ""}</td>
                <td>{row.amount?
                <Image
                    src="/images/icons/eye.png"
                    alt="View Details"
                    width={20}
                    height={20}
                />:"-"}
                </td>
            </tr>
            ))}
        </tbody>
        </table>


        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`px-4 py-2 mx-1 ${
                currentPage === index + 1
                  ? "bg-[#AC0000] text-white"
                  : "bg-gray-200 text-[#AC0000]"
              } rounded`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </Layout>
    </div>
  );
}
