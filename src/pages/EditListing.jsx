import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import ListingForm from "../components/ListingForm";
import LoadingState from "../components/LoadingState";

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadListing = async () => {
      try {
        setFetching(true);
        const { data } = await axiosClient.get(`/properties/${id}`);
        setInitialValues(data);
        setFetching(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load listing");
        setFetching(false);
      }
    };
    loadListing();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await axiosClient.put(`/properties/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLoading(false);
      navigate("/host-dashboard");
    } catch (err) {
      setLoading(false);
      throw new Error(err.response?.data?.message || "Failed to update listing");
    }
  };

  if (fetching) return <LoadingState text="Loading listing..." />;
  if (error) return <div className="card-surface p-6 text-sm text-rose-600">{error}</div>;

  return (
    <div className="space-y-5">
      <div className="hero-glow glass-panel p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8d847e]">Host Center</p>
        <h1 className="mt-2 text-3xl font-extrabold text-[#181512]">Edit Listing</h1>
        <p className="mt-2 text-sm text-[#6f6761]">Update details, location, media, and availability.</p>
      </div>
      <ListingForm
        initialValues={initialValues}
        loading={loading}
        onSubmit={handleSubmit}
        submitText="Save Changes"
      />
    </div>
  );
}

export default EditListing;
