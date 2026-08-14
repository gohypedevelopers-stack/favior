"use client"

import { Printer } from "lucide-react"

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      style={{"display":"inline-flex","height":"2rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(0,0,0,0.03)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}
    >
      <Printer className="size-3.5" />
      Print
    </button>
  )
}
