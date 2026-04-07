import { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";
import useAuthStore from "../store/authStore";
import { nightsBetween } from "../utils/date";
import { areIntervalsOverlapping, parseISO, startOfDay } from "date-fns";
import toast from "react-hot-toast";

function BookingWidget({ property, onBooked }) {
  const { user } = useAuthStore();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    if (!property?._id) return;
    axiosClient.get(`/bookings/property/${property._id}/dates`)
      .then(res => setBookedDates(res.data))
      .catch(console.error);
  }, [property?._id]);

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const total = nights * (property?.pricePerNight || 0);

  const canBook = user?.role === "traveler";

  const submitBooking = async () => {
    if (!checkIn || !checkOut || nights <= 0) {
      toast.error("Select a valid check-in/check-out range.");
      return;
    }

    const checkInDate = startOfDay(parseISO(checkIn));
    const checkOutDate = startOfDay(parseISO(checkOut));
    
    const hasConflict = bookedDates.some(booking => {
      const bStart = startOfDay(parseISO(booking.checkIn));
      const bEnd = startOfDay(parseISO(booking.checkOut));
      // End boundary is exclusive for overlapping logic in hotel bookings typically, 
      // i.e., I can check-in on the exact day someone else checks-out.
      // But let's use a strict overlap if checking in BEFORE they check out,
      // and checking out AFTER they check in.
      return bStart < checkOutDate && bEnd > checkInDate;
    });

    if (hasConflict) {
      toast.error("These dates overlap with an existing booking.");
      return;
    }

    try {
      setLoading(true);
      await axiosClient.post("/bookings", {
        propertyId: property._id,
        checkIn,
        checkOut,
      });
      setLoading(false);
      setCheckIn("");
      setCheckOut("");
      toast.success("Booking confirmed!");
      if (onBooked) onBooked();
    } catch (err) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  if (!canBook) {
    return (
      <aside className="card-surface p-5 text-sm text-slate-600">
        Login as a traveler to reserve this stay and see live pricing.
      </aside>
    );
  }

  return (
    <aside className="card-surface space-y-4 p-5">
      <div className="flex items-end justify-between gap-3">
        <p className="text-2xl font-extrabold text-[#1a1714]">
          ₹{property.pricePerNight}
          <span className="ml-1 text-sm font-medium text-[#6c655f]">night</span>
        </p>
        <span className="rounded-full bg-[#f8f3ee] px-3 py-1 text-xs font-semibold text-[#7b726b]">
          Instant Confirm
        </span>
      </div>

      <div className="rounded-2xl border border-[#e8e1d9] p-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8e857f]">Booking Dates</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Check-in
            </label>
            <input
              type="date"
              className="input"
              value={checkIn}
              onChange={(event) => setCheckIn(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Check-out
            </label>
            <input
              type="date"
              className="input"
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-[#f6f2ee] p-3 text-sm text-[#5d5651]">
        {nights > 0 ? (
          <div className="space-y-1">
            <p className="font-semibold">
              {nights} nights x ₹{property.pricePerNight}
            </p>
            <p className="text-base font-extrabold text-[#1b1815]">Total ₹{total}</p>
          </div>
        ) : (
          "Pick dates to calculate total"
        )}
      </div>

      <p className="text-xs text-[#8a827b]">
        Free cancellation for 24 hours after booking.
      </p>

      <button type="button" className="btn-primary w-full" onClick={submitBooking} disabled={loading}>
        {loading ? "Booking..." : "Book Now"}
      </button>
    </aside>
  );
}

export default BookingWidget;
