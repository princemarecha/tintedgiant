"use client";

import Layout from "@/components/Layout";
import React, { useState, useEffect, use } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Clearance({ params }) {
  const resolvedParams = use(params); // Unwrapping the promise
  const reference = resolvedParams.reference; // Accessing the reference property

  const [clearance, setClearance] = useState(null); // Clearance data
  const [error, setError] = useState(null); // Error message
  const [isLoading, setIsLoading] = useState(true);

  const router  = useRouter();

  // Fetch clearance details
  const fetchClearance = async (reference) => {
    try {
      const response = await axios.get(`/api/customs/${reference}`);
      setClearance(response.data);
      setError(null); // Clear previous errors
    } catch (err) {
      console.error("Error fetching clearance:", err);
      setError("Failed to load clearance details. Please try again.");
    }
  };

  // Effect to fetch clearance details based on the resolved reference
  useEffect(() => {
    if (reference) {
      fetchClearance(reference);
    }
    setIsLoading(false)
  }, [reference]);

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

  const handleDeleteCustom = async () => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this clearance?");
      if (!confirmDelete) return;
  
      await axios.delete(`/api/customs/${reference}`);
      alert("clearance deleted successfully!");
      // Optionally, redirect to another page or refresh the list
      router.push("/customs/manage");
    } catch (error) {
      console.error("Error deleting clearance:", error);
      alert("Failed to delete clearance. Please try again.");
    }
  };
  

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
        {/* Page Header */}
        <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">
          Clearance Details
        </p>
        <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
          <span className="hover:underline">Home </span> <span>&gt;</span>{" "}
          <Link href={"/customs"} passHref>
            <span className="hover:underline">Customs Clearance</span>
          </Link>{" "}
          <span>&gt;</span>
          <Link href={"/customs/manage"} passHref>
            <span className="hover:underline"> Manage Clearance </span>
          </Link>
          <span>&gt;</span>
          <span>{clearance?.reference || "N/A"}</span>
        </p>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>} 

        {/* Clearance Details */}
        <div className="p-4 text-black grid grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-2 mb-4 text-sm">
          {[
            { label: "Date", value: clearance?.date ? formatDateTime(clearance.date) : "N/A" },
            { label: "Reference", value: clearance?.reference || "N/A" },
            { label: "Transporter", value: clearance?.transporter || "N/A" },
            { label: "Exporter", value: clearance?.exporter || "N/A" },
            { label: "Importer", value: clearance?.importer || "N/A" },
            { label: "Horse Plate", value: clearance?.horse_plate || "N/A" },
            { label: "Trailer Plate", value: clearance?.trailer_plate || "N/A" },
            { label: "BOE", value: clearance?.BOE || "N/A" },
            { label: "Invoice", value: clearance?.invoice || "N/A" },
            { label: "Duty", value: clearance?.duty_currency + clearance?.duty || "N/A" },
            { label: "Cargo", value: clearance?.cargo || "N/A" },
            { label: "Cleared", value: clearance?.status == "Cleared" ? "Yes" : "No" },
          ].map((item, index) => (
            <div key={index} className="grid grid-cols-1">
              <span className="font-bold text-[#AC0000]">{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}

        
        </div>
        {/* Attached Media */}
        <div>
  <p className="font-bold text-[#AC0000] text-sm mr-10">Attached Media</p>
  <div className="col-span-full grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {clearance?.attachments.map((src, index) => (
                <div key={index} className="relative h-28 md:h-32 xl:h-44 cursor-pointer group mt-1 border"> 
                  <Link href= {`${src.url}`} target="_blank" rel="noopener noreferrer">
                    <Image
                    src={src.url}
                    alt={`Truck Thumbnail ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover rounded-xl"
                    />
                    </Link>
                    
                </div>
                ))}
        
    
            </div>
</div>

        {/* Footer Actions */}
        <div className="flex justify-between mt-6 text-sm">
        <p
            className="font-bold text-[#AC0000] text-sm mr-10 cursor-pointer hover:underline"
            onClick={handleDeleteCustom}
          >
            Delete Clearance
          </p>

          <button
            onClick={() => alert("Button clicked!")}
            className="px-4 py-2 rounded text-white bg-[#AC0000] hover:bg-gray-600 focus:outline-none focus:ring-0 transition duration-150"
          >
            <p className="flex justify-between">
              <span>Print Clearance</span>
              <span>
                <Image
                  src="/images/icons/print.png"
                  alt="Print Icon"
                  width={20}
                  height={20}
                  className="transition duration-75 group-hover:opacity-80 ml-2 sm:w-6 sm:h-6"
                />
              </span>
            </p>
          </button>
        </div>
        <div className="flex justify-end mt-6 text-sm">

          <button
            
            className="px-4 py-2 rounded text-white bg-[#AC0000] hover:bg-gray-600 focus:outline-none focus:ring-0 transition duration-150"
          >
            <Link href={`/customs/${reference}/edit`}>
            <p className="flex justify-between">
              <span>Edit Clearance</span>
              <span>
                <Image
                  src="/images/icons/edit.png"
                  alt="Print Icon"
                  width={20}
                  height={20}
                  className="transition duration-75 group-hover:opacity-80 ml-2 sm:w-6 sm:h-6"
                />
              </span>
            </p>
            </Link>
          </button>
        </div>
      </Layout>
    </div>
  );
}
