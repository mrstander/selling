"use client";

import React from "react";
import { 
  Home, 
  Users, 
  TrendingUp, 
  MapPin, 
  ShieldCheck, 
  ArrowUpRight,
  Info,
  Building,
  CreditCard,
  FileText,
  Map as MapIcon,
  Compass
} from "lucide-react";
import { formatZAR, formatDate } from "@/lib/utils";
import type { PropertyReportResponse } from "@/types/lightstone";

interface PropertyReportViewProps {
  data: PropertyReportResponse;
}

export default function PropertyReportView({ data }: PropertyReportViewProps) {
  if (!data || !data.propertyDetails) return null;

  const { propertyDetails, owners, comparableSales, municipalValuation, bondDetails, endorsements, servitudes, transferHistory, suburbTrends, pointsOfInterest } = data;

  return (
    <div className="space-y-8 animate-fade-in print:space-y-6">
      {/* 1. Header & Summary */}
      <section className="bg-white rounded-3xl border border-sand-200 p-8 shadow-sm print:shadow-none print:border-none print:p-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Comprehensive Property Report
            </div>
            <h1 className="text-3xl font-display text-ink-900 leading-tight">
              {propertyDetails.streetNumber} {propertyDetails.streetName} {propertyDetails.streetType}
            </h1>
            <p className="text-ink-500 font-medium flex items-center gap-2 mt-2">
              <MapPin className="w-4 h-4 text-forest-500" />
              {propertyDetails.suburb}, {propertyDetails.townName}, {propertyDetails.province}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-ink-300 uppercase tracking-widest">Last Sale Price</p>
              <p className="text-2xl font-bold text-ink-900">{formatZAR(propertyDetails.lastSalePrice)}</p>
              <p className="text-xs text-ink-400 mt-1">{formatDate(propertyDetails.lastSaleDate?.toString())}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-sand-100">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-ink-300 uppercase tracking-widest">Erf Size</p>
            <p className="text-sm font-bold text-ink-900">{propertyDetails.size} m²</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-ink-300 uppercase tracking-widest">Property Type</p>
            <p className="text-sm font-bold text-ink-900">{propertyDetails.propertyType}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-ink-300 uppercase tracking-widest">Erf Number</p>
            <p className="text-sm font-bold text-ink-900">{propertyDetails.erfNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-ink-300 uppercase tracking-widest">Property Age</p>
            <p className="text-sm font-bold text-ink-900">{propertyDetails.yearBuilt ? new Date().getFullYear() - propertyDetails.yearBuilt : 'N/A'} Years</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Data) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 2. Owners Section */}
          <section className="bg-white rounded-3xl border border-sand-200 p-8 shadow-sm print:shadow-none">
            <h2 className="text-xl font-display text-ink-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-forest-50 text-forest-600 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              Ownership Details
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-sand-100">
                    <th className="pb-4 text-[10px] font-bold text-ink-300 uppercase tracking-widest">Owner Name</th>
                    <th className="pb-4 text-[10px] font-bold text-ink-300 uppercase tracking-widest">Title Deed</th>
                    <th className="pb-4 text-right text-[10px] font-bold text-ink-300 uppercase tracking-widest">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-50">
                  {owners?.map((owner, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-4 text-sm font-bold text-ink-900">{owner.ownerName}</td>
                      <td className="py-4 text-sm text-ink-600">{owner.titleDeed}</td>
                      <td className="py-4 text-sm font-medium text-ink-900 text-right">{owner.share}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. Comparable Sales */}
          <section className="bg-white rounded-3xl border border-sand-200 p-8 shadow-sm print:shadow-none">
            <h2 className="text-xl font-display text-ink-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              Comparable Sales
            </h2>
            <div className="space-y-4">
              {comparableSales?.slice(0, 5).map((sale, idx) => (
                <div key={idx} className="p-5 bg-sand-50 rounded-2xl border border-sand-100 flex items-center justify-between gap-6 hover:border-forest-200 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-ink-900">{sale.streetAddress}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] font-bold text-ink-400 uppercase tracking-wider">{sale.distanceM}m away</span>
                      <div className="w-1 h-1 bg-sand-300 rounded-full" />
                      <span className="text-[10px] font-bold text-ink-400 uppercase tracking-wider">{formatDate(sale.saleDate?.toString())}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-forest-600">{formatZAR(sale.salePrice)}</p>
                    <div className="mt-2 w-32 h-1.5 bg-sand-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-forest-500 rounded-full" 
                        style={{ width: `${sale.relevancePerc}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Suburb Trends */}
          <section className="bg-white rounded-3xl border border-sand-200 p-8 shadow-sm print:shadow-none">
            <h2 className="text-xl font-display text-ink-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              Market Trends: {propertyDetails.suburb}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {suburbTrends?.slice(-2).map((trend, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-gradient-to-br from-sand-50 to-white border border-sand-100">
                  <p className="text-[10px] font-bold text-ink-300 uppercase tracking-[0.2em] mb-4">Registration Year: {trend.registrationYear}</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-ink-500">Freehold Price</span>
                      <span className="text-sm font-bold text-ink-900">{formatZAR(trend.freeholdPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-ink-500">Scheme Price</span>
                      <span className="text-sm font-bold text-ink-900">{formatZAR(trend.schemePrice)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (Sidebar Sections) */}
        <div className="space-y-8">
          
          {/* 5. Bond Details */}
          <section className="bg-white rounded-3xl border border-sand-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-ink-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              Bond Information
            </h3>
            {bondDetails && bondDetails.length > 0 ? (
              <div className="space-y-6">
                {bondDetails.map((bond, idx) => (
                  <div key={idx} className="space-y-1.5 pb-4 border-b border-sand-100 last:border-0 last:pb-0">
                    <p className="text-[10px] font-bold text-ink-300 uppercase tracking-widest">{bond.bondInstitution}</p>
                    <p className="text-sm font-bold text-ink-900">{formatZAR(bond.bondamount)}</p>
                    <p className="text-[10px] text-ink-400 font-medium">No: {bond.bondNumber} • {formatDate(bond.bondRegistrationDate?.toString())}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-sand-50 rounded-2xl border border-dashed border-sand-200">
                <p className="text-xs text-ink-400 italic">No bond records found</p>
              </div>
            )}
          </section>

          {/* 6. Municipal Valuation */}
          <section className="bg-ink-900 text-white rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
              <Building className="w-4 h-4 text-forest-400" />
              Municipal Valuation
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] text-ink-400 uppercase tracking-widest mb-1">Valuation</p>
                <p className="text-xl font-bold text-forest-400">{formatZAR(municipalValuation?.municipalValuation)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] text-ink-400 uppercase tracking-widest mb-1">Usage</p>
                  <p className="text-sm font-bold">{municipalValuation?.lsUsage || "Residential"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. Endorsements & Servitudes */}
          <section className="bg-white rounded-3xl border border-sand-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-ink-900 mb-6 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              Endorsements
            </h3>
            <div className="space-y-3">
              {endorsements && endorsements.length > 0 ? (
                endorsements.map((e, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/50 rounded-xl border border-amber-100/50">
                    <p className="text-[10px] font-bold text-amber-800 uppercase tracking-tight">{e.endorsementNumber}</p>
                    <p className="text-[11px] text-amber-900 mt-1 leading-relaxed">{e.endorsementDescription}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-ink-400 italic">No active endorsements</p>
              )}
            </div>
            
            <h3 className="text-sm font-bold text-ink-900 mb-6 mt-8 flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-500" />
              Servitudes
            </h3>
            <div className="space-y-3">
              {servitudes && servitudes.length > 0 ? (
                servitudes.map((s, idx) => (
                  <div key={idx} className="p-3 bg-purple-50/50 rounded-xl border border-purple-100/50">
                    <p className="text-[10px] font-bold text-purple-800 uppercase tracking-tight">{s.servitudeType}</p>
                    <p className="text-[11px] text-purple-900 mt-1 leading-relaxed">{s.easeType}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-ink-400 italic">No registered servitudes</p>
              )}
            </div>
          </section>

          {/* 8. Points of Interest */}
          <section className="bg-white rounded-3xl border border-sand-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-ink-900 mb-6 flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-forest-500" />
              Points of Interest
            </h3>
            <div className="space-y-4">
              {pointsOfInterest?.slice(0, 6).map((poi, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-4 border-b border-sand-50 last:border-0 last:pb-0">
                  <div className="w-6 h-6 bg-sand-100 rounded flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-ink-600">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink-900 leading-tight">{poi.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-ink-400 uppercase tracking-widest">{poi.type}</span>
                      <div className="w-0.5 h-0.5 bg-sand-300 rounded-full" />
                      <span className="text-[9px] font-bold text-forest-500 uppercase tracking-widest">{(poi.distance / 1000).toFixed(1)} km</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 9. Transfer History (Full Width) */}
      <section className="bg-white rounded-3xl border border-sand-200 p-8 shadow-sm print:shadow-none">
        <h2 className="text-xl font-display text-ink-900 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-sand-50 text-ink-900 rounded-xl flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          Transfer History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-sand-100">
                <th className="pb-4 text-[10px] font-bold text-ink-300 uppercase tracking-widest">Buyer</th>
                <th className="pb-4 text-[10px] font-bold text-ink-300 uppercase tracking-widest">Seller</th>
                <th className="pb-4 text-[10px] font-bold text-ink-300 uppercase tracking-widest">Reg Date</th>
                <th className="pb-4 text-[10px] font-bold text-ink-300 uppercase tracking-widest">Title Deed</th>
                <th className="pb-4 text-right text-[10px] font-bold text-ink-300 uppercase tracking-widest">Purchase Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-50">
              {transferHistory?.map((th, idx) => (
                <tr key={idx} className="group hover:bg-sand-50/50 transition-colors">
                  <td className="py-4 text-xs font-bold text-ink-900">{th.buyerName || "—"}</td>
                  <td className="py-4 text-xs text-ink-600">{th.sellerName || "—"}</td>
                  <td className="py-4 text-xs text-ink-600">{formatDate(th.registrationDate)}</td>
                  <td className="py-4 text-xs text-ink-400 font-mono">{th.titleDeed || "—"}</td>
                  <td className="py-4 text-xs font-bold text-ink-900 text-right">
                    {th.purchasePrice ? formatZAR(th.purchasePrice) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex items-center justify-center gap-4 py-12 text-ink-300 no-print">
        <Info className="w-4 h-4" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">End of Comprehensive Report</p>
      </div>
    </div>
  );
}

// Helper icons for the dashboard (if not imported)
function BarChart3(props: any) {
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
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  )
}
