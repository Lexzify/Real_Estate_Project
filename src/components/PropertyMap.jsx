import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Map, { Layer, NavigationControl, Popup, Source } from "react-map-gl/mapbox";
import { getImageUrl } from "../utils/media";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const CLUSTER_LAYER = {
  id: "clusters",
  type: "circle",
  source: "properties",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": "#f43f5e",
    "circle-radius": ["step", ["get", "point_count"], 16, 20, 22, 50, 28],
    "circle-opacity": 0.85,
  },
};

const CLUSTER_COUNT_LAYER = {
  id: "cluster-count",
  type: "symbol",
  source: "properties",
  filter: ["has", "point_count"],
  layout: {
    "text-field": ["get", "point_count_abbreviated"],
    "text-size": 12,
  },
  paint: {
    "text-color": "#ffffff",
  },
};

const UNCLUSTERED_LAYER = {
  id: "unclustered-point",
  type: "circle",
  source: "properties",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "#0f172a",
    "circle-radius": 7,
    "circle-stroke-color": "#ffffff",
    "circle-stroke-width": 2,
  },
};

function PropertyMap({ properties, onBoundsChange }) {
  const mapRef = useRef(null);
  const [popup, setPopup] = useState(null);

  const points = useMemo(
    () =>
      properties
        .filter(
          (property) =>
            typeof property.location?.latitude === "number" &&
            typeof property.location?.longitude === "number"
        )
        .map((property) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [property.location.longitude, property.location.latitude],
          },
          properties: {
            id: property._id,
            title: property.title,
            pricePerNight: String(property.pricePerNight),
            city: property.location.city,
            country: property.location.country,
            image: property.images?.[0] || "",
          },
        })),
    [properties]
  );

  useEffect(() => {
    if (!mapRef.current || !points.length) return;
    const map = mapRef.current.getMap();

    const bounds = points.reduce(
      (acc, point) => {
        const [lng, lat] = point.geometry.coordinates;
        return {
          minLng: Math.min(acc.minLng, lng),
          maxLng: Math.max(acc.maxLng, lng),
          minLat: Math.min(acc.minLat, lat),
          maxLat: Math.max(acc.maxLat, lat),
        };
      },
      { minLng: 180, maxLng: -180, minLat: 90, maxLat: -90 }
    );

    map.fitBounds(
      [
        [bounds.minLng, bounds.minLat],
        [bounds.maxLng, bounds.maxLat],
      ],
      { padding: 60, duration: 700, maxZoom: 13 }
    );
  }, [points]);

  const updateBounds = () => {
    if (!mapRef.current || !onBoundsChange) return;
    const map = mapRef.current.getMap();
    const bounds = map.getBounds();
    onBoundsChange({
      minLat: bounds.getSouth(),
      maxLat: bounds.getNorth(),
      minLng: bounds.getWest(),
      maxLng: bounds.getEast(),
    });
  };

  const onMapClick = async (event) => {
    const feature = event.features?.[0];
    if (!feature) return;

    if (feature.layer.id === "clusters") {
      const clusterId = feature.properties.cluster_id;
      const source = mapRef.current.getMap().getSource("properties");
      source.getClusterExpansionZoom(clusterId, (error, zoom) => {
        if (error) return;
        mapRef.current.getMap().easeTo({
          center: feature.geometry.coordinates,
          zoom,
          duration: 500,
        });
      });
      return;
    }

    if (feature.layer.id === "unclustered-point") {
      setPopup({
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        ...feature.properties,
      });
    }
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="card-surface flex h-[70vh] items-center justify-center p-6 text-center text-sm text-slate-600">
        Map preview unavailable. Set `VITE_MAPBOX_TOKEN` in `client/.env` to enable map discovery.
      </div>
    );
  }

  return (
    <div className="card-surface h-[70vh] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#ebe5de] bg-[#fdf9f6] px-4 py-3">
        <p className="text-sm font-bold text-[#342f2b]">Map View</p>
        <p className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#6f6660]">
          {properties.length} markers
        </p>
      </div>
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
        initialViewState={{ longitude: -74.006, latitude: 40.7128, zoom: 9 }}
        interactiveLayerIds={["clusters", "unclustered-point"]}
        onClick={onMapClick}
        onMoveEnd={updateBounds}
      >
        <NavigationControl position="top-right" />
        <Source
          id="properties"
          type="geojson"
          data={{ type: "FeatureCollection", features: points }}
          cluster
          clusterRadius={50}
          clusterMaxZoom={14}
        >
          <Layer {...CLUSTER_LAYER} />
          <Layer {...CLUSTER_COUNT_LAYER} />
          <Layer {...UNCLUSTERED_LAYER} />
        </Source>

        {popup ? (
          <Popup
            longitude={Number(popup.longitude)}
            latitude={Number(popup.latitude)}
            offset={14}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <div className="w-52 space-y-2">
              <img
                src={getImageUrl(popup.image)}
                alt={popup.title}
                className="h-24 w-full rounded-lg object-cover"
              />
              <p className="line-clamp-1 text-sm font-semibold">{popup.title}</p>
              <p className="text-xs text-slate-600">
                {popup.city}, {popup.country}
              </p>
              <p className="text-sm font-semibold">${popup.pricePerNight}/night</p>
              <Link
                to={`/properties/${popup.id}`}
                className="inline-block rounded-lg bg-rose-500 px-3 py-1 text-xs font-semibold text-white"
              >
                View stay
              </Link>
            </div>
          </Popup>
        ) : null}
      </Map>
    </div>
  );
}

export default PropertyMap;
