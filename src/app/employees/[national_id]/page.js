"use client";

import { useState, useEffect } from "react";

async function getNationalID(params) {
  // Simulate fetching or processing to get the national ID
  const national_id = (await params).national_id
  return national_id
}

export default function MyComponent({ params }) {
  const [nationalID, setNationalID] = useState(null);

  useEffect(() => {
    // Fetch the national ID and set the state
    async function fetchNationalID() {
      const id = await getNationalID(params);
      setNationalID(id);
    }

    fetchNationalID();
  }, [params]); // Dependency array ensures it runs when `params` change

  return <div>National ID: {nationalID || "Not provided"}</div>;
}

