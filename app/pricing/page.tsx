"use client";

import { Check, ArrowRight, ShieldCheck, Zap, BarChart3, Building2, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PricingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const plans = [
    {
      id: "seller-report",
      name: "Property Value Seller Report",
      price: "175.00",
      wcProductId: 61, // Replace with your actual WooCommerce Product ID
      description: "A comprehensive valuation report specifically designed for sellers and real estate professionals.",
      features: [
        "Predicted Market Value",
        "Comparable Sales Analysis",
        "Municipal Valuation Details",
        "Registered Owner Information",
        "Transfer History (Full)",
        "Points of Interest & Amenities",
        "Capital Growth Tracking"
      ],
      highlight: true,
      icon: <Zap className="w-6 h-6" />,
      color: "forest"
    },
    {
      id: "sectional-report",
      name: "Sectional Scheme Report",
      price: "138.00",
      wcProductId: 124, // Replace with your actual WooCommerce Product ID
      description: "Detailed insights into sectional title schemes, including unit performance and scheme health.",
      features: [
        "Scheme Financial Overview",
        "Unit Sales History",
        "Comparable Unit Analysis",
        "Scheme Registration Details",
        "Levy & Rate Estimations",
        "Occupancy Trends"
      ],
      highlight: false,
      icon: <Building2 className="w-6 h-6" />,
      color: "blue"
    },
    {
      id: "property-report",
      name: "Property Report",
      price: "138.00",
      wcProductId: 125, // Replace with your actual WooCommerce Product ID
      description: "Standard property information report covering the essential deeds office and market data.",
      features: [
        "Basic Property Details",
        "Last Sale Information",
        "Owner Verification",
        "Street-level Market Trends",
        "Aerial & Map Views",
        "Zoning Information"
      ],
      highlight: false,
      icon: <BarChart3 className="w-6 h-6" />,
      color: "amber"
    }
  ];

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Navigation */}
      <header className="border-b border-sand-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl text-ink-900 tracking-tight">
              PropValue
            </span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-ink-600">
            <Link href="/" className="hover:text-forest-600 transition-colors">Home</Link>
            <Link href="/pricing" className="text-forest-600">Pricing</Link>
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

      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display text-ink-900 mb-6 tracking-tight">
            Simple, Transparent <br />
            <span className="text-forest-600 italic">Pay-Per-Report</span>
          </h1>
          <p className="text-xl text-ink-500 max-w-2xl mx-auto leading-relaxed">
            Get professional property data without recurring subscriptions.
            Only pay for the insights you need, when you need them.
          </p>
          <p className="mt-4 text-sm text-ink-400 font-medium">* Prices exclude VAT</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-3xl bg-white transition-all duration-300 border-2 group
                         ${plan.highlight
                  ? "border-forest-600 shadow-2xl shadow-forest-900/10 scale-105 z-10"
                  : "border-sand-200 hover:border-sand-300 shadow-xl shadow-sand-900/5 hover:translate-y-[-4px]"}`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-forest-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 
                              ${plan.color === 'forest' ? 'bg-forest-50 text-forest-600' :
                  plan.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                    'bg-amber-50 text-amber-600'}`}>
                {plan.icon}
              </div>

              <h3 className="text-xl font-display text-ink-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-ink-900">R{plan.price}</span>
                <span className="text-ink-400 text-sm">/ report</span>
              </div>

              <p className="text-sm text-ink-500 mb-8 leading-relaxed min-h-[60px]">
                {plan.description}
              </p>

              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 
                                    ${plan.highlight ? 'bg-forest-100 text-forest-600' : 'bg-sand-100 text-ink-400'}`}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-ink-600">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/checkout?plan=${plan.id}`}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                                 ${plan.highlight
                    ? "bg-forest-600 text-white hover:bg-forest-700 shadow-lg shadow-forest-900/20"
                    : "bg-ink-900 text-white hover:bg-ink-800"}`}
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison Footer */}
        <div className="mt-24 p-12 bg-white rounded-3xl border border-sand-200 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-500">
            <ShieldCheck className="w-32 h-32" />
          </div>
          <h2 className="text-2xl font-display text-ink-900 mb-4">Enterprise Data Solutions</h2>
          <p className="text-ink-500 mb-8 max-w-xl mx-auto leading-relaxed">
            Need high-volume access or custom API integrations for your platform?
            Contact our enterprise team for volume-based pricing and custom reporting solutions.
          </p>
          <button className="text-forest-600 font-bold uppercase tracking-widest text-xs hover:underline flex items-center gap-2 mx-auto">
            Contact Sales Support
            <ArrowRight className="w-3 h-3" />
          </button>
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
