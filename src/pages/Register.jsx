import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const { register, token, user, isLoading } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "traveler",
  });

  useEffect(() => {
    if (!token) return;
    if (user?.role === "host") navigate("/host-dashboard");
    else navigate("/traveler-dashboard");
  }, [token, user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      toast.success("Account created successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1fr_1.05fr]">
      <section className="hero-glow glass-panel flex flex-col justify-between p-7 sm:p-9">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#887f79]">
            Join Lexzify Properties
          </p>
          <h1 className="section-title">Create your account and start in minutes.</h1>
          <p className="section-copy">
            Travelers can book curated stays. Hosts can publish listings and manage occupancy from
            a dedicated dashboard.
          </p>
        </div>
        <div className="grid gap-3 pt-8">
          <div className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#89817a]">
              Host Tools
            </p>
            <p className="mt-1 text-sm font-bold text-[#241f1b]">
              Listing builder, map picker, and booking management
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#89817a]">
              Traveler Tools
            </p>
            <p className="mt-1 text-sm font-bold text-[#241f1b]">
              Smart filters, map discovery, and trip dashboard
            </p>
          </div>
        </div>
      </section>

      <section className="card-surface p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-[#171411]">Create Account</h2>
        <p className="mt-1 text-sm text-[#6e6661]">Set up your profile as host or traveler.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8a817b]">
              Name
            </label>
            <input
              className="input"
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8a817b]">
              Email
            </label>
            <input
              type="email"
              className="input"
              required
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8a817b]">
              Password
            </label>
            <input
              type="password"
              className="input"
              minLength={6}
              required
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8a817b]">
              Role
            </label>
            <select
              className="input"
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
            >
              <option value="traveler">Traveler</option>
              <option value="host">Host</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="mt-5 text-sm text-[#6d6560]">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-rose-600 hover:text-rose-700">
            Login
          </Link>
        </p>
      </section>
    </div>
  );
}

export default Register;
