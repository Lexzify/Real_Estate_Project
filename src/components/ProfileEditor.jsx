import { useState } from "react";
import useAuthStore from "../store/authStore";

function ProfileEditor() {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      setLoading(true);
      await updateProfile({
        name,
        profileImage,
        ...(password ? { password } : {}),
      });
      setPassword("");
      setLoading(false);
      setMessage("Profile updated.");
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to update profile");
    }
  };

  return (
    <form onSubmit={submit} className="card-surface space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-[#1c1916]">Profile Settings</h3>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8a817a]">
          account
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          className="input"
          placeholder="Profile image URL"
          value={profileImage}
          onChange={(event) => setProfileImage(event.target.value)}
        />
      </div>
      <input
        type="password"
        className="input"
        placeholder="New password (optional)"
        minLength={6}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Update Profile"}
      </button>
    </form>
  );
}

export default ProfileEditor;
