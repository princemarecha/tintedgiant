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

        const allOptions = [
          ...regular.map((expense) => `${expense} [Regular]`),
          ...other.map((expense) => `${expense} [Other]`),
        ];

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

    const lastRow = rows[rows.length - 1];
    if (lastRow && (!lastRow.amount || !lastRow.expense)) {
      alert(
        "Please fill out the Expense and Amount fields for the previous row before adding a new one."
      );
      return;
    }

    setRows([...rows, { expense: "", amount: "", currency: "USD", file: null }]);
  };

  const currencyOptions = Object.keys(currencySymbols);

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

  const formatCurrency = (amount, currency) => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount)) {
      const currencySymbol = currencySymbols[currency] || "";
      return `${currencySymbol}${parsedAmount.toFixed(2)}`;
    }
    return "";
  };

  const handleAmountChange = (index, value) => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    if (!isNaN(numericValue) && numericValue.split(".").length <= 2) {
      const updatedRows = [...rows];
      updatedRows[index].amount = numericValue;
      setRows(updatedRows);
    }
  };

  const handleAmountBlur = (index) => {
    const updatedRows = [...rows];
    const amount = updatedRows[index].amount;
    if (amount && !isNaN(parseFloat(amount))) {
      updatedRows[index].amount = parseFloat(amount).toString(); // Keep raw numeric value
    }
    setRows(updatedRows);
  };

  const handleCurrencyChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].currency = value;
    updatedRows[index].amount = ""; // Reset amount on currency change
    setRows(updatedRows);
  };

  const handleFileChange = (index, file) => {
    const updatedRows = [...rows];
    updatedRows[index].file = file;
    setRows(updatedRows);

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("/api/upload", formData)
      .then(() => alert("File uploaded successfully"))
      .catch((error) => console.error("Error uploading file:", error));
  };

  const calculateTotals = () => {
    const totals = {};
    rows.forEach((row) => {
      const currency = row.currency;
      const amount = parseFloat(row.amount);
      console.log("Row:", row); // Debugging
      if (!isNaN(amount)) {
        if (!totals[currency]) {
          totals[currency] = 0;
        }
        totals[currency] += amount;
      }
    });
    console.log("Totals:", totals); // Debugging
    return totals;
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
        <div className="h-96">
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
                    <td>
                      <select
                        value={row.expense}
                        onChange={(e) =>
                          handleExpenseChange(index, e.target.value)
                        }
                        className="w-full border-none rounded p-2"
                      >
                        <option value="" disabled>
                          Select Expense
                        </option>
                        {expenseOptions.map((expense, idx) => {
                          const expenseName = expense.split(" [")[0];
                          return (
                            <option key={idx} value={expenseName}>
                              {expense}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td>
                      <select
                        value={row.currency}
                        onChange={(e) =>
                          handleCurrencyChange(index, e.target.value)
                        }
                        className="w-full border-none rounded p-2"
                      >
                        {currencyOptions.map((currency, idx) => (
                          <option key={idx} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.amount ? row.amount : ""}
                        onChange={(e) =>
                          handleAmountChange(index, e.target.value)
                        }
                        onBlur={() => handleAmountBlur(index)}
                        className="w-full border-none rounded p-2"
                        placeholder="Enter amount"
                      />
                    </td>
                    <td className="flex gap-2 items-center justify-between my-2">
                      <div>
                        <input
                          type="file"
                          id={`file-upload-${index}`}
                          className="hidden"
                          onChange={(e) =>
                            handleFileChange(index, e.target.files[0])
                          }
                        />
                        <label
                          htmlFor={`file-upload-${index}`}
                          className="text-green-500 font-bold underline cursor-pointer"
                        >
                          Attach Image
                        </label>
                      </div>
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
        </div>

        {/* Add Row Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={addRow}
            className={`flex items-center justify-center gap-2 px-4 py-2 font-bold rounded 
            ${
              rows.length >= 30 ||
              (rows.length > 0 &&
                (!rows[rows.length - 1]?.expense ||
                  !rows[rows.length - 1]?.amount))
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

        <hr className="my-2 2xl:my-4 border-[#AC0000]" /> {/* Horizontal line */}

        {/* Totals Section */}
        <div className="mt-6 text-[#4F4F4F] flex">
          <p className="font-bold text-sm mr-10">totals</p>
          {Object.entries(calculateTotals()).map(([currency, total]) => (
            <p key={currency} className="mr-4">
              <span className="text-xs">{currency}</span> 
              <span className="font-black text-3xl">{total.toFixed(2)}</span>
            </p>
          ))}
        </div>
      </Layout>
    </div>
  );
}
