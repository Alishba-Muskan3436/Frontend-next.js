"use client";

import React from "react";
import "../../App.css";
import Link from "next/link";

const Services = () => {
  return (
    <section className="services-section">
      <h2>Our Services</h2>
      <p className="services-intro">
        Explore some of our most popular features that make home maintenance simple.
      </p>

      <div className="services-grid">
        <div className="service-card">
          <img src="/images/chat.jpg" alt="Instant Chat" />
          <h3>Instant Chat</h3>
          <p>Chat live with service providers for quick communication.</p>
          <Link href="/login">
            <button className="view-btn">View More</button>
          </Link>
        </div>

        <div className="service-card">
          <img src="/images/booking.jpg" alt="Booking Service" />
          <h3>Booking Service</h3>
          <p>Book or cancel services in seconds with real-time updates.</p>
          <Link href="/login">
            <button className="view-btn">View More</button>
          </Link>
        </div>

        <div className="service-card">
          <img src="/images/finder.jpg" alt="Service Area Finder" />
          <h3>Service Area Finder</h3>
          <p>Find nearby professionals in your location instantly.</p>
          <Link href="/login">
            <button className="view-btn">View More</button>
          </Link>
        </div>

        <div className="service-card">
          <img src="/images/technician.jpg" alt="Technician Availability" />
          <h3>Technician Availability</h3>
          <p>Check which technicians are free in real time.</p>
          <Link href="/login">
            <button className="view-btn">View More</button>
          </Link>
        </div>

        <div className="service-card">
          <img src="/images/reviews.jpg" alt="Reviews & Ratings" />
          <h3>Reviews & Ratings</h3>
          <p>Read verified customer reviews before booking.</p>
          <Link href="/services/reviews-ratings">
            <button className="view-btn">View More</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;