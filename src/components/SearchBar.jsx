import { AMENITIES, CATEGORIES } from "../constants/filterOptions";
import AmenitySelector from "./AmenitySelector";

function SearchBar({ filters, onChange, onReset }) {
  const budgetSummary = `$${filters.minPrice} - $${filters.maxPrice}`;

  return (
    <section className="glass-panel fade-rise space-y-5 p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card-soft p-3">
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#8f8780]">
            Location
          </label>
          <input
            className="input"
            placeholder="City, country, address"
            value={filters.location}
            onChange={(event) => onChange({ location: event.target.value, page: 1 })}
          />
        </div>
        <div className="card-soft p-3">
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#8f8780]">
            Min Price
          </label>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={filters.minPrice}
            onChange={(event) =>
              onChange({ minPrice: Number(event.target.value), page: 1 })
            }
            className="w-full accent-rose-500"
          />
          <p className="mt-2 text-sm font-semibold text-[#524b46]">${filters.minPrice}</p>
        </div>
        <div className="card-soft p-3">
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#8f8780]">
            Max Price
          </label>
          <input
            type="range"
            min="50"
            max="2000"
            step="10"
            value={filters.maxPrice}
            onChange={(event) =>
              onChange({ maxPrice: Number(event.target.value), page: 1 })
            }
            className="w-full accent-rose-500"
          />
          <p className="mt-2 text-sm font-semibold text-[#524b46]">${filters.maxPrice}</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AmenitySelector
          title="Amenities"
          options={AMENITIES}
          selected={filters.amenities}
          onChange={(amenities) => onChange({ amenities, page: 1 })}
        />

        <AmenitySelector
          title="Categories"
          options={CATEGORIES}
          selected={filters.categories}
          onChange={(categories) => onChange({ categories, page: 1 })}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ece5de] pt-3">
        <p className="text-sm font-medium text-[#625b55]">
          Budget window: <span className="font-bold text-[#24201d]">{budgetSummary}</span>
        </p>
        <div className="flex items-center gap-2">
          <button type="button" className="btn-secondary" onClick={onReset}>
            Reset Filters
          </button>
        </div>
      </div>
    </section>
  );
}

export default SearchBar;
