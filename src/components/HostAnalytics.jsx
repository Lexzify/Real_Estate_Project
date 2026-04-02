import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function HostAnalytics({ bookings }) {
  const data = useMemo(() => {
    const monthlyData = {};

    bookings.forEach((booking) => {
      if (booking.bookingStatus !== "confirmed") return;
      
      const date = new Date(booking.checkIn);
      const monthYear = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { name: monthYear, revenue: 0, stays: 0, sortKey: date.getTime() };
      }
      
      monthlyData[monthYear].revenue += booking.totalPrice;
      monthlyData[monthYear].stays += 1;
    });

    return Object.values(monthlyData).sort((a, b) => a.sortKey - b.sortKey);
  }, [bookings]);

  if (!data.length) {
    return (
      <div className="card-surface p-8 text-center text-sm text-[#6f6761]">
        Not enough booking data to display analytics yet.
      </div>
    );
  }

  return (
    <div className="card-surface space-y-4 p-5 sm:p-6">
      <h3 className="text-lg font-bold text-[#1b1714]">Monthly Revenue Overview</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#8c837d" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis 
              stroke="#8c837d" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => `$${value}`} 
            />
            <Tooltip 
              cursor={{ fill: 'rgba(232, 226, 218, 0.4)' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
              formatter={(value, name) => [name === 'revenue' ? `$${value}` : value, name.charAt(0).toUpperCase() + name.slice(1)]}
            />
            <Bar dataKey="revenue" fill="#1b1714" radius={[4, 4, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default HostAnalytics;
