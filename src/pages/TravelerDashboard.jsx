import { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";
import ConfirmModal from "../components/ConfirmModal";
import LoadingState from "../components/LoadingState";
import ProfileEditor from "../components/ProfileEditor";
import { getImageUrl } from "../utils/media";
import toast from "react-hot-toast";

function TravelerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/bookings/user");
      setBookings(data);
      setLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load bookings");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const upcoming = useMemo(() => {
    const now = new Date();
    return bookings.filter(
      (booking) => new Date(booking.checkOut) >= now && booking.bookingStatus !== "cancelled"
    );
  }, [bookings]);

  const stats = useMemo(() => {
    const totalSpent = bookings
      .filter((booking) => booking.bookingStatus === "confirmed")
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
    const cancelled = bookings.filter((booking) => booking.bookingStatus === "cancelled").length;
    return {
      upcoming: upcoming.length,
      cancelled,
      totalSpent,
    };
  }, [bookings, upcoming]);

  const cancelBooking = async () => {
    if (!bookingToCancel) return;
    try {
      await axiosClient.delete(`/bookings/${bookingToCancel._id}`);
      toast.success("Booking cancelled");
      setBookingToCancel(null);
      loadBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) return <LoadingState text="Loading your trips..." />;

  return (
    <div className="space-y-6">
      <section className="hero-glow glass-panel p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#8b827b]">
          Traveler Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-[#181512]">Your trips, organized</h1>
        <p className="mt-2 text-sm text-[#6c645e]">
          Keep track of upcoming stays, spending, and booking history.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8c837d]">
              Upcoming
            </p>
            <p className="mt-2 text-3xl font-extrabold text-[#1b1714]">{stats.upcoming}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8c837d]">
              Cancelled
            </p>
            <p className="mt-2 text-3xl font-extrabold text-[#1b1714]">{stats.cancelled}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8c837d]">
              Total Spend
            </p>
            <p className="mt-2 text-3xl font-extrabold text-[#1b1714]">${stats.totalSpent}</p>
          </div>
        </div>
      </section>

      <ProfileEditor />

      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold text-[#1b1714]">Upcoming Stays</h2>
        {upcoming.map((booking) => (
          <article key={booking._id} className="card-surface flex flex-wrap items-center gap-4 p-4">
            <img
              src={getImageUrl(booking.propertyId?.images?.[0])}
              alt={booking.propertyId?.title}
              className="h-24 w-36 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <p className="font-bold text-[#1f1b18]">{booking.propertyId?.title}</p>
              <p className="text-sm text-[#6d6560]">
                {booking.propertyId?.location?.city}, {booking.propertyId?.location?.country}
              </p>
              <p className="text-sm text-[#6d6560]">
                {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                {new Date(booking.checkOut).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-2 text-right">
              <p className="text-base font-bold text-[#1f1b18]">${booking.totalPrice}</p>
              <button
                type="button"
                className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600"
                onClick={() => setBookingToCancel(booking)}
              >
                Cancel
              </button>
            </div>
          </article>
        ))}
        {!upcoming.length ? (
          <div className="card-surface p-8 text-sm text-[#6f6761]">No upcoming stays.</div>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold text-[#1b1714]">All Bookings</h2>
        {bookings.map((booking) => (
          <article key={booking._id} className="card-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-[#1f1b18]">{booking.propertyId?.title}</p>
                <p className="text-sm text-[#6d6560]">
                  {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </p>
              </div>
              <p
                className={`text-xs font-bold uppercase tracking-[0.12em] ${
                  booking.bookingStatus === "cancelled" ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {booking.bookingStatus}
              </p>
            </div>
          </article>
        ))}
      </section>

      <ConfirmModal
        open={Boolean(bookingToCancel)}
        title="Cancel Booking"
        message="This action will mark the booking as cancelled."
        onCancel={() => setBookingToCancel(null)}
        onConfirm={cancelBooking}
        confirmText="Cancel Booking"
      />
    </div>
  );
}

export default TravelerDashboard;
