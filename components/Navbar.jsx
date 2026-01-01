"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTools } from "react-icons/fa";
import "../app/globals.css";

function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo">
        <Link href="/">
          <FaTools className="logo-icon" />
          <h2>Home<span>Fix</span></h2>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link href="/" className={`nav-item ${pathname === "/" ? "active" : ""}`}>
          Home
        </Link>
        <Link href="/services" className={`nav-item ${pathname === "/services" ? "active" : ""}`}>
          Services
        </Link>
        <Link href="/about" className={`nav-item ${pathname === "/about" ? "active" : ""}`}>
          About
        </Link>
        <Link href="/contact" className={`nav-item ${pathname === "/contact" ? "active" : ""}`}>
          Contact
        </Link>
      </div>

      {/* Right-side Buttons */}
      <div className="nav-buttons">
        <Link href="/dashboard">
          <button className="btn-outline">Dashboard</button>
        </Link>
        <Link href="/login">
          <button className="btn-outline">Login</button>
        </Link>
        <Link href="/registration">
          <button className="btn-filled">Register</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

