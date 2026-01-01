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
      <div className="dashboard-page min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner border-4 border-emerald-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page min-h-screen bg-emerald-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800">Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-emerald-800 mb-2">
              Welcome, {user.name}!
            </h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 mb-2">Pending Reviews</h3>
            <p className="text-3xl font-bold text-emerald-600">{stats.pendingReviews}</p>
            <Link href="/pending-reviews" className="text-emerald-600 hover:underline text-sm mt-2 block">
              View all →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 mb-2">Upcoming Bookings</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.upcomingBookings}</p>
            <Link href="/bookings" className="text-blue-600 hover:underline text-sm mt-2 block">
              View all →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 mb-2">Active Chats</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.activeChats}</p>
            <Link href="/services/instant-chat" className="text-purple-600 hover:underline text-sm mt-2 block">
              Start chat →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.totalBookings}</p>
            <Link href="/bookings" className="text-orange-600 hover:underline text-sm mt-2 block">
              View all →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-emerald-800 mb-4">Recent Bookings</h2>
          {recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Service</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking._id} className="border-b">
                      <td className="p-2">{booking.serviceType}</td>
                      <td className="p-2">{new Date(booking.date).toLocaleDateString()}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-2">
                        {booking.status === 'Completed' && !booking.rated && (
                          <Link
                            href={`/rate-service/${booking._id}`}
                            className="text-emerald-600 hover:underline text-sm"
                          >
                            Rate Service
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No recent bookings</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

