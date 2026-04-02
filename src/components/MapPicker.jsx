import { useEffect, useMemo, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import axios from "axios";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function MapPicker({ value, onChange }) {
  const [query, setQuery] = useState(value?.address || "");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const location = useMemo(
    () => ({
      address: value?.address || "",
      city: value?.city || "",
      country: value?.country || "",
      latitude: value?.latitude ?? 40.7128,
      longitude: value?.longitude ?? -74.006,
    }),
    [value]
  );

  useEffect(() => {
    setQuery(value?.address || "");
  }, [value?.address]);

  const updateCoords = (latitude, longitude) => {
    onChange({
      ...location,
      latitude,
      longitude,
    });
  };

  const handleSearch = async () => {
    if (!MAPBOX_TOKEN) {
      setError("Mapbox token missing. Set VITE_MAPBOX_TOKEN in client/.env.");
      return;
    }
    if (!query.trim()) return;
    setError("");
    try {
      setSearching(true);
      const encoded = encodeURIComponent(query.trim());
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json`;
      const { data } = await axios.get(url, {
        params: {
          access_token: MAPBOX_TOKEN,
          limit: 1,
        },
      });
      const feature = data.features?.[0];
      if (!feature) {
        setError("No location found for this address.");
        setSearching(false);
        return;
      }

      const [longitude, latitude] = feature.center;
      const cityContext = feature.context?.find((item) => item.id.startsWith("place."));
      const countryContext = feature.context?.find((item) => item.id.startsWith("country."));

      onChange({
        address: feature.place_name || query,
        city: cityContext?.text || value?.city || "",
        country: countryContext?.text || value?.country || "",
        latitude,
        longitude,
      });
      setSearching(false);
    } catch {
      setSearching(false);
      setError("Failed to geocode address");
    }
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="space-y-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-700">
        <p>Mapbox token is not configured.</p>
        <p className="text-amber-600">Set `VITE_MAPBOX_TOKEN` in `client/.env` to enable map picking.</p>
      </div>
    );
  }

  return (
    <div className="card-soft space-y-4 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.17em] text-[#8f857d]">
        Pinpoint Property Location
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className="input"
          value={query}
          placeholder="Search address"
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="button" className="btn-secondary" onClick={handleSearch} disabled={searching}>
          {searching ? "Searching..." : "Find Address"}
        </button>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <div className="h-72 overflow-hidden rounded-3xl border border-[#e8e1d9]">
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: location.longitude,
            latitude: location.latitude,
            zoom: 11,
          }}
          longitude={location.longitude}
          latitude={location.latitude}
          zoom={11}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
          <NavigationControl position="top-right" />
          <Marker
            longitude={location.longitude}
            latitude={location.latitude}
            draggable
            onDragEnd={(event) => updateCoords(event.lngLat.lat, event.lngLat.lng)}
          >
            <div className="h-4 w-4 rounded-full border-2 border-white bg-rose-500 shadow" />
          </Marker>
        </Map>
      </div>
    </div>
  );
}

export default MapPicker;
