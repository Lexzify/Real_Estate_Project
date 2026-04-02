import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import BookingWidget from "../components/BookingWidget";
import LoadingState from "../components/LoadingState";
import Lightbox from "../components/Lightbox";
import { formatLabel } from "../constants/filterOptions";
import { getImageUrl } from "../utils/media";
import toast from "react-hot-toast";

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(`/properties/${id}`);
        setProperty(data);
        setLoading(false);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load property");
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  if (loading) return <LoadingState text="Loading property..." />;
  if (!property) return null;

  return (
    <div className="space-y-6">
      <div className="hero-glow glass-panel space-y-3 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8d847e]">Property Details</p>
        <h1 className="text-3xl font-extrabold text-[#181512] sm:text-4xl">{property.title}</h1>
        <p className="text-sm text-[#6b645e]">
          {property.location?.address}, {property.location?.city}, {property.location?.country}
        </p>
        <div className="flex flex-wrap gap-2">
          {(property.categories || []).map((category) => (
            <span key={category} className="pill pill-active">
              {formatLabel(category)}
            </span>
          ))}
        </div>
      </div>

      <div className="relative grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {(property.images.length ? property.images : [null]).slice(0, 6).map((image, index) => (
          <img
            key={`${image || "fallback"}-${index}`}
            src={getImageUrl(image)}
            alt={property.title}
            className={`h-56 w-full cursor-pointer rounded-3xl border border-[#ece5de] object-cover transition-opacity hover:opacity-90 ${
              index === 0 ? "md:col-span-2 md:h-120" : ""
            }`}
            onClick={() => setLightboxIndex(index)}
          />
        ))}
        {property.images.length > 0 && (
          <button
            type="button"
            className="absolute bottom-4 right-4 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-md transition-transform hover:scale-105"
            onClick={() => setLightboxIndex(0)}
          >
            Show all photos
          </button>
        )}
      </div>

      {lightboxIndex >= 0 && (
        <Lightbox
          images={property.images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
        />
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.22fr_0.78fr]">
        <section className="card-surface space-y-6 p-5 sm:p-6">
          <div>
            <h2 className="text-2xl font-bold text-[#191613]">About this place</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#5b544f]">
              {property.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8d847d]">
              Amenities
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {property.amenities?.map((amenity) => (
                <span key={amenity} className="pill">
                  {formatLabel(amenity)}
                </span>
              ))}
              {!property.amenities?.length ? (
                <span className="text-sm text-slate-500">No amenities listed</span>
              ) : null}
            </div>
          </div>

          <div className="card-soft space-y-2 p-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#8d847d]">Host</h3>
            <p className="text-base font-bold text-[#1d1916]">{property.hostId?.name}</p>
            <p className="text-sm text-[#6c655f]">{property.hostId?.email}</p>
          </div>
        </section>

        <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <BookingWidget property={property} />
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
