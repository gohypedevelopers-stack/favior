"use client"

import { CirclePlus, X } from "lucide-react"
import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { defaultProductCategories } from "@/lib/product-categories"

function AddPill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{"display":"inline-flex","height":"1.5rem","alignItems":"center","gap":"0.25rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.07)","paddingLeft":"0.5rem","paddingRight":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}>
      {children}
    </span>
  )
}

export function ProductOrganizationFields() {
  const [category, setCategory] = useState("")

  return (
    <div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)","paddingLeft":"1rem","paddingRight":"1rem","paddingBottom":"1rem"}}>
      <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}>
        <span>Collections</span>
        <div style={{"display":"flex","height":"2.25rem","alignItems":"center","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.25)","paddingLeft":"0.375rem","paddingRight":"0.375rem"}}>
          <AddPill>
            <CirclePlus className="size-3" />
            Add collections
          </AddPill>
        </div>
      </label>

      <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}>
        <span>Category</span>
        <Select value={category} onValueChange={(nextValue) => { if (nextValue) setCategory(nextValue) }}>
          <SelectTrigger
            aria-label="Product category"
            style={{"width":"100%","borderRadius":"0.5rem","borderColor":"rgb(0,0,0,0.25)","backgroundColor":"rgb(255,255,255) !important","color":"rgb(0,0,0)","boxShadow":"0 0 #0000, 0 0 #0000, 0 0 #0000"}}
          >
            <SelectValue placeholder="Add to a category" />
          </SelectTrigger>
          <SelectContent style={{"backgroundColor":"rgb(255,255,255)","color":"rgb(0,0,0)"}}>
            {defaultProductCategories.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {category ? (
          <span style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.5rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.06)","paddingLeft":"0.625rem","paddingRight":"0.625rem","paddingTop":"0.375rem","paddingBottom":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.7)"}}>
            {defaultProductCategories.find((option) => option.id === category)?.title}
            <button
              type="button"
              onClick={() => setCategory("")}
              aria-label={`Remove ${category} category`}
              style={{"borderRadius":"0.25rem","padding":"0.125rem","color":"rgb(0,0,0)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.1)","outline":"2px solid transparent","outlineOffset":"2px","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(2px + 0px) rgb(59,130,246,0.5), 0 0 #0000"}}
            >
              <X className="size-3.5" />
            </button>
          </span>
        ) : null}
      </label>

      <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}>
        <span>Tags</span>
        <div style={{"display":"flex","height":"2.25rem","alignItems":"center","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.25)","paddingLeft":"0.375rem","paddingRight":"0.375rem"}}>
          <AddPill>
            <CirclePlus className="size-3" />
            Add tags
          </AddPill>
        </div>
      </label>
    </div>
  )
}


