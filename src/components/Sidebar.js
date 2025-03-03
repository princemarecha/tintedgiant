// components/Sidebar.js


import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [occupation, setOccupation] = useState("");

   useEffect(() => {
    const fetchOccupation = async () => {
      try {
        var email =  localStorage.getItem("email")
        const response = await fetch(`http://localhost:3000/api/employee/my_account/${email}`);
        if (response.ok) {
          const data = await response.json();
          setOccupation(data.occupation);
          localStorage.setItem("occupation", data.occupation);
        }
      } catch (error) {
        console.error("Failed to fetch occupation:", error);
      }
    };

    const storedOccupation = localStorage.getItem("occupation");
    if (!storedOccupation) {
      fetchOccupation();
    } else {
      setOccupation(storedOccupation);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/employee/logout", { method: "POST" });
  
      if (response.ok) {
        localStorage.removeItem("token"); // Optional: Remove localStorage token if stored
        localStorage.removeItem("occupation");
        localStorage.removeItem("email");
        window.location.href = "/auth/login"; // Redirect to login page
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
</button>

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
      {occupation== "Administrator" || occupation== "Accounting" || occupation== "Managing Director" ||  occupation== "Manager"?<li>
        <Link
          href="/"
          className={`block px-4 py-2 rounded ${
            currentPath.length ==1
              ? "flex items-center p-2 text-white rounded-lg border-2 border-white  dark:text-white hover:border-2 hover:border-gray-100 group" // Active styling
              : "flex items-center p-2 text-white rounded-lg border-2 border-[#AC0000]  dark:text-white hover:border-2 hover:border-gray-100 group"
          }`}
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
      </li>:""}

      {/* Employee Management */}
      {occupation== "Administrator" || occupation== "Managing Director" ||  occupation== "Manager"?<li>
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
      </li>:""}

      {/* Truck Management */}
      {occupation== "Administrator" || occupation== "Managing Director" ||  occupation== "Manager" || occupation== "Supervisor" ?<li>
        <Link
          href="/trucks"
          className={`block px-4 py-2 rounded ${
            currentPath.startsWith("/trucks")
              ? "flex items-center p-2 text-white rounded-lg border-2 border-white  dark:text-white hover:border-2 hover:border-gray-100 group" // Active styling
              : "flex items-center p-2 text-white rounded-lg border-2 border-[#AC0000]  dark:text-white hover:border-2 hover:border-gray-100 group"
          }`}
        >
        <Image
          src="/images/icons/truck.png" // Replace with your image path
          alt="Truck Icon"  // Alternative text for the image
          width={20} // Set the width of the image
          height={20} // Set the height of the image
          className="transition duration-75 group-hover:opacity-80" // Apply hover effect, for example, reduce opacity
        />
          <span className="ms-3">Truck Management</span>
        </Link>
      </li>:""}

      {/* Expenses Management */}
      <li>
        <Link
          href="/expenses"
          className={`block px-4 py-2 rounded ${
            currentPath.startsWith("/expenses")
              ? "flex items-center p-2 text-white rounded-lg border-2 border-white  dark:text-white hover:border-2 hover:border-gray-100 group" // Active styling
              : "flex items-center p-2 text-white rounded-lg border-2 border-[#AC0000]  dark:text-white hover:border-2 hover:border-gray-100 group"
          }`}
        >
        <Image
          src="/images/icons/expenses.png" // Replace with your image path
          alt="Expenses Icon"  // Alternative text for the image
          width={20} // Set the width of the image
          height={20} // Set the height of the image
          className="transition duration-75 group-hover:opacity-80" // Apply hover effect, for example, reduce opacity
        />
          <span className="ms-3">Expenses Management</span>
        </Link>
      </li>

      {/* Journey and Tracking */}
      {occupation== "Administrator" || occupation== "Driver" || occupation== "Managing Director" ||  occupation== "Manager" ||   occupation== "Supervisor"?<li>
        <Link
          href="/journeys"
          className={`block px-4 py-2 rounded ${
            currentPath.startsWith("/journeys")
              ? "flex items-center p-2 text-white rounded-lg border-2 border-white  dark:text-white hover:border-2 hover:border-gray-100 group" // Active styling
              : "flex items-center p-2 text-white rounded-lg border-2 border-[#AC0000]  dark:text-white hover:border-2 hover:border-gray-100 group"
          }`}
        >
        <Image
          src="/images/icons/journey.png" // Replace with your image path
          alt="Journey Icon"  // Alternative text for the image
          width={20} // Set the width of the image
          height={20} // Set the height of the image
          className="transition duration-75 group-hover:opacity-80" // Apply hover effect, for example, reduce opacity
        />
          <span className="ms-3">Journey and Tracking</span>
        </Link>
      </li>:""}

      {/* Customs Clearance */}
      {occupation== "Administrator" || occupation== "Accounting" || occupation== "Managing Director" ||  occupation== "Manager"?<li>
        <Link
          href="/customs"
          className={`block px-4 py-2 rounded ${
            currentPath.startsWith("/customs")
              ? "flex items-center p-2 text-white rounded-lg border-2 border-white  dark:text-white hover:border-2 hover:border-gray-100 group" // Active styling
              : "flex items-center p-2 text-white rounded-lg border-2 border-[#AC0000]  dark:text-white hover:border-2 hover:border-gray-100 group"
          }`}
        >
        <Image
          src="/images/icons/customs.png" // Replace with your image path
          alt="Customs Icon"  // Alternative text for the image
          width={20} // Set the width of the image
          height={20} // Set the height of the image
          className="transition duration-75 group-hover:opacity-80" // Apply hover effect, for example, reduce opacity
        />
          <span className="ms-3">Customs Clearance</span>
        </Link>
      </li>:""}

      {/* My Account */}
      <li>
        <Link
          href="/my_account"
          className={`block px-4 py-2 rounded ${
            currentPath.startsWith("/my_account")
              ? "flex items-center p-2 text-white rounded-lg border-2 border-white  dark:text-white hover:border-2 hover:border-gray-100 group" // Active styling
              : "flex items-center p-2 text-white rounded-lg border-2 border-[#AC0000]  dark:text-white hover:border-2 hover:border-gray-100 group"
          }`}
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
        </Link>
      </li>
    </ul>


    <div className="flex flex-col justify-end h-[15%] ">
  <div className="flex items-center">
  <button onClick={handleLogout} className="mr-3">Sign Out</button>
    <Image
      src="/images/icons/logout.png"
      alt="Account Icon"
      width={25}
      height={25}
      className="transition duration-75 group-hover:opacity-80"
    />
  </div>
</div>

      </div>

    </aside>

    </div>
  );
}
