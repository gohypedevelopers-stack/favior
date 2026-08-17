import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server/dal/auth";
import { listOrders } from "@/lib/server/controllers/orders.controller";
import Navbar from "@/components/Navbar";
import { Package, User } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./logout-button";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const orders = await listOrders(user.id);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16 mt-16">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-zinc-900 mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Profile Sidebar */}
          <div className="col-span-1 flex flex-col gap-8 border-r border-zinc-100 pr-8">
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.05em] text-zinc-400 mb-4 flex items-center gap-2">
                <User size={14} /> Profile Details
              </h2>
              <p className="text-sm font-medium text-zinc-900">{user.name}</p>
              <p className="text-sm text-zinc-500 mt-1">{user.email}</p>
            </div>
            
            <div className="pt-8 border-t border-zinc-100">
               <LogoutButton />
            </div>
          </div>

          {/* Orders Section */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.05em] text-zinc-400 flex items-center gap-2">
              <Package size={14} /> Order History
            </h2>
            
            {orders.length === 0 ? (
              <div className="bg-zinc-50 border border-zinc-100 rounded-sm p-8 text-center">
                <p className="text-sm text-zinc-500 mb-4">You haven't placed any orders yet.</p>
                <Link href="/all-products" className="inline-block bg-black text-white text-[11px] font-bold uppercase tracking-widest px-6 py-3 hover:opacity-80 transition-opacity">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-zinc-100 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase text-zinc-900 tracking-wider">Order #{order.id.slice(-6)}</p>
                      <p className="text-[11px] text-zinc-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <p className="text-sm font-medium text-zinc-900">${order.total.toFixed(2)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1 px-2 py-0.5 bg-zinc-100 rounded-sm">
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
