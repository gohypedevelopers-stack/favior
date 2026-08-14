"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, PackageOpen, Plus, Tag, Truck } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const discountTypes = [
  {
    title: "Amount off products",
    description: "Discount specific products or collections of products",
    icon: Tag,
  },
  {
    title: "Buy X get Y",
    description: "Discount specific products or collections of products",
    icon: Tag,
  },
  {
    title: "Amount off order",
    description: "Discount the total order amount",
    icon: PackageOpen,
  },
  {
    title: "Free shipping",
    description: "Offer free shipping on an order",
    icon: Truck,
  },
]

const discountTypeRoutes: Record<string, string> = {
  "Amount off products": "/dashboard/discounts/new",
  "Buy X get Y": "/dashboard/discounts/buy-x-get-y",
  "Amount off order": "/dashboard/discounts/amount-off-order",
  "Free shipping": "/dashboard/discounts/free-shipping",
}

export function CreateDiscountDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            style={{"display":"inline-flex","height":"2rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(255,255,255)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}
          />
        }
      >
        <Plus className="size-3.5" /> Create discount
      </DialogTrigger>

      <DialogContent
        style={{"width":"min(620px,calc(100vw - 2rem))","maxWidth":"calc(100vw - 2rem)","gap":"0px","overflow":"hidden","borderRadius":"1rem","padding":"0px"}}
        overlayClassName="bg-black/45"
      >
        <DialogHeader style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1.25rem","paddingBottom":"1.25rem"}}>
          <DialogTitle style={{"fontSize":"1rem","lineHeight":"1.5rem","fontWeight":"600"}}>
            Select discount type
          </DialogTitle>
          <DialogDescription style={{"position":"absolute","width":"1px","height":"1px","padding":"0","margin":"-1px","overflow":"hidden","clip":"rect(0, 0, 0, 0)","whiteSpace":"nowrap","borderWidth":"0"}}>
            Choose the type of discount you want to create.
          </DialogDescription>
        </DialogHeader>

        <div role="list" aria-label="Discount types">
          {discountTypes.map((discountType, index) => {
            const Icon = discountType.icon
            const route = discountTypeRoutes[discountType.title]
            const optionClass = `flex min-h-[68px] w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-black/[0.05] ${index < discountTypes.length - 1 ? "border-b border-black/10" : ""} ${index === 0 ? "bg-black/[0.035]" : ""}`
            const optionContent = <><Icon style={{"flexShrink":"0","color":"rgb(0,0,0,0.75)"}} /><span style={{"minWidth":"0px","flex":"1 1 0%"}}><span style={{"display":"block","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.8)"}}>{discountType.title}</span><span style={{"marginTop":"0.25rem","display":"block","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.6)"}}>{discountType.description}</span></span><ChevronRight style={{"flexShrink":"0"}} /></>

            return route ? (
              <Link key={discountType.title} href={route} className={optionClass}>
                {optionContent}
              </Link>
            ) : (
              <button
                key={discountType.title}
                type="button"
                role="listitem"
                onClick={() => setOpen(false)}
                className={optionClass}
              >
                {optionContent}
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
