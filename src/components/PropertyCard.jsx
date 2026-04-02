import { Link } from "react-router-dom";
import { formatLabel } from "../constants/filterOptions";
import PropertyImageCarousel from "./PropertyImageCarousel";

function PropertyCard({ property }) {
  return (
    <Link
      to={`/properties/${property._id}`}
      className="card-surface group fade-rise block overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_26px_50px_-26px_rgba(15,23,42,0.42)]"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <PropertyImageCarousel images={property.images} title={property.title} />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-black/0 to-transparent z-10" />
        <div className="absolute left-3 top-3 z-20">
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#3f3a35]">
          Guest favorite
        </span>
      </div>
      <p className="absolute bottom-3 left-3 text-sm font-bold text-white z-20">
        ${property.pricePerNight}/night
      </p>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-bold text-[#1a1714]">{property.title}</h3>
          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
            ★ 4.9
          </span>
        </div>
        <p className="text-sm text-[#67605a]">
          {property.location?.city}, {property.location?.country}
        </p>
        <div className="flex flex-wrap gap-2">
          {(property.categories || []).slice(0, 2).map((item) => (
            <span key={item} className="pill py-1 text-[11px]">
              {formatLabel(item)}
            </span>
          ))}
          {(property.amenities || []).slice(0, 2).map((item) => (
            <span key={item} className="pill py-1 text-[11px]">
              {formatLabel(item)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;
