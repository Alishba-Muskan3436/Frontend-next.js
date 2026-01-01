"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export const dynamic = 'force-dynamic';

const ServiceRating = () => {
  const params = useParams();
  const bookingId = params.bookingId;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState({
    stars: 0,
    review: "",
    title: ""
  });

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.success) {
          setBooking(data.booking);
        } else {
          toast.error("Booking not found");
          router.push("/bookings");
        }
      } catch (error) {
        toast.error("Failed to load booking details");
        router.push("/bookings");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId, router]);

  const handleStarClick = (starCount) => {
    setRating({ ...rating, stars: starCount });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating.stars === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/api/bookings/${bookingId}/rate`,
        rating,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Rating submitted successfully!");
        router.push("/bookings");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-4 border-emerald-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-emerald-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-6">Rate Your Service</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Service: {booking.serviceType}</h2>
          <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className={`text-4xl ${
                    star <= rating.stars ? "text-yellow-400" : "text-gray-300"
                  } hover:text-yellow-400 transition`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Review Title</label>
            <input
              type="text"
              value={rating.title}
              onChange={(e) => setRating({ ...rating, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter a title for your review"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Review</label>
            <textarea
              value={rating.review}
              onChange={(e) => setRating({ ...rating, review: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows="5"
              placeholder="Share your experience..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Rating"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/bookings")}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceRating;

