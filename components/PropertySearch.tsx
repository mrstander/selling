"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Loader2, X, Home, Globe } from "lucide-react";
import type { PropertySearchResult, SuburbSearchResult, CompleteSearchResult } from "@/types/lightstone";

// Removed SearchMode type as we only use address/property search now

interface PropertySearchProps {
  onSelect: (result: PropertySearchResult | SuburbSearchResult | CompleteSearchResult) => void;
  onSearchResults?: (results: (PropertySearchResult | SuburbSearchResult | CompleteSearchResult)[]) => void;
}

export default function PropertySearch({ onSelect, onSearchResults }: PropertySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<(PropertySearchResult | SuburbSearchResult | CompleteSearchResult)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // doSearch is now only used for selection if needed, but we mostly use handleSubmit now
  const doSearch = useCallback(async (searchQuery: string, isSubmit = false) => {
    if (searchQuery.trim().length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const endpoint = "/api/property-search";

      const res = await fetch(
        `${endpoint}?q=${encodeURIComponent(searchQuery)}&limit=20`,
        { cache: 'no-store' }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Search failed");
      }

      const newResults = data.results ?? [];
      setResults(newResults);
      
      if (isSubmit) {
        setIsOpen(false);
        onSearchResults?.(newResults);
      } else {
        setIsOpen(true);
      }
      
      setHighlightIndex(-1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [onSearchResults]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 3) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}&mode=address`);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    // Auto-search is disabled
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(results[highlightIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (result: PropertySearchResult | SuburbSearchResult | CompleteSearchResult) => {
    if ("source" in result) {
      setQuery(result.source.name);
    } else if ("addressString" in result) {
      setQuery(result.addressString || result.description);
    } else {
      setQuery(result.suburbName || result.name);
    }
    setIsOpen(false);
    onSelect(result);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /** Build a display title from the result fields */
  const displayTitle = (r: PropertySearchResult | SuburbSearchResult | CompleteSearchResult) => {
    if ("source" in r) {
      return r.source.name;
    } else if ("addressString" in r) {
      if (r.addressString) return r.addressString;
      return [r.streetNumber, r.streetName, r.streetType]
        .filter(Boolean)
        .join(" ");
    } else {
      return r.suburbName || r.name;
    }
  };

  /** Build the location subtitle line */
  const displayLocation = (r: PropertySearchResult | SuburbSearchResult | CompleteSearchResult) => {
    if ("source" in r) {
      return r.source.description;
    } else if ("addressString" in r) {
      return [r.suburbName, r.townName, r.provinceName]
        .filter(Boolean)
        .join(", ");
    } else {
      return [r.townName, r.municipalityName, r.provinceName]
        .filter(Boolean)
        .join(", ");
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Mode Toggle Removed */}

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400 group-focus-within:text-forest-500 transition-colors" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search properties, addresses, or streets..."
          className="search-input pl-12 pr-32"
          autoComplete="off"
          spellCheck={false}
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-forest-500 animate-spin mr-2" />
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="p-2 text-ink-300 hover:text-ink-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          ) : null}
          
          <button
            type="submit"
            disabled={isLoading || query.trim().length < 3}
            className="bg-forest-600 hover:bg-forest-700 disabled:bg-sand-300 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            Search
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-sand-200 
                     rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden"
        >
          <div className="px-4 py-2 border-b border-sand-100 flex justify-between items-center">
            <span className="text-xs font-medium text-ink-400 uppercase tracking-wider">
              {results.length} properties found
            </span>
          </div>
          <ul className="max-h-[360px] overflow-y-auto">
            {results.map((result, index) => (
              <li key={`${"source" in result ? result.id : result.id}-${index}`}>
                <button
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setHighlightIndex(index)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 
                             transition-colors duration-100
                             ${
                                index === highlightIndex
                                  ? "bg-forest-50"
                                  : "hover:bg-sand-50"
                             }`}
                >
                  <MapPin className="w-4 h-4 mt-0.5 text-forest-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-800 truncate">
                      {displayTitle(result)}
                    </p>
                    {displayLocation(result) && (
                      <p className="text-xs text-ink-400 mt-0.5">
                        {displayLocation(result)}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {"estateName" in result && result.estateName && (
                        <span className="inline-block text-[10px] font-medium uppercase tracking-wider text-forest-600 bg-forest-50 px-2 py-0.5 rounded-full">
                          {result.estateName}
                        </span>
                      )}
                      {"postCode" in result && result.postCode && (
                        <span className="text-[10px] text-ink-300 font-mono">
                          {result.postCode}
                        </span>
                      )}
                      {"suburbPostCode" in result && result.suburbPostCode && (
                        <span className="text-[10px] text-ink-300 font-mono">
                          {result.suburbPostCode}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No results */}
      {isOpen && results.length === 0 && !isLoading && query.length >= 3 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-sand-200 
                     rounded-xl shadow-lg p-6 text-center"
        >
          <p className="text-sm text-ink-500">
            No properties found for &ldquo;{query}&rdquo;
          </p>
          <p className="text-xs text-ink-400 mt-1">
            Try a more specific address or suburb
          </p>
        </div>
      )}
    </div>
  );
}
