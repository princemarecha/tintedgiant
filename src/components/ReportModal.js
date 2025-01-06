import React, { useState } from "react";

export default function ReportModal({
  isOpen,
  toggleModal,
  type = "info",
  message = "This is a modal message",
  color = "blue",
  onConfirm, // Function to call on confirm action
  onCancel, // Function to call on cancel action
}) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const isDateValid = () => {
    if (!fromDate || !toDate) return false;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return from <= to; // Ensure fromDate is earlier or equal to toDate
  };

  // Handle Confirm
  const handleConfirm = async () => {
    if (!isDateValid()) return;

    setIsLoading(true);
    try {
      const link = document.createElement("a");
      link.href = `/api/customs/report?from=${fromDate}&to=${toDate}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error generating the report:", error);
      setIsLoading(false);
    }
  };

  // Modal header and button styles based on type
  const headerStyles = {
    info: "text-blue-700 dark:text-blue-400",
    success: "text-green-700 dark:text-green-400",
    warning: "text-yellow-700 dark:text-yellow-400",
    error: "text-red-700 dark:text-red-400",
    saving: "text-gray-700 dark:text-gray-400",
    delete: "text-gray-700 dark:text-gray-400",
  };

  const bgStyles = {
    info: "bg-[#AC0000]",
    success: "bg-[#AC0000]",
    warning: "bg-[#AC0000]",
    error: "bg-[#AC0000]",
    saving: "bg-[#AC0000]",
    delete: "bg-[#AC0000]",
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className={`relative rounded-lg shadow ${bgStyles[type]}`}>
          {/* Modal Header */}
          <div
            className={`flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 ${headerStyles[type]}`}
          >
            <h3 className="text-white font-bold text-xl">Report Range</h3>
            <button
              onClick={toggleModal}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex flex-col justify-center items-center p-4 md:p-5 text-center my-8">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 text-white">
              {message}
            </p>
            {/* Date Range Input */}
            <div className="flex flex-col space-y-4 mt-6 w-full">
              <div>
                <label className="block text-white text-sm font-medium">
                  From
                </label>
                <input
                  type="date"
                  className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium">
                  To
                </label>
                <input
                  type="date"
                  className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              {!isDateValid() && fromDate && toDate && (
                <p className="text-white text-sm">
                  "From" date must be earlier than or equal to "To" date.
                </p>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              onClick={handleConfirm}
              disabled={!isDateValid() || isLoading}
              className={`text-white ${
                isDateValid()
                  ? `bg-${color}-700 hover:bg-${color}-800 focus:ring-4 focus:outline-none focus:ring-${color}-300`
                  : "bg-gray-400 cursor-not-allowed"
              } font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-${color}-600 dark:hover:bg-${color}-700 dark:focus:ring-${color}-800`}
            >
              {isLoading ? "Generating..." : "Confirm"}
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="py-2.5 px-5 ms-3 text-sm font-medium text-[#AC0000] focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
