import React from "react";

export default function Modal({
  isOpen,
  toggleModal,
  type = "info", // Modal type (info, success, warning, error, saving)
  message = "This is a modal message",
  color = "blue", // Tailwind color (e.g., blue, green, red, yellow)
  onConfirm, // Function to call on confirm action
  onCancel, // Function to call on cancel action
}) {
  if (!isOpen) return null; // Only render when open

  // Modal header and button styles based on type
  const headerStyles = {
    info: "text-blue-700 dark:text-blue-400",
    success: "text-green-700 dark:text-green-400",
    warning: "text-yellow-700 dark:text-yellow-400",
    error: "text-red-700 dark:text-red-400",
    saving: "text-gray-700 dark:text-gray-400",
  };

  const bgStyles = {
    info: "bg-blue-100 ",
    success: "bg-green-100 ",
    warning: "bg-yellow-100 ",
    error: "bg-[#AC0000] ",
    saving: "bg-[#AC0000]",
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className={`relative rounded-lg shadow  ${bgStyles[type]}`}>
          {/* Modal header */}
          <div className={`flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 ${headerStyles[type]}`}>
            {/* <h3 className="text-xl font-semibold text-white ">Please wait</h3> */}
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
          {/* Modal body */}
          <div className="flex justify-center items-center flex-col p-4 md:p-5 text-center my-8">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400 text-white ">{message}</p>
            <div className="relative flex justify-center items-center mt-6">
                <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-yellow-300"></div>
                <img
                src="/images/logo.png"
                alt="Loading Logo"
                className="rounded-full h-22 w-28"
                />
            </div>
            </div>

          {/* Modal footer */}
          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
            {type !== "saving" && type !== "error" && onConfirm && (
              <button
                onClick={onConfirm}
                className={`text-white bg-${color}-700 hover:bg-${color}-800 focus:ring-4 focus:outline-none focus:ring-${color}-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-${color}-600 dark:hover:bg-${color}-700 dark:focus:ring-${color}-800`}
              >
                Confirm
              </button>
            )}
            {type === "saving" && onCancel && (
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
