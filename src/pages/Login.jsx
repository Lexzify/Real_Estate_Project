import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, token, user, isLoading } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (!token) return;
    if (user?.role === "host") navigate("/host-dashboard");
    else if (user?.role === "traveler") navigate("/traveler-dashboard");
    else navigate("/");
  }, [token, user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo);
      toast.success("Logged in successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1fr_1.05fr]">
      <section className="hero-glow glass-panel flex flex-col justify-between p-7 sm:p-9">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#887f79]">Welcome Back</p>
          <h1 className="section-title">Sign in and continue your journey.</h1>
          <p className="section-copy">
            Track trips, manage bookings, and host properties from one streamlined workspace.
          </p>
        </div>
        <div className="grid gap-3 pt-8 sm:grid-cols-2">
          <div className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#89817a]">Secure</p>
            <p className="mt-1 text-sm font-bold text-[#241f1b]">JWT + encrypted credentials</p>
          </div>
          <div className="stat-card">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#89817a]">Fast</p>
            <p className="mt-1 text-sm font-bold text-[#241f1b]">Map-first property discovery</p>
          </div>
        </div>
      </section>

      <section className="card-surface p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-[#171411]">Login</h2>
        <p className="mt-1 text-sm text-[#6e6661]">Use your account credentials to sign in.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
              required
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-sm text-[#6d6560]">
          No account?{" "}
          <Link to="/register" className="font-semibold text-rose-600 hover:text-rose-700">
            Create one
          </Link>
        </p>
      </section>
    </div>
  );
}

export default Login;
