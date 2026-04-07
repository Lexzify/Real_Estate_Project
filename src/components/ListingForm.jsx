import { useMemo, useState } from "react";
import { AMENITIES, CATEGORIES } from "../constants/filterOptions";
import { getImageUrl } from "../utils/media";
import AmenitySelector from "./AmenitySelector";
import MapPicker from "./MapPicker";

const defaultValues = {
  title: "",
  description: "",
  pricePerNight: 5000,
  amenities: [],
  categories: [],
  location: {
    address: "",
    city: "",
    country: "",
    latitude: 40.7128,
    longitude: -74.006,
  },
  availability: {
    isAvailable: true,
    startDate: "",
    endDate: "",
  },
  images: [],
};

function ListingForm({ initialValues = defaultValues, onSubmit, submitText = "Save Listing", loading }) {
  const [form, setForm] = useState({
    ...defaultValues,
    ...initialValues,
    amenities: initialValues.amenities || [],
    categories: initialValues.categories || [],
    location: { ...defaultValues.location, ...(initialValues.location || {}) },
    availability: {
      ...defaultValues.availability,
      ...(initialValues.availability || {}),
      startDate: initialValues.availability?.startDate?.slice?.(0, 10) || "",
      endDate: initialValues.availability?.endDate?.slice?.(0, 10) || "",
    },
    images: initialValues.images || [],
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const filePreview = useMemo(() => Array.from(files).map((file) => file.name), [files]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (
      !form.title ||
      !form.description ||
      !form.pricePerNight ||
      !form.location.address ||
      !form.location.city ||
      !form.location.country
    ) {
      setError("Please fill all required fields.");
      return;
    }

    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("description", form.description);
    payload.append("pricePerNight", String(form.pricePerNight));
    payload.append("amenities", JSON.stringify(form.amenities));
    payload.append("categories", JSON.stringify(form.categories));
    payload.append("location", JSON.stringify(form.location));
    payload.append("availability", JSON.stringify(form.availability));
    payload.append("existingImages", JSON.stringify(form.images));

    Array.from(files).forEach((file) => payload.append("images", file));

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.message || "Failed to save listing");
    }
  };

  return (
    <form className="space-y-5" onSubmit={submit}>
      <section className="hero-glow card-surface p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#8d837c]">
          Listing Studio
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-[#1b1714]">Create a stay guests remember</h2>
        <p className="mt-2 text-sm text-[#6f6761]">
          Add compelling details, set fair pricing, and pin your exact location on the map.
        </p>
      </section>

      <section className="card-surface space-y-4 p-5 sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#8d837c]">Basic Details</p>
          <h3 className="mt-1 text-lg font-bold text-[#221d1a]">Title, pricing and description</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8a817a]">
              Title *
            </label>
            <input
              className="input"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8a817a]">
              Price Per Night (₹) *
            </label>
            <input
              type="number"
              min="1"
              className="input"
              value={form.pricePerNight}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, pricePerNight: Number(event.target.value) }))
              }
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8a817a]">
            Description *
          </label>
          <textarea
            rows={5}
            className="textarea"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
        </div>
      </section>

      <section className="card-surface space-y-4 p-5 sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#8d837c]">Location</p>
          <h3 className="mt-1 text-lg font-bold text-[#221d1a]">Address and map pin</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8a817a]">
              Address *
            </label>
            <input
              className="input"
              value={form.location.address}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  location: { ...prev.location, address: event.target.value },
                }))
              }
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8a817a]">
              City *
            </label>
            <input
              className="input"
              value={form.location.city}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  location: { ...prev.location, city: event.target.value },
                }))
              }
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8a817a]">
            Country *
          </label>
          <input
            className="input"
            value={form.location.country}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                location: { ...prev.location, country: event.target.value },
              }))
            }
          />
        </div>

        <MapPicker
          value={form.location}
          onChange={(location) => setForm((prev) => ({ ...prev, location }))}
        />
      </section>

      <section className="card-surface space-y-5 p-5 sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#8d837c]">Experience</p>
          <h3 className="mt-1 text-lg font-bold text-[#221d1a]">Amenities and categories</h3>
        </div>

        <AmenitySelector
          title="Amenities"
          options={AMENITIES}
          selected={form.amenities}
          onChange={(amenities) => setForm((prev) => ({ ...prev, amenities }))}
        />
        <AmenitySelector
          title="Categories"
          options={CATEGORIES}
          selected={form.categories}
          onChange={(categories) => setForm((prev) => ({ ...prev, categories }))}
        />
      </section>

      <section className="card-surface space-y-4 p-5 sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#8d837c]">Operations</p>
          <h3 className="mt-1 text-lg font-bold text-[#221d1a]">Availability and photos</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="card-soft flex items-center gap-3 px-3 py-2 text-sm font-semibold text-[#4f4843]">
            <input
              type="checkbox"
              checked={form.availability.isAvailable}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  availability: { ...prev.availability, isAvailable: event.target.checked },
                }))
              }
            />
            Available for booking
          </label>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8a817a]">
              Available From
            </label>
            <input
              type="date"
              className="input"
              value={form.availability.startDate}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  availability: { ...prev.availability, startDate: event.target.value },
                }))
              }
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8a817a]">
              Available To
            </label>
            <input
              type="date"
              className="input"
              value={form.availability.endDate}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  availability: { ...prev.availability, endDate: event.target.value },
                }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-[#8a817a]">
            Upload Images
          </label>
          <input
            type="file"
            className="input"
            accept="image/*"
            multiple
            onChange={(event) => setFiles(event.target.files || [])}
          />
          {filePreview.length ? (
            <p className="text-xs text-[#7d746d]">New files: {filePreview.join(", ")}</p>
          ) : null}
        </div>

        {form.images.length ? (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[#3b3531]">Current Images</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {form.images.map((img) => (
                <div key={img} className="relative">
                  <img
                    src={getImageUrl(img)}
                    alt="Listing"
                    className="h-20 w-full rounded-xl border border-[#e9e2dc] object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1 rounded-lg bg-black/65 px-2 py-0.5 text-xs font-medium text-white"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        images: prev.images.filter((item) => item !== img),
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      {error ? <p className="text-sm font-semibold text-rose-600">{error}</p> : null}

      <div className="flex justify-end">
        <button type="submit" className="btn-primary min-w-40" disabled={loading}>
          {loading ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}

export default ListingForm;
