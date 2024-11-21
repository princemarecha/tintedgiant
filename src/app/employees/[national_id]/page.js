"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

async function getNationalID(params) {
  // Simulate fetching or processing to get the national ID
  const national_id = (await params).national_id
  return national_id
}



async function fetchEmployeeData(nationalID) {
  // Fetch employee data from the endpoint

  const response = await fetch(`/api/employee/${nationalID}`);
  if (!response.ok) {
    throw new Error("Failed to fetch employee data"+nationalID);
  }
  return response.json();
}

export default function MyComponent({ params }) {
  const router = useRouter();
  const [nationalID, setNationalID] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    // Fetch the national ID and set the state
    async function fetchNationalID() {
      try {
        const id = await getNationalID(params);
        setNationalID(id);
      } catch (err) {
        setError("Failed to fetch national ID");
      }
    }

    fetchNationalID();
  }, [params]); // Dependency array ensures it runs when `params` change

  useEffect(() => {
    // Fetch employee data when nationalID is available
    if (nationalID) {
      async function fetchEmployee() {
        try {
          const data = await fetchEmployeeData(nationalID);
          setEmployeeData(data);
        } catch (err) {
          setError("Failed to fetch employee data");
        }
      }

      fetchEmployee();
    }
  }, [nationalID]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const deleteEmployee = async () => {
    console.log("National Id is this "+ nationalID)
    if (!nationalID) return;
  
    try {
      const response = await axios.delete(`/api/employee/${nationalID}`);
      if (response.status === 200) {
        // Navigate to the employees list on successful deletion
        router.push("/employees/all");
      } else {
        throw new Error("Failed to delete employee");
      }
    } catch (err) {
      console.error(err);
      // Show failure modal
      setIsModalOpen(true);
    }
  };

  return (
    <div className="bg-white h-screen relative">
      <Layout>
      <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">Employees</p>

<p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8"><span>Home </span> <span>&gt;</span> <span>Employee Management</span> <span>&gt;</span><span>Employees </span><span>&gt;</span><span>{nationalID}</span></p>
        <div className="grid  grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-x-2 gap-y-2">
        <div className="col-span-3  md:col-span-2 lg:col-span-4 xl:col-span-4 flex justify-center items-center bg-gray-100">
          <Image
            src="/images/employee.jpg"
            alt="Search Icon"
            width={400}
            height={400}
            className="transition duration-75 group-hover:opacity-80 sm:w-100 sm:h-100 rounded-xl object-contain"
          />
        </div>

            
            {employeeData ? (
              <div className="col-span-3  text-xs 2xl:text-lg 2xl:gap-y-1 2xl:py-2 md:col-span-2 lg:col-span-8 xl:col-span-5 p-6 lg:p-6 xl:p-8 text-black shadow-xl rounded border border-gray-100 grid grid-cols-3">
                <div className="font-bold" >Name</div> <div className="col-span-2">{employeeData.name || "Not provided"}</div> 
                <div className="font-bold" >Age </div> <div className="col-span-2">{employeeData.age || "Not provided"}</div> 
                <div className="font-bold" >Phone</div> <div className="col-span-2">{employeeData.phoneNumber || "Not provided"}</div> 
                <div className="font-bold" >Gender </div> <div className="col-span-2">{employeeData.gender || "Not provided"}</div> 
                <div className="font-bold" >Nationality</div> <div className="col-span-2">{employeeData.nationality || "Not provided"}</div> 
                <div className="font-bold" >National ID </div> <div className="col-span-2">{employeeData.nationalID || "Not provided"}</div> 
                <div className="font-bold" >Passport Number</div> <div className="col-span-2">{employeeData.passportNumber || "Not provided"}</div> 
                <div className="font-bold" >Occupation</div> <div className="col-span-2">{employeeData.occupation || "Not provided"}</div> 
                <div className="font-bold" >Km Travelled</div> <div className="col-span-2">{employeeData.kmtravelled || "Not provided"} km</div> 
                <div className="font-bold" >Avg Km </div> <div className="col-span-2">{employeeData.avg_km || "Not provided"} km</div> 
                <div className="font-bold" >Journeys</div> <div className="col-span-2">{employeeData.journeys || "Not provided"} </div> 
                <div className="font-bold" >Occupation</div> <div className="col-span-2">{employeeData.occupation || "Not provided"}</div> 
                <div className="font-bold" >Operational Costs</div> <div className="col-span-2">${employeeData.opCosts || "Not provided"}</div> 
                <div className="font-bold" >Avg Op Cost</div> <div className="col-span-2">${employeeData.avg_op_costs || "Not provided"}</div> 
              </div>
            ) : (
              nationalID && <div>Loading employee data...</div>
            )}
            {employeeData ? (
              <div className="col-span-3 md:col-span-2 lg:col-span-5 xl:col-span-3  py-4  text-black shadow-xl rounded bg-[#AC0000] ">
                <p className="xl:text-lg mx-6 font-black text-white 2xl:text-2xl">Current Journey</p> 
                <hr className="my-2 2xl:my-4 border-white" /> {/* Horizontal line */}
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-black text-white">From</p> 
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-medium text-white mb-1">Harare, Zimbabwe</p> 
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-black text-white">To</p> 
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-medium text-white mb-1">Pretoria, South Africa</p> 
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-black text-white">Truck</p> 
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-medium text-[#AC0000] bg-white text-center rounded my-1">Toyota Streamliner</p> 

                <hr className="my-2 2xl:my-4 border-white" /> {/* Horizontal line */}
                <div className="text-sm 2xl:text-lg grid grid-cols-4 mx-6 text-white gap-y-2">
                <div className="font-bold col-span-2" >Departure</div> <div className="col-span-2">21/11/24</div> 
                <div className="font-bold col-span-2" >Arrival(Est) </div> <div className="col-span-2">23/11/24</div> 
                <div className="font-bold col-span-2" >Distance</div> <div className="col-span-2">243 km</div> 
                <div className="font-bold col-span-2" >Estimate Cost </div> <div className="col-span-2">$670.20</div> 
                </div>

              </div>
            ) : (
              nationalID && <div>Loading employee data...</div>
            )}
        </div>
        <div className="my-4 flex justify-between text-sm 2xl:text-lg ">
          <button
                onClick={() => alert("Button clicked!")}
                className="px-4 py-2 rounded text-white bg-[#AC0000] hover:bg-gray-600 focus:outline-none focus:ring-0  transition duration-150"
              >
                <p className="flex justify-between"><span>Upload Image</span><span>
                <Image
                src="/images/icons/camera.png"
                alt="Search Icon"
                width={20}
                height={20}
                className="transition duration-75 group-hover:opacity-80 ml-2 sm:w-6 sm:h-6"
              />
                  </span>
                  </p>
          </button>

          <button
                onClick={() => alert("Button clicked!")}
                className="px-4 py-2 rounded text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-0  transition duration-150 "
              >
                <p className="flex justify-between"><span>Edit</span><span>
                <Image
                src="/images/icons/edit.png"
                alt="Search Icon"
                width={20}
                height={20}
                className="transition duration-75 group-hover:opacity-80 ml-2 sm:w-6 sm:h-6"
              />
                  </span>
                  </p>
          </button>

        </div>
        <div className="my-4 flex justify-end text-sm 2xl:text-lg">
        <button
            onClick={deleteEmployee}
            className="px-4 py-2 rounded text-white bg-[#AC0000] hover:bg-gray-600 focus:outline-none focus:ring-0  transition duration-150"
          >
            <p className="flex justify-between">
              <span>Delete Employee</span>
              <span>
                <Image
                  src="/images/icons/delete.png"
                  alt="Delete Icon"
                  width={20}
                  height={20}
                  className="transition duration-75 group-hover:opacity-80 ml-2 sm:w-6 sm:h-6"
                />
              </span>
            </p>
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded p-6 text-center shadow-lg">
              <p className="text-lg font-bold text-[#AC0000] mb-4">Failed to delete Employee</p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
}
