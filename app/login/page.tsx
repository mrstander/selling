"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isSignup) {
        // Real Registration via WooCommerce API
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, firstName, lastName }),
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");
        
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", `${firstName} ${lastName}`);
        router.push(redirect);
      } else {
        // Simulated Login for Demo
        setTimeout(() => {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", email);
          router.push(redirect);
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-2.5 mb-12">
        <div className="w-10 h-10 bg-forest-600 rounded-xl flex items-center justify-center shadow-lg shadow-forest-900/20">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <span className="font-display text-2xl text-ink-900 tracking-tight">
          PropValue
        </span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl border border-sand-200 shadow-xl shadow-sand-900/5 overflow-hidden">
        <div className="p-8 pb-0 text-center">
          <h1 className="text-2xl font-display text-ink-900 mb-2">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-ink-400">
            {isSignup 
              ? "Join PropValue to access premium property reports." 
              : "Log in to access your property reports and insights."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-bold border border-red-100 animate-shake">
              {error}
            </div>
          )}

          {isSignup && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-400 uppercase tracking-widest">First Name</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/10 transition-all outline-none"
                  required={isSignup}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-400 uppercase tracking-widest">Last Name</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/10 transition-all outline-none"
                  required={isSignup}
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-bold text-ink-400 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-sand-200 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/10 transition-all outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-ink-400 uppercase tracking-widest">Password</label>
              <a href="#" className="text-[10px] font-bold text-forest-600 uppercase tracking-widest hover:underline">Forgot?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-sand-200 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/10 transition-all outline-none"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-ink-900 text-white rounded-xl font-bold hover:bg-ink-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-sand-900/10 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isSignup ? "Create Account" : "Sign In"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="p-6 bg-sand-50 border-t border-sand-200 text-center">
          <p className="text-sm text-ink-500">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button 
              onClick={() => setIsSignup(!isSignup)}
              className="text-forest-600 font-bold hover:underline"
            >
              {isSignup ? "Sign in instead" : "Sign up for free"}
            </button>
          </p>
        </div>
      </div>

      <p className="mt-8 text-xs text-ink-300">
        Demo Credentials: demo@example.com / password123
      </p>
    </div>
  );
}
