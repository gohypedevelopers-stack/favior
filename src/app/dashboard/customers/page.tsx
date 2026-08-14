import type { Metadata } from "next";
import { Plus, UserRound } from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { CustomerTableRows } from "@/components/admin/customers/customer-table-rows";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCustomersForDashboard } from "@/lib/server/controllers/dashboard.controller";

export const metadata: Metadata = {
  title: "Customers | Favior Admin",
  description: "Review customer profiles, orders, and spending in Favior.",
};

export default async function CustomersPage() {
  const customers = await getCustomersForDashboard();

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main style={{"minHeight":"100%","flex":"1 1 0%","backgroundColor":"rgb(245,245,245)","padding":"1rem","color":"rgb(0,0,0)"}}>
            <div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}>
              <div>
                <h1 style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"1.125rem","lineHeight":"1.75rem","fontWeight":"600"}}><UserRound className="size-4" /> Customers</h1>
                <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Customers saved in your database.</p>
              </div>
              <button type="button" style={{"display":"inline-flex","height":"2rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(255,255,255)"}}><Plus className="size-3.5" /> Add customer</button>
            </div>

            <section style={{"marginTop":"0.75rem","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
              {customers.length === 0 ? (
                <div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"3rem","paddingBottom":"3rem","textAlign":"center"}}>
                  <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>No customers yet</h2>
                  <p style={{"marginTop":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}>Customer accounts will appear here after they are created.</p>
                </div>
              ) : (
                <div style={{"overflowX":"auto"}}>
                  <table style={{"width":"100%","minWidth":"900px","borderCollapse":"collapse","textAlign":"left","fontSize":"0.75rem","lineHeight":"1rem"}}>
                    <thead style={{"backgroundColor":"rgb(0,0,0,0.025)"}}>
                      <tr>
                        {['', 'Customer name', 'Email', 'Phone', 'Orders', 'Amount spent', 'Joined'].map((heading, index) => (
                          <th key={`${heading}-${index}`} className={`border-b border-black/10 px-3 py-2.5 font-medium ${index === 4 || index === 5 ? 'text-right' : ''}`}>{index === 0 ? <input type="checkbox" aria-label="Select all customers" /> : heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody><CustomerTableRows customers={customers} /></tbody>
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
