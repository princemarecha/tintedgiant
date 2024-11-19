"use client"

import Image from "next/image";
import { useState } from "react";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      {/* Sidebar */}
      <aside
  id="logo-sidebar"
  className={`fixed top-0 left-0 z-40 w-72 h-screen transition-transform ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  } sm:translate-x-0`}
  aria-label="Sidebar"
>
  <div className="h-full px-3 py-4 overflow-y-auto bg-[#AC0000] dark:bg-gray-800">
    {/* Close Button for Mobile */}
    <button
      onClick={toggleSidebar}
      className="absolute top-4 right-4 sm:hidden p-2 bg-gray-800 text-white rounded-full"
      aria-label="Close Sidebar"
    >
      <svg
        className="w-3 h-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <div className="w-full mb-4">
      <img
        src="/images/logo.png" // Replace with your logo's path
        alt="Logo"
        className="w-full max-w-[200px] mx-auto mb-4" // Adjust max-width as needed
      />
    </div>

    {/* Sidebar Menu */}
    <ul className="space-y-2 font-medium">
  {/* Dashboard */}
  <li>
    <a
      href="#"
      className="flex items-center p-2 text-white rounded-lg border-2 border-[#AC0000] dark:text-white hover:border-2 hover:border-gray-100 group"
    >
     <Image
      src="/images/icons/dashboard.png" // Replace with your image path
      alt="Dashboard Icon"  // Alternative text for the image
      width={20} // Set the width of the image
      height={20} // Set the height of the image
      className="transition duration-75 group-hover:opacity-80" // Apply hover effect, for example, reduce opacity
    />
      <span className="ms-3">Dashboard</span>
    </a>
  </li>

  {/* Employee Management */}
  <li>
    <a
      href="#"
      className="flex items-center p-2 text-white rounded-lg border-2 border-[#AC0000]  dark:text-white hover:border-2 hover:border-gray-100 group"
    >
     <Image
      src="/images/icons/staff.png" // Replace with your image path
      alt="Employee Icon"  // Alternative text for the image
      width={20} // Set the width of the image
      height={20} // Set the height of the image
      className="transition duration-75 group-hover:opacity-80" // Apply hover effect, for example, reduce opacity
    />
      <span className="ms-3">Employee Management</span>
    </a>
  </li>

  {/* Truck Management */}
  <li>
    <a
      href="#"
      className="flex items-center p-2 text-white rounded-lg border-2 border-[#AC0000]  dark:text-white hover:border-2 hover:border-gray-100 group"
    >
     <Image
      src="/images/icons/truck.png" // Replace with your image path
      alt="Truck Icon"  // Alternative text for the image
      width={20} // Set the width of the image
      height={20} // Set the height of the image
      className="transition duration-75 group-hover:opacity-80" // Apply hover effect, for example, reduce opacity
    />
      <span className="ms-3">Truck Management</span>
    </a>
  </li>

  {/* Expenses Management */}
  <li>
    <a
      href="#"
      className="flex items-center p-2 text-white rounded-lg border-2 border-[#AC0000] dark:text-white hover:border-2 hover:border-gray-100 group"
    >
     <Image
      src="/images/icons/expenses.png" // Replace with your image path
      alt="Expenses Icon"  // Alternative text for the image
      width={20} // Set the width of the image
      height={20} // Set the height of the image
      className="transition duration-75 group-hover:opacity-80" // Apply hover effect, for example, reduce opacity
    />
      <span className="ms-3">Expenses Management</span>
    </a>
  </li>

  {/* Journey and Tracking */}
  <li>
    <a
      href="#"
      className="flex items-center p-2 text-white rounded-lg border-2 border-[#AC0000]  dark:text-white hover:border-2 hover:border-gray-100 group"
    >
     <Image
      src="/images/icons/journey.png" // Replace with your image path
      alt="Journey Icon"  // Alternative text for the image
      width={20} // Set the width of the image
      height={20} // Set the height of the image
      className="transition duration-75 group-hover:opacity-80" // Apply hover effect, for example, reduce opacity
    />
      <span className="ms-3">Journey and Tracking</span>
    </a>
  </li>

  {/* Customs Clearance */}
  <li>
    <a
      href="#"
      className="flex items-center p-2 text-white rounded-lg border-2 border-[#AC0000]  dark:text-white hover:border-2 hover:border-gray-100 group"
    >
     <Image
      src="/images/icons/customs.png" // Replace with your image path
      alt="Customs Icon"  // Alternative text for the image
      width={20} // Set the width of the image
      height={20} // Set the height of the image
      className="transition duration-75 group-hover:opacity-80" // Apply hover effect, for example, reduce opacity
    />
      <span className="ms-3">Customs Clearance</span>
    </a>
  </li>

  {/* My Account */}
  <li>
    <a
      href="#"
      className="flex items-center p-2 text-white rounded-lg border-2 border-[#AC0000]  dark:text-white hover:border-2 hover:border-gray-100 group"
    >
     {/* Image Replacement */}
     <Image
      src="/images/icons/account.png" // Replace with your image path
      alt="Account Icon"  // Alternative text for the image
      width={20} // Set the width of the image
      height={20} // Set the height of the image
      className="transition duration-75 group-hover:opacity-80" // Apply hover effect, for example, reduce opacity
    />
      <span className="ms-3">My Account</span>
    </a>
  </li>
</ul>

  </div>
</aside>


      {/* Main Content */}
      <div className="p-4  sm:ml-72">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Grid Items */}
            {Array(9)
              .fill()
              .map((_, index) => (
                <div key={index} className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
                  <p className="text-2xl text-gray-400 dark:text-gray-500">
                    <svg
                      className="w-3.5 h-3.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 1v16M1 9h16"
                      />
                    </svg>
                  </p>
                </div>
              ))}
          </div>
          {/* Additional content can go here */}
        </div>
      </div>
    </>
  );
}
