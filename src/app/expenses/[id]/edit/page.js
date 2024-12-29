"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function Manage() {
  const [rows, setRows] = useState([]);
  const [expenseOptions, setExpenseOptions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [attachments, setAttachments] = useState([]);// For managing attachment input
  const [type, setType] = useState(""); // Type of expense (e.g., trip, misc)
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today's date
  const [newAttachments, setNewAttachments] = useState([]); // Default to today's date
  const [uploading, setUploading] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const router  = useRouter()

  const { id } = useParams();

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

  // Fetch an existing expense by ID
  const fetchExpenseById = async () => {
    try {
      const response = await axios.get(`/api/expense/${id}`);
      const expenseData = response.data;

      // Initialize state based on fetched data
      setDate(expenseData.date);
      setType(expenseData.type);
      setRows(expenseData.expenses);
      setAttachments(expenseData.attachments);
    } catch (error) {
      console.error("Error fetching expense by ID:", error);
      alert("Failed to fetch expense data. Please try again.");
    }
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

  const handleFileChange = (e) => {
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
    ).then((base64Files) => setNewAttachments(base64Files));
  };

  const uploadImages = async () => {
    if (!newAttachments.length) {
      
      return [];
    }
  
    setUploading(true);
    try {
      const response = await axios.post("/api/customs/upload", {
        files: newAttachments.map((img) => img.data), // Send base64 strings
        folder: "customs", // Specify folder name
      });
  
      //console.log("Uploaded Images:", response.data.images);
      return response.data.images; // Return the uploaded images
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
      throw error; // Re-throw error to handle it in `handleSubmit`
    } finally {
      setUploading(false);
    }
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
    //console.log("Totals:", totals); // Debugging
    return totals;
  };

    // Save the expense
    const saveExpense = async () => {
      setIsLoading(true)
      try {
        // Format data for the API
        const totalAmount = Object.entries(calculateTotals()).map(
          ([currency, amount]) => ({ currency, amount: amount.toString() })
        );
  
        const payload = {
          date,
          type,
          expenses: rows,
          total_amount: totalAmount,
         
          attachments,
        };

        const uploadedImages = await uploadImages(); // Wait for images to upload
        //console.log(`these are uploaded images ${uploadedImages}`)
      if (uploadedImages) {
        payload.attachments = [...uploadedImages, ...attachments]; // Update payload with uploaded images
      }

      setAttachments([...uploadedImages, ...attachments])
  
        const response = await axios.patch(`/api/expense/${id}`, payload);
        setIsLoading(false)
        alert("Expense updated successfully!");
        router.push(`/expenses/${id}`)
      } catch (error) {
        console.error("Error updating expense:", error);
        setIsLoading(false)
        alert("Failed to update expense. Please try again.");
      }
    };

    const deleteImage = (e, publicID)=>{

      e.preventDefault();
  
      axios
            .delete("/api/customs/upload", {
              data: {
                publicId: publicID, // Replace with your actual public ID
              },
            })
            .then((response) => {
              console.log("Response:", response.data);
              const newPhotos = attachments?.filter((pic) => !pic?.url?.includes(publicID))
              console.log(newPhotos)
              try{
                updatePhotos(newPhotos)
              }
              catch{}
            })
            .catch((error) => {
              console.error("Error:", error);
            });
    }

    async function updatePhotos(pics) {
      try {
        const response = await axios.patch(`/api/expense/${id}`, {
        attachments: pics,
      });
      console.log("Image updated successfully:", response.data);
      setAttachments(pics)
      
    } catch (error) {
      console.error("Error updating image:", error);
    }
  }

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (id) {
      fetchExpenseById(); // Fetch the expense when the component mounts and ID is available
    }
    setIsLoading(false)
  }, [id]);

  return (
    <div className="bg-white h-screen relative">
                {isLoading && (
      <div className="absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-yellow-300"></div>
          <img src="/images/logo.png" alt="Loading Logo" className="rounded-full h-22 w-28" />
        </div>
      </div>
    )}
      <Layout>
        <div>
          <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">
            Log Expenses
          </p>
          <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
            <span>Home </span> <span>&gt;</span>{" "}
            <Link href="/expenses" passHref>
              <span className="hover:underline">Expenses Management</span>
            </Link>{" "}
            <span>&gt;</span>
            <Link href="/expenses/manage" passHref>
              <span className="hover:underline"> Manage Expenses</span>
            </Link>{" "}
            <span>&gt;</span>
            <Link href={`/expenses/${id}/`} passHref>
              <span className="hover:underline"> Expense Detail</span>
            </Link>{" "}
            <span>&gt;</span>
            <span > Edit Expense </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
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
                    onChange={(e) => setDate(e.target.value)} // Update the state
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000] text-sm lg:text-md"
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
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#AC0000] focus:border-[#AC0000] text-sm lg:text-md"
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
        <div className="h-96 mt-4 text-sm xl:text-lg">
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
                        className="w-full border-none rounded p-2 text-xs xl:text-md"
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
                        className="w-full border-none rounded p-2 text-xs xl:text-md"
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
                        className="w-full border-none rounded p-2 text-xs xl:text-md"
                        placeholder="Enter amount"
                      />
                    </td>
                    <td className="flex gap-2 items-center justify-between my-2">
                      <div>
                        <input
                          type="file"
                          disabled
                          id={`file-upload-${index}`}
                          className="hidden"
                          onChange={(e) =>
                            handleFileChange(index, e.target.files[0])
                          }
                        />
                        <label
                          htmlFor={`file-upload-${index}`}
                          className="text-gray-300 font-bold underline cursor-pointer"
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
            className={`flex items-center justify-center gap-2 px-4 py-2 font-bold rounded text-xs lg:text-lg
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
              <span className="font-black text-xl xl:text-3xl">{total.toFixed(2)}</span>
            </p>
          ))}
        </div>


        <p className="font-black text-[#AC0000] text-md mr-10 mt-10">Attached Media</p>
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:mt-4">
        
        {attachments?.map((src, index) => (
                <div key={index} className="relative h-32 xl:h-60 cursor-pointer group">
                    <Image
                    src={src.url}
                    alt={`Truck Thumbnail ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover rounded-xl"
                    />
                    <div
                    className="absolute bottom-2 right-2 bg-[#AC0000] p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-200"
                    onClick={(e) => deleteImage(e,src.publicId)}
                    >
                    <Image
                        src="/images/icons/delete.png" // Replace with the path to your delete icon
                        alt="Delete Icon"
                        width={20}
                        height={20}
                        className="object-contain"
                    />
                    </div>
                </div>
                ))}

            
     
        </div>

        <div className="col-span-4 mb-4 mt-4">
          <div className="">
            {/* Attach Media Button */}
            <button
              type="button"
              onClick={() => document.getElementById("images").click()} // Trigger the file input click
              className=" px-2 py-2 xl:py-3 rounded text-sm text-white bg-[#AC0000] hover:bg-gray-600 focus:outline-none transition duration-150"
            >
              <span className="flex">
                <span className="mr-2 text-xs lg:text-md my-auto">Attach Relevant Media</span>
                <Image
                  src="/images/icons/attachment.png" // Replace with your image path
                  alt="attachment Icon" // Alternative text for the image
                  width={20} // Set the width of the image
                  height={20} // Set the height of the image
                  className="transition duration-75 group-hover:opacity-80 w-5 h-5 mr-2"
                />
              </span>
            </button>

              {/* Clear Attachments Button */}
              {newAttachments?newAttachments.length > 0 && (
                <button
                  type="button"
                  onClick={() => setNewAttachments({ ...newAttachments, images: [] })} // Clear the images
                  className="px-4 py-2 ml-4 text-sm rounded text-white bg-gray-400 hover:bg-gray-500 focus:outline-none transition duration-150"
                >
                  Clear Attachments
                </button>
              ):""}
            </div>

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

            {/* Show attached file names */}
              <div className="mt-3 text-sm text-[#AC0000]">
                {newAttachments.length > 0 ? (
                  <p>
                    <span className="font-bold">Attached Files:</span>{" "}
                    {newAttachments.map((file, index) => (
                      <span key={index} className="mr-2">
                        {file.name}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p>No files attached</p>
                )}
              </div>
          </div>

        
        {/* Add Row and Save Buttons */}
        <div className="flex justify-end mt-4">
          <button
            onClick={saveExpense}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm lg:text-md"
          >
            Save Expense
          </button>
        </div>
      </Layout>
    </div>
  );
}
