import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import LoadingState from "../components/LoadingState";
import ProfileEditor from "../components/ProfileEditor";
import HostAnalytics from "../components/HostAnalytics";
import useAuthStore from "../store/authStore";
import { getImageUrl } from "../utils/media";
import toast from "react-hot-toast";

function HostDashboard() {
  const { user } = useAuthStore();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const [propertiesRes, bookingsRes] = await Promise.all([
        axiosClient.get("/properties", { params: { hostId: user._id, limit: 30 } }),
        axiosClient.get("/bookings/host"),
      ]);
      setProperties(propertiesRes.data.data);
      setBookings(bookingsRes.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load host dashboard");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user?._id]);

  const stats = useMemo(() => {
    const confirmed = bookings.filter((booking) => booking.bookingStatus === "confirmed");
    const totalRevenue = confirmed.reduce((sum, booking) => sum + booking.totalPrice, 0);
    return {
      listings: properties.length,
      activeBookings: confirmed.length,
      totalRevenue,
    };
  }, [properties, bookings]);

  const deleteListing = async (id) => {
    const ok = window.confirm("Delete this listing?");
    if (!ok) return;
    try {
      await axiosClient.delete(`/properties/${id}`);
      toast.success("Listing deleted successfully");
      loadDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete listing");
    }
  };

  if (loading) return <LoadingState text="Loading host dashboard..." />;
  if (error) return <div className="card-surface p-6 text-sm text-rose-600">{error}</div>;

  return (
    <div className="space-y-6">
      <section className="hero-glow glass-panel p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#8b827b]">
              Host Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#181512]">Manage your portfolio</h1>
            <p className="mt-2 text-sm text-[#6c645e]">
              Track occupancy, monitor guest reservations, and update listings quickly.
            </p>
          </div>
          <Link to="/host/listings/create" className="btn-primary">
            Add Listing
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8c837d]">Listings</p>
            <p className="mt-2 text-3xl font-extrabold text-[#1b1714]">{stats.listings}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8c837d]">
              Active Bookings
            </p>
            <p className="mt-2 text-3xl font-extrabold text-[#1b1714]">{stats.activeBookings}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8c837d]">Revenue</p>
            <p className="mt-2 text-3xl font-extrabold text-[#1b1714]">${stats.totalRevenue}</p>
          </div>
        </div>
      </section>

      <HostAnalytics bookings={bookings} />

      <ProfileEditor />

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-[#1b1714]">Your Listings</h2>
          <p className="text-sm font-medium text-[#6a625c]">{properties.length} total</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {properties.map((property) => (
            <article key={property._id} className="card-surface overflow-hidden">
              <img
                src={getImageUrl(property.images?.[0])}
                alt={property.title}
                className="h-48 w-full object-cover"
              />
              <div className="space-y-3 p-4">
                <h3 className="text-lg font-bold text-[#201c19]">{property.title}</h3>
                <p className="text-sm text-[#6f6761]">
                  {property.location?.city}, {property.location?.country}
                </p>
                <p className="text-sm font-semibold text-[#312b27]">${property.pricePerNight}/night</p>
                <div className="flex gap-2">
                  <Link className="btn-secondary px-3 py-2" to={`/host/listings/${property._id}/edit`}>
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600"
                    onClick={() => deleteListing(property._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
          {!properties.length ? (
            <div className="card-surface p-8 text-sm text-[#6f6761]">No listings yet.</div>
          ) : null}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold text-[#1b1714]">Recent Bookings</h2>
        <div className="space-y-3">
          {bookings.map((booking) => (
            <article key={booking._id} className="card-surface flex flex-wrap items-center gap-4 p-4">
              <img
                src={getImageUrl(booking.propertyId?.images?.[0])}
                alt={booking.propertyId?.title}
                className="h-24 w-36 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <p className="font-bold text-[#1f1b18]">{booking.propertyId?.title}</p>
                <p className="text-sm text-[#6d6560]">Traveler: {booking.travelerId?.name}</p>
                <p className="text-sm text-[#6d6560]">
                  {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-[#1f1b18]">${booking.totalPrice}</p>
                <p
                  className={`text-xs font-bold uppercase tracking-[0.12em] ${
                    booking.bookingStatus === "cancelled"
                      ? "text-rose-600"
                      : booking.bookingStatus === "confirmed"
                        ? "text-emerald-600"
                        : "text-amber-600"
                  }`}
                >
                  {booking.bookingStatus}
                </p>
              </div>
            </article>
          ))}
          {!bookings.length ? (
            <div className="card-surface p-8 text-sm text-[#6f6761]">No bookings yet.</div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default HostDashboard;
