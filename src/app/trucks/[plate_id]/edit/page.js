
 "use client";

import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Modal from "@/components/modal";

export default function MyComponent({ params }) {
  const router = useRouter();
  const [plateId, setPlateId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("error");
  const [modalMessage, setModalMessage] = useState("");

  const [initialFormData, setInitialFormData] = useState({
    name: "",
    status: "N/A",
    location: "",
    travelling: "N/A",
    trailer: false,
    trailerPlate: "",
    colour: "",
    plate_id: "",
    mileage: "",
    fuel: "",
    journeys: "",
    avg_km: "",
    opCosts: "",
    avg_opCosts: "",
    photos: "",
  });

  const [formData, setFormData] = useState(initialFormData);

  // Fetch truck data using plateId
  useEffect(() => {
    if (plateId) {
      async function fetchTruckData() {
        try {
          setIsLoading(true);
          const response = await axios.get(`/api/trucks/${plateId}`);
          if (response.status === 200 && response.data) {
            // Update both initialFormData and formData
            setInitialFormData((prevData) => ({
              ...prevData,
              ...response.data,
            }));
            setFormData((prevData) => ({
              ...prevData,
              ...response.data,
            }));
          }
        } catch (error) {
          console.error("Error fetching truck data:", error);
          setModalType("error");
          setModalMessage("Failed to load truck data.");
          setModalOpen(true);
        } finally {
          setIsLoading(false);
        }
      }

      fetchTruckData();
    }
  }, [plateId]);

  // Unwrap params and set plateId
  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await params;
      setPlateId(resolvedParams.plate_id); // Assuming plate_id exists in params
    }

    fetchParams();
  }, [params]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name || formData.name.length < 2 || formData.name.length > 25) {
      setModalMessage("Name must be at least 2 characters long, and less than 25 characters long.");
      return false;
    }

    if (!formData.plate_id || formData.plate_id.length !== 8) {
      setModalMessage("Plate ID must be exactly 8 characters long.");
      return false;
    }

    if (!formData.mileage || +formData.mileage <= 0 || +formData.mileage > 1000000) {
      setModalMessage("Mileage must be greater than 0 and less than or equal to 1,000,000.");
      return false;
    }

    if (!formData.colour) {
      setModalMessage("Please specify the colour.");
      return false;
    }

    if (formData.trailer === "Yes" && (!formData.trailerPlate || formData.trailerPlate.length !== 8)) {
      setModalMessage("Trailer Plate must be exactly 8 characters if a trailer is attached.");
      return false;
    }

    if (!formData.location) {
      setModalMessage("Please specify the location.");
      return false;
    }

    if (!formData.fuel) {
      setModalMessage("Please select a fuel type.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setModalOpen(true);
      return;
    }

    try {
      setIsLoading(true);

      // Compare formData with initialFormData to find changes
      const updatedFields = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => initialFormData[key] !== value)
      );

      if (Object.keys(updatedFields).length === 0) {
        setIsLoading(false);
        setModalMessage("No changes detected!");
        return;
      }

      const response = await axios.patch(`/api/trucks/${plateId}`, updatedFields);
      if (response.status === 200) {
        setIsLoading(false);
        setModalMessage("Truck information updated successfully!");
        router.push("/trucks/all");
      }
    } catch (error) {
      console.error("Error submitting truck information:", error);
      setIsLoading(false);
      setModalMessage("Failed to submit truck information.");
    }
  };

  const toggleModal = () => setModalOpen(!isModalOpen);


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
        <p className="text-xl lg:text-4xl text-[#AC0000] font-bold mt-8 md:mt-12 mb-4">Trucks</p>

        <p className="text-sm 2xl:text-lg text-[#AC0000] font-bold mt-8 md:mt-6 mb-8">
          <Link href="/" passHref>
            <span>Home </span>
          </Link>{" "}
          <span>&gt;</span>
          <Link href="/trucks" passHref className="hover:underline">
            <span>Truck Management</span>
          </Link>{" "}
          <span>&gt;</span>
          <Link href="/trucks/all" passHref className="hover:underline">
            <span>Trucks </span>
          </Link>
          <span>&gt;</span>
          <span>Edit Truck</span>
        </p>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Name",
                name: "name",
                type: "text",
                placeholder: "Enter name...",
                required: true,
              },
              {
                label: "Make",
                name: "make",
                type: "select",
                options: [
                  "Volvo",
                  "Scania",
                  "Mercedes-Benz",
                  "MAN",
                  "DAF",
                  "Iveco",
                  "Kenworth",
                  "Peterbilt",
                ],
                required: true,
              },
              {
                label: "Plate ID",
                name: "plate_id",
                type: "text",
                placeholder: "Enter plate ID...",
                required: true,
              },
              {
                label: "Fuel",
                name: "fuel",
                type: "select",
                options: ["Diesel", "Petrol", "Electric", "Hybrid"],
                required: true,
              },
              {
                label: "Mileage",
                name: "mileage",
                type: "number",
                placeholder: "Enter mileage...",
                required: true,
              },
              {
                label: "Colour",
                name: "colour",
                type: "text",
                placeholder: "Enter colour...",
                required: true,
              },
              {
                label: "Trailer",
                name: "trailer",
                type: "select",
                options: ["No", "Yes"],
                required: true,
              },
              {
                label: "Trailer Plate",
                name: "trailerPlate",
                type: "text",
                placeholder: "Enter trailer plate...",
                required: formData.trailer === "Yes",
              },
              {
                label: "Location",
                name: "location",
                type: "text",
                placeholder: "Enter location...",
                required: true,
              },
            ].map(({ label, name, type, placeholder, options, required }, index) => (
              <div key={index} className="mb-4">
                <label htmlFor={name} className="block text-lg font-bold text-gray-700 mb-2">
                  {label}
                </label>
                {type === "select" ? (
                  <select
                    id={name}
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
                    required={required}
                  >
                    <option value="">Select {label}</option>
                    {name === "trailer"
                      ? [
                          { label: "No", value: false },
                          { label: "Yes", value: true },
                        ].map((option, i) => (
                          <option key={i} value={option.value}>
                            {option.label}
                          </option>
                        ))
                      : options.map((option, i) => (
                          <option key={i} value={option}>
                            {option}
                          </option>
                        ))}
                  </select>
                ) : (
                  <input
                    id={name}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    className="w-full p-3 bg-white text-gray-700 border border-[#AC0000] rounded focus:outline-none"
                    required={required}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="px-6 py-3 rounded text-white bg-[#AC0000] hover:bg-gray-600 focus:outline-none transition duration-150"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
        <Modal
          isOpen={isModalOpen}
          toggleModal={toggleModal}
          type={modalType}
          message={modalMessage}
          color="gray"
          onCancel={toggleModal}
        />
      </Layout>
    </div>
  );
}
