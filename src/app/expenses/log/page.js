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
  const [attachments, setAttachments] = useState(""); // For managing attachment input
  const [type, setType] = useState(""); // Type of expense (e.g., trip, misc)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today's date
  const [images, setImages] = useState([]); // Stores images with names
  const [uploadedImages, setUploadedImages] = useState({}); // State to store uploaded image names by index
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false) ;

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
    if (lastRow && (!lastRow.amount || !lastRow.name)) {
      alert(
        "Please fill out the Expense and Amount fields for the previous row before adding a new one."
      );
      return;
    }

    setRows([...rows, { name: "", amount: "", currency: "USD", file: null }]);
  };

  const currencyOptions = Object.keys(currencySymbols);

  // Handle dropdown change for expense
  const handleExpenseChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].name = value;
    setRows(updatedRows);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  

  const deleteRow = (index) => {

    console.log("start "+ JSON.stringify(uploadedImages))
    // Update rows by filtering out the row at the given index
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
  
    // Remove images associated with the deleted row
    setImages((prevImages) =>
      prevImages.filter((image) => image.rowID !== index)
    );
  
    setUploadedImages((prevUploadedImages) => {
      // Create an array of entries and filter out the one at the given index
      const updatedEntries = Object.entries(prevUploadedImages)
        .filter(([key]) => parseInt(key) !== index)
        .map(([key, value], i) => [i.toString(), value]); // Reassign keys starting from 0
    
      // Convert the array back to an object
      return Object.fromEntries(updatedEntries);
    });
    

    console.log("end"+ JSON.stringify(uploadedImages))
  };
  

  const formatCurrency = (amount, currency) => {
    const parsedAmount = parseFloat(amount);
    if (!isNaN(parsedAmount)) {
      const currencySymbol = currencySymbols[currency] || "";
      return `${currencySymbol}${parsedAmount.toFixed(2)}`;
    }
    return "";
  };

  // Handle input changes
  const handleInputChange = (index, key, value) => {
    const updatedRows = [...rows];
    updatedRows[index][key] = value;
    setRows(updatedRows);
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

  const calculateTotals = () => {
    const totals = {};
    rows.forEach((row) => {
      const currency = row.currency;
      const amount = parseFloat(row.amount);
      //console.log("Row:", row); // Debugging
      if (!isNaN(amount)) {
        if (!totals[currency]) {
          totals[currency] = 0;
        }
        totals[currency] += amount;
      }
    });
   // console.log("Totals:", totals); // Debugging
    return totals;
  };

  const saveExpense = async () => {
    try {
      // Upload images and get their URLs
      const uploadedImageUrls = await uploadImages();
  
      // Format data for the API
      const totalAmount = Object.entries(calculateTotals()).map(
        ([currency, amount]) => ({ currency, amount: amount.toString() })
      );
  
      // Combine uploaded images with their corresponding rows
      const formattedRows = rows.map((row, index) => ({
        ...row,
        attachment: uploadedImageUrls[index] || null, // Assign image URL if exists
      }));
  
      // Construct payload
      const payload = {
        date,
        type,
        expenses: formattedRows,
        total_amount: totalAmount,
        trip: { route: "N/A", id: "N/A" }, // Adjust if trip data is available
        attachments: uploadedImageUrls, // Attach uploaded image URLs
      };
  
      // Send the payload to the API
      const response = await axios.post("/api/expense", payload);
  
      alert("Expense saved successfully!");
      setRows([]); // Clear rows after saving
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense. Please try again.");
    }
  };
  
  useEffect(() => {
    fetchExpenses();
  }, []);


  const handleFileChange = (e, index) => {
    const files = Array.from(e.target.files);
  
    Promise.all(
      files.map((file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve({ name: file.name, data: reader.result });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
      )
    ).then((base64Files) => {
      // Store images with their associated rowID (index)
      setImages((prevImages) => [
        ...prevImages,
        ...base64Files.map((file) => ({
          rowID: index,
          image: file.data,
          name: file.name,
        })),
      ]);
  
      setUploadedImages((prev) => ({
        ...prev,
        [index]: base64Files[0]?.name, // Store the first file name by index
      }));
    });
  
    console.log(images);
  };
  
  const uploadImages = async () => {
    if (!images.length) {
      
      return [];
    }
  
    setUploading(true);
    try {
      const response = await axios.post("/api/customs/upload", {
        files: images.map((img) => img.image), // Send base64 strings
        folder: "expenses", // Specify folder name
      });
  
      console.log("Uploaded Images:", response.data.images);
      return response.data.images; // Return the uploaded images
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
      throw error; // Re-throw error to handle it in `handleSubmit`
    } finally {
      setUploading(false);
    }
  };
  
    
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
            <Link href="/expenses/manage" passHref>
              <span> Manage Expenses</span>
            </Link>{" "}
            <span>&gt;</span>
            <span> Add Expenses </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Row 1 */}
              <div>
                <label
                  htmlFor="departure"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="departure"
                  name="departure"
                  value={date} // Bind the input value to the state
                 onChange={handleDateChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000] text-black"
                />
              </div>
              <div>
                <label
                  htmlFor="trip-select"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Option
                </label>
         	
                  <select
                      id="trip-select"
                      name="trip-select"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000] text-black"
                    >
                      <option value="" disabled>
                        -- Select an Option --
                      </option>
                      <option value="Trip">Trip</option>
                      <option value="General">General</option>
                    </select>
    </div>
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
                        value={row.name}
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
                          name={row.name}
                          className="hidden"
                          onChange={(e) =>
                            handleFileChange(e,index)
                          }
                        />
                        <label
                          htmlFor={`file-upload-${index}`}
                          className={`font-bold underline cursor-pointer ${
                            uploadedImages[index] ? "text-blue-500" : "text-green-500"
                          }`}
                        >
                            {uploadedImages[index] 
                              ? `${uploadedImages[index].slice(0, 20)}${uploadedImages[index].length > 20 ? '...' : ''}` 
                              : "Attach Image"}
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
                (!rows[rows.length - 1]?.name ||
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

        
        {/* Add Row and Save Buttons */}
        <div className="flex justify-end mt-4">
          <button
            onClick={saveExpense}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Expense
          </button>
        </div>

        {/* Attach Image */}
        <div className="flex items-center gap-2 mt-2">
        <input
            id="images"
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={(e) => {
              handleFileChange(e)
            }}
            className="hidden" // Hide the file input
          />
          </div>
      </Layout>
    </div>
  );
}
