"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, 
  User, 
  FileText, 
  Download, 
  LogOut, 
  Settings, 
  ExternalLink,
  Search,
  ChevronRight,
  MapPin,
  ShieldCheck,
  CreditCard,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { formatZAR, formatDate } from "@/lib/utils";

export default function AccountPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [billingAddress, setBillingAddress] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [consumedReports, setConsumedReports] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const email = localStorage.getItem("userEmail");
    
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setUserEmail(email || "");
      const consumed = JSON.parse(localStorage.getItem("consumedReports") || "[]");
      setConsumedReports(consumed);
      if (email) {
        fetchAccountData(email);
      }
    }
  }, [router]);

  const fetchAccountData = async (email: string) => {
    setIsLoading(true);
    try {
      // 1. Fetch Orders
      const orderRes = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      const orderData = await orderRes.json();
      if (Array.isArray(orderData)) {
        setOrders(orderData);
        
        // 2. Extract billing from latest order if available
        if (orderData.length > 0) {
          const latestOrder = orderData[0];
          setBillingAddress({
            fullName: `${latestOrder.billing.first_name} ${latestOrder.billing.last_name}`,
            address: latestOrder.billing.address_1,
            city: latestOrder.billing.city,
            postalCode: latestOrder.billing.postcode,
            email: latestOrder.billing.email
          });
          setUserName(`${latestOrder.billing.first_name} ${latestOrder.billing.last_name}`);
        }
      }
    } catch (error) {
      console.error("Failed to fetch account data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  // Mock purchased reports
  const reports = [
    {
      id: "REP-98234",
      date: "2024-05-12T14:30:00Z",
      property: "116 High Level Road, Green Point",
      type: "Property Value Seller Report",
      price: 175.00,
      status: "Completed"
    },
    {
      id: "REP-98120",
      date: "2024-05-10T09:15:00Z",
      property: "2 SS 116 ON HIGH LEVEL",
      type: "Sectional Scheme Report",
      price: 138.00,
      status: "Completed"
    },
    {
      id: "REP-97881",
      date: "2024-04-28T16:45:00Z",
      property: "Erf 1869, Green Point",
      type: "Property Report",
      price: 138.00,
      status: "Completed"
    }
  ];

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Navigation */}
      <header className="border-b border-sand-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl text-ink-900 tracking-tight">
              PropValue
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-ink-400 hover:text-red-600 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-sand-200 p-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-20 h-20 bg-forest-50 rounded-bl-full opacity-50" />
              <div className="relative">
                <div className="w-16 h-16 bg-forest-100 text-forest-600 rounded-2xl flex items-center justify-center mb-4">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="font-display text-xl text-ink-900">{userName}</h2>
                <p className="text-sm text-ink-400 truncate">{userEmail}</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-forest-600 uppercase tracking-widest bg-forest-50 w-fit px-2 py-1 rounded-md">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Pro
                </div>
              </div>
            </div>

            {billingAddress && (
              <div className="bg-white rounded-3xl border border-sand-200 p-6 shadow-sm">
                <h3 className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  Billing Address
                </h3>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-ink-900">{billingAddress.fullName}</p>
                  <p className="text-xs text-ink-500">{billingAddress.address}</p>
                  <p className="text-xs text-ink-500">{billingAddress.city}, {billingAddress.postalCode}</p>
                  <p className="text-xs text-ink-300 mt-2">{billingAddress.email}</p>
                </div>
              </div>
            )}

            <nav className="space-y-1">
              {[
                { name: "My Reports", icon: <FileText className="w-4 h-4" />, active: true },
                { name: "Billing", icon: <CreditCard className="w-4 h-4" />, active: false },
                { name: "Settings", icon: <Settings className="w-4 h-4" />, active: false }
              ].map((item) => (
                <button 
                  key={item.name}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all
                             ${item.active ? "bg-white text-forest-600 shadow-sm border border-sand-200" : "text-ink-400 hover:text-ink-600"}`}
                >
                  <div className="flex items-center gap-3 text-sm font-medium">
                    {item.icon}
                    {item.name}
                  </div>
                  {item.active && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-display text-ink-900 mb-1">My Reports</h1>
                <p className="text-sm text-ink-500">Access and manage all your purchased valuation reports.</p>
              </div>
              <Link 
                href="/" 
                className="flex items-center gap-2 px-6 py-3 bg-forest-600 text-white rounded-xl font-bold hover:bg-forest-700 transition-all shadow-lg shadow-forest-900/10"
              >
                <Search className="w-4 h-4" />
                New Search
              </Link>
            </div>

            {/* Unlocked Reports */}
            <div className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden mb-12">
              <div className="px-6 py-4 border-b border-sand-100 bg-sand-50/50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-4 h-4 text-forest-600" />
                  Unlocked Reports
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-sand-50/30 border-b border-sand-200">
                      <th className="px-6 py-4 text-xs font-bold text-ink-400 uppercase tracking-widest">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-ink-400 uppercase tracking-widest">Property</th>
                      <th className="px-6 py-4 text-xs font-bold text-ink-400 uppercase tracking-widest">Date Unlocked</th>
                      <th className="px-6 py-4 text-xs font-bold text-ink-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {consumedReports.length > 0 ? (
                      consumedReports.map((report, idx) => (
                        <tr key={`${report.id}-${idx}`} className="group hover:bg-sand-50/50 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${report.type === 'sellers' ? 'bg-forest-50 text-forest-700' : 'bg-blue-50 text-blue-700'}`}>
                              {report.type}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm font-bold text-ink-900 line-clamp-1">{report.address}</p>
                            <p className="text-[10px] text-ink-400 mt-0.5 font-mono">ID: {report.id}</p>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <p className="text-sm text-ink-600">{formatDate(report.date)}</p>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => router.push(`/property/${report.id}?type=${report.type}`)}
                                className="p-2 text-ink-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-all" 
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => alert("Downloading PDF...")}
                                className="p-2 text-ink-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-all" 
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-ink-400 italic text-sm">
                          No reports unlocked yet. 
                          <Link href="/" className="ml-2 text-forest-600 not-italic font-bold hover:underline">Start searching</Link>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* WooCommerce Order History */}
            <div className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-sand-100 bg-sand-50/50">
                <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  Order History & Credits
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-sand-50/30 border-b border-sand-200">
                      <th className="px-6 py-4 text-xs font-bold text-ink-400 uppercase tracking-widest">Order</th>
                      <th className="px-6 py-4 text-xs font-bold text-ink-400 uppercase tracking-widest">Product</th>
                      <th className="px-6 py-4 text-xs font-bold text-ink-400 uppercase tracking-widest">Total</th>
                      <th className="px-6 py-4 text-xs font-bold text-ink-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <Loader2 className="w-6 h-6 text-forest-500 animate-spin mx-auto mb-2" />
                          <p className="text-[10px] font-bold text-ink-300 uppercase">Syncing orders...</p>
                        </td>
                      </tr>
                    ) : orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-sand-50/50 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <p className="text-sm font-bold text-ink-900">#{order.id}</p>
                            <p className="text-[10px] text-ink-400">{formatDate(order.date_created)}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-sm text-ink-900 font-medium">
                              {order.line_items?.[0]?.name || "Property Data Package"}
                            </p>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-ink-900">
                            {formatZAR(parseFloat(order.total))}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-ink-400 italic text-sm">
                          No orders found in WooCommerce.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Account Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-8 group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-16 h-16" />
                </div>
                <h3 className="font-display text-lg text-ink-900 mb-2">Billing History</h3>
                <p className="text-sm text-ink-500 mb-6">View your invoices and manage your payment methods.</p>
                <button className="text-xs font-bold text-forest-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                  Manage Billing
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="card p-8 group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-16 h-16" />
                </div>
                <h3 className="font-display text-lg text-ink-900 mb-2">Security & Privacy</h3>
                <p className="text-sm text-ink-500 mb-6">Update your password and manage your account security.</p>
                <button className="text-xs font-bold text-forest-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                  Security Settings
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-12 border-t border-sand-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs text-ink-300">© {new Date().getFullYear()} PropValue Dashboard • Verified Data Access</p>
        <div className="flex gap-6 text-xs text-ink-400">
          <a href="#" className="hover:text-forest-600">Privacy</a>
          <a href="#" className="hover:text-forest-600">Terms</a>
          <a href="#" className="hover:text-forest-600">Support</a>
        </div>
      </footer>
    </div>
  );
}
