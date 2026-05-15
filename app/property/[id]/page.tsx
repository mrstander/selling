"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, ArrowLeft, Loader2, Download, ShieldCheck, MapPin } from "lucide-react";
import SellersReportView from "@/components/SellersReportView";
import PropertyReportView from "@/components/PropertyReportView";
import ValuationSkeleton from "@/components/ValuationSkeleton";
import type { SellersReportResponse, PropertyReportResponse } from "@/types/lightstone";

interface PropertyPageProps {
  params: { id: string };
}

export default function PropertyDetailPage({ params }: PropertyPageProps) {
  const { id } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportType = searchParams.get("type") || "sellers";
  
  const [report, setReport] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const purchased = JSON.parse(localStorage.getItem("purchasedPlans") || "[]");

    if (!isLoggedIn) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.href));
      return;
    }

    if (purchased.length === 0) {
      router.push("/pricing");
      return;
    }

    async function fetchPropertyData() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/property-report?id=${encodeURIComponent(id)}&type=${reportType}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error ?? "Failed to load property details");
        }
        
        setReport(data);

        // Mark as consumed for credit tracking
        const consumed = JSON.parse(localStorage.getItem("consumedReports") || "[]");
        const alreadyConsumed = consumed.find((c: any) => c.id === id && c.type === reportType);
        
        if (!alreadyConsumed) {
          consumed.push({ 
            id, 
            type: reportType, 
            date: new Date().toISOString(),
            address: `${data.propertyDetails.streetNumber} ${data.propertyDetails.streetName}` 
          });
          localStorage.setItem("consumedReports", JSON.stringify(consumed));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPropertyData();
  }, [id]);

  return (
    <div className="min-h-screen bg-sand-50 pb-20 print:bg-white print:pb-0">
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            margin: 1cm;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      {/* Header */}
      <header className="border-b border-sand-200 bg-white sticky top-0 z-40 no-print">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-ink-600 hover:text-forest-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-lg text-ink-900 hidden sm:block">
              PropValue
            </span>
          </div>

          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-forest-600 text-white rounded-lg text-sm font-bold hover:bg-forest-700 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-8 px-2">
              <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center text-forest-600 animate-pulse">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-48 bg-sand-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-sand-100 rounded animate-pulse" />
              </div>
            </div>
            <ValuationSkeleton />
          </div>
        ) : error ? (
          <div className="bg-white border border-red-100 p-10 rounded-3xl text-center shadow-lg animate-fade-in">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-display text-ink-900 mb-3">Unable to Load Property</h1>
            <p className="text-ink-500 mb-8 max-w-sm mx-auto">{error}</p>
            <button 
              onClick={() => router.push("/")}
              className="bg-forest-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-forest-700 transition-all shadow-md"
            >
              Return to Home
            </button>
          </div>
        ) : report ? (
          <div className="animate-fade-in">
            {/* Page Title / Context */}
            <div className="mb-8 px-2 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-display text-ink-900">Sellers Report</h1>
                <p className="text-ink-400 text-sm mt-1">Generated from Lightstone verified data</p>
              </div>
              <div className="flex items-center gap-2 bg-forest-50 text-forest-700 px-3 py-1.5 rounded-full border border-forest-100">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Verified</span>
              </div>
            </div>

            {reportType === "property" ? (
              <PropertyReportView data={report as PropertyReportResponse} />
            ) : (
              <SellersReportView report={report as SellersReportResponse} />
            )}
            
            <div className="mt-12 p-6 bg-white border border-sand-200 rounded-2xl flex items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-sand-50 rounded-xl flex items-center justify-center text-forest-600">
                   <Building2 className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-ink-900">Looking for more?</p>
                   <p className="text-xs text-ink-400 mt-0.5">Explore more properties in this area.</p>
                 </div>
               </div>
               <button 
                 onClick={() => router.push("/")}
                 className="text-xs font-bold text-forest-600 uppercase tracking-widest hover:underline"
               >
                 Search Again
               </button>
            </div>
          </div>
        ) : null}
      </main>

      <footer className="max-w-3xl mx-auto px-4 py-12 border-t border-sand-200 text-center no-print">
        <p className="text-xs text-ink-300">
          This report is generated using Lightstone's Property Value Sellers Report (No PI) endpoint. 
          Information provided is based on historical deeds office data and current market estimations.
        </p>
        <p className="text-xs text-ink-300 mt-4">
          © {new Date().getFullYear()} PropValue • Powered by Lightstone
        </p>
      </footer>
    </div>
  );
}
