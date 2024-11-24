"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Manage() {
    
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
        </Layout>
        </div>
    )
}