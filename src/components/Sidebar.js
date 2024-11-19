// components/Sidebar.js

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const currentPath = usePathname();

  return (
    <div>
              <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={toggleSidebar}
      />
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
            src="/images/logo.png"
            alt="Logo"
            className="w-full max-w-[200px] mx-auto mb-4"
          />
        </div>

        {/* Sidebar Menu */}
        <ul className="space-y-2 font-medium">
  {/* Dashboard */}
  <li>
    <Link
      href="/"
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
    </Link>
  </li>

  {/* Employee Management */}
  <li>
    <Link
      href="/employees"

      className={`block px-4 py-2 rounded ${
        currentPath.startsWith("/employees")
          ? "flex items-center p-2 text-white rounded-lg border-2 border-white  dark:text-white hover:border-2 hover:border-gray-100 group" // Active styling
          : "flex items-center p-2 text-white rounded-lg border-2 border-[#AC0000]  dark:text-white hover:border-2 hover:border-gray-100 group"
      }`}
    >
     <Image
      src="/images/icons/staff.png" // Replace with your image path
      alt="Employee Icon"  // Alternative text for the image
      width={20} // Set the width of the image
      height={20} // Set the height of the image
      className="transition duration-75 group-hover:opacity-80" // Apply hover effect, for example, reduce opacity
    />
      <span className="ms-3">Employee Management</span>
    </Link>
  </li>

  {/* Truck Management */}
  <li>
    <a
      href="/trucks"
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
      href="/expenses"
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
      href="/journeys"
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
      href="/customs"
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
      href="/my_account"
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
    </div>
  );
}
