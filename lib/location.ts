export type ApproxLocation = {
  city?: string;
  region?: string;
  country?: string;
};

export type SharedLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

function decodeHeader(value: string | null) {
  if (!value?.trim()) return undefined;
  try {
    return decodeURIComponent(value.trim());
  } catch {
    return value.trim();
  }
}

export function getIpLocationFromHeaders(headers: Headers): ApproxLocation | null {
  const city = decodeHeader(headers.get("x-vercel-ip-city"));
  const region = decodeHeader(headers.get("x-vercel-ip-country-region"));
  const country = decodeHeader(headers.get("x-vercel-ip-country"));

  if (!city && !region && !country) {
    return null;
  }

  return { city, region, country };
}

export function getIpLocationFromRequest(request: {
  headers: Headers;
  geo?: {
    city?: string;
    country?: string;
    region?: string;
  };
}): ApproxLocation | null {
  const geo = request.geo;
  if (geo?.city || geo?.region || geo?.country) {
    return {
      city: geo.city,
      region: geo.region,
      country: geo.country,
    };
  }

  return getIpLocationFromHeaders(request.headers);
}

export function formatApproxLocation(location?: ApproxLocation | null) {
  if (!location) return "Unknown (IP lookup unavailable)";

  const parts = [location.city, location.region, location.country].filter(Boolean);
  return parts.length ? `${parts.join(", ")} (approx. from IP)` : "Unknown (IP lookup unavailable)";
}

export function formatSharedLocation(location: SharedLocation) {
  const coords = `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
  const accuracy =
    typeof location.accuracy === "number" ? ` (±${Math.round(location.accuracy)}m)` : "";
  return `${coords}${accuracy}`;
}

export function sharedLocationMapsUrl(location: SharedLocation) {
  return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
}

export function parseSharedLocation(value: unknown): SharedLocation | null {
  if (!value || typeof value !== "object") return null;

  const { latitude, longitude, accuracy } = value as Record<string, unknown>;
  if (typeof latitude !== "number" || typeof longitude !== "number") return null;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;

  const parsed: SharedLocation = { latitude, longitude };
  if (typeof accuracy === "number" && accuracy >= 0) {
    parsed.accuracy = accuracy;
  }

  return parsed;
}
