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

export const dynamic = 'force-dynamic';

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
    <div className="registration-page min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-8 px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-md border border-emerald-100/50 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2 text-emerald-800">
            Create Account
          </h2>
          <p className="text-gray-600 text-sm">Join us and get started today</p>
        </div>

        {errors.overall && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center text-sm font-medium">
              {errors.overall}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-emerald-700 mb-2 font-semibold text-sm">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={inputData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent ${
                errors.name 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-emerald-200 bg-white hover:border-emerald-300'
              }`}
              placeholder="Enter your full name"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-emerald-700 mb-2 font-semibold text-sm">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={inputData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent ${
                errors.email 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-emerald-200 bg-white hover:border-emerald-300'
              }`}
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-emerald-700 mb-2 font-semibold text-sm">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={inputData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent ${
                  errors.password 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-emerald-200 bg-white hover:border-emerald-300'
                }`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-emerald-700 mb-2 font-semibold text-sm">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={inputData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent ${
                  errors.confirmPassword 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-emerald-200 bg-white hover:border-emerald-300'
                }`}
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3.5 px-4 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-emerald-600 hover:text-emerald-800 font-semibold hover:underline transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;

