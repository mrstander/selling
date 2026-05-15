"use client";

import {
  TrendingUp,
  TrendingDown,
  Home,
  Ruler,
  BedDouble,
  Bath,
  Car,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import type { PropertyDetails, TransferRecord } from "@/types/lightstone";
import { formatZAR, formatDate, percentChange } from "@/lib/utils";

interface ValuationCardProps {
  property: PropertyDetails;
}

export default function ValuationCard({ property }: ValuationCardProps) {
  const val = property.valuation;
  const lastTransfer = property.transferHistory?.[0];

  // Calculate growth if we have both current estimate and last sale
  const growth =
    val?.estimatedValue && val?.lastSalePrice
      ? percentChange(val.lastSalePrice, val.estimatedValue)
      : null;

  return (
    <div className="animate-fade-in-up">
      {/* Main Valuation Hero */}
      <div className="card p-8 md:p-10 mb-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-forest-50 to-transparent rounded-bl-full opacity-60" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="stat-label mb-1">Estimated Market Value</p>
              <p className="text-4xl md:text-5xl font-display text-ink-900 tracking-tight">
                {formatZAR(val?.estimatedValue)}
              </p>
              {val?.estimatedValueLow && val?.estimatedValueHigh && (
                <p className="text-sm text-ink-400 mt-2 font-body">
                  Range: {formatZAR(val.estimatedValueLow)} –{" "}
                  {formatZAR(val.estimatedValueHigh)}
                </p>
              )}
            </div>

            {growth !== null && (
              <div
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl ${
                  growth >= 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {growth >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-semibold">
                  {growth >= 0 ? "+" : ""}
                  {growth.toFixed(1)}%
                </span>
                <span className="text-xs opacity-70">since last sale</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="mt-6 pt-6 border-t border-sand-100">
            <p className="font-medium text-ink-800">{property.address}</p>
            <p className="text-sm text-ink-400 mt-0.5">
              {[property.suburb, property.city, property.province]
                .filter(Boolean)
                .join(", ")}
            </p>
            {property.propertyType && (
              <span className="badge-forest mt-2">
                {property.propertyType}
              </span>
            )}
          </div>

          {/* Confidence */}
          {val?.confidenceLevel && (
            <div className="mt-4">
              <span className="badge-sand">
                Confidence: {val.confidenceLevel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Property Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in-up-delay-1">
        {property.erfSize && (
          <StatCard
            icon={<Ruler className="w-4 h-4" />}
            label="Erf Size"
            value={`${property.erfSize.toLocaleString()} m²`}
          />
        )}
        {property.buildingSize && (
          <StatCard
            icon={<Home className="w-4 h-4" />}
            label="Building Size"
            value={`${property.buildingSize.toLocaleString()} m²`}
          />
        )}
        {property.numberOfBedrooms && (
          <StatCard
            icon={<BedDouble className="w-4 h-4" />}
            label="Bedrooms"
            value={property.numberOfBedrooms.toString()}
          />
        )}
        {property.numberOfBathrooms && (
          <StatCard
            icon={<Bath className="w-4 h-4" />}
            label="Bathrooms"
            value={property.numberOfBathrooms.toString()}
          />
        )}
        {property.parkingSpaces && (
          <StatCard
            icon={<Car className="w-4 h-4" />}
            label="Parking"
            value={property.parkingSpaces.toString()}
          />
        )}
        {property.yearBuilt && (
          <StatCard
            icon={<Calendar className="w-4 h-4" />}
            label="Year Built"
            value={property.yearBuilt.toString()}
          />
        )}
      </div>

      {/* Transfer History */}
      {property.transferHistory && property.transferHistory.length > 0 && (
        <div className="card p-6 md:p-8 animate-fade-in-up-delay-2">
          <h3 className="font-display text-xl text-ink-900 mb-4">
            Transfer History
          </h3>
          <div className="space-y-3">
            {property.transferHistory.map(
              (transfer: TransferRecord, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-sand-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-forest-50 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-forest-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-800">
                        {formatDate(transfer.transferDate)}
                      </p>
                      {transfer.buyerType && (
                        <p className="text-xs text-ink-400">
                          {transfer.buyerType}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="font-display text-lg text-ink-900">
                    {formatZAR(transfer.purchasePrice)}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Municipal Value */}
      {val?.municipalValue && (
        <div className="card p-6 mt-6 animate-fade-in-up-delay-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Municipal Valuation</p>
              <p className="text-xl font-display text-ink-900 mt-1">
                {formatZAR(val.municipalValue)}
              </p>
            </div>
            {val.municipalValueDate && (
              <p className="text-xs text-ink-400">
                as of {formatDate(val.municipalValueDate)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Last Sale Info */}
      {val?.lastSalePrice && (
        <div className="card p-6 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">Last Sale Price</p>
              <p className="text-xl font-display text-ink-900 mt-1">
                {formatZAR(val.lastSalePrice)}
              </p>
            </div>
            {val.lastSaleDate && (
              <p className="text-xs text-ink-400">
                {formatDate(val.lastSaleDate)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Legal Info */}
      {(property.erfNumber || property.titleDeedNumber) && (
        <div className="card p-6 mt-4 animate-fade-in-up-delay-3">
          <h3 className="font-display text-lg text-ink-900 mb-3">
            Legal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {property.erfNumber && (
              <div>
                <span className="text-ink-400">Erf Number:</span>{" "}
                <span className="font-mono text-ink-700">
                  {property.erfNumber}
                </span>
              </div>
            )}
            {property.portionNumber && (
              <div>
                <span className="text-ink-400">Portion:</span>{" "}
                <span className="font-mono text-ink-700">
                  {property.portionNumber}
                </span>
              </div>
            )}
            {property.titleDeedNumber && (
              <div>
                <span className="text-ink-400">Title Deed:</span>{" "}
                <span className="font-mono text-ink-700">
                  {property.titleDeedNumber}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Metadata (Owners & Coordinates) */}
      {(property.ownerCount !== undefined || property.cadPoint) && (
        <div className="mt-8 pt-6 border-t border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-forest-500" />
            <p className="text-[11px] font-bold text-ink-400 uppercase tracking-widest">
              Ownership & Location
            </p>
          </div>
          <div className="flex items-center gap-6 text-[11px] text-ink-400">
            {property.ownerCount !== undefined && (
              <p>Registered Owners: <span className="text-ink-600 font-medium">{property.ownerCount}</span></p>
            )}
            {property.cadPoint?.coordinates && (
              <p>Coordinates: <span className="text-ink-600 font-medium font-mono">
                {property.cadPoint.coordinates.latitude.toFixed(4)}, {property.cadPoint.coordinates.longitude.toFixed(4)}
              </span></p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Compact stat card for property features */
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-forest-500">{icon}</span>
        <span className="stat-label">{label}</span>
      </div>
      <p className="text-xl font-display text-ink-900">{value}</p>
    </div>
  );
}
