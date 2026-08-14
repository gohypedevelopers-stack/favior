import type { Metadata } from "next";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { AddProductForm } from "@/components/admin/products/add-product-form";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import * as categoriesController from "@/lib/server/controllers/categories.controller";

export const metadata: Metadata = {
  title: "Add product | Favior Admin",
  description: "Create a new product in the Favior admin dashboard.",
};

export default async function AddProductPage() {
  const categories = await categoriesController.listCategories();

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main style={{"minHeight":"100%","backgroundColor":"rgb(245,245,245)","padding":"1rem","color":"rgb(0,0,0)"}}>
            <AddProductForm categories={categories.map((c: any) => ({ id: c.id, title: c.title }))} />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
