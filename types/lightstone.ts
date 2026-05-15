// ──────────────────────────────────────────────
// Lightstone Property Search API types
// Matches: GET /lspsearch/v1/address?query=...
// ──────────────────────────────────────────────

/** A single result from /lspsearch/v1/address */
export interface PropertySearchResult {
  id: number;
  description: string;
  name: string;
  propertyId: number;
  deedsOfficeId: number;
  address: string;
  addressString: string;
  streetNumber: string;
  streetId: number;
  streetName: string;
  streetType: string;
  estateId: number;
  estateName: string;
  schemeName: string;
  schemeGroupId: number;
  suburbId: number;
  suburb: string;
  suburbName: string;
  townId: number;
  town: string;
  townName: string;
  municipalityId: number;
  municipalityName: string;
  districtCouncilId: number;
  districtCouncilName: string;
  postCode: string;
  provinceId: number;
  province: string;
  provinceName: string;
  countryId: number;
  countryName: string;
  relevanceScore: number;
  legalDescription?: string;
  propertyType?: string;
  ownerCount?: number;
  owners?: {
    buyer_description: string;
    buyer_id: string;
    titledeed_number: string;
  }[];
  cadPoint?: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
}

/** 
 * Comprehensive Address Detail structure 
 * Supports both /lspdata/v1/property/{id}/address and /lspdata/v1/address/{id}/address
 */
export interface AddressDetail {
  propertyId?: number;
  suburbId: number;
  suburb: string;
  postalCode: string;
  schemeGroupId?: number;
  schemeName: string;
  unit: number | string;
  estateId: number;
  estateName: string;
  townId?: number;
  townID?: number; // Some endpoints use townID
  town: string;
  municipalityId: number;
  municipality: string;
  provinceId: any;
  province: string;
  streetNumber: string;
  streetName: string;
  streetType: string;
  coordinateX?: number;
  coordinateY?: number;
  primarySource?: string;
}

/** A single result from /lspsearch/v1/suburb */
export interface SuburbSearchResult {
  id: number;
  name: string;
  description: string;
  suburbAlias: {
    suburb_alias_name: string;
    suburbAliasName: string;
  }[];
  suburbPostCode: string;
  cadPoint: {
    boundingBoxes: number[];
    crs: {
      type: any;
    };
    type: any;
    coordinates: {
      altitude: number;
      latitude: number;
      longitude: number;
    };
  };
  cadPolygon: {
    boundingBoxes: number[];
    crs: {
      type: any;
    };
    type: any;
    geometries: {
      type: any;
    }[];
  };
  suburbId: number;
  suburbName: string;
  townId: number;
  townName: string;
  municipalityId: number;
  municipalityName: string;
  provinceId: number;
  provinceName: string;
  countryId: number;
  countryName: string;
  districtCouncilId: number;
  districtCouncilName: string;
  relevanceScore?: number;
}

/** Response envelope from /lspsearch/v1/suburb */
export interface SuburbSearchResponse {
  searchIdentifier: string;
  results: SuburbSearchResult[];
}

/** Response envelope from /lspsearch/v1/address */
export interface PropertySearchResponse {
  searchIdentifier: string;
  results: PropertySearchResult[];
}

/** A single result from /lspsearch/v1/complete */
export interface CompleteSearchResult {
  type: string;
  subType?: string;
  alternativeTypes?: string[];
  id: number;
  validated: boolean;
  score: number;
  source: {
    id: string;
    type: string;
    name: string;
    description: string;
    streetAlternatives?: string[];
  };
}

/** Response envelope from /lspsearch/v1/complete */
export interface CompleteSearchResponse {
  searchIdentifier: string;
  results: CompleteSearchResult[];
}

// ──────────────────────────────────────────────
// Property Details / Valuation types
// (Update once you confirm the Property Data API shape)
// ──────────────────────────────────────────────

/** Property valuation data */
export interface PropertyValuation {
  estimatedValue?: number;
  estimatedValueLow?: number;
  estimatedValueHigh?: number;
  confidenceLevel?: string;
  valuationDate?: string;
  lastSalePrice?: number;
  lastSaleDate?: string;
  municipalValue?: number;
  municipalValueDate?: string;
}

export interface SellersReportResponse {
  propertyDetails: {
    propertyId: number;
    streetNumber: string;
    streetName: string;
    streetType: string;
    province: string;
    townName: string;
    municipality: string;
    suburb: string;
    size: number;
    erfNumber: number;
    portion: number;
    propertyType: string;
    lastSaleDate: number;
    lastSalePrice: number;
    postalCode: string;
    buildingSize?: number;
    bedRooms?: number;
    bathRooms?: number;
    garages?: number;
    yearBuilt?: number;
  };
  propertyValuation: {
    predictedValue: number;
    predictedValueLow: number;
    predictedValueHigh: number;
    predictValueAccuracyScore: number;
    predictValueSafetyScore: number;
  };
  owners: Array<{
    ownerName: string;
    titleDeed: string;
    share: string;
  }>;
  municipalValuation: {
    municipalValuation: number;
    municipalValuationDate: number;
    lsUsage: string;
  };
  transferHistory: Array<{
    buyerName: string;
    sellerName: string;
    purchaseDate: string;
    purchasePrice: number;
    registrationDate: string;
    titleDeed: string;
  }>;
  comparableSales: Array<{
    streetAddress: string;
    salePrice: number;
    saleDate: number;
    distanceM: number;
    propertySize: number;
    relevancePerc: number;
  }>;
  suburbTrends: Array<{
    registrationYear: number;
    freeholdPrice: number;
    schemePrice: number;
  }>;
  pointsOfInterest: Array<{
    description: string;
    type: string;
    distance: number;
  }>;
}

export interface PropertyReportResponse extends SellersReportResponse {
  bondDetails: Array<{
    bondInstitution: string;
    bondamount: number;
    bondNumber: string;
    bondRegistrationDate: number;
  }>;
  endorsements: Array<{
    endorsementNumber: string;
    endorsementDescription: string;
    endorsementParticulars: string;
    propertyId: number;
  }>;
  servitudes: Array<{
    cadId: number;
    gid: number;
    tagValue: string;
    easeType: string;
    servitudeType: string;
    geomProperties: number;
    indAreaLine: string;
    servitudeId: number;
  }>;
  transferSummaryThreeMonths: {
    minimumPrice: number;
    maximumPrice: number;
    totalValue: number;
  };
  transfersValuationStreet: Array<{
    propertyid: string;
    regdate: string;
    buyerName: string;
    sellerName: string;
    purchaseDate: string;
    purchasePrice: number;
    titleDeed: string;
    streetName: string;
    streetNumber: string;
    erf: number;
    portion: number;
    unit: number;
    scheme: string;
  }>;
  propertiesOnSameTitleDeed: Array<{
    propertyID: number;
    municipality: string;
    township: string;
    erf: number;
    portion: number;
    propertySize: number;
    scheme: string;
    schemeNumber: string;
    schemeYear: string;
    unit: string;
  }>;
  sieAndPip: Array<{
    propertyId: number;
    streetNumber: string;
    streetName: string;
    streetId: number;
    farmName: string;
    streetType: string;
    registrar: string;
    portion: number;
    size: number;
    erfNumber: number;
    schemeName: string;
    unit: number;
    coordinateX: number;
    coordinateY: number;
    number: number;
    suburb: string;
    registrationDate: string;
    purchaseDate: string;
    purchasePrice: number;
    erfSize: number;
    distance: number;
    propertyType: string;
    source: string;
  }>;
}

/** Full property details from the Property Data API */
export interface PropertyDetails {
  propertyId: number;
  address: string;
  suburb?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  propertyType?: string;
  erfSize?: number;
  buildingSize?: number;
  numberOfRooms?: number;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  yearBuilt?: number;
  parkingSpaces?: number;
  pool?: boolean;
  erfNumber?: string;
  portionNumber?: string;
  titleDeedNumber?: string;
  latitude?: number;
  longitude?: number;
  valuation?: PropertyValuation;
  transferHistory?: TransferRecord[];
  ownerType?: string;
  addressDetail?: AddressDetail;
}

/** A single transfer/sale record */
export interface TransferRecord {
  transferDate: string;
  purchasePrice?: number;
  purchaseDate?: string;
  registrationDate?: string;
  buyerType?: string;
}

/** Suburb-level market stats */
export interface SuburbStats {
  suburb: string;
  city?: string;
  province?: string;
  medianPrice?: number;
  averagePrice?: number;
  totalSales?: number;
  priceGrowthPercent?: number;
  period?: string;
}

// ──────────────────────────────────────────────
// App-level types
// ──────────────────────────────────────────────

export interface SearchState {
  query: string;
  results: PropertySearchResult[];
  isLoading: boolean;
  error: string | null;
}

export interface SuburbSearchState {
  query: string;
  results: SuburbSearchResult[];
  isLoading: boolean;
  error: string | null;
}

export interface ValuationState {
  property: PropertyDetails | null;
  isLoading: boolean;
  error: string | null;
}
