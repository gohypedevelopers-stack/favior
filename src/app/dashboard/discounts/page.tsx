import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Settings2, Tag } from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { DiscountsTable } from "@/components/admin/discounts/discounts-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import * as discountsController from "@/lib/server/controllers/discounts.controller";

export const metadata: Metadata = {
  title: "Discounts | Favior Admin",
  description: "Manage discounts and automatic offers for Favior.",
};

export default async function DiscountsPage() {
  const discounts = await discountsController.listDiscounts();

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main style={{"minHeight":"100%","flex":"1 1 0%","backgroundColor":"rgb(245,245,245)","padding":"1rem","color":"rgb(0,0,0)"}}>
            <div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}>
              <div>
                <h1 style={{"display":"flex","alignItems":"center","gap":"0.625rem","fontSize":"1.25rem","lineHeight":"1.75rem","fontWeight":"500","color":"rgb(26,26,26)"}}><Settings2 className="size-5" /> Discounts</h1>
                <p style={{"marginTop":"0.25rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}>Create and manage discounts for your online store.</p>
              </div>
              <Link href="/dashboard/discounts/new" style={{"display":"inline-flex","height":"2rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(255,255,255)"}}><Plus className="size-3.5" /> Create discount</Link>
            </div>
            {discounts.length ? <DiscountsTable discounts={discounts.map((discount: any) => ({ ...discount, createdAt: discount.createdAt.toISOString() }))} /> : (
              <section style={{"marginTop":"1rem","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"3.5rem","paddingBottom":"3.5rem","textAlign":"center","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
                <div style={{"marginLeft":"auto","marginRight":"auto","display":"flex","alignItems":"center","justifyContent":"center","borderRadius":"0.75rem","backgroundColor":"rgb(0,91,211,0.1)","color":"rgb(0,91,211)"}}><Tag className="size-5" /></div>
                <h2 style={{"marginTop":"1rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Create your first discount</h2>
                <p style={{"marginLeft":"auto","marginRight":"auto","marginTop":"0.5rem","maxWidth":"28rem","fontSize":"0.875rem","lineHeight":"1.5rem"}}>Offer a percentage or fixed amount off across all products with a customer code or an automatic discount.</p>
                <Link href="/dashboard/discounts/new" style={{"marginTop":"1.25rem","display":"inline-flex","height":"2rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(255,255,255)"}}><Plus className="size-3.5" /> Create discount</Link>
              </section>
            )}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
