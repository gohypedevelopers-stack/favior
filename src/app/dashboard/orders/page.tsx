import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Package } from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getOrdersForDashboard } from "@/lib/server/controllers/dashboard.controller";

export const metadata: Metadata = {
  title: "Orders | Favior Admin",
  description: "Manage Favior orders and fulfillment.",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function extractPaymentMethod(address: string | null): string {
  if (!address) return "—";
  const match = address.match(/\[Payment:\s*([A-Z_]+)\]/i);
  if (!match) return "—";
  const method = match[1].toUpperCase();
  if (method === "CARD") return "Credit / Debit Card";
  if (method === "UPI") return "UPI";
  if (method === "COD") return "Cash on Delivery";
  if (method === "NETBANKING") return "Net Banking";
  return method;
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function orderReference(id: string) {
  return `#${id.slice(-8).toUpperCase()}`;
}

function statusClass(status: string): React.CSSProperties {
  if (status === "DELIVERED") return { backgroundColor: "#d1fae5", color: "#065f46" };
  if (status === "CANCELLED") return { backgroundColor: "#fee2e2", color: "#7f1d1d" };
  if (status === "PROCESSING" || status === "SHIPPED") return { backgroundColor: "#e0f2fe", color: "#0c4a6e" };
  return { backgroundColor: "#fef3c7", color: "#78350f" };
}

export default async function OrdersPage() {
  const orders = await getOrdersForDashboard();
  const activeOrders = orders.filter((order: any) => order.status !== "CANCELLED");
  const itemsOrdered = activeOrders.reduce(
    (sum: number, order: any) => sum + order.items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0),
    0
  );
  const summary = [
    { label: "Orders", value: orders.length },
    { label: "Items ordered", value: itemsOrdered },
    { label: "Open orders", value: orders.filter((order: any) => ["PENDING", "CONFIRMED", "PROCESSING"].includes(order.status)).length },
    { label: "Fulfilled", value: orders.filter((order: any) => ["SHIPPED", "DELIVERED"].includes(order.status)).length },
    { label: "Delivered", value: orders.filter((order: any) => order.status === "DELIVERED").length },
  ];

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header style={{"display":"flex","height":"4rem","flexShrink":"0","alignItems":"center","gap":"0.5rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem"}}>
            <div style={{"display":"flex","alignItems":"center","gap":"0.5rem","paddingLeft":"1rem","paddingRight":"1rem"}}>
            </div>
          </header>
          <main style={{"flex":"1 1 0%","overflowY":"auto","padding":"1.5rem"}}>
            <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","marginBottom":"1.5rem"}}>
              <div>
                <h1 style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"1.125rem","lineHeight":"1.75rem","fontWeight":"600"}}><Package className="size-4" /> Orders</h1>
                <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>All orders recorded in your database.</p>
              </div>
              <Link href="/dashboard/orders/create-order" style={{"display":"inline-flex","height":"2rem","alignItems":"center","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(255,255,255)"}}>
                Create order
              </Link>
            </div>

            <section style={{"marginTop":"0.75rem","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
              <div style={{"display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","borderRightWidth":"calc(1px * 0)","borderLeftWidth":"calc(1px * calc(1 - 0))","borderTopWidth":"calc(1px * calc(1 - 0))","borderBottomWidth":"calc(1px * 0)","borderColor":"rgb(0,0,0,0.1)"}}>
                <div style={{"display":"flex","alignItems":"center","gap":"0.5rem","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}><CalendarDays className="size-4" /> All time</div>
                {summary.map((metric) => (
                  <div key={metric.label} style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>
                    <p style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}>{metric.label}</p>
                    <p style={{"marginTop":"0.25rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>{metric.value.toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </section>

            <section style={{"marginTop":"1rem","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
              <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>
                <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Orders</h2>
                <span style={{"fontSize":"0.75rem","lineHeight":"1rem"}}>{orders.length.toLocaleString("en-IN")} total</span>
              </div>

              <div style={{"overflowX":"auto"}}>
                <table style={{"width":"100%","minWidth":"800px","borderCollapse":"collapse","textAlign":"left","fontSize":"0.75rem","lineHeight":"1rem"}}>
                  <thead style={{"backgroundColor":"rgb(0,0,0,0.025)"}}>
                    <tr>
                      {['Order', 'Date', 'Customer', 'Total', 'Status', 'Items', 'Payment', 'Shipping'].map((heading) => (
                        <th key={heading} style={{ borderBottom: "1px solid rgba(0,0,0,0.1)", padding: "0.625rem 0.75rem", fontWeight: 600, textAlign: heading === 'Total' ? 'right' : 'left', color: "rgb(0,0,0,0.8)" }}>{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"2.5rem","paddingBottom":"2.5rem","textAlign":"center","fontSize":"0.875rem","lineHeight":"1.25rem"}}>No orders yet. Create your first order to see it here.</td>
                      </tr>
                    ) : orders.map((order: any) => {
                      const itemCount = order.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
                      const cleanAddress = (order.shippingAddress || "").replace(/\[Payment:\s*[A-Z_]+\]/gi, "").trim();
                      return (
                        <tr key={order.id} style={{"cursor":"pointer","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.03)"}}>
                          <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"600","color":"rgb(0,0,0)"}}>
                            <Link href={`/dashboard/orders/${order.id}`} style={{"display":"block","fontWeight":"700","color":"rgb(0,0,0)","textDecorationLine":"underline"}}>
                              {orderReference(order.id)}
                            </Link>
                          </td>
                          <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem"}}><Link href={`/dashboard/orders/${order.id}`} style={{"display":"block","color":"inherit"}}>{dateFormatter.format(order.createdAt)}</Link></td>
                          <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"500"}}><Link href={`/dashboard/orders/${order.id}`} style={{"display":"block","color":"inherit"}}>{order.user.name}</Link></td>
                          <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","textAlign":"right","fontWeight":"600","fontVariantNumeric":"tabular-nums"}}><Link href={`/dashboard/orders/${order.id}`} style={{"display":"block","color":"inherit"}}>{currencyFormatter.format(order.total)}</Link></td>
                          <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem"}}><Link href={`/dashboard/orders/${order.id}`} style={{"display":"block"}}><span style={{ borderRadius: "0.375rem", padding: "0.25rem 0.5rem", fontWeight: 600, ...statusClass(order.status) }}>{formatStatus(order.status)}</span></Link></td>
                          <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem"}}><Link href={`/dashboard/orders/${order.id}`} style={{"display":"block","color":"inherit"}}>{itemCount} {itemCount === 1 ? "item" : "items"}</Link></td>
                          <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"500","color":"rgb(0,0,0,0.8)"}}><Link href={`/dashboard/orders/${order.id}`} style={{"display":"block","color":"inherit"}}>{extractPaymentMethod(order.shippingAddress)}</Link></td>
                          <td style={{"maxWidth":"20rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"500","lineHeight":"1.5","color":"rgb(0,0,0,0.8)"}}><Link href={`/dashboard/orders/${order.id}`} style={{"display":"block","color":"inherit"}}>{cleanAddress || "—"}</Link></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
