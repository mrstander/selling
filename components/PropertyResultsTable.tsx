"use client";

import { MapPin, ArrowRight, Home, Users, Building, Download, FileText } from "lucide-react";
import type { PropertySearchResult, SuburbSearchResult, CompleteSearchResult } from "@/types/lightstone";
import Link from "next/link";

interface PropertyResultsTableProps {
  results: (PropertySearchResult | SuburbSearchResult | CompleteSearchResult)[];
  onSelect: (result: PropertySearchResult | SuburbSearchResult | CompleteSearchResult, reportType?: "sellers" | "property") => void;
  orders?: any[];
}

export default function PropertyResultsTable({ results, onSelect, orders = [] }: PropertyResultsTableProps) {
  if (results.length === 0) return null;

  // Calculate credits based on orders
  // Using product names or IDs from pricing (61, etc.)
  const sellerCredits = orders.filter(o => 
    o.status === "completed" && 
    (o.line_items.some((li: any) => li.product_id === 61 || li.name.toLowerCase().includes("seller")))
  ).length;

  const propertyCredits = orders.filter(o => 
    o.status === "completed" && 
    (o.line_items.some((li: any) => li.product_id === 63 || li.name.toLowerCase().includes("property report")))
  ).length;

  // Tracking consumed reports from localStorage
  const consumed = JSON.parse(typeof window !== "undefined" ? localStorage.getItem("consumedReports") || "[]" : "[]");
  
  const usedSellerCount = consumed.filter((c: any) => c.type === "sellers").length;
  const usedPropertyCount = consumed.filter((c: any) => c.type === "property").length;

  const availableSeller = Math.max(0, sellerCredits - usedSellerCount);
  const availableProperty = Math.max(0, propertyCredits - usedPropertyCount);

  return (
    <div className="w-full mt-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-lg font-display text-ink-900 flex items-center gap-2">
          <div className="w-2 h-6 bg-forest-500 rounded-full" />
          Search Results
          <span className="text-sm font-normal text-ink-400 ml-2">
            ({results.length} found)
          </span>
        </h2>
      </div>

      <div className="bg-white border border-sand-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-sand-50/50 border-b border-sand-200">
              <th className="px-6 py-4 text-xs font-bold text-ink-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-xs font-bold text-ink-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-ink-400 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-bold text-ink-400 uppercase tracking-wider">Suburb / Location</th>
              <th className="px-6 py-4 text-xs font-bold text-ink-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {results.map((r, i) => {
              // Handle new CompleteSearchResult format
              const isCompleteResult = "source" in r;
              
              const id = isCompleteResult ? r.id : (("propertyId" in r) ? r.propertyId : r.id);
              const type = isCompleteResult ? r.type : (("propertyId" in r) ? "property" : "suburb");
              const title = isCompleteResult ? r.source.name : (("addressString" in r) ? (r.addressString || r.description) : (r.suburbName || r.name));
              const description = isCompleteResult ? r.source.description : (("addressString" in r) ? r.addressString : r.description);
              
              // Extract suburb from description (rough heuristic for the new payload)
              let suburb = "";
              if (isCompleteResult && r.source.description) {
                const parts = r.source.description.split(",");
                if (parts.length >= 3) {
                  suburb = parts[2].trim(); // Usually the 3rd part in the provided examples
                }
              } else if (!isCompleteResult) {
                suburb = ("suburbName" in r) ? r.suburbName : "";
              }

              return (
                <tr key={`${id}-${i}`} className="group hover:bg-forest-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-ink-400">{id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider 
                        ${type === "property" || type === "address" ? "bg-blue-50 text-blue-600" : 
                          type === "suburb" ? "bg-forest-50 text-forest-600" : "bg-sand-100 text-ink-600"}`}>
                        {type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm font-medium text-ink-900 line-clamp-1" title={title}>
                      {title}
                    </p>
                    <p className="text-xs text-ink-400 mt-0.5 line-clamp-1" title={description}>
                      {description}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-ink-600">{suburb || "—"}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {availableSeller > 0 && (
                        <div className="relative group/tooltip">
                          <button
                            onClick={() => onSelect(r, "sellers")}
                            className="p-2 rounded-xl bg-white border border-sand-200 text-forest-600 hover:bg-forest-600 hover:text-white hover:border-forest-600 transition-all shadow-sm active:scale-95"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-ink-900 text-white text-[10px] font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Property Value Report ({availableSeller} left)
                          </div>
                        </div>
                      )}

                      {availableProperty > 0 && (
                        <div className="relative group/tooltip">
                          <button
                            onClick={() => onSelect(r, "property")}
                            className="p-2 rounded-xl bg-white border border-sand-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-95"
                          >
                            <Building className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-ink-900 text-white text-[10px] font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            Property Value ({availableProperty} left)
                          </div>
                        </div>
                      )}

                      {availableSeller === 0 && availableProperty === 0 && (
                        <Link 
                          href="/pricing"
                          className="text-[10px] font-bold text-ink-300 uppercase tracking-widest hover:text-forest-600"
                        >
                          Buy Credits
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 px-2 flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-ink-300">
        <div className="flex items-center gap-4">
          <p>Showing {results.length} results</p>
          <div className="w-1 h-1 bg-sand-200 rounded-full" />
          <p>Credits: <span className="text-forest-600">{availableSeller} Seller</span> / <span className="text-blue-600">{availableProperty} Property</span></p>
        </div>
      </div>
    </div>
  );
}
