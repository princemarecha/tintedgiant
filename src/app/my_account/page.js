"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams,useRouter } from "next/navigation";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import Modal from "@/components/Modal";
import { useSession } from "next-auth/react";


async function fetchEmployeeData(empID) {
  // Fetch employee data from the endpoint

  const response = await fetch(`/api/employee/${empID}`);
  if (!response.ok) {
    throw new Error("Failed to fetch employee data"+empID);
  }
  return response.json();
}

export default function MyComponent({ params }) {
  const router = useRouter();
  const [empID, setEmpID] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("delete");
  const [modalMessage, setModalMessage] = useState("Are you sure you want to delete this employee?");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const fileInputRef = useRef(null); // Reference to the hidden file input
  const [data, setData] = useState(null); // To store API response
  const [loading, setLoading] = useState(true); // To handle loading state
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const { id } = useParams();

  const toggleModal = () => setIsModalOpen(!isModalOpen);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
          const email = localStorage.getItem("email");

          console.log("Fetching profile for:", email);

          const response = await axios.get(`/api/employee/my_account/${email}`);

          if (response.status === 200) {
            setEmployeeData(response.data);
          } else {
            console.error("Failed to fetch employee profile:", response.data.message);
          }
      
      } catch (error) {
        console.error("Error fetching employee profile:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    // Fetch the national ID and set the state
 
        setEmpID(id);
  }, [params]); // Dependency array ensures it runs when `params` change

  // useEffect(() => {
  //   // Fetch employee data when empID is available
  //   if (empID) {
  //     async function fetchEmployee() {
  //       try {
  //         const data = await fetchEmployeeData(empID);
  //         setEmployeeData(data);
  //       } catch (err) {
  //         setError("Failed to fetch employee data");
  //       }
  //     }

  //     fetchEmployee();
  //   }
  // }, [empID]);

  useEffect(() => {
    const uploadImage = async () => {
      if (!image) return; // Prevent upload if no image is selected
  
      console.log("Uploading file:", image);
      setUploading(true);
  
      const reader = new FileReader();
  
      reader.onloadend = async () => {
        try {
          const response = await fetch("/api/employee/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ file: reader.result, imageName: empID }),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            setUploadedImageUrl(data.url);
          
          } else {
            console.error("Upload failed:", data.error);
            alert("Failed to upload image.");
          }
        } catch (error) {
          console.error("Error during upload:", error);
          alert("An error occurred while uploading the image.");
        } finally {
          setUploading(false);
        }
      };
  
      reader.onerror = (err) => {
        console.error("FileReader error:", err);
        alert("Failed to read the file.");
      };
  
      reader.readAsDataURL(image); // Convert file to base64
    };
  
    uploadImage();
  }, [image]); // Dependency array to watch for image state changes
  
  useEffect(() => {
    // Fetch data when component mounts or empID changes
    const fetchOperationalCosts = async () => {
      try {
        setLoading(true); // Start loading
        setError(null); // Reset error

        // API call to fetch data
        const response = await fetch(
          `/api/employee/opCosts?userId=${empID}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        setData(result); // Save response data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (empID) fetchOperationalCosts();
  }, [empID]);

    // Make a PATCH request when uploadedImageUrl changes
    useEffect(() => {
      if (uploadedImageUrl) {
        const updateEmployeeImage = async () => {
          try {
            const response = await axios.patch(`/api/employee/${empID}`, {
              photo: uploadedImageUrl,
            });
            console.log("Image updated successfully:", response.data);
          } catch (error) {
            console.error("Error updating image:", error);
          }
        };
  
        updateEmployeeImage();
      }
    }, [uploadedImageUrl, empID]);

  useEffect(() => {
    if (employeeData?.photo) {
      setUploadedImageUrl(employeeData.photo);
    }
    setIsLoading(false)
  }, [employeeData]);

  const deleteEmployee = async () => {
    console.log("National Id is this "+ empID)
    if (!empID) return;
  
    try {
      const response = await axios.delete(`/api/employee/${empID}`);
      if (response.status === 200) {
        // Navigate to the employees list on successful deletion
        router.push("/employees/all");
      } else {
        throw new Error("Failed to delete employee");
      }
    } catch (err) {
      console.error(err);
      // Show failure modal
      setIsModalOpen(true);
    }
  };


  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  function printCard(e){
    e.preventDefault();
    
    try{

      axios.get(`/api/employee/${empID}/print`)
    }
    catch{
      console.log(`Could not print employee Card`)
    }
    
  }


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
      <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">My Profile {userId}</p>

      <p className="text-sm 2xl:text-lg text-[#AC0000] font-bold mt-8 md:mt-6 mb-8"><span>Home </span> <span>&gt;</span> <Link href={"/employees"}><span className="hover:underline">My Profile</span></Link></p>
        <div className="grid  grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-x-2 gap-y-2">
        <div className="col-span-3  md:col-span-2 lg:col-span-4 xl:col-span-4 flex justify-center items-center bg-gray-100 ">
          <CldImage
            src= {uploadedImageUrl?uploadedImageUrl:"irxdkhgi7ehjhtbeh1zk"}
            alt="Search Icon"
            width={400}
            height={400}
            className={`transition duration-75 group-hover:opacity-80 sm:w-100 sm:h-100 rounded-xl object-contain  ${
              uploading ? 'animate-pulse' : ''
            }max-h-96`}
            onError={(e) => (e.target.src = "irxdkhgi7ehjhtbeh1zk")}
          />
        </div>

            
            {employeeData ? (
              <div className="col-span-3  text-xs 2xl:text-lg 2xl:gap-y-1 2xl:py-2 md:col-span-2 lg:col-span-8 xl:col-span-5 p-6 lg:p-6 xl:p-8 text-black shadow-xl rounded border border-gray-100 grid grid-cols-3">
                <div className="font-bold" >Name</div> <div className="col-span-2">{employeeData.name || "Not provided"}</div> 
                <div className="font-bold" >Age </div> <div className="col-span-2">{employeeData.age || "Not provided"}</div> 
                <div className="font-bold" >Phone</div> <div className="col-span-2">{employeeData.phoneNumber || "Not provided"}</div> 
                <div className="font-bold" >Gender </div> <div className="col-span-2">{employeeData.gender || "Not provided"}</div> 
                <div className="font-bold" >Nationality</div> <div className="col-span-2">{employeeData.nationality || "Not provided"}</div> 
                <div className="font-bold" >National ID </div> <div className="col-span-2">{employeeData.nationalID || "Not provided"}</div> 
                <div className="font-bold" >Passport Number</div> <div className="col-span-2">{employeeData.passportNumber || "Not provided"}</div> 
                <div className="font-bold" >Occupation</div> <div className="col-span-2">{employeeData.occupation || "Not provided"}</div> 

                {employeeData?.occupation == "Driver"?<div className="grid grid-cols-3 col-span-full">
                                <div className="font-bold" >Km Travelled</div> <div className="col-span-2">{data?.totalKmTravelled || "0"} km</div> 
                                <div className="font-bold" >Avg Km </div> <div className="col-span-2">{data?.avgKmTravelled || "0"} km</div> 
                                <div className="font-bold" >Journeys</div> <div className="col-span-2">{data?.totalJourneys || "0"} </div> 
                </div>:""}

              </div>
            ) : (
              empID && <div>Loading employee data...</div>
            )}
            {employeeData ? (
              <div className="col-span-3 md:col-span-2 lg:col-span-5 xl:col-span-3  py-4  text-black shadow-xl rounded bg-[#AC0000] ">
                <p className="xl:text-lg mx-6 font-black text-white 2xl:text-2xl">Current Journey</p> 
                <hr className="my-2 2xl:my-4 border-white" /> {/* Horizontal line */}
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-black text-white">From</p> 
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-medium text-white mb-1">Harare, Zimbabwe</p> 
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-black text-white">To</p> 
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-medium text-white mb-1">Pretoria, South Africa</p> 
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-black text-white">Truck</p> 
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-medium text-[#AC0000] bg-white text-center rounded my-1">Toyota Streamliner</p> 

                <hr className="my-2 2xl:my-4 border-white" /> {/* Horizontal line */}
                <div className="text-sm 2xl:text-lg grid grid-cols-4 mx-6 text-white gap-y-2">
                <div className="font-bold col-span-2" >Departure</div> <div className="col-span-2">21/11/24</div> 
                <div className="font-bold col-span-2" >Arrival(Est) </div> <div className="col-span-2">23/11/24</div> 
                <div className="font-bold col-span-2" >Distance</div> <div className="col-span-2">243 km</div> 
                <div className="font-bold col-span-2" >Estimate Cost </div> <div className="col-span-2">$670.20</div> 
                </div>

              </div>
            ) : (
              empID && <div>Loading employee data...</div>
            )}
        </div>
        {data?.totalExpenses?.length?<div className="col-span-full grid grid-cols-6 bg-[#6B0303] p-4 my-4 gap-y-2 rounded">
            <div className="col-span-full">
              <p className="text-lg font-bold mb-2">Operational Costs</p>
            </div>
            {data?.totalExpenses && data?.totalExpenses.map((expense, index) => (
              <div key={index} className="col-span-1">
                <p className="text-sm font-bold">
                  {expense.currency} <span className="text-3xl">{expense.operation_costs}</span>
                </p>
              </div>
            ))}

        </div>:""}

        {data?.totalExpenses?.length?<div className="col-span-full grid grid-cols-6 bg-[#6B0303] p-4 my-4 gap-y-2 rounded">
            <div className="col-span-full">
              <p className="text-lg font-bold mb-2">Average Operational Costs</p>
            </div>
            {data?.averageOperationalCosts && data?.averageOperationalCosts.map((expense, index) => (
              <div key={index} className="col-span-1">
                <p className="text-sm font-bold">
                  {expense.currency} <span className="text-3xl">{expense.avg_operational_costs}</span>
                </p>
              </div>
            ))}

        </div>:""}

        <div className="my-4 flex justify-between text-sm 2xl:text-lg ">
          <button
                onClick={(e) => fileInputRef.current.click()}
                className="px-4 py-2 rounded text-white bg-[#AC0000] hover:bg-gray-600 focus:outline-none focus:ring-0  transition duration-150"
              >
                <p className="flex justify-between"><span>Upload Image</span><span>
                <Image
                src="/images/icons/camera.png"
                alt="Search Icon"
                width={20}
                height={20}
                className="transition duration-75 group-hover:opacity-80 ml-2 sm:w-6 sm:h-6"
              />
                  </span>
                  </p>
          </button>
{/* 
          <button
                onClick={() => router.push(`/employees/${empID}/edit`)}
                className="px-4 py-2 rounded text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-0  transition duration-150 "
              >
                <p className="flex justify-between"><span>Edit</span><span>
                <Image
                src="/images/icons/edit.png"
                alt="Search Icon"
                width={20}
                height={20}
                className="transition duration-75 group-hover:opacity-80 ml-2 sm:w-6 sm:h-6"
              />
                  </span>
                  </p>
          </button> */}

        </div>
        <div className="my-4 flex justify-between text-sm 2xl:text-lg">
        {/* <button
               onClick={(e) => printCard(e)}
                className="px-4 py-2 rounded text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-0  transition duration-150 "
              >
                <p className="flex justify-between"><span>Print</span><span>
                <Image
                src="/images/icons/print.png"
                alt="Search Icon"
                width={20}
                height={20}
                className="transition duration-75 group-hover:opacity-80 ml-2 sm:w-6 sm:h-6"
              />
                  </span>
                  </p>
          </button> */}
      {/* Delete Button */}
      {/* <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 rounded text-white bg-[#AC0000] hover:bg-gray-600 focus:outline-none focus:ring-0 transition duration-150"
      >
        <p className="flex justify-between">
          <span>Delete Employee</span>
          <span>
            <Image
              src="/images/icons/delete.png"
              alt="Delete Icon"
              width={20}
              height={20}
              className="transition duration-75 group-hover:opacity-80 ml-2 sm:w-6 sm:h-6"
            />
          </span>
        </p>
      </button> */}
        </div>

              {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*" // Restrict to image files
          onChange={handleFileChange}
          style={{ display: "none" }} // Hide the input
        />


        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded p-6 text-center shadow-lg">
              <p className="text-lg font-bold text-[#AC0000] mb-4">Failed to delete Employee</p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <Modal isOpen={isModalOpen} toggleModal={toggleModal} type={modalType} message={modalMessage} color="gray" onCancel={toggleModal} onConfirm={deleteEmployee} />
      </Layout>
    </div>
  );
}