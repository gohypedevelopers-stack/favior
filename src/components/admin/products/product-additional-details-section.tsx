"use client"

import { useRef, useState } from "react"
import { ListPlus, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type Detail = {
  id: number
  name: string
  value: string
}

export function ProductAdditionalDetailsSection() {
  const [details, setDetails] = useState<Detail[]>([])
  const nextDetailId = useRef(1)

  function addDetail() {
    const id = nextDetailId.current
    nextDetailId.current += 1
    setDetails((current) => [...current, { id, name: "", value: "" }])
  }

  function updateDetail(id: number, field: "name" | "value", value: string) {
    setDetails((current) => current.map((detail) => detail.id === id ? { ...detail, [field]: value } : detail))
  }

  function removeDetail(id: number) {
    setDetails((current) => current.filter((detail) => detail.id !== id))
  }

  return (
    <section style={{"marginTop":"1rem","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
      <div style={{"display":"flex","alignItems":"flex-start","justifyContent":"space-between","gap":"1rem","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem"}}>
        <div>
          <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(0,0,0,0.75)"}}>Additional details</h2>
          <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.5)"}}>Add any product-specific information, such as material, fit, care, or origin.</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addDetail} style={{"flexShrink":"0","cursor":"pointer","backgroundColor":"rgb(0,0,0,0.03)","color":"rgb(0,0,0,0.7)","boxShadow":"0 0 #0000, 0 0 #0000, 0 0 #0000"}}>
          <Plus className="size-3.5" /> Add detail
        </Button>
      </div>

      {details.length > 0 ? (
        <div style={{"borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem"}}>
          <div style={{"display":"grid","gap":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(0,0,0,0.5)"}}>
            <span>Detail name</span>
            <span>Information</span>
          </div>
          <div style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)"}}>
            {details.map((detail) => (
              <div key={detail.id} style={{"display":"grid","alignItems":"flex-start","gap":"0.5rem"}}>
                <Input
                  aria-label="Detail name"
                  value={detail.name}
                  onChange={(event) => updateDetail(detail.id, "name", event.target.value)}
                  placeholder="e.g. Material"
                  style={{"borderColor":"rgb(0,0,0,0.2)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 0 #0000"}}
                />
                <Textarea
                  aria-label={detail.name || "Detail information"}
                  value={detail.value}
                  onChange={(event) => updateDetail(detail.id, "value", event.target.value)}
                  placeholder="Add the product information"
                  style={{"resize":"vertical","borderColor":"rgb(0,0,0,0.2)","backgroundColor":"rgb(255,255,255)","paddingTop":"0.5rem","paddingBottom":"0.5rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 0 #0000"}}
                />
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Remove detail" onClick={() => removeDetail(detail.id)} style={{"cursor":"pointer","color":"rgb(185,28,28)","backgroundColor":"rgb(254,242,242)"}}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{"marginLeft":"1rem","marginRight":"1rem","marginBottom":"1rem","display":"flex","flexDirection":"column","alignItems":"center","borderRadius":"0.5rem","borderWidth":"1px","borderStyle":"dashed","backgroundColor":"rgb(0,0,0,0.015)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1.25rem","paddingBottom":"1.25rem","textAlign":"center"}}>
          <ListPlus className="size-5 text-black/35" />
          <p style={{"marginTop":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>No additional details yet</p>
          <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Use “Add detail” to create your first field.</p>
        </div>
      )}
    </section>
  )
}
