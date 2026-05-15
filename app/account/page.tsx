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
import { generateInvoicePDF } from "@/lib/invoice";
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
    const name = localStorage.getItem("userName");
    
    if (!isLoggedIn || !email) {
      router.push("/login?redirect=/account");
      return;
    }

    setUserEmail(email);
    setUserName(name || "User");
    
    const consumed = JSON.parse(localStorage.getItem("consumedReports") || "[]");
    setConsumedReports(consumed);
    
    fetchAccountData(email);
  }, [router]);

  const fetchAccountData = async (email: string) => {
    setIsLoading(true);
    try {
      // 1. Fetch Orders
      const orderRes = await fetch(`/api/orders?email=${encodeURIComponent(email)}`, { cache: 'no-store' });
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

  const [activeTab, setActiveTab] = useState<"reports" | "billing" | "settings">("reports");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (userName) {
      const parts = userName.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
    }
  }, [userName]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateSuccess(false);
    
    try {
      const res = await fetch("/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          firstName,
          lastName
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      // Update local state and storage
      const newName = `${firstName} ${lastName}`.trim();
      setUserName(newName);
      localStorage.setItem("userName", newName);
      setUpdateSuccess(true);
      
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownloadInvoice = (order: any) => {
    generateInvoicePDF({
      orderId: order.id.toString(),
      date: formatDate(order.date_created),
      customerName: `${order.billing.first_name} ${order.billing.last_name}`,
      customerEmail: order.billing.email,
      billingAddress: {
        address: order.billing.address_1,
        city: order.billing.city,
        postcode: order.billing.postcode,
      },
      items: order.line_items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: formatZAR(parseFloat(item.total)),
      })),
      total: formatZAR(parseFloat(order.total)),
      paymentMethod: order.payment_method_title || "Direct Payment",
    });
  };

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
                <h2 className="font-display text-xl text-ink-900">{userName || "User"}</h2>
                <p className="text-sm text-ink-400 truncate">{userEmail}</p>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-forest-600 uppercase tracking-widest bg-forest-50 w-fit px-2 py-1 rounded-md">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Pro
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { id: "reports", name: "My Reports", icon: <FileText className="w-4 h-4" /> },
                { id: "billing", name: "Billing & Orders", icon: <CreditCard className="w-4 h-4" /> },
                { id: "settings", name: "Settings", icon: <Settings className="w-4 h-4" /> }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all
                             ${activeTab === item.id ? "bg-white text-forest-600 shadow-sm border border-sand-200" : "text-ink-400 hover:text-ink-600"}`}
                >
                  <div className="flex items-center gap-3 text-sm font-medium">
                    {item.icon}
                    {item.name}
                  </div>
                  {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-8 animate-fade-in">
            {activeTab === "reports" && (
              <>
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

                <div className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden">
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
              </>
            )}

            {activeTab === "billing" && (
              <>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-3xl font-display text-ink-900 mb-1">Billing & Orders</h1>
                    <p className="text-sm text-ink-500">Manage your purchases and view your transaction history.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-3xl border border-sand-200 p-6 shadow-sm">
                    <p className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-1">Total Spent</p>
                    <p className="text-2xl font-display text-ink-900">
                      {formatZAR(orders.reduce((acc, o) => acc + parseFloat(o.total), 0))}
                    </p>
                  </div>
                  <div className="bg-white rounded-3xl border border-sand-200 p-6 shadow-sm">
                    <p className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-1">Total Orders</p>
                    <p className="text-2xl font-display text-ink-900">{orders.length}</p>
                  </div>
                  <div className="bg-white rounded-3xl border border-sand-200 p-6 shadow-sm">
                    <p className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-1">Active Credits</p>
                    <p className="text-2xl font-display text-forest-600">
                      {Math.max(0, orders.filter(o => o.status === "completed").length - consumedReports.length)} Available
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-sand-100 bg-sand-50/50 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        Full Order History
                      </h3>
                      <p className="text-xs text-ink-400 mt-1 uppercase tracking-tight">All transactions linked to {userEmail}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-ink-300 uppercase">Status:</span>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Connected</span>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-white border-b border-sand-200">
                          <th className="px-8 py-4 text-xs font-bold text-ink-400 uppercase tracking-widest">Order ID</th>
                          <th className="px-8 py-4 text-xs font-bold text-ink-400 uppercase tracking-widest">Package / Report Type</th>
                          <th className="px-8 py-4 text-xs font-bold text-ink-400 uppercase tracking-widest">Transaction Date</th>
                          <th className="px-8 py-4 text-xs font-bold text-ink-400 uppercase tracking-widest">Amount Paid</th>
                          <th className="px-8 py-4 text-xs font-bold text-ink-400 uppercase tracking-widest">Status</th>
                          <th className="px-8 py-4 text-xs font-bold text-ink-400 uppercase tracking-widest text-right">Invoice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sand-100 bg-white">
                        {isLoading ? (
                          <tr>
                            <td colSpan={6} className="px-8 py-16 text-center">
                              <Loader2 className="w-8 h-8 text-forest-500 animate-spin mx-auto mb-4" />
                              <p className="text-xs font-bold text-ink-300 uppercase tracking-widest">Retrieving transactions...</p>
                            </td>
                          </tr>
                        ) : orders.length > 0 ? (
                          orders.map((order) => (
                            <tr key={order.id} className="hover:bg-sand-50/50 transition-colors group">
                              <td className="px-8 py-6 whitespace-nowrap">
                                <p className="text-sm font-bold text-ink-900">#{order.id}</p>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-sand-100 flex items-center justify-center text-ink-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-ink-900 font-bold">
                                      {order.line_items?.[0]?.name || "Property Report Package"}
                                    </p>
                                    <p className="text-[10px] text-ink-400 uppercase tracking-widest mt-0.5">
                                      {order.payment_method_title || "Direct Payment"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <p className="text-sm text-ink-600">{formatDate(order.date_created)}</p>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <p className="text-sm font-bold text-ink-900">{formatZAR(parseFloat(order.total))}</p>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                                  order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  <div className={`w-1 h-1 rounded-full ${
                                    order.status === 'completed' ? 'bg-emerald-600' : 
                                    order.status === 'processing' ? 'bg-blue-600' :
                                    'bg-amber-600'
                                  }`} />
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap text-right">
                                <button 
                                  onClick={() => handleDownloadInvoice(order)}
                                  className="p-2 text-ink-300 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                  title="Download Invoice PDF"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-8 py-16 text-center">
                              <div className="w-12 h-12 bg-sand-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-ink-200">
                                <CreditCard className="w-6 h-6" />
                              </div>
                              <p className="text-sm text-ink-400 mb-4">No transactions found for this account.</p>
                              <Link href="/pricing" className="bg-forest-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-forest-700 transition-all inline-block shadow-lg shadow-forest-900/10">
                                Buy a Package
                              </Link>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {billingAddress && (
                  <div className="bg-white rounded-3xl border border-sand-200 p-8 shadow-sm">
                    <h3 className="text-lg font-display text-ink-900 mb-6 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-forest-600" />
                      Default Billing Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-2">Customer Details</p>
                        <p className="text-sm font-bold text-ink-900">{billingAddress.fullName}</p>
                        <p className="text-sm text-ink-600">{billingAddress.email}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-2">Shipping To</p>
                        <p className="text-sm text-ink-900">{billingAddress.address}</p>
                        <p className="text-sm text-ink-900">{billingAddress.city}, {billingAddress.postalCode}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "settings" && (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-3xl font-display text-ink-900 mb-1">Account Settings</h1>
                    <p className="text-sm text-ink-500">Update your profile information and account preferences.</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-sand-100 bg-sand-50/50">
                    <h3 className="text-sm font-bold text-ink-900 uppercase tracking-widest flex items-center gap-2">
                      <User className="w-4 h-4 text-forest-600" />
                      Personal Information
                    </h3>
                  </div>
                  
                  <form onSubmit={handleUpdateProfile} className="p-8 space-y-6 max-w-2xl">
                    {updateSuccess && (
                      <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-100 animate-fade-in">
                        Profile updated successfully! Changes synced to WooCommerce.
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-ink-400 uppercase tracking-widest">First Name</label>
                        <input 
                          type="text" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/10 transition-all outline-none text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-ink-400 uppercase tracking-widest">Last Name</label>
                        <input 
                          type="text" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-sand-200 focus:border-forest-500 focus:ring-4 focus:ring-forest-500/10 transition-all outline-none text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-ink-400 uppercase tracking-widest">Email Address</label>
                      <input 
                        type="email" 
                        value={userEmail}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-sand-100 bg-sand-50 text-ink-400 text-sm cursor-not-allowed"
                      />
                      <p className="text-[10px] text-ink-300 italic">Email address cannot be changed. Contact support for assistance.</p>
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        disabled={isUpdating}
                        className="px-8 py-3 bg-ink-900 text-white rounded-xl font-bold hover:bg-ink-800 transition-all flex items-center gap-2 shadow-lg shadow-sand-900/10 disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-sand-100/50 rounded-3xl p-8 border border-dashed border-sand-300">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-ink-400 border border-sand-200">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-ink-900 uppercase tracking-widest mb-1">Advanced Settings</h4>
                      <p className="text-xs text-ink-400 mb-4">Additional preferences and security settings will be available soon.</p>
                      <button disabled className="text-[10px] font-bold text-ink-300 uppercase tracking-widest cursor-not-allowed">
                        Coming Soon
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
