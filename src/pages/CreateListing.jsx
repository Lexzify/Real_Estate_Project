import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import ListingForm from "../components/ListingForm";

function CreateListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.post("/properties", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Listing created successfully.");
      setLoading(false);
      navigate(`/properties/${data._id}`);
    } catch (error) {
      setLoading(false);
      throw new Error(error.response?.data?.message || "Failed to create listing");
    }
  };

  return (
    <div className="space-y-5">
      <div className="hero-glow glass-panel p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8d847e]">Host Center</p>
        <h1 className="mt-2 text-3xl font-extrabold text-[#181512]">Create Listing</h1>
        <p className="mt-2 text-sm text-[#6f6761]">
          Add your property details, amenities, categories, and exact location.
        </p>
      </div>
      {message ? (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}
      <ListingForm loading={loading} onSubmit={handleSubmit} submitText="Create Listing" />
    </div>
  );
}

export default CreateListing;
