import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  Download,
  Plus,
  Tag,
  Upload,
} from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { ProductsTable } from "@/components/admin/products/products-table";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import * as productsController from "@/lib/server/controllers/products.controller";

export const metadata: Metadata = {
  title: "Products | Favior Admin",
  description: "Manage Favior products, collections, and inventory.",
};

export default async function ProductsPage() {
  const dbProducts = await productsController.listProducts();

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main style={{"minHeight":"100%","flex":"1 1 0%","backgroundColor":"rgb(245,245,245)","padding":"1rem","color":"rgb(0,0,0)"}}>
            <div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}>
              <h1 style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"1.125rem","lineHeight":"1.75rem","fontWeight":"600"}}>
                <Tag className="size-4" /> Products ({dbProducts.length})
              </h1>
              <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                <button
                  type="button"
                  style={{"display":"inline-flex","height":"2rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}
                >
                  <Download className="size-3.5" /> Export
                </button>
                <button
                  type="button"
                  style={{"display":"inline-flex","height":"2rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}
                >
                  <Upload className="size-3.5" /> Import
                </button>
                <button
                  type="button"
                  style={{"display":"inline-flex","height":"2rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}
                >
                  More actions <ChevronDown className="size-3.5" />
                </button>
                <Link
                  href="/dashboard/products/new"
                  style={{"display":"inline-flex","height":"2rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(255,255,255)"}}
                >
                  <Plus className="size-3.5" /> Add product
                </Link>
              </div>
            </div>

            <section style={{"marginTop":"0.75rem","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
              <div style={{"display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","borderRightWidth":"calc(1px * 0)","borderLeftWidth":"calc(1px * calc(1 - 0))","borderTopWidth":"calc(1px * calc(1 - 0))","borderBottomWidth":"calc(1px * 0)","borderColor":"rgb(0,0,0,0.1)"}}>
                <div style={{"display":"flex","alignItems":"center","gap":"0.5rem","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}>
                  <CalendarDays className="size-4" /> 30 days
                </div>
                <div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>
                  <p style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","textDecorationLine":"underline","textDecorationStyle":"dotted","textUnderlineOffset":"4px"}}>
                    Average sell-through rate
                  </p>
                  <p style={{"marginTop":"0.25rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>
                    0.01% <span style={{"fontWeight":"400"}}>—</span>
                  </p>
                  <div style={{"marginTop":"0.5rem","height":"0.125rem","width":"2.75rem","backgroundColor":"rgb(85,197,247)"}} />
                </div>
                <div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>
                  <p style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","textDecorationLine":"underline","textDecorationStyle":"dotted","textUnderlineOffset":"4px"}}>
                    Products by days of inventory remaining
                  </p>
                  <p style={{"marginTop":"0.25rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}>No data</p>
                </div>
                <div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>
                  <p style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","textDecorationLine":"underline","textDecorationStyle":"dotted","textUnderlineOffset":"4px"}}>
                    ABC product analysis
                  </p>
                  <p style={{"marginTop":"0.25rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>
                    ₹0.00 <span style={{"fontWeight":"400"}}>C</span>
                  </p>
                  <div style={{"marginTop":"0.5rem","height":"0.125rem","width":"2.75rem","backgroundColor":"rgb(85,197,247)"}} />
                </div>
              </div>
            </section>

            <ProductsTable
              products={dbProducts.map((product: any) => ({
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                mainImage: product.mainImage,
                quantity: product.quantity,
                category: product.category ? { title: product.category.title } : null,
              }))}
            />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
