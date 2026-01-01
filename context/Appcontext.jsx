"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = loading, null = no user
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/",
    withCredentials: true,
  });

  // Set mounted state on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check auth on load (only after mount)
  useEffect(() => {
    if (!mounted) return;
    
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const { data } = await axiosInstance.get("/user/is-auth", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    checkAuth();
  }, [mounted]);

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/user/register", {
        name,
        email,
        password,
      });

      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem("token", data.token); // store token
        }
        setUser(data.user);
        toast.success("Account created successfully");
        router.push("/dashboard");
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/user/login", {
        email,
        password,
      });

      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.setItem("token", data.token);
        }
        setUser(data.user);
        toast.success("Logged in successfully");
        router.push("/dashboard");
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
      }
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/"); // Redirect to Home page
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

