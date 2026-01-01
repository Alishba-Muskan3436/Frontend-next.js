"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/Appcontext";
import { sanitizeInput } from "@/src/Utils/sanitizeInput";
import { regNameTest } from "@/src/Utils/regNameTest";
import { regEmailTest } from "@/src/Utils/regEmailTest";
import { charLength } from "@/src/Utils/charLength";

const Registration = () => {
  const { register } = useAppContext();
  const router = useRouter();
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const name = sanitizeInput(inputData.name);
    const email = sanitizeInput(inputData.email);
    const password = sanitizeInput(inputData.password);
    const confirmPassword = sanitizeInput(inputData.confirmPassword);

    let valid = true;
    const newErrors = {};

    if (!name) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (regNameTest(name) === 0) {
      newErrors.name = "Only alphabets allowed in name";
      valid = false;
    } else if (charLength(name, 3, 35) === 0) {
      newErrors.name = "Name must be 3–35 characters";
      valid = false;
    }

    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (regEmailTest(email) === 0) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (charLength(password, 6, 35) === 0) {
      newErrors.password = "Password must be 6–35 characters long";
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    if (!valid) {
      newErrors.overall = "Please fix the highlighted errors.";
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="bg-white p-12 rounded-xl shadow-lg w-full max-w-md border border-emerald-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-emerald-800">
          Register
        </h2>

        {errors.overall && (
          <p className="text-red-500 text-center mb-4 font-medium">
            {errors.overall}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-emerald-700 mb-2 font-medium">Name*</label>
            <input
              type="text"
              name="name"
              value={inputData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              placeholder="Enter your name"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-5">
            <label className="block text-emerald-700 mb-2 font-medium">Email*</label>
            <input
              type="email"
              name="email"
              value={inputData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
              placeholder="Enter your email"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-5">
            <label className="block text-emerald-700 mb-2 font-medium">Password*</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={inputData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-emerald-700 mb-2 font-medium">Confirm Password*</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={inputData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-white py-3 px-4 rounded-lg hover:bg-amber-600 transition duration-300 font-medium shadow-md hover:shadow-lg disabled:opacity-70"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="mt-5 text-center">
            <Link
              href="/login"
              className="text-emerald-600 hover:text-emerald-800 hover:underline font-medium"
            >
              Already have an account? <span className="text-amber-600">Login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;

