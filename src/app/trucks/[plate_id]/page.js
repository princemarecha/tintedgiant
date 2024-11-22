"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

async function getplateID(params) {
  // Simulate fetching or processing to get the plate ID
  const plate_id = (await params).plate_id
  return plate_id
}



async function fetchTruckData(plateID) {
  // Fetch truck data from the endpoint

  const response = await fetch(`/api/trucks/${plateID}`);
  if (!response.ok) {
    throw new Error("Failed to fetch truck data"+plateID);
  }
  return response.json();
}

export default function MyComponent({ params }) {
  const router = useRouter();
  const [plateID, setplateID] = useState(null);
  const [truckData, setTruckData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mainImageSrc, setMainImageSrc] = useState("/images/truck.png");


  useEffect(() => {
    // Fetch the plate ID and set the state
    async function fetchplateID() {
      try {
        const id = await getplateID(params);
        setplateID(id);
      } catch (err) {
        setError("Failed to fetch plate ID");
      }
    }

    fetchplateID();
  }, [params]); // Dependency array ensures it runs when `params` change

  useEffect(() => {
    // Fetch truck data when plateID is available
    if (plateID) {
      async function fetchTruck() {
        try {
          const data = await fetchTruckData(plateID);
          setTruckData(data);
        } catch (err) {
          setError("Failed to fetch truck data");
        }
      }

      fetchTruck();
    }
  }, [plateID]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const deleteTruck = async () => {
    console.log("plate ID is this "+ plateID)
    if (!plateID) return;
  
    try {
      const response = await axios.delete(`/api/trucks/${plateID}`);
      if (response.status === 200) {
        // Navigate to the trucks list on successful deletion
        router.push("/trucks/all");
      } else {
        throw new Error("Failed to delete truck");
      }
    } catch (err) {
      console.error(err);
      // Show failure modal
      setIsModalOpen(true);
    }
  };

  const handleImageClick = (newSrc) => {
    setMainImageSrc(newSrc);
  };

  return (
    <div className="bg-white h-screen relative">
      <Layout>
        <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">Trucks</p>

        <p className="text-sm 2xl:text-lg text-[#AC0000] font-bold mt-8 md:mt-6 mb-8"><span>Home </span> <span>&gt;</span> <span>Truck Management</span> <span>&gt;</span><span>Trucks </span><span>&gt;</span><span>{plateID}</span></p>
        <div className="grid  grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-x-2 gap-y-2">
        <div className="relative col-span-3 md:col-span-2 lg:col-span-4 xl:col-span-5 bg-gray-100 ">
            <Image
                src={mainImageSrc}
                id="mainImage"
                alt="Truck Image"
                fill
                className="object-cover rounded-xl"
            />
        </div>





            
            {truckData ? (
        <div className="col-span-3 text-xs 2xl:text-lg 2xl:gap-y-1 2xl:py-2 md:col-span-2 lg:col-span-8 xl:col-span-4 p-6 lg:p-6 xl:p-8 text-black shadow-xl rounded border border-gray-100 grid grid-cols-2">
        <div className="font-bold">Name</div> 
        <div className="">{truckData.name || "Not provided"}</div> 
      
        <div className="font-bold">Status</div> 
        <div className="">{truckData.status || "Not provided"}</div> 
      
        <div className="font-bold">Location</div> 
        <div className="">{truckData.location || "Not provided"}</div> 
      
        <div className="font-bold">Travelling</div> 
        <div className="">{truckData.travelling || "Not provided"}</div> 
      
        <div className="font-bold">Trailer</div> 
        <div className="">{truckData.trailer ? "Yes" : "No"}</div> 
      
        <div className="font-bold">Trailer Plate</div> 
        <div className="">{truckData.trailerPlate || "Not provided"}</div> 
      
        <div className="font-bold">Colour</div> 
        <div className="">{truckData.colour || "Not provided"}</div> 
      
        <div className="font-bold">Plate ID</div> 
        <div className="">{truckData.plate_id || "Not provided"}</div> 
      
        <div className="font-bold">Mileage</div> 
        <div className="">{truckData.mileage || "Not provided"} km</div> 
      
        <div className="font-bold">Fuel</div> 
        <div className="">{truckData.fuel || "Not provided"}</div> 
      
        <div className="font-bold">Journeys</div> 
        <div className="">{truckData.journeys || "Not provided"}</div> 
      
        <div className="font-bold">Avg Km</div> 
        <div className="">{truckData.avg_km || "Not provided"} km</div> 
      
        <div className="font-bold">Operational Costs</div> 
        <div className="">${truckData.opCosts || "Not provided"}</div> 
      
        <div className="font-bold">Avg Op Cost</div> 
        <div className="">${truckData.avg_opCosts || "Not provided"}</div> 
      
      </div>
      
            ) : (
              plateID && <div>Loading truck data...</div>
            )}
            {truckData ? (
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
              plateID && <div>Loading truck data...</div>
            )}


            <div className="col-span-full grid grid-cols-5 gap-2">
            {["/images/trucks/1.png", "/images/trucks/2.png", "/images/trucks/3.png", "/images/trucks/4.png", "/images/trucks/5.png"].map((src, index) => (
                <div key={index} className="relative h-60 cursor-pointer group">
                    <Image
                    src={src}
                    alt={`Truck Thumbnail ${index + 1}`}
                    fill
                    className="object-cover rounded-xl"
                    />
                    <div
                    className="absolute bottom-2 right-2 bg-[#AC0000] p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-200"
                    onClick={() => console.log(`Delete image: ${src}`)}
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
        </div>


        <div className="my-4 flex justify-between text-sm 2xl:text-lg ">
          <button
                onClick={() => alert("Button clicked!")}
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

          <button
                onClick={() => alert("Button clicked!")}
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
          </button>

        </div>
        <div className="my-4 flex justify-end text-sm 2xl:text-lg">
        <button
            onClick={deleteTruck}
            className="px-4 py-2 rounded text-white bg-[#AC0000] hover:bg-gray-600 focus:outline-none focus:ring-0  transition duration-150"
          >
            <p className="flex justify-between">
              <span>Delete Truck</span>
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
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded p-6 text-center shadow-lg">
              <p className="text-lg font-bold text-[#AC0000] mb-4">Failed to delete Truck</p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
}
