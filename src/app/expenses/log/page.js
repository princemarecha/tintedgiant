"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";

export default function Manage() {
  const [rows, setRows] = useState([]);
  const [expenseOptions, setExpenseOptions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  // Currency symbol map
  const currencySymbols = {
    USD: "$",
    ZAR: "R",
    PUL: "P",
    ZWD: "Z$",
    BWP: "P",
    ZMW: "ZK",
    MWK: "MK",
    LSL: "M",
    NAD: "$",
    SZL: "E",
  };

  // Fetch expenses for dropdown
  const fetchExpenses = async () => {
    try {
      const response = await axios.get("/api/expense/manage");
      const { frameworks } = response.data;

      if (frameworks.length > 0) {
        const { regular, other } = frameworks[0];

        // Map over the regular and other arrays and append the category name to each expense item
        const allOptions = [
          ...regular.map((expense) => `${expense} [Regular]`),
          ...other.map((expense) => `${expense} [Other]`),
        ];

        // Set the expense options state
        setExpenseOptions(allOptions);
      }
    } catch (error) {
      console.error("Error fetching expense options:", error);
    }
  };

  // Add a new row
  const addRow = () => {
    if (rows.length >= 30) {
      alert("You can only add a maximum of 30 expenses.");
      return;
    }
  
    // Check if the last row has both 'amount' and 'expense' fields filled
    const lastRow = rows[rows.length - 1];
    if (lastRow && (!lastRow.amount || !lastRow.expense)) {
      alert("Please fill out the Expense and Amount fields for the previous row before adding a new one.");
      return;
    }
  
    setRows([...rows, { expense: "", amount: "", currency: "USD", file: null }]);
  };
  
  
  const currencyOptions = [
    "USD",
    "ZAR",
    "PUL",
    "ZWD",
    "BWP",
    "ZMW",
    "MWK",
    "LSL",
    "NAD",
    "SZL",
  ];

  // Handle dropdown change for expense
  const handleExpenseChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].expense = value;
    setRows(updatedRows);
  };

  const deleteRow = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
  };
  

  // Format the amount with the correct currency symbol
  const formatCurrency = (amount, currency) => {
    const parsedAmount = parseFloat(amount);

    // Check if the parsedAmount is a valid number
    if (!isNaN(parsedAmount)) {
      const currencySymbol = currencySymbols[currency] || ""; // Use the symbol from the map
      return `${currencySymbol}${parsedAmount.toFixed(2)}`;
    }

    return ""; // Return an empty string if the value is invalid
  };

  // Handle amount change
  const handleAmountChange = (index, value) => {
    // Allow numeric input including decimal point for cents
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Allow one decimal point and ensure that a valid number is entered
    if (!isNaN(numericValue) && numericValue.split('.').length <= 2) {
      const updatedRows = [...rows];
      updatedRows[index].amount = numericValue;
      setRows(updatedRows);
    }
  };

// Handle amount formatting when input loses focus or when currency changes
// const handleAmountBlur = (index) => {
//   const updatedRows = [...rows];
//   const amount = updatedRows[index].amount;

//   // Only format if the amount is not empty and is a valid number
//   if (amount && !isNaN(parseFloat(amount))) {
//     updatedRows[index].amount = formatCurrency(amount, updatedRows[index].currency);
//   } else {
//     updatedRows[index].amount = ""; // Keep the field empty if the value is invalid or empty
//   }

//   setRows(updatedRows);
// };

const handleCurrencyChange = (index, value) => {
    const updatedRows = [...rows];
    
    // Update the currency
    updatedRows[index].currency = value;
    
    // Reset the amount field when the currency changes
    updatedRows[index].amount = ""; 
  
    setRows(updatedRows);
  };
  
  const handleAmountBlur = (index) => {
    const updatedRows = [...rows];
    const amount = updatedRows[index].amount;
  
    // Only format if the amount is not empty and is a valid number
    if (amount && !isNaN(parseFloat(amount))) {
      updatedRows[index].amount = formatCurrency(amount, updatedRows[index].currency);
    }
  
    setRows(updatedRows);
  };
  

  // Handle file upload
  const handleFileChange = (index, file) => {
    const updatedRows = [...rows];
    updatedRows[index].file = file;
    setRows(updatedRows);

    // Mock file upload
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("/api/upload", formData)
      .then(() => alert("File uploaded successfully"))
      .catch((error) => console.error("Error uploading file:", error));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="bg-white h-screen relative">
      <Layout>
        <div>
          <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">
            Log Expenses
          </p>
          <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
            <span>Home </span> <span>&gt;</span>{" "}
            <Link href="/expenses" passHref>
              <span>Expenses Management</span>
            </Link>{" "}
            <span>&gt;</span>
            <span> Add Expenses </span>
          </p>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="text-[#AC0000] font-bold border-b border-[#AC0000]">
              <tr>
                <th>Expense</th>  
                <th>Currency</th> 
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-[#AC0000] text-xs lg:text-sm">
              {rows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  {/* Expense Dropdown */}
                  <td>
                    <select
                      value={row.expense}
                      onChange={(e) => handleExpenseChange(index, e.target.value)}
                      className="w-full border-none rounded p-2"
                    >
                      <option value="" disabled>
                        Select Expense
                      </option>
                      {expenseOptions.map((expense, idx) => {
                        // Extract the expense name (without the category)
                        const expenseName = expense.split(" [")[0];
                        return (
                          <option key={idx} value={expenseName}>
                            {expense}
                          </option>
                        );
                      })}
                    </select>
                  </td>

                    {/* Currency Dropdown */}
                    <td>
                    <select
                        value={row.currency}
                        onChange={(e) => handleCurrencyChange(index, e.target.value)}
                        className="w-full border-none rounded p-2"
                    >
                        {currencyOptions.map((currency, idx) => (
                        <option key={idx} value={currency}>
                            {currency}
                        </option>
                        ))}
                    </select>
                    </td>

                    {/* Amount Field */}
                    <td>
                    <input
                        type="text"
                        value={row.amount ? row.amount : ""}
                        onChange={(e) => handleAmountChange(index, e.target.value)}
                        onBlur={() => handleAmountBlur(index)} // Format amount on blur
                        className="w-full border-none rounded p-2"
                        placeholder="Enter amount"
                    />
                    </td>

                    {/* Action Field */}
                    <td className="flex gap-2 items-center justify-between my-2">
                        {/* Hidden File Input */}
                        <div>
                            <input
                                type="file"
                                id={`file-upload-${index}`}
                                className="hidden"
                                onChange={(e) => handleFileChange(index, e.target.files[0])}
                            />
                            <label
                                htmlFor={`file-upload-${index}`}
                                className="text-green-500 font-bold underline cursor-pointer"
                            >
                                Attach Image
                            </label>
                        </div>
                        {/* Delete Button */}
                        <button
                        onClick={() => deleteRow(index)}
                        className="text-red-500 cursor-pointer"
                        >
                        <Image
                            src="/images/icons/delete_red.png"
                            alt="Delete Icon"
                            width={20}
                            height={20}
                        />
                        </button>

                    </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        <div className="flex justify-end mt-4">
     

        <button
        onClick={addRow}
        disabled={
            rows.length >= 30 || 
            (rows.length > 0 && (!rows[rows.length - 1]?.expense || !rows[rows.length - 1]?.amount))
        }
        className={`flex items-center justify-center gap-2 px-4 py-2 font-bold rounded 
            ${
            rows.length >= 30 || 
            (rows.length > 0 && (!rows[rows.length - 1]?.expense || !rows[rows.length - 1]?.amount))
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#AC0000] text-white hover:bg-[#8A0000]"
            }`}
        >
        <span>Add Expense</span>
        <Image
            src="/images/icons/white_plus.png"
            alt="Plus Icon"
            width={16}
            height={16}
            className="object-contain"
        />
        </button>



        </div>
      </Layout>
    </div>
  );
}
