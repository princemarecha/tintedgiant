// pages/employee.js
"use client";

import Layout from "@/components/Layout";

export default function Employee() {
  return (
    <div className="bg-white">
      <Layout>
        <div>
          <div className="">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Grid Items */}
                {Array(6)
                  .fill()
                  .map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800"
                    >
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
              {/* Additional content for employee page can go here */}
              <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mt-4">
                Employee Management
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Manage account records and tasks here.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
