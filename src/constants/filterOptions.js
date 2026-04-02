export const AMENITIES = [
  "wifi",
  "kitchen",
  "pool",
  "parking",
  "air_conditioning",
  "pet_friendly",
  "washing_machine",
  "workspace",
  "tv",
];

export const CATEGORIES = [
  "beach",
  "mountain",
  "city",
  "cabin",
  "luxury",
  "budget",
  "family",
  "romantic",
  "unique",
];

export const formatLabel = (value) =>
  value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
