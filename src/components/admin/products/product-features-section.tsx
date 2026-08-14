"use client"

import { Plus, Trash2, ListPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ProductFeaturesSectionProps {
  features: string[]
  onChange: (features: string[]) => void
}

export function ProductFeaturesSection({ features, onChange }: ProductFeaturesSectionProps) {

  function addFeature() {
    onChange([...features, ""])
  }

  function updateFeature(index: number, value: string) {
    const newFeatures = [...features]
    newFeatures[index] = value
    onChange(newFeatures)
  }

  function removeFeature(index: number) {
    const newFeatures = [...features]
    newFeatures.splice(index, 1)
    onChange(newFeatures)
  }

  return (
    <section style={{"marginTop":"1rem","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
      <div style={{"display":"flex","alignItems":"flex-start","justifyContent":"space-between","gap":"1rem","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem"}}>
        <div>
          <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(0,0,0,0.75)"}}>Key Features</h2>
          <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.5)"}}>Add short, punchy bullet points to highlight the product's main selling points.</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addFeature} style={{"flexShrink":"0","cursor":"pointer","backgroundColor":"rgb(0,0,0,0.03)","color":"rgb(0,0,0,0.7)","boxShadow":"0 0 #0000, 0 0 #0000, 0 0 #0000"}}>
          <Plus style={{"marginRight":"0.25rem"}} /> Add feature
        </Button>
      </div>

      {features.length > 0 ? (
        <div style={{"borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem"}}>
          <div style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)"}}>
            {features.map((feature, index) => (
              <div key={index} style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                <Input
                  aria-label="Feature text"
                  value={feature}
                  onChange={(event) => updateFeature(index, event.target.value)}
                  placeholder="e.g. 180° Rotating Gimbal Stand"
                  style={{"flex":"1 1 0%","borderColor":"rgb(0,0,0,0.2)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 0 #0000"}}
                />
                <Button type="button" variant="ghost" size="icon" aria-label="Remove feature" onClick={() => removeFeature(index)} style={{"flexShrink":"0","cursor":"pointer","color":"rgb(185,28,28)","backgroundColor":"rgb(254,242,242)"}}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{"marginLeft":"1rem","marginRight":"1rem","marginBottom":"1rem","display":"flex","flexDirection":"column","alignItems":"center","borderRadius":"0.5rem","borderWidth":"1px","borderStyle":"dashed","backgroundColor":"rgb(0,0,0,0.015)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1.25rem","paddingBottom":"1.25rem","textAlign":"center"}}>
          <ListPlus className="size-5 text-black/35" />
          <p style={{"marginTop":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>No features yet</p>
          <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.5)"}}>Highlight your product's main selling points.</p>
          <Button type="button" variant="outline" size="sm" onClick={addFeature} style={{"marginTop":"0.75rem","cursor":"pointer","backgroundColor":"rgb(255,255,255)","border":"1px solid rgb(0,0,0,0.2)","color":"rgb(0,0,0,0.7)","boxShadow":"0 1px 2px 0 rgb(0,0,0,0.05)"}}>
            <Plus style={{"marginRight":"0.25rem","width":"1rem","height":"1rem"}} /> Add feature
          </Button>
        </div>
      )}
    </section>
  )
}
