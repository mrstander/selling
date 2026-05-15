"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Building2,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Mail,
  User,
  MapPin
} from "lucide-react";
import Link from "next/link";
import { formatZAR } from "@/lib/utils";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("plan") || "seller-report";

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      const redirectUrl = `/checkout?plan=${planId}`;
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    }
  }, [router, planId]);

  const plans: Record<string, any> = {
    "seller-report": {
      name: "Property Value Seller Report",
      price: 175.00,
      vat: 26.25,
      total: 201.25,
      wcProductId: 61
    },
    "sectional-report": {
      name: "Sectional Scheme Report",
      price: 138.00,
      vat: 20.70,
      total: 158.70,
      wcProductId: 124
    },
    "property-report": {
      name: "Property Report",
      price: 138.00,
      vat: 20.70,
      total: 158.70,
      wcProductId: 125
    }
  };

  const plan = plans[planId] || plans["seller-report"];

  const [billingInfo, setBillingInfo] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: ""
  });

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        const billing = {
          ...billingInfo,
          email: billingInfo.email || userEmail // Fallback to user email if billing email is empty
        };

        if (userEmail) {
          const response = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              planName: plan.name,
              total: plan.total,
              wcProductId: plan.wcProductId,
              billing: billing
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Failed to create order");
          }
        }

        // Keep local tracking for UI simplicity
        const purchased = JSON.parse(localStorage.getItem("purchasedPlans") || "[]");
        if (!purchased.includes(planId)) {
          purchased.push(planId);
          localStorage.setItem("purchasedPlans", JSON.stringify(purchased));
        }

        setIsProcessing(false);
        setIsSuccess(true);
      } catch (error: any) {
        console.error("Order sync failed:", error);
        alert(`Order creation failed: ${error.message}. Please try again or contact support.`);
        setIsProcessing(false);
      }
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-display text-ink-900 mb-4">Payment Successful!</h1>
        <p className="text-ink-500 mb-6 leading-relaxed">
          You have successfully purchased the <span className="font-bold text-ink-900">{plan.name}</span> package.
        </p>
        <p className="text-ink-400 mb-10 text-sm">
          Your report is being generated and will be sent to your email address shortly.
          You can now unlock valuation details for any property.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/")}
            className="bg-ink-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-ink-800 transition-all"
          >
            Return Home
          </button>
          <button className="bg-white border border-sand-200 text-ink-900 px-8 py-3 rounded-xl font-bold hover:bg-sand-50 transition-all">
            View Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-ink-400 hover:text-ink-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Pricing</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-3xl border border-sand-200 p-8 shadow-sm">
            <h2 className="text-xl font-display text-ink-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-forest-50 text-forest-600 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              Billing Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-400 uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={billingInfo.fullName}
                  onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/10 transition-all outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-400 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={billingInfo.email}
                    onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-sand-200 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/10 transition-all outline-none"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-ink-400 uppercase tracking-widest">Street Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
                  <input
                    type="text"
                    placeholder="123 Property Lane"
                    value={billingInfo.address}
                    onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-sand-200 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/10 transition-all outline-none"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-400 uppercase tracking-widest">City</label>
                <input
                  type="text"
                  placeholder="Cape Town"
                  value={billingInfo.city}
                  onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/10 transition-all outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-400 uppercase tracking-widest">Postal Code</label>
                <input
                  type="text"
                  placeholder="8001"
                  value={billingInfo.postalCode}
                  onChange={(e) => setBillingInfo({ ...billingInfo, postalCode: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/10 transition-all outline-none"
                  required
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-sand-200 p-8 shadow-sm">
            <h2 className="text-xl font-display text-ink-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              Payment Method
            </h2>
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-400 uppercase tracking-widest">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242 (Demo)"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-sand-200 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/10 transition-all outline-none font-mono"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-ink-400 uppercase tracking-widest">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/10 transition-all outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-ink-400 uppercase tracking-widest">CVC</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
                    <input
                      type="password"
                      placeholder="•••"
                      className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/10 transition-all outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-forest-600 text-white rounded-xl font-bold hover:bg-forest-700 transition-all shadow-lg shadow-forest-900/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay {formatZAR(plan.total)} Securely
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 mt-4 text-ink-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">AES-256 Encrypted Payment</span>
                </div>
              </div>
            </form>
          </section>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <section className="bg-ink-900 text-white rounded-3xl p-8 shadow-xl sticky top-24">
            <h3 className="text-lg font-display mb-6">Order Summary</h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-bold text-sm">{plan.name}</p>
                  <p className="text-xs text-ink-400 mt-1 italic">Single Use Report</p>
                </div>
                <p className="font-bold text-sm">{formatZAR(plan.price)}</p>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-ink-400">Subtotal (Excl. VAT)</span>
                <span>{formatZAR(plan.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ink-400">VAT (15%)</span>
                <span>{formatZAR(plan.vat)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/10 mt-3">
                <span>Total</span>
                <span className="text-forest-400">{formatZAR(plan.total)}</span>
              </div>
            </div>

            <div className="mt-10 bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-[10px] text-ink-400 leading-relaxed italic">
                * By completing this purchase, you agree to our Terms of Service.
                All reports are generated using live Lightstone data and are non-refundable
                once generated.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <header className="border-b border-sand-200 bg-white h-16 flex items-center">
        <div className="max-w-6xl mx-auto px-4 w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl text-ink-900 tracking-tight">
              PropValue
            </span>
          </Link>
          <div className="flex items-center gap-2 text-ink-400">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Secure Checkout</span>
          </div>
        </div>
      </header>

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-forest-100 border-t-forest-600 rounded-full animate-spin" />
        </div>
      }>
        <CheckoutContent />
      </Suspense>

      <footer className="py-12 px-4 text-center">
        <p className="text-xs text-ink-300">
          © {new Date().getFullYear()} PropValue • Powered by Lightstone Secure Data Systems
        </p>
      </footer>
    </div>
  );
}
