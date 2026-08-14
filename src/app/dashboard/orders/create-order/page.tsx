import type { Metadata } from "next"
import { Suspense } from "react"

import { CreateOrderClient } from "./create-order-client"

export const metadata: Metadata = {
  title: "Create order | Favior Admin",
  description: "Create draft orders, add products, and configure payment details.",
}

export default function CreateOrderPage() {
  return (
    <Suspense fallback={<div style={{"padding":"1.5rem","color":"rgb(148,163,184)"}}>Loading order form...</div>}>
      <CreateOrderClient />
    </Suspense>
  )
}
