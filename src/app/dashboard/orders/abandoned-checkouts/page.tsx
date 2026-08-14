import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, ShoppingCart } from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { listOpenAbandonedCheckouts } from "@/lib/server/controllers/abandoned-checkouts.controller";
import { readAbandonedCheckoutItems } from "@/lib/server/dal/abandoned-checkouts.dal";

export const metadata: Metadata = {
  title: "Abandoned checkouts | Favior Admin",
  description: "Review abandoned checkouts and recovery status.",
};

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 });
const timestamp = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

export default async function AbandonedCheckoutsPage() {
  const checkouts = await listOpenAbandonedCheckouts();

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main style={{"minHeight":"100%","flex":"1 1 0%","backgroundColor":"rgb(245,245,245)","padding":"1rem","color":"rgb(0,0,0)"}}>
            <div style={{"display":"flex","flexWrap":"wrap","alignItems":"flex-end","justifyContent":"space-between","gap":"0.5rem"}}>
              <div>
                <h1 style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"1.125rem","lineHeight":"1.75rem","fontWeight":"600"}}><ShoppingCart className="size-4" /> Abandoned checkouts</h1>
                <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Checkouts started by customers but not yet completed.</p>
              </div>
              <span style={{"fontSize":"0.75rem","lineHeight":"1rem"}}>{checkouts.length} open</span>
            </div>

            <section style={{"marginTop":"0.75rem","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
              {checkouts.length === 0 ? (
                <div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"3rem","paddingBottom":"3rem","textAlign":"center"}}>
                  <ShoppingCart style={{"marginLeft":"auto","marginRight":"auto"}} />
                  <h2 style={{"marginTop":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>No abandoned checkouts to show</h2>
                  <p style={{"marginLeft":"auto","marginRight":"auto","marginTop":"0.5rem","maxWidth":"28rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}>Checkout activity will appear here when a customer leaves checkout without placing their order.</p>
                </div>
              ) : (
                <div style={{"overflowX":"auto"}}>
                  <table style={{"width":"100%","minWidth":"760px","borderCollapse":"collapse","textAlign":"left","fontSize":"0.75rem","lineHeight":"1rem"}}>
                    <thead style={{"backgroundColor":"rgb(0,0,0,0.025)"}}>
                      <tr>
                        {['Customer', 'Products', 'Total', 'Last activity', ''].map((heading: string) => <th key={heading} style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.625rem","paddingBottom":"0.625rem","fontWeight":"500"}}>{heading}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {checkouts.map((checkout: any) => {
                        const items = readAbandonedCheckoutItems(checkout.items);
                        const firstItem = items[0];
                        const customer = checkout.customerName || checkout.email || "Guest checkout";
                        return (
                          <tr key={checkout.id} style={{"backgroundColor":"rgb(0,0,0,0.02)"}}>
                            <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","fontWeight":"500"}}>
                              <p>{customer}</p>
                              {checkout.email && checkout.customerName ? <p style={{"marginTop":"0.125rem","fontWeight":"400"}}>{checkout.email}</p> : null}
                            </td>
                            <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>
                              <p style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontWeight":"500"}}>{firstItem?.name ?? "Products unavailable"}</p>
                              <p style={{"marginTop":"0.125rem"}}>{checkout.itemCount} {checkout.itemCount === 1 ? "item" : "items"}</p>
                            </td>
                            <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","fontWeight":"500"}}>{money.format(checkout.total)}</td>
                            <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}><span style={{"display":"inline-flex","alignItems":"center","gap":"0.25rem"}}><Clock3 className="size-3" />{timestamp.format(checkout.lastActivityAt)}</span></td>
                            <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","textAlign":"right"}}><Link href={`/dashboard/orders/abandoned-checkouts/${checkout.id}`} style={{"fontWeight":"500","color":"rgb(0,91,211)","textDecorationLine":"underline"}}>View</Link></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
