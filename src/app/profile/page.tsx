import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server/dal/auth";
import { listOrders } from "@/lib/server/controllers/orders.controller";
import Navbar from "@/components/Navbar";
import ProfileSidebar from "./profile-sidebar";
import ProfileForm from "./profile-form";
import WishlistDisplay from "./wishlist-display";
import AddressManager from "./address-manager";
import Link from "next/link";
import { Package, User, MapPin, Heart } from "lucide-react";
import { db } from "@/lib/db";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function ProfilePage(props: Props) {
  const searchParams = await props.searchParams;
  const tab = searchParams.tab || "profile";

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const orders = await listOrders(user.id);
  const addresses = await db.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: 'desc' }]
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column", fontFamily: "sans-serif" }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: "1024px", margin: "64px auto 0", width: "100%", padding: "48px 24px", boxSizing: "border-box" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", color: "#18181b", marginBottom: "48px" }}>
          My Account
        </h1>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "48px" }}>
          
          <ProfileSidebar userName={user.name || "Customer"} userEmail={user.email} />

          {/* Main Content Area */}
          <div style={{ flex: "3 1 500px", display: "flex", flexDirection: "column", gap: "24px", minWidth: "300px" }}>
            
            {/* PROFILE TAB */}
            {tab === "profile" && <ProfileForm user={user} />}

            {/* ORDERS TAB */}
            {tab === "orders" && (
              <>
                <h2 style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#a1a1aa", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                  <Package size={14} /> Order History
                </h2>
                
                {orders.length === 0 ? (
                  <div style={{ backgroundColor: "#fafafa", border: "1px solid #f4f4f5", borderRadius: "2px", padding: "48px", textAlign: "center" }}>
                    <p style={{ fontSize: "14px", color: "#71717a", marginBottom: "24px" }}>You haven't placed any orders yet.</p>
                    <Link href="/all-products" style={{ display: "inline-block", backgroundColor: "#000", color: "#fff", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em", padding: "16px 32px", textDecoration: "none" }}>
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {orders.map((order) => (
                      <div key={order.id} style={{ border: "1px solid #f4f4f5", padding: "24px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                        <div>
                          <p style={{ fontSize: "12px", fontWeight: "500", textTransform: "uppercase", color: "#18181b", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>Order #{order.id.slice(-6)}</p>
                          <p style={{ fontSize: "11px", color: "#71717a", margin: 0 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: "80px" }}>
                          <p style={{ fontSize: "14px", fontWeight: "500", color: "#18181b", margin: "0 0 8px 0" }}>${order.total.toFixed(2)}</p>
                          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: "#71717a", padding: "4px 8px", backgroundColor: "#fafafa", borderRadius: "2px", margin: 0 }}>
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ADDRESSES TAB */}
            {tab === "addresses" && <AddressManager addresses={addresses} />}

            {/* WISHLIST TAB */}
            {tab === "wishlist" && <WishlistDisplay />}

          </div>
          
        </div>
      </main>
    </div>
  );
}
