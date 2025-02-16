import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
  
    try {
      if (!email || !password) {
        throw new Error("Both fields are required.");
      }
  
      const response = await fetch("/api/employee/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }
  
      // Store token and email in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email); // Save user's email
  
      setIsLoading(false);
  
      // Small delay before redirecting to ensure data is saved
      setTimeout(() => {
        router.push("/");
      }, 100);
  
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };
  
  

  return (
    <div className="flex justify-center items-center min-h-screen ">


      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-center">
          <Image
                    src="/images/logo.png"
                    alt="Expense Icon"
                    width={150}
                    height={150}
                    className="transition duration-75 group-hover:opacity-80 ml-2"
                  />
        </div>
                  
{/* 
        <h2 className="text-lg  text-gray-200 mb-6">
          Login
        </h2> */}
        {errorMessage && (
          <p className="text-sm text-red-500 text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 text-white font-medium rounded-lg ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
