"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Shield, Zap, MapPin, Globe, Home, ArrowUpRight, User } from "lucide-react";
import Link from "next/link";
import PropertySearch from "@/components/PropertySearch";
import ValuationCard from "@/components/ValuationCard";
import ValuationSkeleton from "@/components/ValuationSkeleton";
import type {
  PropertySearchResult,
  SuburbSearchResult,
  PropertyDetails,
} from "@/types/lightstone";

export default function HomePage() {
  const router = useRouter();
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [suburbProperties, setSuburbProperties] = useState<PropertySearchResult[]>([]);
  const [selectedSuburb, setSelectedSuburb] = useState<SuburbSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const handleSelect = async (result: any) => {
    let propertyId: number | string | null = null;

    if ("propertyId" in result) {
      propertyId = result.propertyId;
    } else if ("source" in result && (result.type === "property" || result.type === "address")) {
      propertyId = result.id;
    }

    if (propertyId) {
      router.push(`/property/${propertyId}`);
    } else {
      // Suburb or Town search result
      setIsLoading(true);
      setError(null);
      setProperty(null);
      setSuburbProperties([]);
      setSelectedSuburb(result);

      try {
        const suburbId = result.suburbId;
        const townId = result.townId;
        const name = result.suburbName || result.townName || result.name;

        let res;
        let data;

        if (suburbId) {
          // 1. Try fetching by suburbId
          res = await fetch(
            `/api/properties-by-suburb?suburbId=${suburbId}&limit=100`
          );
          data = await res.json();

          // 2. Fallback to keyword search if no results or error
          if (!res.ok || !data.results || data.results.length === 0) {
            const townName = result.townName || "";
            const searchQuery = `${name}${townName && townName !== name ? `, ${townName}` : ""}`;
            console.log(`No results for suburbId ${suburbId}, falling back to keyword search for "${searchQuery}"`);

            res = await fetch(
              `/api/property-search?q=${encodeURIComponent(searchQuery)}&limit=100`
            );
            data = await res.json();
          }
        } else {
          // Town selection or generic location - use keyword search for broad coverage
          const searchQuery = name;
          console.log(`Searching properties for town/area: "${searchQuery}"`);
          res = await fetch(
            `/api/property-search?q=${encodeURIComponent(searchQuery)}&limit=100`
          );
          data = await res.json();
        }

        if (!res.ok) {
          throw new Error(data.error ?? "Failed to load properties for this area");
        }

        setSuburbProperties(data.results ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-sand-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl text-ink-900 tracking-tight">
              Sellhome
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-ink-600">
            <Link href="/pricing" className="hover:text-forest-600 transition-colors">Pricing</Link>
            {isLoggedIn ? (
              <Link href="/account" className="flex items-center gap-2 bg-sand-100 text-ink-900 px-4 py-2 rounded-lg hover:bg-sand-200 transition-all shadow-sm">
                <User className="w-4 h-4" />
                Account
              </Link>
            ) : (
              <Link href="/login" className="bg-ink-900 text-white px-4 py-2 rounded-lg hover:bg-ink-800 transition-all shadow-sm">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

        <div className="max-w-4xl mx-auto px-4 relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest-700 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in">
            <Zap className="w-3 h-3" />
            Trusted by 500+ Real Estate Pros
          </div>

          <h1 className="text-5xl md:text-7xl font-display text-ink-900 leading-[1.1] tracking-tight mb-8 animate-fade-in-up">
            Valuation Data <br />
            <span className="text-forest-600 italic">You Can Trust</span>
          </h1>

          <p className="text-xl text-ink-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delay-1">
            Access verified deeds office data, market trends, and AI-powered property valuations in seconds.
          </p>

          <div className="animate-fade-in-up-delay-1">
            <PropertySearch onSelect={handleSelect} />
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 animate-fade-in-up-delay-2">
            <div className="card p-8 group hover:border-forest-200 transition-all">
              <div className="w-12 h-12 bg-forest-50 rounded-2xl flex items-center justify-center text-forest-600 mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl text-ink-900 mb-3">Verified Data</h3>
              <p className="text-sm text-ink-500 leading-relaxed">Sourced directly from official deeds office records for 100% accuracy.</p>
            </div>

            <div className="card p-8 group hover:border-forest-200 transition-all">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl text-ink-900 mb-3">Instant Valuation</h3>
              <p className="text-sm text-ink-500 leading-relaxed">Get automated market values using our proprietary AI algorithms.</p>
            </div>

            <div className="card p-8 group hover:border-forest-200 transition-all">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl text-ink-900 mb-3">Market Trends</h3>
              <p className="text-sm text-ink-500 leading-relaxed">Detailed suburb performance and historical price trend analysis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky search when results are showing */}
      {(property || selectedSuburb || isLoading) && (
        <section className="pt-6 pb-4 px-4 sm:px-6 bg-sand-50 border-b border-sand-200">
          <PropertySearch onSelect={handleSelect} />
        </section>
      )}

      {/* Results Area */}
      <main className="bg-sand-50 pb-32">
        <div className="max-w-2xl mx-auto mt-8">
          {isLoading && <ValuationSkeleton />}

          {error && (
            <div className="card p-8 text-center animate-fade-in-up">
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-ink-400 text-sm mt-4 hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {property && !isLoading && (
            <ValuationCard property={property} />
          )}

          {selectedSuburb && !isLoading && (
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center text-forest-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display text-ink-900">
                      {selectedSuburb.suburbName || selectedSuburb.townName || selectedSuburb.name}
                    </h2>
                    <p className="text-sm text-ink-400">
                      {selectedSuburb.townName ? `${selectedSuburb.townName}, ` : ""}{selectedSuburb.provinceName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-ink-400 uppercase tracking-widest">Available Data</p>
                  <p className="text-sm font-bold text-forest-600">{suburbProperties.length} Properties</p>
                </div>
              </div>

              <div className="space-y-4">
                {suburbProperties.map((p, index) => (
                  <button
                    key={p.propertyId}
                    onClick={() => handleSelect(p)}
                    className="w-full text-left card p-6 group hover:border-forest-300 transition-all flex items-center justify-between gap-6"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-sand-100 rounded-xl flex items-center justify-center text-ink-400 group-hover:bg-forest-100 group-hover:text-forest-600 transition-colors">
                        <Home className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-medium text-ink-900 group-hover:text-forest-700 transition-colors">
                          {p.addressString || `${p.streetNumber} ${p.streetName} ${p.streetType}`}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-ink-400">{p.propertyType || "Residential"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block text-right">
                        <p className="text-xs font-bold text-ink-400 uppercase tracking-widest">Est. Value</p>
                        <p className="text-sm font-bold text-ink-900">Market Rate</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-sand-50 flex items-center justify-center text-ink-300 group-hover:bg-forest-600 group-hover:text-white transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-sand-200 py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-forest-600 rounded flex items-center justify-center">
              <Building2 className="w-3 h-3 text-white" />
            </div>
            <span className="font-display text-lg text-ink-900">PropValue</span>
          </div>
          <div className="flex items-center gap-8 text-xs text-ink-400">
            <p>Data provided by Lightstone Property</p>
            <p>© {new Date().getFullYear()} PropValue</p>
            <a href="#" className="hover:text-forest-600">Privacy Policy</a>
            <a href="#" className="hover:text-forest-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
