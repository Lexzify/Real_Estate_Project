import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "../store/authStore";

function Navbar() {
  const navigate = useNavigate();
  const { user, token, logout, fetchMe } = useAuthStore();

  useEffect(() => {
    if (token && !user?._id) {
      fetchMe();
    }
  }, [token, user?._id, fetchMe]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#e9e3dd]/80 bg-white/75 backdrop-blur-xl">
      <div className="layout-shell flex min-h-18 flex-wrap items-center justify-between gap-3 py-3">
        <Link to="/" className="group inline-flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[#ff5a70] to-[#e13d58] text-lg text-white shadow-[0_14px_26px_-18px_rgba(239,68,96,0.9)]">
            L
          </span>
          <div className="leading-tight">
            <p className="text-[1.05rem] font-extrabold text-[#1f1a17] transition group-hover:text-[#e63f5b]">
              Lexzify Properties
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#8e8680]">
              Stay Better
            </p>
          </div>
        </Link>

        <nav className="order-3 flex w-full items-center justify-between gap-2 rounded-2xl border border-[#ece6df] bg-white px-2 py-1.5 sm:order-2 sm:w-auto sm:justify-start">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `btn-ghost ${isActive ? "bg-[#f6f2ef] text-[#161311]" : "text-[#5d5752]"}`
            }
          >
            Explore
          </NavLink>

          {user?.role === "host" && (
            <NavLink
              to="/host-dashboard"
              className={({ isActive }) =>
                `btn-ghost ${isActive ? "bg-[#f6f2ef] text-[#161311]" : "text-[#5d5752]"}`
              }
            >
              Hosting
            </NavLink>
          )}

          {user?.role === "traveler" && (
            <NavLink
              to="/traveler-dashboard"
              className={({ isActive }) =>
                `btn-ghost ${isActive ? "bg-[#f6f2ef] text-[#161311]" : "text-[#5d5752]"}`
              }
            >
              Trips
            </NavLink>
          )}

          {user?.role === "host" ? (
            <Link to="/host/listings/create" className="btn-ghost text-[#5d5752]">
              New Listing
            </Link>
          ) : null}
        </nav>

        <div className="order-2 ml-auto flex items-center gap-2 sm:order-3">
          {token ? (
            <>
              <span className="hidden rounded-xl bg-[#f6f2ee] px-3 py-2 text-sm font-semibold text-[#514a45] md:block">
                {user?.name || "Account"}
              </span>
              <button type="button" onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
