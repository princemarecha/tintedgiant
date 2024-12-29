"use client";

import Layout from "@/components/Layout";
import React, { useState, use, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MyComponent({params}) {
  const resolvedParams = use(params); // Unwrapping the promise
  const reference = resolvedParams.reference; // Accessing the reference property
  const router = useRouter()

  const initialFormData = {
    date: "",
    reference: "",
    transporter: "",
    exporter: "",
    importer: "",
    horse_plate: "",
    trailer_plate: "",
    BOE: "",
    status: "",
    duty: "",
    invoice: "",
    cargo: "",
    cargoVisible: false, // Toggle for the cargo field
    attachments: [], // Array to hold multiple images
  };

  async function updatePhotos(pics) {
    try {
      const response = await axios.patch(`/api/customs/${reference}`, {
      attachments: pics,
    });
    console.log("Image updated successfully:", response.data);
    setPhotos(pics)
    
  } catch (error) {
    console.error("Error updating image:", error);
  }
}

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
            const newPhotos = customsData?.attachments?.filter((pic) => !pic?.url?.includes(publicID))
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

  // Form state
  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [customsData, setCustomsData] = useState([]) ;
  const [photos, setPhotos] = useState([]) ;
  const [loading, setLoading] = useState(false) ;

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    
  };

  useEffect(() => {
    async function fetchCustomData() {
      try {
        const response = await axios.get(`/api/customs/${reference}`);
        setCustomsData(response.data); // Update the state with response data
        setLoading(false); // Set loading to false
      } catch (err) {
        console.error("Error fetching custom data:", err);
        setError("Failed to fetch custom data. Please try again.");
        setLoading(false); // Set loading to false
      }
    }

    if (reference) fetchCustomData();
  }, [reference]);

  useEffect(() => {
    if (customsData) {
      setFormData({
        date: customsData.date || "",
        reference: customsData.reference || "",
        transporter: customsData.transporter || "",
        exporter: customsData.exporter || "",
        importer: customsData.importer || "",
        horse_plate: customsData.horse_plate || "",
        trailer_plate: customsData.trailer_plate || "",
        BOE: customsData.BOE || "",
        duty: customsData.duty || "",
        status: customsData.status || "",
        invoice: customsData.invoice || "",
        cargo: customsData.cargo || "",
        cargoVisible: false, // Keep toggle state independent of customsData
        //attachments: customsData.attachments || [], // Ensure attachments are initialized properly
      });

      setPhotos(customsData.attachments);
    }
  }, [customsData]);
  

  // Toggle cargo field visibility
  const toggleCargoVisibility = () => {
    setFormData((prevData) => ({
      ...prevData,
      cargoVisible: !prevData.cargoVisible,
    }));
  };

  // Submit the form
  const handleSubmit = async () => {
    // Prepare the payload
    const payload = { ...formData };
  
    // Remove unnecessary fields
    delete payload.cargoVisible; // Remove visibility toggle flag
  
    try {
      // Upload images and update attachments in payload
      const uploadedImages = await uploadImages(); // Wait for images to upload
      if (uploadedImages) {
        payload.attachments = [...uploadedImages, ...photos]; // Update payload with uploaded images
      }
  
      // Send the payload to the API endpoint
      const response = await axios.patch(`/api/customs/${reference}`, payload);
  
      if (response.status === 200) {
        alert("Customs entry updated successfully!");
        //setFormData(initialFormData); // Reset form to initial state
        router.refresh()
      }
    } catch (error) {
      console.error("Error adding customs entry:", error);
      alert("Failed to add customs entry.");
    }
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
    ).then((base64Files) => setImages(base64Files));
  };

  const uploadImages = async () => {
    if (!images.length) {
      
      return [];
    }
  
    setUploading(true);
    try {
      const response = await axios.post("/api/customs/upload", {
        files: images.map((img) => img.data), // Send base64 strings
        folder: "customs", // Specify folder name
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
            Edit Customs Entry
          </p>
          <p className="text-sm text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
            <span>Home </span> <span>&gt;</span>
            <Link href="/customs" passHref>
              <span className="hover:underline"> Customs Clearance</span>
            </Link>{" "}
            <span>&gt;</span>
            <Link href="/customs/manage" passHref>
              <span className="hover:underline"> Customs Management</span>
            </Link>{" "}
            <span>&gt;</span>
            <span> Edit Customs Entry </span>
          </p>
        </div>

        {/* Form */}
        <div className="md:grid md:grid-cols-6 gap-4 ">
          {/* Date Field */}
          <div className="md:col-span-3 lg:col-span-2 mb-4">
            <label htmlFor="date" className="block text-md font-bold text-gray-700 mb-2">
              Date
            </label>
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
            />
          </div>

          {/* Reference Field */}
          <div className="md:col-span-3 lg:col-span-2 mb-4">
            <label htmlFor="reference" className="block text-md font-bold text-gray-700 mb-2">
              Reference
            </label>
            <input
              id="reference"
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="Enter reference..."
              className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
            />
          </div>

          {/* Transporter Field */}
          <div className="md:col-span-3 lg:col-span-2 mb-4">
            <label htmlFor="transporter" className="block text-md font-bold text-gray-700 mb-2">
              Transporter
            </label>
            <input
              id="transporter"
              type="text"
              name="transporter"
              value={formData.transporter}
              onChange={handleChange}
              placeholder="Enter transporter..."
              className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
            />
          </div>

          {/* Exporter Field */}
          <div className="md:col-span-3 lg:col-span-2 mb-4">
            <label htmlFor="exporter" className="block text-md font-bold text-gray-700 mb-2">
              Exporter
            </label>
            <input
              id="exporter"
              type="text"
              name="exporter"
              value={formData.exporter}
              onChange={handleChange}
              placeholder="Enter exporter..."
              className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
            />
          </div>

          {/* Importer Field */}
          <div className="md:col-span-3 lg:col-span-2 mb-4">
            <label htmlFor="importer" className="block text-md font-bold text-gray-700 mb-2">
              Importer
            </label>
            <input
              id="importer"
              type="text"
              name="importer"
              value={formData.importer}
              onChange={handleChange}
              placeholder="Enter importer..."
              className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
            />
          </div>

          {/* Horse Plate Field */}
          <div className="md:col-span-3 lg:col-span-2 mb-4">
            <label htmlFor="horse_plate" className="block text-md font-bold text-gray-700 mb-2">
              Horse Plate
            </label>
            <input
              id="horse_plate"
              type="text"
              name="horse_plate"
              value={formData.horse_plate}
              onChange={handleChange}
              placeholder="Enter horse plate..."
              className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
            />
          </div>

          {/* Trailer Plate Field */}
          <div className="md:col-span-3 lg:col-span-2 mb-4">
            <label htmlFor="trailer_plate" className="block text-md font-bold text-gray-700 mb-2">
              Trailer Plate
            </label>
            <input
              id="trailer_plate"
              type="text"
              name="trailer_plate"
              value={formData.trailer_plate}
              onChange={handleChange}
              placeholder="Enter trailer plate..."
              className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
            />
          </div>

          {/* BOE Field */}
          <div className="md:col-span-3 lg:col-span-2 mb-4">
            <label htmlFor="BOE" className="block text-md font-bold text-gray-700 mb-2">
              BOE
            </label>
            <input
              id="BOE"
              type="number"
              name="BOE"
              value={formData.BOE}
              onChange={handleChange}
              placeholder="Enter BOE..."
              className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
            />
          </div>

          {/* Invoice and Duty Row */}
          <div className="md:col-span-3 lg:col-span-2 flex gap-4">
            <div className="lg:w-1/2">
              <label htmlFor="invoice" className="block text-md font-bold text-gray-700 mb-2">
                Invoice
              </label>
              <input
                id="invoice"
                type="number"
                name="invoice"
                value={formData.invoice}
                onChange={handleChange}
                placeholder="Enter invoice..."
                className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
              />
            </div>
            <div className="lg:w-1/2">
              <label htmlFor="duty" className="block text-md font-bold text-gray-700 mb-2">
                Duty
              </label>
              <input
                id="duty"
                type="number"
                name="duty"
                value={formData.duty}
                onChange={handleChange}
                placeholder="Enter duty..."
                className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
              />
            </div>
          </div>


          {/* Cargo Field */}
            <div className="col-span-3 lg:col-span-4 mb-4">
              <label htmlFor="cargo" className="block text-md font-bold text-gray-700 mb-2">
                Cargo
              </label>
              <input
                id="cargo"
                type="text"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                placeholder="Enter cargo details..."
                className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
              />
            </div>
            <div className="md:col-span-3 lg:col-span-2 mb-4">
              <label htmlFor="cargo" className="block text-md font-bold text-gray-700 mb-2">
                Status
              </label>
              <select
                  id="status"
                  name="status"
                  value={formData.status || ""}
                  onChange={handleChange}
                  className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
                >
                  
                  <option value="Not Cleared">Not Cleared</option>
                  <option value="Cleared">Cleared</option>
                </select>
            </div>

    {/* Images Preview */}
    <div className="col-span-full grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 mb-2 lg:mb-0">
            {photos?.map((src, index) => (
                <div key={index} className="relative h-28 md:h-32 xl:h-44 cursor-pointer group mt-1 border">
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

      {/* Multiple Images Upload */}
      <div className="col-span-4 mb-4">
  <div className="">
    {/* Attach Media Button */}
    <button
      type="button"
      onClick={() => document.getElementById("images").click()} // Trigger the file input click
      className="px-2 py-3 rounded text-sm text-white bg-[#AC0000] hover:bg-gray-600 focus:outline-none transition duration-150"
    >
      <span className="flex">
        <span className="mr-2">Attach Relevant Media</span>
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
    {formData.images?formData.images.length > 0 && (
      <button
        type="button"
        onClick={() => setFormData({ ...formData, images: [] })} // Clear the images
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
      const fileNames = Array.from(e.target.files).map((file) => file.name); // Extract only file names
      setFormData((prevData) => ({
        ...prevData,
        images: fileNames, // Update images field with file names
        
      }));
      handleFileChange(e)
    }}
    className="hidden" // Hide the file input
  />

  {/* Show attached file names */}
  <div className="mt-3  text-sm text-[#AC0000]">
    {formData.images?formData.images.length > 0 ? (
      <p>
        <span className="font-bold">Attached Files:</span>{" "}
        {formData.images.map((fileName, index) => (
          <span key={index} className="mr-2">
            {fileName}
          </span>
        ))}
      </p>
    ) : (
      <p>No files attached</p>
    ):""}
  </div>
</div>


        </div>



      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 rounded text-white bg-[#AC0000] hover:bg-gray-600 focus:outline-none transition duration-150 flex items-center"
        >
          <span className="mr-2">Save</span>
          <Image
            src="/images/icons/save.png" // Replace with your image path
            alt="save Icon"  // Alternative text for the image
            width={20} // Set the width of the image
            height={20} // Set the height of the image
            className="transition duration-75 group-hover:opacity-80 w-5 h-5" 
          />
        </button>
      </div>

      </Layout>
    </div>
  );
}
