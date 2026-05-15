"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, ArrowLeft, Loader2, Search as SearchIcon, User } from "lucide-react";
import PropertySearch from "@/components/PropertySearch";
import PropertyResultsTable from "@/components/PropertyResultsTable";
import type { PropertySearchResult, SuburbSearchResult, CompleteSearchResult } from "@/types/lightstone";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q");
  const mode = searchParams.get("mode") || "address";

  const [results, setResults] = useState<(PropertySearchResult | SuburbSearchResult | CompleteSearchResult)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      const email = localStorage.getItem("userEmail");
      if (email) fetchOrders(email);
    }
  }, []);

  const fetchOrders = async (email: string) => {
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setUserOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch user orders:", error);
    }
  };

  useEffect(() => {
    if (query) {
      fetchResults(query, mode);
    }
  }, [query, mode]);

  const fetchResults = async (searchQuery: string, searchMode: string) => {
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const endpoint = 
        searchMode === "address" ? "/api/property-search" :
        searchMode === "suburb" ? "/api/suburb-search" :
        "/api/town-search";

      const res = await fetch(`${endpoint}?q=${encodeURIComponent(searchQuery)}&limit=50`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Search failed");
      }

      setResults(data.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (result: PropertySearchResult | SuburbSearchResult | CompleteSearchResult, reportType: "sellers" | "property" = "sellers") => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const purchased = JSON.parse(localStorage.getItem("purchasedPlans") || "[]");
    
    // Check if user is logged in
    if (!isLoggedIn) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.href));
      return;
    }

    // Check if user has any purchased plan (assuming any plan unlocks reports for now)
    if (purchased.length === 0) {
      router.push("/pricing");
      return;
    }

    let propertyId: number | string | null = null;
    
    if ("source" in result) {
      propertyId = result.source.id;
    } else if ("propertyId" in result) {
      propertyId = (result as any).propertyId;
    } else if ("id" in result) {
      propertyId = result.id;
    }

    if (propertyId) {
      router.push(`/property/${propertyId}?type=${reportType}`);
    } else {
      // For suburb or other types, we might want to handle them differently
      console.log("Selected a non-property result:", result);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <header className="border-b border-sand-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-ink-600 hover:text-forest-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Back Home</span>
          </button>
          
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <PropertySearch onSelect={handleSelect} />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6 mr-4 text-sm font-medium text-ink-600 border-r border-sand-200 pr-6">
              <Link href="/pricing" className="hover:text-forest-600 transition-colors">Pricing</Link>
              {isLoggedIn ? (
                <Link href="/account" className="flex items-center gap-2 text-ink-900 hover:text-forest-600 transition-all">
                  <User className="w-4 h-4" />
                  Account
                </Link>
              ) : (
                <Link href="/login" className="text-ink-900 hover:text-forest-600 transition-all">
                  Sign In
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-lg text-ink-900 hidden sm:block">
                PropValue
              </span>
            </div>
          </div>
        </div>
        {/* Mobile Search */}
        <div className="px-4 pb-4 md:hidden">
          <PropertySearch onSelect={handleSelect} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <Loader2 className="w-10 h-10 text-forest-500 animate-spin mb-4" />
            <p className="text-ink-500 font-medium">Fetching the best results for you...</p>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto bg-white border border-red-100 p-8 rounded-2xl text-center shadow-sm">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-display text-ink-900 mb-2">Search Error</h2>
            <p className="text-ink-500 mb-6">{error}</p>
            <button 
              onClick={() => fetchResults(query!, mode)}
              className="bg-forest-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-forest-700 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && results.length === 0 && !error && (
          <div className="max-w-2xl mx-auto bg-white border border-sand-200 p-12 rounded-2xl text-center shadow-sm">
            <div className="w-16 h-16 bg-sand-50 text-ink-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-display text-ink-900 mb-2">No Results Found</h2>
            <p className="text-ink-500 mb-8">We couldn't find anything matching &ldquo;{query}&rdquo;. Try adjusting your search or category.</p>
            <button 
              onClick={() => router.push("/")}
              className="bg-forest-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-forest-700 transition-all"
            >
              Back to Home
            </button>
          </div>
        )}

        {results.length > 0 && !isLoading && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h1 className="text-2xl font-display text-ink-900">
                Results for <span className="text-forest-600">&ldquo;{query}&rdquo;</span>
              </h1>
              <p className="text-ink-400 mt-1">Found {results.length} properties and locations matching your search.</p>
            </div>
            <PropertyResultsTable 
              results={results} 
              onSelect={handleSelect} 
              orders={userOrders}
            />
          </div>
        )}
      </main>

    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-forest-500 animate-spin" />
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
