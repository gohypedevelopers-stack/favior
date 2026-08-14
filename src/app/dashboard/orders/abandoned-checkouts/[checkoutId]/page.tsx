import Link from "next/link";
import { Clock3, ShoppingCart } from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAbandonedCheckout } from "@/lib/server/controllers/abandoned-checkouts.controller";
import { readAbandonedCheckoutItems } from "@/lib/server/dal/abandoned-checkouts.dal";

export default async function AbandonedCheckoutDetailPage({ params }: PageProps<"/dashboard/orders/abandoned-checkouts/[checkoutId]">) {
  const { checkoutId } = await params;
  let checkout: Awaited<ReturnType<typeof getAbandonedCheckout>> | null = null;
  try {
    checkout = await getAbandonedCheckout(checkoutId);
  } catch {
    checkout = null;
  }

  const items = checkout ? readAbandonedCheckoutItems(checkout.items) : [];
  const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
  const timestamp = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main style={{"minHeight":"100%","flex":"1 1 0%","backgroundColor":"rgb(245,245,245)","padding":"1rem","color":"rgb(0,0,0)"}}>
            <div style={{"marginLeft":"auto","marginRight":"auto","maxWidth":"48rem"}}>
              <Link href="/dashboard/orders/abandoned-checkouts" style={{"fontSize":"0.75rem","lineHeight":"1rem","textDecorationLine":"underline","textUnderlineOffset":"2px","color":"rgb(0,0,0)"}}>Back to abandoned checkouts</Link>
              {!checkout ? (
                <section style={{"marginTop":"0.75rem","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"3rem","paddingBottom":"3rem","textAlign":"center","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
                  <ShoppingCart style={{"marginLeft":"auto","marginRight":"auto"}} />
                  <h1 style={{"marginTop":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Checkout not found</h1>
                  <p style={{"marginLeft":"auto","marginRight":"auto","marginTop":"0.5rem","maxWidth":"28rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}>This checkout may have been completed or removed.</p>
                </section>
              ) : (
                <>
                  <header style={{"marginTop":"0.75rem","display":"flex","flexWrap":"wrap","alignItems":"flex-end","justifyContent":"space-between","gap":"0.75rem"}}>
                    <div><h1 style={{"fontSize":"1.125rem","lineHeight":"1.75rem","fontWeight":"600"}}>Abandoned checkout</h1><p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Started {timestamp.format(checkout.createdAt)}</p></div>
                    <span style={{"display":"inline-flex","alignItems":"center","gap":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}><Clock3 className="size-3.5" />Last active {timestamp.format(checkout.lastActivityAt)}</span>
                  </header>
                  <div style={{"marginTop":"0.75rem","display":"grid","gap":"1rem"}}>
                    <section style={{"overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
                      <div style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}><h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Products</h2></div>
                      <div style={{"borderTopWidth":"calc(1px * calc(1 - 0))","borderBottomWidth":"calc(1px * 0)","borderColor":"rgb(0,0,0,0.1)"}}>
                        {items.map((item) => <div key={item.productId} style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"1rem","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}><div><Link href={`/dashboard/products/${item.slug}`} style={{"fontWeight":"500","textDecorationLine":"underline"}}>{item.name}</Link><p style={{"marginTop":"0.125rem","fontSize":"0.75rem","lineHeight":"1rem"}}>{item.category} · Quantity {item.quantity}</p></div><span style={{"flexShrink":"0","fontWeight":"500"}}>{money.format(item.unitPrice * item.quantity)}</span></div>)}
                      </div>
                      <div style={{"display":"flex","justifyContent":"space-between","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}><span>Total</span><span>{money.format(checkout.total)}</span></div>
                    </section>
                    <aside style={{"borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}><h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Customer</h2><dl style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)","fontSize":"0.875rem","lineHeight":"1.25rem"}}><div><dt className="text-black/55">Name</dt><dd style={{"marginTop":"0.125rem","fontWeight":"500"}}>{checkout.customerName || "Not provided"}</dd></div><div><dt className="text-black/55">Email</dt><dd style={{"marginTop":"0.125rem","fontWeight":"500"}}>{checkout.email || "Not provided"}</dd></div><div><dt className="text-black/55">Phone</dt><dd style={{"marginTop":"0.125rem","fontWeight":"500"}}>{checkout.phone || "Not provided"}</dd></div></dl></aside>
                  </div>
                </>
              )}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
