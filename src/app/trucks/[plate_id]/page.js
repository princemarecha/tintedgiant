"use client";

import Layout from "@/components/Layout";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

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

async function fetchJourneyData(journeyID) {
  // Fetch truck data from the endpoint
  const response = await fetch(`/api/journey/${journeyID}`);
  if (!response.ok) {
    throw new Error("Failed to fetch truck data"+journeyID);
  }
  return response.json();
}

export default function MyComponent({ params }) {
  const router = useRouter();
  const [plateID, setplateID] = useState(null);
  const [truckData, setTruckData] = useState(null);
  const [journeyData, setJourneyData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photos, setPhotos] = useState([])
  const [mainImageSrc, setMainImageSrc] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const fileInputRef = useRef(null); // Reference to the hidden file input
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);



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
          if (data.current_journey)
          {const journey = await fetchJourneyData(data.current_journey); setJourneyData(journey)}
          if (data.photos)
            {
              setMainImageSrc(data.photos[0])
              setPhotos(data.photos)
              }
        } catch (err) {
          setError("Failed to fetch truck data");
        }
      }

      fetchTruck();
    }
  }, [plateID]);

  useEffect(() => {
    const uploadImage = async () => {
      if (!image) return; // Prevent upload if no image is selected
  
      console.log("Uploading file:", image);
      setUploading(true);
  
      const reader = new FileReader();
  
      reader.onloadend = async () => {
        try {
          const response = await fetch("/api/trucks/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ file: reader.result, imageName:image.name, folder: plateID }),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            setUploadedImageUrl(data.url);
            setMainImageSrc(data.url);
          
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

    // Make a PATCH request when uploadedImageUrl changes
    useEffect(() => {
      if (uploadedImageUrl) {
        const updateEmployeeImage = async () => {
          try {
              const response = await axios.patch(`/api/trucks/${plateID}`, {
              photos: [uploadedImageUrl, ...photos],
            });
            setPhotos([uploadedImageUrl, ...photos])
            console.log("Image updated successfully:", response.data);
          } catch (error) {
            console.error("Error updating image:", error);
          }
        };
  
        updateEmployeeImage();
      }
    }, [uploadedImageUrl, plateID]);

    useEffect(() => {
      // Fetch data when component mounts or plateID changes
      const fetchOperationalCosts = async () => {
        try {
          setLoading(true); // Start loading
          setError(null); // Reset error
    
          // API call to fetch data
          const response = await fetch(
            `http://localhost:3000/api/trucks/opCosts?plateId=${plateID}`
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
    
      if (plateID) fetchOperationalCosts();
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

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };


  function cleanCloudinaryUrl(url) {
    try {
      // Use URL constructor to parse the URL
      const urlObj = new URL(url);
  
      // Extract the pathname, remove the leading `/` and split by `/`
      const pathParts = urlObj.pathname.split("/");
  
      // Start from the part after "trucks" and join the rest
      const truckIndex = pathParts.indexOf("trucks");
      if (truckIndex === -1) {
        throw new Error("URL does not contain 'trucks'");
      }
  
      // Join the path parts after "trucks"
      const cleanedPath = pathParts.slice(truckIndex).join("/");
  
      // Remove file extension from the cleaned path
      const pathWithoutExtension = cleanedPath.replace(/\.[^/.]+$/, ''); // Removes file extension
  
      return pathWithoutExtension;
    } catch (error) {
      console.error("Invalid URL or missing 'trucks' segment:", error);
      return null;
    }
  }
  
  async function updatePhotos(pics) {
        try {
          const response = await axios.patch(`/api/trucks/${plateID}`, {
          photos: pics,
        });
        console.log("Image updated successfully:", response.data);
        truckData?.photos?setMainImageSrc(truckData.photos[0]): setMainImageSrc(null)
      } catch (error) {
        console.error("Error updating image:", error);
      }
  }
  

  const deleteImage = (e, publicID)=>{

    e.preventDefault();

    axios
          .delete("/api/trucks/upload", {
            data: {
              publicId: cleanCloudinaryUrl(publicID), // Replace with your actual public ID
            },
          })
          .then((response) => {
            console.log("Response:", response.data);
            const newPhotos = photos.filter((url) => !url.includes(publicID))
            console.log(newPhotos)
            setPhotos(newPhotos)
            try{
              setMainImageSrc(photos[0])
              updatePhotos(newPhotos)
            }
            catch{}
          })
          .catch((error) => {
            console.error("Error:", error);
          });
  }



  return (
    <div className="bg-white h-screen relative">
      <Layout>
        <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">Trucks</p>

        <p className="text-sm 2xl:text-lg text-[#AC0000] font-bold mt-8 md:mt-6 mb-8"><span>Home </span> <span>&gt;</span> <span>Truck Management</span> <span>&gt;</span><span>Trucks </span><span>&gt;</span><span>{plateID}</span></p>
        <div className="grid  grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-x-2 gap-y-2">
        <div id="truck image" className="relative col-span-3 md:col-span-4 lg:col-span-6 xl:col-span-5 bg-gray-100 h-96 lg:h-full">
          {truckData?<Image
              src= {mainImageSrc?mainImageSrc:"https://res.cloudinary.com/dix6sop3b/image/upload/v1733117711/u0y0mh6rtjgwqvtgoelr.png"}
              alt="Main Image"
              fill
              unoptimized
              className={`transition duration-75 group-hover:opacity-80 w-100 h-100 rounded-xl object-contain mx-auto ${
                uploading ? 'animate-pulse' : ''
              }`}
              //onError={(e) => (e.target.src = "u0y0mh6rtjgwqvtgoelr")}
            />:""}
          </div>





            
            {truckData ? (
        <div className="col-span-3 border border-gray-300 text-xs 2xl:text-lg 2xl:gap-y-1 2xl:py-2 md:col-span-2 lg:col-span-6 xl:col-span-4 p-6 lg:p-6 xl:p-8 text-black shadow-xl rounded border border-gray-100 grid grid-cols-2">
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
        <div className="">{data?.totalJourneys || "0"}</div> 
      
        <div className="font-bold">Km Travelled</div> 
        <div className="">{data?.totalKmTravelled || "0"} km</div> 

        <div className="font-bold">Avg Km</div> 
        <div className="">{data?.avgKmTravelled || "0"} km</div> 
      
      
      </div>
      
            ) : (
              plateID && <div>Loading truck data...</div>
            )}
            {journeyData ? (
              <div className="col-span-3 md:col-span-2 lg:col-span-6 xl:col-span-3  py-4  text-black shadow-xl rounded bg-[#AC0000] ">
                <p className="xl:text-lg mx-6 font-black text-white 2xl:text-2xl">Current Journey</p> 
                <hr className="my-2 2xl:my-4 border-white" /> {/* Horizontal line */}
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-black text-white">From</p> 
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-medium text-white mb-1">{journeyData.from}</p> 
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-black text-white">To</p> 
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-medium text-white mb-1">{journeyData.to}</p> 
                <p className="text-sm xl:text-md 2xl:text-lg mx-6 font-black text-white">Driver</p> 
                <Link href={`/employees/${journeyData.driver?.id}`}><p className="text-sm xl:text-md 2xl:text-lg mx-6 font-medium text-[#AC0000] bg-white text-center rounded my-1">{journeyData.driver?.name}</p> </Link>

                <hr className="my-2 2xl:my-4 border-white" /> {/* Horizontal line */}
                <div className="text-sm 2xl:text-lg grid grid-cols-4 mx-6 text-white gap-y-2">
                <div className="font-bold col-span-2" >Departure</div> <div className="col-span-2">{journeyData.departure}</div> 
                <div className="font-bold col-span-2" >Arrival(Est) </div> <div className="col-span-2">{journeyData.arrival}</div> 
                <div className="font-bold col-span-2" >Distance</div> <div className="col-span-2">{journeyData.distance} km</div> 
                <div className="font-bold col-span-2" >Estimate Cost </div> <div className="col-span-2">{journeyData.expenses?.total_cost || "N/A"}</div> 
                </div>

              </div>
            ) : (
              plateID && <div>Loading truck data...</div>
            )}

          {data?.totalExpenses?.length?<div className="col-span-3 md:col-span-full grid grid-cols-6 bg-[#6B0303] p-4 my-4 gap-y-2 rounded ">
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

        {data?.totalExpenses?.length?<div className="col-span-3 md:col-span-full grid grid-cols-6 bg-[#6B0303] p-4 mb-4 gap-y-2 rounded">
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

            <div className="col-span-full grid grid-cols-3 gap-2">
            {photos.map((src, index) => (
                <div key={index} className="relative  h-32 lg:h-60 cursor-pointer group">
                    <Image
                    src={src}
                    alt={`Truck Thumbnail ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover rounded-xl"
                    onClick={()=>{setMainImageSrc(src)}}
                    />
                    <div
                    className="absolute bottom-2 right-2 bg-[#AC0000] p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-200"
                    onClick={(e) => deleteImage(e,src)}
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

          <button
                onClick={() => router.push(`/trucks/${plateID}/edit`)}
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
