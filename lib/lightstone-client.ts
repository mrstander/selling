import {
  PropertySearchResponse,
  PropertyDetails,
  SuburbSearchResponse,
  AddressDetail,
  CompleteSearchResponse,
} from "@/types/lightstone";

// ──────────────────────────────────────────────
// Lightstone API Client (server-side only)
// ──────────────────────────────────────────────

const SUBSCRIPTION_KEY = process.env.LIGHTSTONE_SUBSCRIPTION_KEY ?? "";
const API_KEY = process.env.LIGHTSTONE_API_KEY ?? "";

/**
 * Lightstone has two base URLs:
 *   - apis.lightstone.co.za      → the actual API gateway
 *   - portal.apis.lightstone.co.za → the developer portal (docs only)
 */
const BASE_URL =
  process.env.LIGHTSTONE_API_BASE_URL ?? "https://apis.lightstone.co.za";

if (!SUBSCRIPTION_KEY) {
  console.warn(
    "⚠️  LIGHTSTONE_SUBSCRIPTION_KEY is not set. API calls will fail."
  );
}

/** Standard headers for every Lightstone API request */
function getHeaders(): HeadersInit {
  return {
    "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY.trim(),
    Accept: "application/json",
    "Ocp-Apim-Trace": "true",
  };
}

/** Generic fetch wrapper with error handling */
async function lightstoneRequest<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const cleanBaseUrl = BASE_URL.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");
  const url = `${cleanBaseUrl}/${cleanPath}`;

  console.log(`[Lightstone] ${options?.method ?? "GET"} ${url}`);
  console.log(
    `[Lightstone] Subscription Key Present: ${
      SUBSCRIPTION_KEY ? "Yes" : "NO - API WILL FAIL"
    }`
  );

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options?.method !== "GET" && options?.method !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
        ...(options?.headers ?? {}),
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorBody = "";

      try {
        if (contentType?.includes("application/json")) {
          const json = await response.json();
          errorBody = JSON.stringify(json);
        } else {
          errorBody = await response.text();
        }
      } catch {
        errorBody = await response.text().catch(() => "Unknown error");
      }

      console.error(
        `[Lightstone] Error ${response.status}: ${errorBody.slice(0, 500)}`
      );

      throw new Error(
        `Lightstone API error (${response.status}): ${errorBody.slice(0, 300)}`
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error("[Lightstone] Request failed:", {
      url,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

// ──────────────────────────────────────────────
// Address Search
// Endpoint: GET /lspsearch/v1/address?query={query}
// Returns: { searchIdentifier, results: [{ id, propertyId, addressString, suburbName, ... }] }
// ──────────────────────────────────────────────

/**
 * Search for properties with detailed metadata.
 *
 * Uses the Property Search API at:
 *   GET https://apis.lightstone.co.za/lspsearch/v1/property?query=...
 *
 * @param query - Search term
 * @param maxResults - Max results to return
 */
export async function searchProperties(
  query: string,
  maxResults: number = 20
): Promise<PropertySearchResponse> {
  const encodedQuery = encodeURIComponent(query);

  try {
    const response = await lightstoneRequest<PropertySearchResponse>(
      `/lspsearch/v1/property?query=${encodedQuery}&limit=${maxResults}`
    );

    return {
      searchIdentifier: response.searchIdentifier,
      results: response.results.slice(0, maxResults),
    };
  } catch (error) {
    console.error("Property search failed:", {
      query,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

// ──────────────────────────────────────────────
// Complete Search
// Endpoint: GET /lspsearch/v1/complete?query={query}
// ──────────────────────────────────────────────

/**
 * Perform a complete search across multiple categories (properties, suburbs, etc.)
 *
 * @param query - Search term
 * @param maxResults - Max results to return
 */
export async function searchComplete(
  query: string,
  maxResults: number = 20
): Promise<CompleteSearchResponse> {
  const encodedQuery = encodeURIComponent(query);

  try {
    const response = await lightstoneRequest<CompleteSearchResponse>(
      `/lspsearch/v1/complete?query=${encodedQuery}`
    );

    return {
      searchIdentifier: response.searchIdentifier,
      results: (response.results || []).slice(0, maxResults),
    };
  } catch (error) {
    console.error("Complete search failed:", {
      query,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

// ──────────────────────────────────────────────
// Street Search
// Endpoint: GET /lspsearch/v1/street?query={query}
// ──────────────────────────────────────────────

/**
 * Search by street name.
 *
 * @param query - Street name (e.g. "High Level Road")
 * @param maxResults - Max results to return (default 10)
 */
export async function searchStreets(
  query: string,
  maxResults: number = 10
): Promise<PropertySearchResponse> {
  const encodedQuery = encodeURIComponent(query);

  try {
    const response = await lightstoneRequest<PropertySearchResponse>(
      `/lspsearch/v1/street?query=${encodedQuery}`
    );

    return {
      searchIdentifier: response.searchIdentifier,
      results: response.results.slice(0, maxResults),
    };
  } catch (error) {
    console.error("Street search failed:", {
      url: `${BASE_URL}/lspsearch/v1/street?query=${encodedQuery}`,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

// ──────────────────────────────────────────────
// Suburb Property Search
// Endpoint: GET /lspsearch/v1/property?suburbId={id}
// ──────────────────────────────────────────────

/**
 * Search for properties within a suburb.
 *
 * @param suburbId - The suburbId from address search results
 * @param maxResults - Max results to return (default 50)
 */
export async function searchPropertiesBySuburb(
  suburbId: number,
  maxResults: number = 50
): Promise<PropertySearchResponse> {
  try {
    console.log(`[Lightstone] Searching properties for suburbId: ${suburbId}`);
    const response = await lightstoneRequest<PropertySearchResponse>(
      `/lspsearch/v1/property?suburbId=${suburbId}&limit=${maxResults}`
    );

    return {
      searchIdentifier: response.searchIdentifier,
      results: response.results.slice(0, maxResults),
    };
  } catch (error) {
    console.error("Property search by suburb failed:", {
      suburbId,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

/**
 * Search for properties within a town.
 *
 * @param townId - The townId from town search results
 * @param maxResults - Max results to return (default 50)
 */
export async function searchPropertiesByTown(
  townId: number,
  maxResults: number = 50
): Promise<PropertySearchResponse> {
  try {
    console.log(`[Lightstone] Searching properties for townId: ${townId}`);
    const response = await lightstoneRequest<PropertySearchResponse>(
      `/lspsearch/v1/property?townId=${townId}&limit=${maxResults}`
    );

    return {
      searchIdentifier: response.searchIdentifier,
      results: response.results.slice(0, maxResults),
    };
  } catch (error) {
    console.error("Property search by town failed:", {
      townId,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

// ──────────────────────────────────────────────
// Property Details / Valuation
// Update paths once confirmed in your portal.
// ──────────────────────────────────────────────

/**
 * Get full property details including valuation data.
 *
 * @param propertyId - The propertyId from search results
 */
export async function getPropertyDetails(
  propertyId: number | string
): Promise<PropertyDetails> {
  return lightstoneRequest<PropertyDetails>(
    `/lspproperty/v1/property/${encodeURIComponent(propertyId)}`
  );
}

/**
 * Get property valuation specifically.
 *
 * @param propertyId - The propertyId from search results
 */
export async function getPropertyValuation(propertyId: number | string) {
  return lightstoneRequest(
    `/lspproperty/v1/property/${encodeURIComponent(propertyId)}/valuation`
  );
}

// ──────────────────────────────────────────────
// Suburb Search
// Endpoint: GET /lspsearch/v1/suburb?query={query}
// ──────────────────────────────────────────────

/**
 * Search for suburbs by name.
 *
 * @param query - Suburb name (e.g. "Sandton")
 * @param maxResults - Max results to return (default 10)
 */
export async function searchSuburbs(
  query: string,
  maxResults: number = 10
): Promise<SuburbSearchResponse> {
  const encodedQuery = encodeURIComponent(query);

  try {
    const response = await lightstoneRequest<SuburbSearchResponse>(
      `/lspsearch/v1/suburb?query=${encodedQuery}`
    );

    return {
      searchIdentifier: response.searchIdentifier,
      results: response.results.slice(0, maxResults),
    };
  } catch (error) {
    console.error("Suburb search failed:", {
      query,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

// ──────────────────────────────────────────────
// Town Search
// Endpoint: GET /lspsearch/v1/town?query={query}
// ──────────────────────────────────────────────

/**
 * Search for towns by name.
 *
 * @param query - Town name (e.g. "Cape Town")
 * @param maxResults - Max results to return (default 10)
 */
export async function searchTowns(
  query: string,
  maxResults: number = 10
): Promise<SuburbSearchResponse> {
  const encodedQuery = encodeURIComponent(query);

  try {
    const response = await lightstoneRequest<SuburbSearchResponse>(
      `/lspsearch/v1/town?query=${encodedQuery}`
    );

    return {
      searchIdentifier: response.searchIdentifier,
      results: response.results.slice(0, maxResults),
    };
  } catch (error) {
    console.error("Town search failed:", {
      query,
      error: error instanceof Error ? error.message : error,
    });
    throw error;
  }
}

// ──────────────────────────────────────────────
// Address Detail (New Endpoint)
// Endpoint: GET /lspdata/v1/address/{id}/address
// ──────────────────────────────────────────────

/**
 * Get detailed address info by property ID.
 *
 * @param propertyId - The propertyId from search results
 */
export async function getPropertyAddressDetail(
  propertyId: number | string
): Promise<AddressDetail> {
  return lightstoneRequest<AddressDetail>(
    `/lspdata/v1/property/${encodeURIComponent(propertyId)}/address`
  );
}

/**
 * Get detailed address info by search result ID.
 *
 * @param id - The ID from search results
 */
export async function getAddressDetail(
  id: number | string
): Promise<AddressDetail> {
  return lightstoneRequest<AddressDetail>(
    `/lspdata/v1/address/${encodeURIComponent(id)}/address`
  );
}

/**
 * Get the Property Value Sellers Report (No PI).
 *
 * @param propertyId - The propertyId from search results
 */
export async function getPropertySellersReport(
  propertyId: number | string
): Promise<any> {
  return lightstoneRequest<any>(
    `/lspdata/v1/property/${encodeURIComponent(propertyId)}/PropertyValueSellersReportNoPi`
  );
}

/**
 * Get the Property Report (No PI).
 *
 * @param propertyId - The propertyId from search results
 */
export async function getPropertyReport(
  propertyId: number | string
): Promise<any> {
  return lightstoneRequest<any>(
    `/lspdata/v1/property/${encodeURIComponent(propertyId)}/PropertyReportNoPi`
  );
}

export { lightstoneRequest, getHeaders, BASE_URL };
