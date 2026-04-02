import { useEffect, useMemo, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import PropertyMap from "../components/PropertyMap";
import SearchBar from "../components/SearchBar";
import LoadingState from "../components/LoadingState";
import usePropertyStore from "../store/propertyStore";
import useAuthStore from "../store/authStore";

const DEFAULT_FILTERS = {
  location: "",
  minPrice: 0,
  maxPrice: 1000,
  amenities: [],
  categories: [],
  page: 1,
  limit: 12,
  mapBounds: null,
};

function Home() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { properties, pagination, loading, fetchProperties } = usePropertyStore();
  const { user } = useAuthStore();

  const queryParams = useMemo(() => {
    const params = {
      page: filters.page,
      limit: filters.limit,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    };

    if (filters.location) params.location = filters.location;
    if (filters.amenities.length) params.amenities = filters.amenities.join(",");
    if (filters.categories.length) params.categories = filters.categories.join(",");
    if (filters.mapBounds) {
      params.minLat = filters.mapBounds.minLat;
      params.maxLat = filters.mapBounds.maxLat;
      params.minLng = filters.mapBounds.minLng;
      params.maxLng = filters.mapBounds.maxLng;
    }

    return params;
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProperties(queryParams);
    }, 250);
    return () => clearTimeout(timeout);
  }, [fetchProperties, queryParams]);

  const handleBoundsChange = (bounds) => {
    setFilters((prev) => {
      if (
        prev.mapBounds &&
        Math.abs(prev.mapBounds.minLat - bounds.minLat) < 0.0005 &&
        Math.abs(prev.mapBounds.maxLat - bounds.maxLat) < 0.0005 &&
        Math.abs(prev.mapBounds.minLng - bounds.minLng) < 0.0005 &&
        Math.abs(prev.mapBounds.maxLng - bounds.maxLng) < 0.0005
      ) {
        return prev;
      }
      return { ...prev, mapBounds: bounds, page: 1 };
    });
  };

  const renderPagination = () => {
    const { page, totalPages } = pagination;
    if (totalPages <= 1) return null;

    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          type="button"
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
            i === page
              ? "bg-[#25201b] text-white"
              : "text-[#655f59] hover:bg-[#e8e2da]"
          }`}
          onClick={() => setFilters((prev) => ({ ...prev, page: i }))}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#655f59] transition-colors hover:bg-[#e8e2da] disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
        >
          &lt;
        </button>
        {pages}
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#655f59] transition-colors hover:bg-[#e8e2da] disabled:opacity-40"
          disabled={page >= totalPages}
          onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <section className="hero-glow fade-rise glass-panel overflow-hidden p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8d837b]">
              Curated stays and seamless booking
            </p>
            <h1 className="section-title">
              Discover remarkable homes for every trip and every budget.
            </h1>
            <p className="section-copy max-w-xl">
              Explore a map-first catalog, compare amenities instantly, and book in minutes. Hosts
              can list, manage, and grow occupancy with clean operational tools.
            </p>
          </div>
          <div className="grid w-full max-w-sm grid-cols-2 gap-3">
            <div className="stat-card">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8b817a]">
                Active Stays
              </p>
              <p className="mt-2 text-2xl font-extrabold text-[#1c1916]">{pagination.total}</p>
            </div>
            <div className="stat-card">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8b817a]">
                Avg Rating
              </p>
              <p className="mt-2 text-2xl font-extrabold text-[#1c1916]">4.9</p>
            </div>
            <div className="stat-card col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8b817a]">
                Signed In As
              </p>
              <p className="mt-2 line-clamp-1 text-sm font-semibold text-[#26211e]">
                {user ? `${user.name} (${user.role})` : "Guest traveler"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <SearchBar
        filters={filters}
        onChange={(update) => setFilters((prev) => ({ ...prev, ...update }))}
        onReset={() =>
          setFilters({
            ...DEFAULT_FILTERS,
            amenities: [],
            categories: [],
            mapBounds: null,
          })
        }
      />

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.03fr_0.97fr]">
        <div className="space-y-4">
          <div className="card-soft flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="text-sm font-semibold text-[#645d57]">{pagination.total} stays found</p>
            {renderPagination()}
          </div>

          {loading ? (
            <LoadingState text="Loading properties..." />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
              {!properties.length ? (
                <div className="card-surface col-span-full p-9 text-center text-sm text-slate-600">
                  No properties match current filters.
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <PropertyMap properties={properties} onBoundsChange={handleBoundsChange} />
        </div>
      </section>
    </div>
  );
}

export default Home;
