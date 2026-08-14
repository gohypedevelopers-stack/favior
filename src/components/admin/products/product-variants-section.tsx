"use client"

import { useMemo, useRef, useState } from "react"
import { Boxes, GripVertical, MoreHorizontal, Palette, Plus, Ruler, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type OptionName = "color" | "size"

const optionDetails = {
  color: { label: "Color", placeholder: "e.g. Black", icon: Palette },
  size: { label: "Size", placeholder: "e.g. Medium", icon: Ruler },
} as const

const colorSwatches: Record<string, string> = {
  black: "#171717",
  white: "#ffffff",
  red: "#ef2b2d",
  blue: "#2563eb",
  green: "#16a34a",
  yellow: "#eab308",
  orange: "#f97316",
  olive: "#808000",
  purple: "#9333ea",
  pink: "#ec4899",
  brown: "#8b5e3c",
  beige: "#d6c3a5",
  cream: "#f5ead2",
  gray: "#6b7280",
  grey: "#6b7280",
  navy: "#1e3a5f",
  teal: "#0f766e",
  cyan: "#06b6d4",
  aqua: "#06b6d4",
  lime: "#84cc16",
  maroon: "#7f1d1d",
  gold: "#d4a017",
  silver: "#a8a8a8",
}

function getColorSwatch(value: string, customSwatch?: string) {
  if (customSwatch) return customSwatch
  const normalized = value.trim().toLowerCase()
  if (/^#[0-9a-f]{3,8}$/i.test(normalized)) return normalized
  return colorSwatches[normalized] ?? "#d1d5db"
}

function toTitleCase(value: string) {
  const trimmed = value.trim()
  if (/^#[0-9a-f]{3,8}$/i.test(trimmed)) return trimmed.toUpperCase()
  return trimmed.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
}

export function ProductVariantsSection() {
  const [enabledOptions, setEnabledOptions] = useState<Record<OptionName, boolean>>({ color: false, size: false })
  const [values, setValues] = useState<Record<OptionName, string[]>>({ color: [], size: [] })
  const [drafts, setDrafts] = useState<Record<OptionName, string>>({ color: "", size: "" })
  const [quantities, setQuantities] = useState<Record<string, string>>({})
  const [prices, setPrices] = useState<Record<string, string>>({})
  const [compareAtPrices, setCompareAtPrices] = useState<Record<string, string>>({})
  const [selectedVariantKeys, setSelectedVariantKeys] = useState<string[]>([])
  const [customSwatches, setCustomSwatches] = useState<Record<string, string>>({})
  const selectedColorRef = useRef("#000000")
  const colorPickerTouchedRef = useRef(false)
  const [headerPickerOpen, setHeaderPickerOpen] = useState(false)
  const [inlinePickerOpen, setInlinePickerOpen] = useState(false)
  const [draggedValue, setDraggedValue] = useState<{ option: OptionName; value: string } | null>(null)
  const [optionOrder, setOptionOrder] = useState<OptionName[]>(["color", "size"])
  const [draggedOption, setDraggedOption] = useState<OptionName | null>(null)
  const [editingValue, setEditingValue] = useState<{ option: OptionName; value: string } | null>(null)
  const [valueDraft, setValueDraft] = useState("")

  const activeOptions = optionOrder.filter((option) => enabledOptions[option])
  const availableOptions = (["color", "size"] as OptionName[]).filter((option) => !enabledOptions[option])

  const variants = useMemo(() => {
    if (values.color.length === 0 && values.size.length === 0) return []

    const sizes = values.size.length > 0 ? values.size : ["Variant"]
    return sizes.map((size) => ({
      key: `size::${size.toUpperCase()}`,
      label: size.toUpperCase(),
      accessibleLabel: size.toUpperCase(),
    }))
  }, [values.color, values.size])

  const totalInventory = variants.reduce((total, variant) => total + (Number(quantities[variant.key]) || 0), 0)
  const allVariantsSelected = variants.length > 0 && variants.every((variant) => selectedVariantKeys.includes(variant.key))

  function addOption(option: OptionName) {
    setEnabledOptions((current) => ({ ...current, [option]: true }))
  }

  function removeOption(option: OptionName) {
    setEnabledOptions((current) => ({ ...current, [option]: false }))
    setValues((current) => ({ ...current, [option]: [] }))
    setDrafts((current) => ({ ...current, [option]: "" }))
  }

  function addValue(option: OptionName) {
    const nextValue = option === "size" ? drafts[option].trim().toUpperCase() : toTitleCase(drafts[option])
    if (!nextValue || values[option].some((value) => value.toLowerCase() === nextValue.toLowerCase())) return

    setValues((current) => ({ ...current, [option]: [...current[option], nextValue] }))
    if (option === "color" && colorPickerTouchedRef.current) {
      setCustomSwatches((current) => ({ ...current, [nextValue]: selectedColorRef.current }))
      colorPickerTouchedRef.current = false
    }
    setDrafts((current) => ({ ...current, [option]: "" }))
  }

  function removeValue(option: OptionName, value: string) {
    setValues((current) => ({ ...current, [option]: current[option].filter((item) => item !== value) }))
    if (option === "color") setCustomSwatches((current) => {
      const next = { ...current }
      delete next[value]
      return next
    })
  }

  function moveValue(option: OptionName, source: string, target: string) {
    if (source === target) return

    setValues((current) => {
      const next = [...current[option]]
      const sourceIndex = next.indexOf(source)
      const targetIndex = next.indexOf(target)
      if (sourceIndex < 0 || targetIndex < 0) return current

      next.splice(sourceIndex, 1)
      next.splice(targetIndex, 0, source)
      return { ...current, [option]: next }
    })
  }

  function moveOption(source: OptionName, target: OptionName) {
    if (source === target) return

    setOptionOrder((current) => {
      const next = [...current]
      const sourceIndex = next.indexOf(source)
      const targetIndex = next.indexOf(target)
      next.splice(sourceIndex, 1)
      next.splice(targetIndex, 0, source)
      return next
    })
  }

  function startEditingValue(option: OptionName, value: string) {
    setEditingValue({ option, value })
    setValueDraft(value)
  }

  function saveValue(option: OptionName, value: string) {
    const nextValue = option === "size" ? valueDraft.trim().toUpperCase() : toTitleCase(valueDraft)
    const hasDuplicate = values[option].some((item) => item !== value && item.toLowerCase() === nextValue.toLowerCase())
    if (!nextValue || hasDuplicate) {
      setEditingValue(null)
      return
    }

    setValues((current) => ({ ...current, [option]: current[option].map((item) => item === value ? nextValue : item) }))
    if (option === "color" && value !== nextValue) {
      setCustomSwatches((current) => {
        const next = { ...current }
        if (next[value]) {
          next[nextValue] = next[value]
          delete next[value]
        }
        return next
      })
    }
    setEditingValue(null)
  }

  function deleteSelectedVariants() {
    setValues((current) => ({
      ...current,
      size: current.size.filter((size) => !selectedVariantKeys.includes(`size::${size.toUpperCase()}`)),
    }))
    setSelectedVariantKeys([])
  }

  return (
    <section style={{"marginTop":"1rem","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
      <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.75rem","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem"}}>
        <div>
          <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(0,0,0,0.75)"}}>Variants</h2>
          <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.5)"}}>Add color or size options. Inventory is managed once per size.</p>
        </div>
        <OptionPicker availableOptions={availableOptions} open={headerPickerOpen} onAdd={(option) => { addOption(option); setHeaderPickerOpen(false) }} onOpenChange={setHeaderPickerOpen} />
      </div>

      <div style={{"borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem"}}>
        {activeOptions.length > 0 ? (
          <div style={{"overflow":"hidden","borderRadius":"0.5rem","borderWidth":"1px"}}>
            {activeOptions.map((option, index) => {
              const { label, placeholder, icon: Icon } = optionDetails[option]

              return (
                <div
                  key={option}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "move"
                    setDraggedOption(option)
                  }}
                  onDragEnd={() => setDraggedOption(null)}
                  onDragOver={(event) => {
                    if (draggedOption) event.preventDefault()
                  }}
                  onDrop={(event) => {
                    event.preventDefault()
                    if (draggedOption) moveOption(draggedOption, option)
                    setDraggedOption(null)
                  }}
                  className={`${index > 0 ? "border-t border-black/10" : ""} cursor-grab active:cursor-grabbing ${draggedOption === option ? "bg-black/[0.025]" : ""}`}
                >
                  <div style={{"display":"flex","alignItems":"flex-start","gap":"0.5rem","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>
                    <span style={{"marginTop":"0.25rem","flexShrink":"0","color":"rgb(0,0,0,0.3)"}}><GripVertical className="size-4" aria-hidden="true" /></span>
                    <span style={{"marginTop":"0.125rem","display":"grid","flexShrink":"0","placeItems":"center","borderRadius":"0.375rem","backgroundColor":"rgb(0,0,0,0.045)"}}><Icon className="size-3.5" /></span>
                    <div style={{"minWidth":"0px","flex":"1 1 0%"}}>
                      <p style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>{label}</p>
                      <div style={{"marginTop":"0.5rem","display":"flex","flexWrap":"wrap","alignItems":"center","gap":"0.375rem"}}>
                        {values[option].map((value) => (
                          <span
                            key={value}
                            draggable
                            title="Drag to reorder"
                            onDragStart={(event) => {
                              event.stopPropagation()
                              event.dataTransfer.effectAllowed = "move"
                              setDraggedValue({ option, value })
                            }}
                            onDragOver={(event) => {
                              if (draggedValue?.option === option) event.preventDefault()
                            }}
                            onDrop={(event) => {
                              event.preventDefault()
                              if (draggedValue?.option === option) moveValue(option, draggedValue.value, value)
                              setDraggedValue(null)
                            }}
                            onDragEnd={() => setDraggedValue(null)}
                            className={`inline-flex cursor-grab items-center gap-1 rounded bg-[#edf5ff] py-1 pl-2 pr-1 text-xs font-medium text-[#16446f] active:cursor-grabbing ${draggedValue?.option === option && draggedValue.value === value ? "opacity-45" : ""}`}
                          >
                            {option === "color" && <span aria-hidden="true" style={{"borderRadius":"0.125rem","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(1px + 0px) rgb(59,130,246,0.5), 0 0 #0000",  backgroundColor: getColorSwatch(value, customSwatches[value] ?? customSwatches[toTitleCase(value)]) }} />}
                            {editingValue?.option === option && editingValue.value === value ? (
                              <Input
                                aria-label={`Edit ${value}`}
                                autoFocus
                                value={valueDraft}
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) => setValueDraft(event.target.value)}
                                onBlur={() => saveValue(option, value)}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") saveValue(option, value)
                                  if (event.key === "Escape") setEditingValue(null)
                                }}
                                style={{"height":"1.25rem","width":"4rem","borderColor":"rgb(22,68,111,0.4)","backgroundColor":"rgb(255,255,255)","paddingLeft":"0.25rem","paddingRight":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(22,68,111)","boxShadow":"0 0 #0000, 0 0 #0000, 0 0 #0000"}}
                              />
                            ) : (
                              <button type="button" draggable={false} onClick={(event) => { event.stopPropagation(); startEditingValue(option, value) }} style={{"cursor":"text","textAlign":"left","outline":"2px solid transparent","outlineOffset":"2px","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(2px + 0px) rgb(59,130,246,0.5), 0 0 #0000"}} title="Click to edit">
                                {option === "size" ? value.toUpperCase() : toTitleCase(value)}
                              </button>
                            )}
                            <button type="button" draggable={false} aria-label={`Remove ${value}`} onClick={() => removeValue(option, value)} style={{"display":"grid","cursor":"pointer","placeItems":"center","borderRadius":"0.25rem","color":"rgb(22,68,111)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(207,228,250)","outline":"2px solid transparent","outlineOffset":"2px","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(2px + 0px) rgb(59,130,246,0.5), 0 0 #0000"}}>
                              <X className="size-3" />
                            </button>
                          </span>
                        ))}
                        <div style={{"display":"flex","flex":"1 1 0%","alignItems":"center","gap":"0.375rem"}}>
                          {option === "color" && (
                            <Input
                              aria-label="Choose custom color"
                              title="Choose a custom color"
                              type="color"
                              defaultValue="#000000"
                              draggable={false}
                              onChange={(event) => {
                                selectedColorRef.current = event.target.value
                                colorPickerTouchedRef.current = true
                              }}
                              onDragStart={(event) => event.stopPropagation()}
                              style={{"flexShrink":"0","cursor":"pointer","borderRadius":"0.375rem","backgroundColor":"rgb(255,255,255)","padding":"0.125rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 0 #0000"}}
                            />
                          )}
                          <Input
                            aria-label={`Add ${label.toLowerCase()} value`}
                            value={drafts[option]}
                            onChange={(event) => setDrafts((current) => ({ ...current, [option]: event.target.value }))}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault()
                                addValue(option)
                              }
                            }}
                            placeholder={values[option].length === 0 ? placeholder : `Add ${label.toLowerCase()}`}
                            style={{"height":"1.75rem","minWidth":"0px","flex":"1 1 0%","borderWidth":"0px","backgroundColor":"transparent","paddingLeft":"0.375rem","paddingRight":"0.375rem","fontSize":"0.75rem","lineHeight":"1rem","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(2px + 0px) rgb(59,130,246,0.5), 0 0 #0000","borderColor":"rgb(0,0,0,0.25)"}}
                          />
                          <Button type="button" variant="ghost" size="icon-xs" aria-label={`Add ${label.toLowerCase()}`} onClick={() => addValue(option)} style={{"flexShrink":"0","cursor":"pointer","backgroundColor":"rgb(0,0,0,0.05)","color":"rgb(0,0,0)"}}>
                            <Plus className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon-xs" aria-label={`Remove ${label} option`} onClick={() => removeOption(option)} style={{"cursor":"pointer","color":"rgb(185,28,28)","backgroundColor":"rgb(254,242,242)"}}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })}
            {availableOptions.length > 0 && (
              <div style={{"borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem"}}>
                <OptionPicker availableOptions={availableOptions} open={inlinePickerOpen} onAdd={(option) => { addOption(option); setInlinePickerOpen(false) }} onOpenChange={setInlinePickerOpen} compact />
              </div>
            )}
          </div>
        ) : (
          <div style={{"borderRadius":"0.5rem","borderWidth":"1px","borderStyle":"dashed","borderColor":"rgb(0,0,0,0.2)","backgroundColor":"rgb(0,0,0,0.015)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1.5rem","paddingBottom":"1.5rem","textAlign":"center"}}>
            <Boxes style={{"marginLeft":"auto","marginRight":"auto"}} />
            <p style={{"marginTop":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>Create your first option</p>
            <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Choose Color or Size to generate individual variants.</p>
          </div>
        )}
      </div>

      {variants.length > 0 ? (
        <div style={{"borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)"}}>
          <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.75rem","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>
            <div>
              <h3 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>Variant inventory</h3>
              <p style={{"marginTop":"0.125rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.5)"}}>Set selling price, compare-at price, and stock for each size.</p>
            </div>
            <span style={{"borderRadius":"9999px","backgroundColor":"rgb(0,0,0,0.05)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.25rem","paddingBottom":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}>{variants.length} {variants.length === 1 ? "variant" : "variants"}</span>
          </div>
          <div style={{"overflow":"hidden","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)"}}>
            <div>
              <div style={{"display":"grid","gridTemplateColumns":"18px minmax(48px,1fr) minmax(72px,1fr) minmax(94px,1.25fr) minmax(56px,0.8fr)","alignItems":"center","gap":"0.5rem","backgroundColor":"rgb(0,0,0,0.025)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}>
                <Checkbox aria-label="Select all variants" checked={allVariantsSelected} onCheckedChange={(checked) => setSelectedVariantKeys(checked === true ? variants.map((variant) => variant.key) : [])} />
                <span style={{"display":"flex","alignItems":"center","gap":"0.375rem"}}>
                  Variant
                  <span style={{"display":"inline-flex","flexShrink":"0"}}>
                    {selectedVariantKeys.length > 0 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button type="button" variant="outline" size="icon-xs" aria-label="Selected variant actions" style={{"cursor":"pointer","borderRadius":"0.375rem","borderColor":"rgb(0,0,0,0.2)","backgroundColor":"rgb(0,0,0,0.06)","color":"rgb(0,0,0)"}}>
                            <MoreHorizontal className="size-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" style={{"width":"10rem"}}>
                          <DropdownMenuItem variant="destructive" onSelect={deleteSelectedVariants}>
                            <Trash2 /> Delete variant{selectedVariantKeys.length > 1 ? "s" : ""}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </span>
                </span>
                <span>Price</span>
                <span>Compare-at price</span>
                <span>Available</span>
              </div>
              <div style={{"borderTopWidth":"calc(1px * calc(1 - 0))","borderBottomWidth":"calc(1px * 0)","borderColor":"rgb(0,0,0,0.1)"}}>
                {variants.map((variant) => (
                  <div key={variant.key} style={{"display":"grid","gridTemplateColumns":"18px minmax(48px,1fr) minmax(72px,1fr) minmax(94px,1.25fr) minmax(56px,0.8fr)","alignItems":"center","gap":"0.5rem","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>
                    <Checkbox aria-label={`Select ${variant.accessibleLabel}`} checked={selectedVariantKeys.includes(variant.key)} onCheckedChange={(checked) => setSelectedVariantKeys((current) => checked === true ? [...new Set([...current, variant.key])] : current.filter((key) => key !== variant.key))} />
                    <span style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.7)"}}>{variant.label}</span>
                    <span style={{"position":"relative"}}>
                      <span style={{"pointerEvents":"none","position":"absolute","left":"0.625rem","top":"50%","transform":"translate(0, -50%) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.5)"}}>₹</span>
                      <Input
                        aria-label={`${variant.accessibleLabel} price`}
                        inputMode="decimal"
                        placeholder="0.00"
                        type="text"
                        value={prices[variant.key] ?? ""}
                        onChange={(event) => setPrices((current) => ({ ...current, [variant.key]: event.target.value }))}
                        style={{"borderColor":"rgb(0,0,0,0.2)","backgroundColor":"rgb(255,255,255)","paddingLeft":"1.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 0 #0000"}}
                      />
                    </span>
                    <span style={{"position":"relative"}}>
                      <span style={{"pointerEvents":"none","position":"absolute","left":"0.625rem","top":"50%","transform":"translate(0, -50%) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.5)"}}>₹</span>
                      <Input
                        aria-label={`${variant.accessibleLabel} compare-at price`}
                        inputMode="decimal"
                        placeholder="0.00"
                        type="text"
                        value={compareAtPrices[variant.key] ?? ""}
                        onChange={(event) => setCompareAtPrices((current) => ({ ...current, [variant.key]: event.target.value }))}
                        style={{"borderColor":"rgb(0,0,0,0.2)","backgroundColor":"rgb(255,255,255)","paddingLeft":"1.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 0 #0000"}}
                      />
                    </span>
                    <Input
                      aria-label={`${variant.accessibleLabel} available stock`}
                      inputMode="numeric"
                      min="0"
                      placeholder="0"
                      type="number"
                      value={quantities[variant.key] ?? ""}
                      onChange={(event) => setQuantities((current) => ({ ...current, [variant.key]: event.target.value }))}
                      style={{"borderColor":"rgb(0,0,0,0.2)","backgroundColor":"rgb(255,255,255)","fontSize":"0.875rem","lineHeight":"1.25rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 0 #0000"}}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{"borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(0,0,0,0.015)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.6)"}}>Total variant inventory: <span style={{"fontWeight":"600","color":"rgb(0,0,0,0.75)"}}>{totalInventory} available</span></div>
        </div>
      ) : activeOptions.length > 0 ? (
        <div style={{"borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1.25rem","paddingBottom":"1.25rem","textAlign":"center","fontSize":"0.875rem","lineHeight":"1.25rem"}}>Add at least one option value to create variants.</div>
      ) : null}
    </section>
  )
}

function OptionPicker({
  availableOptions,
  open,
  onAdd,
  onOpenChange,
  compact = false,
}: {
  availableOptions: OptionName[]
  open: boolean
  onAdd: (option: OptionName) => void
  onOpenChange: (open: boolean) => void
  compact?: boolean
}) {
  if (availableOptions.length === 0) return null

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button type="button" variant={compact ? "ghost" : "outline"} size="sm" style={{"cursor":"pointer","backgroundColor":"rgb(0,0,0,0.03)","color":"rgb(0,0,0,0.7)","boxShadow":"0 0 #0000, 0 0 #0000, 0 0 #0000"}}>
          <Plus className="size-3.5" /> {compact ? "Add another option" : "Add variant"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" style={{"width":"13rem","gap":"0.25rem","padding":"0.375rem"}}>
        <p style={{"paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.25rem","paddingBottom":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}>Add an option</p>
        {availableOptions.map((option) => {
          const { label, icon: Icon } = optionDetails[option]
          return (
            <button key={option} type="button" onClick={() => onAdd(option)} style={{"display":"flex","width":"100%","cursor":"pointer","alignItems":"center","gap":"0.5rem","borderRadius":"0.375rem","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","textAlign":"left","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.05)","outline":"2px solid transparent","outlineOffset":"2px","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(2px + 0px) rgb(59,130,246,0.5), 0 0 #0000"}}>
              <Icon style={{"color":"rgb(0,0,0,0.5)"}} />
              {label}
            </button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
