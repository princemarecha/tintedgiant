"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Manage() {
  const [customs, setCustoms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [clearanceType, setClearanceType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const rowsPerPage = 10;

  // Fetch customs data with filters, pagination, and sorting
  const fetchCustoms = async () => {
    try {
      const response = await axios.get("/api/customs", {
        params: {
          search: searchQuery,
          filter: clearanceType,
          page: currentPage,
          limit: rowsPerPage,
        },
      });

      const { data, pagination } = response.data;
      setCustoms(data || []);
      setTotalPages(pagination?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching customs data:", error);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle dropdown change
  const handleTypeChange = (e) => {
    setClearanceType(e.target.value);
    setCurrentPage(1); // Reset to first page on new filter
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fetch data when filters or pagination changes
  useEffect(() => {
    fetchCustoms();
  }, [searchQuery, clearanceType, currentPage]);

  // Add empty rows if necessary to fill up to rowsPerPage
  const rowsToRender = [
    ...customs,
    ...Array.from({ length: rowsPerPage - customs.length }).map(() => ({
      date: "",
      reference: "",
      transporter: "",
      exporter: "",
      importer: "",
      cargo: "",
      clearanceType: "",
    })),
  ];

  return (
    <div className="bg-white h-screen relative">
      <Layout>
        <div>
          <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">
            Customs Management
          </p>
          <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
            <span>Home </span> <span>&gt;</span>
            <Link href="/customs" passHref>
              <span>Customs Management</span>
            </Link>{" "}
            <span>&gt;</span>
            <span> Manage Customs </span>
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="grid grid-cols-12 mb-4">
          {/* Search Bar */}
          <div className="flex flex-col col-span-10 md:col-span-7 justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-l">
            <input
              type="text"
              placeholder="Search Customs..."
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

          {/* Clearance Type Dropdown */}
          <div className="flex flex-col col-span-8 md:col-span-3 justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-l">
            <select
              id="dropdown"
              className="w-full h-full bg-[#AC0000] text-white placeholder-white border-none rounded-l focus:outline-none focus:ring-0"
              onChange={handleTypeChange}
              value={clearanceType}
            >
              <option value="">All</option>
              <option value="Cleared">Cleared</option>
              <option value="Not Cleared">Not Cleared</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-4 min-w-[800px]">
            <thead className="text-[#AC0000] font-bold">
              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Transporter</th>
                <th>Exporter</th>
                <th>Importer</th>
                <th>Commodity</th>
                <th>Clearance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowsToRender.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100 text-black">
                  <td>{row.date || ""}</td>
                  <td>{row.reference || ""}</td>
                  <td>{row.transporter || ""}</td>
                  <td>{row.exporter || ""}</td>
                  <td>{row.importer || ""}</td>
                  <td>{row.cargo || ""}</td>
                  <td className="flex justify-center">
                    {row.date?row.cleared ? (
                      <span className="bg-[#126928] p-1 w-3/5 text-center text-white rounded">
                        Cleared
                      </span>
                    ) : (
                      <span className="bg-gray-500 p-1 w-3/5 text-center text-white rounded">
                      Clear
                    </span>
                    ):""}
                  </td>
                  <td className="text-center">
                    {row.date ? (
                      <Link href={`/customs/${row.reference}`}>
                      <Image
                        src="/images/icons/eye.png"
                        alt="View Details"
                        width={20}
                        height={20}
                        className="cursor-pointer mx-auto"
                      />
                      </Link>
                    ) : (
                      "-"
                    )}
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
