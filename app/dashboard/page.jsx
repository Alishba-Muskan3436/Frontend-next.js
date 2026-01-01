"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/Appcontext";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, setUser, logout } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingReviews: 0,
    upcomingBookings: 0,
    activeChats: 0,
    totalBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const router = useRouter();

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If not authenticated, skip protected API calls but allow the
      // dashboard page to render a limited view instead of forcing
      // a redirect to the login page.
      setLoading(false);
      return;
    }

    try {
      const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userResponse.data.success) {
        setUser(userResponse.data.user);
      } else {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const bookingsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (bookingsResponse.data.success) {
        const bookings = bookingsResponse.data.bookings;
        
        const pendingReviews = bookings.filter(
          booking => booking.status === 'Completed' && !booking.rated
        ).length;
        
        const upcomingBookings = bookings.filter(
          booking => booking.status === 'Scheduled' || booking.status === 'Pending'
        ).length;

        setStats({
          pendingReviews,
          upcomingBookings,
          activeChats: 0,
          totalBookings: bookings.length
        });

        setRecentBookings(bookings.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50">
        <div className="text-center">
          <div className="spinner border-4 border-emerald-500 border-t-transparent rounded-full w-16 h-16 animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-2">
              Dashboard
            </h1>
            {user && (
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            )}
          </div>
          <button
            onClick={logout}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            Logout
          </button>
        </div>

        {/* User Info Card */}
        {user && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-emerald-500">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-emerald-800 mb-1">
                  {user.name}
                </h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-emerald-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 font-medium text-sm uppercase tracking-wide">Pending Reviews</h3>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-emerald-600 text-xl">⭐</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-emerald-600 mb-2">{stats.pendingReviews}</p>
            <Link 
              href="/pending-reviews" 
              className="text-emerald-600 hover:text-emerald-800 text-sm font-medium hover:underline inline-flex items-center gap-1"
            >
              View all <span>→</span>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-purple-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 font-medium text-sm uppercase tracking-wide">Instant Chat</h3>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">💬</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">{stats.activeChats}</p>
            <Link 
              href="/services/instant-chat" 
              className="text-purple-600 hover:text-purple-800 text-sm font-medium hover:underline inline-flex items-center gap-1"
            >
              Start chat <span>→</span>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-orange-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 font-medium text-sm uppercase tracking-wide">Total Bookings</h3>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">📋</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-2">{stats.totalBookings}</p>
            <Link 
              href="/bookings" 
              className="text-orange-600 hover:text-orange-800 text-sm font-medium hover:underline inline-flex items-center gap-1"
            >
              View all <span>→</span>
            </Link>
          </div>
        </div>

        {/* Service Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 font-medium text-sm uppercase tracking-wide">Service Area Finder</h3>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📍</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Find services available in your area</p>
            <Link 
              href="/services/service-area-finder" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline inline-flex items-center gap-1"
            >
              Find services <span>→</span>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-yellow-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 font-medium text-sm uppercase tracking-wide">Rate Service</h3>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">⭐</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Rate your completed services</p>
            <Link 
              href="/services/reviews-ratings" 
              className="text-yellow-600 hover:text-yellow-800 text-sm font-medium hover:underline inline-flex items-center gap-1"
            >
              Rate services <span>→</span>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-indigo-500">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 font-medium text-sm uppercase tracking-wide">Technician Availability</h3>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 text-xl">👷</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">Check technician availability status</p>
            <Link 
              href="/services/technician-availability" 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline inline-flex items-center gap-1"
            >
              Check availability <span>→</span>
            </Link>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-emerald-800">Recent Bookings</h2>
            <div className="flex items-center gap-4">
              <Link 
                href="/services/booking-service"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                <span>+</span> Create New Booking
              </Link>
              <Link 
                href="/bookings"
                className="text-emerald-600 hover:text-emerald-800 font-medium text-sm hover:underline"
              >
                View all bookings →
              </Link>
            </div>
          </div>
          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-4 text-gray-700 font-semibold">Service</th>
                    <th className="text-left p-4 text-gray-700 font-semibold">Date</th>
                    <th className="text-left p-4 text-gray-700 font-semibold">Status</th>
                    <th className="text-left p-4 text-gray-700 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking, index) => (
                    <tr 
                      key={booking._id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === recentBookings.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="p-4 font-medium text-gray-800">{booking.serviceType || 'N/A'}</td>
                      <td className="p-4 text-gray-600">
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          booking.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : booking.status === 'Scheduled' 
                            ? 'bg-blue-100 text-blue-800' 
                            : booking.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {booking.status === 'Completed' && !booking.rated && (
                          <Link
                            href={`/rate-service/${booking._id}`}
                            className="text-emerald-600 hover:text-emerald-800 font-medium text-sm hover:underline inline-flex items-center gap-1"
                          >
                            Rate Service <span>→</span>
                          </Link>
                        )}
                        {(!booking.status || booking.status !== 'Completed' || booking.rated) && (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-lg font-medium">No recent bookings</p>
              <p className="text-gray-500 text-sm mt-2">Your bookings will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

