"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

export default function ViewEmployees() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState(""); // State for selected role
  const itemsPerPage = 9; // Items to show per page
  const [validPhotoUrls, setValidPhotoUrls] = useState([]);

  // Fetch employee data
  const fetchEmployees = async (page = 1, search = "", role = "") => {
    try {
      const response = await axios.get(`/api/employee`, {
        params: {
          page,
          limit: itemsPerPage,
          search,
          role, // Pass the selected role to the backend
        },
      });
      setEmployees(response.data.employees);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees(currentPage, searchTerm, role);
  }, [currentPage, searchTerm, role]); // Fetch data when search or role changes
  
  useEffect(() => {
    const checkPhotos = async () => {
      const updatedUrls = await Promise.all(
        employees.map(async (employee) => {
          const isValid = await isValidUrl(employee.photo);
          return isValid ? employee.photo : "irxdkhgi7ehjhtbeh1zk";
        })
      );
      setValidPhotoUrls(updatedUrls);
    };

    checkPhotos();
  }, [employees]);

  const isValidUrl = async (url) => {
    try {
      const response = await axios.head(url);
      response.status ==200? console.log("got image"): console.log("failed to get image")
      return response.status === 200;
    } catch {
      return false;
    }
  };

  // Handle Search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset to the first page for new search
  };

  // Handle Role Change
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setCurrentPage(1); // Reset to the first page for new role selection
  };

  // Pagination Controls
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getLink = (id)=>{
    let link = `/employees/${id}`
    return link
  }

  return (
    <div className="bg-white h-screen relative">
      <Layout>
        <div>
          <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">Employees</p>

          <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8"><span>Home </span> <span>&gt;</span> <span>Employee Management</span> <span>&gt;</span><span>Employees </span></p>

          {/* Search and Filter Section */}
          <div className="grid grid-cols-12 mb-4">
            {/* Search Bar */}
            <div className="flex flex-col col-span-10 md:col-span-7 justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-l">
              <input
                type="text"
                placeholder="Search Employees....."
                className="bg-[#AC0000] border-none placeholder-white text-white focus:outline-none focus:ring-0 text-xs md:text-md lg:text-lg"
                onKeyUp={handleSearch}
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

            {/* Role Dropdown */}
            <div className="flex flex-col col-span-12 md:col-span-4 lg:col-span-3 md:ml-2 lg:ml-0 justify-center h-12 font-bold bg-[#AC0000] mb-4 rounded-l ">
              <select
                id="dropdown"
                className="w-full h-full bg-[#AC0000] text-white placeholder-white border-none rounded-l focus:outline-none focus:ring-0 text-xs md:text-md lg:text-lg"
                onChange={handleRoleChange} // Update role on change
                value={role}
              >
                <option value=""  defaultValue>
                  Select Role...
                </option>
                <option value="Driver">Driver</option>
                <option value="Accountant">Accountant</option>
                <option value="Manager">Manager</option>
                <option value="Administrator">Administrator</option>
                <option value="Software Engineer">Software Engineer</option>
              </select>
            </div>
          </div>

          {/* Employees Section */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 font-bold md:p-2">
            {employees.map((employee, index) => (
              <div id="emp" key={index}>
                <Link href= {getLink(employee._id)} passHref>
                <div className="grid grid-cols-4 flex flex-col items-center h-20 md:h-24 xl:h-32 2xl:h-40 rounded bg-white border shadow-2xl">
                  <div className="col-span-1 flex items-center  justify-center font-bold">
                  <CldImage
                      src={validPhotoUrls[index] || "irxdkhgi7ehjhtbeh1zk"}
                      alt={employee.name || "Employee Photo"}
                      width={200}
                      height={200}
                      className="rounded-full object-cover md:w-12 lg:w-16 2xl:w-24 2xl:h-24"
                    />
                  </div>
                  <div className="col-span-3 text-[#5F5F5F]">
                    <p className="text-xs xl:text-lg 2xl:text-xl ml-1">{employee.name}</p>
                    <p className="text-xs xl:text-lg 2xl:text-xl mt-1 2xl:mt-3 ml-1">{employee.phone}</p>
                    <div className="flex justify-between mt-1 2xl:mt-3 ml-1">
                      <div className="flex">
                        <Image
                          src="/images/icons/driver.png"
                          alt="Role Icon"
                          width={30}
                          height={30}
                          className="transition duration-75 group-hover:opacity-80 my-auto w-4 h-4 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8"
                        />
                        <span className="text-xs xl:text-lg 2xl:text-xl my-auto ml-2">{employee.occupation}</span>
                      </div>
                      <div>
                        <Image
                          src="/images/icons/eye.png"
                          alt="View Icon"
                          width={30}
                          height={30}
                          className="mr-4 hidden md:block transition duration-75 group-hover:opacity-80 w-4 h-4 xl:w-8 xl:h-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Layout>

      {/* Pagination Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 flex justify-center sm:justify-end text-xs md:text-md lg:text-lg">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-2 font-bold text-white rounded ${currentPage === 1 ? "bg-gray-400" : "bg-[#AC0000] hover:bg-[#D32F2F]"}`}
        >
          Previous
        </button>
        <span className="mx-4 my-auto font-semibold text-[#AC0000]">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-2 font-bold text-white rounded ${currentPage === totalPages ? "bg-gray-400" : "bg-[#AC0000] hover:bg-[#D32F2F]"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
