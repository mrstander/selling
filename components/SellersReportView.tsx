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
  User,
  MapPin,
  Building,
  Target,
  Navigation
} from "lucide-react";
import type { SellersReportResponse } from "@/types/lightstone";
import { formatZAR, formatDate, percentChange } from "@/lib/utils";

interface SellersReportViewProps {
  report: SellersReportResponse;
}

export default function SellersReportView({ report }: SellersReportViewProps) {
  const { propertyDetails: details, propertyValuation: val, owners, municipalValuation: mun, transferHistory: history, comparableSales: comparables, pointsOfInterest: pois } = report;

  const growth =
    val?.predictedValue && details?.lastSalePrice
      ? percentChange(details.lastSalePrice, val.predictedValue)
      : null;

  const address = `${details.streetNumber} ${details.streetName} ${details.streetType}`;

  return (
    <div className="space-y-8 print:space-y-6">
      {/* PDF-Style Gradient Header (Print only or visible?) */}
      <div className="hidden print:block h-12 bg-gradient-to-r from-[#4A154B] to-[#C72027] mb-6 -mx-4">
        <div className="flex items-center justify-between h-full px-6">
          <span className="text-white font-display font-bold">Property Value Seller Report</span>
          <span className="text-white text-xs opacity-80">CB Property</span>
        </div>
      </div>

      {/* Main Valuation Hero */}
      <div className="card p-8 md:p-10 relative overflow-hidden bg-white border-forest-100 border-2 shadow-xl shadow-forest-900/5 print:shadow-none print:border-sand-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-forest-50 to-transparent rounded-bl-full opacity-60 print:hidden" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold text-forest-600 uppercase tracking-widest mb-2">Estimated Market Value</p>
              <p className="text-4xl md:text-5xl font-display text-ink-900 tracking-tight">
                {formatZAR(val?.predictedValue)}
              </p>
              {val?.predictedValueLow && val?.predictedValueHigh && (
                <p className="text-sm text-ink-400 mt-2 font-body">
                  Market Range: {formatZAR(val.predictedValueLow)} – {formatZAR(val.predictedValueHigh)}
                </p>
              )}
            </div>

            {growth !== null && (
              <div
                className={`flex flex-col items-end gap-1 p-4 rounded-2xl ${
                  growth >= 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {growth >= 0 ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  <span className="text-xl font-bold">
                    {growth >= 0 ? "+" : ""}
                    {growth.toFixed(1)}%
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Capital Growth</span>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-sand-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg font-bold text-ink-900">{address}</p>
              <p className="text-sm text-ink-500 mt-1">
                {[details.suburb, details.townName, details.province].filter(Boolean).join(", ")}
              </p>
              <div className="flex items-center gap-2 mt-4">
                <span className="px-2.5 py-1 bg-ink-900 text-white text-[10px] font-bold uppercase rounded-md tracking-wider">
                  {details.propertyType}
                </span>
                <span className="px-2.5 py-1 bg-sand-100 text-ink-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                  ID: {details.propertyId}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-sand-50 p-3 rounded-xl border border-sand-100">
                  <p className="text-[10px] font-bold text-ink-400 uppercase mb-1">Accuracy Score</p>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-forest-600" />
                    <span className="text-sm font-bold text-ink-900">{val.predictValueAccuracyScore}%</span>
                  </div>
               </div>
               <div className="bg-sand-50 p-3 rounded-xl border border-sand-100">
                  <p className="text-[10px] font-bold text-ink-400 uppercase mb-1">Safety Score</p>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-forest-600" />
                    <span className="text-sm font-bold text-ink-900">{val.predictValueSafetyScore}%</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {details.size > 0 && (
          <StatCard icon={<Ruler />} label="Land Size" value={`${details.size.toLocaleString()} m²`} />
        )}
        {details.bedRooms && (
          <StatCard icon={<BedDouble />} label="Bedrooms" value={details.bedRooms.toString()} />
        )}
        {details.bathRooms && (
          <StatCard icon={<Bath />} label="Bathrooms" value={details.bathRooms.toString()} />
        )}
        {details.garages && (
          <StatCard icon={<Car />} label="Garages" value={details.garages.toString()} />
        )}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:gap-6">
        
        {/* Ownership & Transfers */}
        <div className="space-y-6 print:space-y-4">
          <section className="card p-6 print:p-4">
            <h3 className="flex items-center gap-2 font-display text-lg text-ink-900 mb-4 print:bg-[#E9F0F5] print:p-2 print:text-[#003366]">
              <User className="w-5 h-5 text-forest-600 print:text-[#00AEEF]" />
              Registered Owners
            </h3>
            <div className="space-y-4">
              {owners.map((owner, i) => (
                <div key={i} className="pb-3 border-b border-sand-100 last:border-0 last:pb-0">
                  <p className="text-sm font-bold text-ink-900">{owner.ownerName}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-ink-400">Share: <span className="text-ink-600">{owner.share}</span></p>
                    <p className="text-xs text-ink-400">Deed: <span className="text-ink-600 font-mono">{owner.titleDeed}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6 print:p-4">
            <h3 className="flex items-center gap-2 font-display text-lg text-ink-900 mb-4 print:bg-[#E9F0F5] print:p-2 print:text-[#003366]">
              <ArrowUpRight className="w-5 h-5 text-forest-600 print:text-[#00AEEF]" />
              Transfer History
            </h3>
            <div className="space-y-4">
              {history.slice(0, 5).map((t, i) => (
                <div key={i} className="flex justify-between items-center pb-3 border-b border-sand-100 last:border-0 last:pb-0">
                  <div>
                    <p className="text-xs font-bold text-ink-900">{formatDate(t.purchaseDate)}</p>
                    <p className="text-[10px] text-ink-400 mt-0.5 line-clamp-1">{t.sellerName} → {t.buyerName}</p>
                  </div>
                  <p className="text-sm font-bold text-forest-700">{formatZAR(t.purchasePrice)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Comparable Sales & POIs */}
        <div className="space-y-6 print:space-y-4">
          <section className="card p-6 print:p-4">
            <h3 className="flex items-center gap-2 font-display text-lg text-ink-900 mb-4 print:bg-[#E9F0F5] print:p-2 print:text-[#003366]">
              <Building className="w-5 h-5 text-forest-600 print:text-[#00AEEF]" />
              Comparable Sales
            </h3>
            <div className="space-y-4">
              {comparables.slice(0, 5).map((sale, i) => (
                <div key={i} className="pb-3 border-b border-sand-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-ink-900 line-clamp-1">{sale.streetAddress}</p>
                      <p className="text-[10px] text-ink-400 mt-0.5">{formatDate(new Date(sale.saleDate).toISOString())} • {sale.distanceM}m away</p>
                    </div>
                    <p className="text-sm font-bold text-ink-900">{formatZAR(sale.salePrice)}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-sand-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#00AEEF] transition-all duration-1000" 
                        style={{ width: `${sale.relevancePerc}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#00AEEF] whitespace-nowrap">{sale.relevancePerc}% Relevant</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6 print:p-4">
            <h3 className="flex items-center gap-2 font-display text-lg text-ink-900 mb-4 print:bg-[#E9F0F5] print:p-2 print:text-[#003366]">
              <Navigation className="w-5 h-5 text-forest-600 print:text-[#00AEEF]" />
              Points of Interest
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2">
              {pois.slice(0, 6).map((poi, i) => (
                <div key={i} className="bg-sand-50 p-3 rounded-lg border border-sand-100 print:p-2">
                  <p className="text-[10px] font-bold text-[#00AEEF] uppercase mb-1">{poi.type}</p>
                  <p className="text-xs font-medium text-ink-900 line-clamp-1">{poi.description}</p>
                  <p className="text-[10px] text-ink-400 mt-1">{poi.distance}km away</p>
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>

      {/* Municipal Data */}
      <section className="card p-8 bg-ink-900 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 p-8 opacity-10">
           <Building className="w-24 h-24" />
         </div>
         <div className="relative">
            <p className="text-xs font-bold text-forest-400 uppercase tracking-widest mb-4">Official Municipal Assessment</p>
            <div className="flex items-end gap-12 flex-wrap">
              <div>
                <p className="text-xs text-ink-400 mb-1">Municipal Valuation</p>
                <p className="text-3xl font-display">{formatZAR(mun.municipalValuation)}</p>
              </div>
              <div>
                <p className="text-xs text-ink-400 mb-1">Assessment Date</p>
                <p className="text-lg font-bold">{formatDate(new Date(mun.municipalValuationDate).toISOString())}</p>
              </div>
              <div>
                <p className="text-xs text-ink-400 mb-1">Usage Category</p>
                <p className="text-lg font-bold">{mun.lsUsage}</p>
              </div>
            </div>
         </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card p-5 hover:border-forest-200 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-forest-600">{icon}</span>
        <span className="text-[10px] font-bold text-ink-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-2xl font-display text-ink-900">{value}</p>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
