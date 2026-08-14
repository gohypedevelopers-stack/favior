"use client"

import * as React from "react"
import { ChevronDown, Mail, MessageSquare, MoreHorizontal, Smartphone, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

type ModalName = "customer" | "address" | "marketing" | null

const inputClass =
  "h-8 w-full rounded-lg border border-black/30 bg-white px-3 text-sm outline-none transition focus:border-black/60 focus:ring-2 focus:ring-black/5"

const COUNTRY_OPTIONS = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
]

const STATES_BY_COUNTRY: Record<string, string[]> = {
  IN: ["Delhi", "Haryana", "Karnataka", "Maharashtra", "Punjab", "Tamil Nadu"],
  US: ["California", "New York", "Texas"],
  CA: ["Ontario", "Quebec"],
  GB: ["England", "Scotland", "Wales"],
}

function CountrySelect({
  compact = false,
  value,
  onValueChange,
}: {
  compact?: boolean
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <Select value={value} onValueChange={(nextValue) => { if (nextValue) onValueChange(nextValue) }}>
      <SelectTrigger
        size="sm"
        aria-label={compact ? "Phone country" : "Country or region"}
        className={compact ? "h-8 w-[88px] border border-black/30 bg-white px-2 shadow-none" : `${inputClass} shadow-none`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent style={{"maxHeight":"16rem"}}>
        {COUNTRY_OPTIONS.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {compact ? country.code : country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ModalHeading({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <DialogHeader style={{"flexDirection":"row","alignItems":"center","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem"}}>
      <div>
        <DialogTitle style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>{title}</DialogTitle>
        <DialogDescription style={{"position":"absolute","width":"1px","height":"1px","padding":"0","margin":"-1px","overflow":"hidden","clip":"rect(0, 0, 0, 0)","whiteSpace":"nowrap","borderWidth":"0"}}>{title} form</DialogDescription>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={`Close ${title}`}
        style={{"borderRadius":"0.375rem","padding":"0.25rem","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.05)","color":"rgb(0,0,0)"}}
      >
        <X className="size-5" />
      </button>
    </DialogHeader>
  )
}

function ModalFooter({ onCancel, saveDisabled = false }: { onCancel: () => void; saveDisabled?: boolean }) {
  return (
    <DialogFooter style={{"flexDirection":"row","alignItems":"center","justifyContent":"flex-end","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>
      <button type="button" onClick={onCancel} style={{"height":"2rem","borderRadius":"0.5rem","borderWidth":"1px","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","backgroundColor":"rgb(0,0,0,0.03)"}}>
        Cancel
      </button>
      <button
        type="submit"
        disabled={saveDisabled}
        style={{"height":"2rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(255,255,255)","cursor":"not-allowed"}}
      >
        Save
      </button>
    </DialogFooter>
  )
}

function PhoneInput() {
  return (
    <div style={{"display":"flex","gap":"0.5rem"}}>
      <CountrySelect compact value="IN" onValueChange={() => undefined} />
      <input aria-label="Phone number" className={inputClass} />
    </div>
  )
}

function EditCustomerDialog({
  open,
  onOpenChange,
  email,
  name,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
  name: string
}) {
  const [firstName = "", ...remainingName] = name.split(" ")
  const lastName = remainingName.join(" ")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{"maxHeight":"calc(100vh - 2rem)","gap":"0px","overflowY":"auto","padding":"0px"}}
        showCloseButton={false}
        overlayClassName="bg-black/45 supports-backdrop-filter:backdrop-blur-[1px]"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onOpenChange(false)
          }}
        >
          <ModalHeading title="Edit customer" onClose={() => onOpenChange(false)} />
          <div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem"}}>
            <div style={{"display":"grid","gap":"0.75rem"}}>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
                First name
                <input defaultValue={firstName} className={inputClass} />
              </label>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
                Last name
                <input defaultValue={lastName} className={inputClass} />
              </label>
            </div>
            <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
              Language
              <span style={{"position":"relative"}}>
                <select defaultValue="English [Default]" className={`${inputClass} appearance-none pr-8`}>
                  <option>English [Default]</option>
                  <option>Hindi</option>
                </select>
                <ChevronDown style={{"pointerEvents":"none","position":"absolute","right":"0.625rem","top":"50%","transform":"translate(0, -50%) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)"}} />
              </span>
              <span style={{"fontWeight":"400","color":"rgb(0,0,0,0.6)"}}>This customer will receive notifications in this language.</span>
            </label>
            <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
              Email
              <input type="email" defaultValue={email} className={inputClass} />
            </label>
            <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
              Phone number
              <PhoneInput />
            </label>
          </div>
          <ModalFooter onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddAddressDialog({
  open,
  onOpenChange,
  name,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
}) {
  const [firstName = "", ...remainingName] = name.split(" ")
  const lastName = remainingName.join(" ")
  const [countryCode, setCountryCode] = React.useState("IN")
  const [stateName, setStateName] = React.useState("")
  const [cityName, setCityName] = React.useState("")
  const states = STATES_BY_COUNTRY[countryCode] ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{"maxHeight":"calc(100vh - 2rem)","gap":"0px","overflowY":"auto","padding":"0px"}}
        showCloseButton={false}
        overlayClassName="bg-black/45 supports-backdrop-filter:backdrop-blur-[1px]"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onOpenChange(false)
          }}
        >
          <ModalHeading title="Add new address" onClose={() => onOpenChange(false)} />
          <div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem"}}>
            <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
              Country/region
              <CountrySelect value={countryCode} onValueChange={(value) => {
                setCountryCode(value)
                setStateName("")
                setCityName("")
              }} />
            </label>
            <div style={{"display":"grid","gap":"0.75rem"}}>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
                First name
                <input defaultValue={firstName} className={inputClass} />
              </label>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
                Last name
                <input defaultValue={lastName} className={inputClass} />
              </label>
            </div>
            <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
              Address
              <input className={inputClass} />
            </label>
            <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
              Apartment, suite, etc
              <input className={inputClass} />
            </label>
            <div style={{"display":"grid","gap":"0.75rem"}}>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
                City
                <input value={cityName} onChange={(event) => setCityName(event.target.value)} className={inputClass} />
              </label>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
                State
                {states.length ? (
                  <Select value={stateName} onValueChange={(nextValue) => { if (nextValue) setStateName(nextValue) }}>
                    <SelectTrigger size="sm" aria-label="State" style={{"height":"2rem !important","width":"100%","borderRadius":"0.5rem","borderColor":"rgb(0,0,0,0.3)","backgroundColor":"rgb(255,255,255) !important","paddingLeft":"0.75rem","paddingRight":"0.75rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 0 #0000"}}>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent style={{"maxHeight":"16rem"}}>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <input value={stateName} onChange={(event) => setStateName(event.target.value)} className={inputClass} />
                )}
              </label>
              <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
                PIN code
                <input className={inputClass} />
              </label>
            </div>
            <label style={{"display":"grid","gap":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
              Phone
              <PhoneInput />
            </label>
          </div>
          <ModalFooter onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  )
}

function MarketingChannel({
  icon,
  title,
  detail,
  enabled = true,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode
  title: string
  detail: React.ReactNode
  enabled?: boolean
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <div style={{"display":"flex","alignItems":"center","gap":"0.75rem","borderBottomWidth":"0px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.75rem","paddingBottom":"0.75rem"}}>
      <span className="text-black/65">{icon}</span>
      <div style={{"minWidth":"0px","flex":"1 1 0%"}}>
        <div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","gap":"0.5rem"}}>
          <h3 style={{"fontWeight":"600"}}>{title}</h3>
          <span style={{"borderRadius":"0.375rem","backgroundColor":"rgb(0,0,0,0.06)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.6)"}}>Not subscribed</span>
        </div>
        <p style={{"marginTop":"0.25rem","fontSize":"0.875rem","lineHeight":"1.25rem"}}>{detail}</p>
      </div>
      {enabled ? (
        <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={`Toggle ${title} marketing`} />
      ) : (
        <Switch checked={false} disabled aria-label={`${title} marketing unavailable`} />
      )}
    </div>
  )
}

function MarketingDialog({
  open,
  onOpenChange,
  email,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
}) {
  const [emailSubscribed, setEmailSubscribed] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{"gap":"0px","overflow":"hidden","padding":"0px"}}
        showCloseButton={false}
        overlayClassName="bg-black/45 supports-backdrop-filter:backdrop-blur-[1px]"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onOpenChange(false)
          }}
        >
          <ModalHeading title="Edit marketing status" onClose={() => onOpenChange(false)} />
          <div style={{"paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"1rem","paddingBottom":"1rem"}}>
            <p style={{"fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.75)"}}>
              Indicate which marketing channels the customer has agreed to receive messages from:
            </p>
            <div style={{"marginTop":"1rem","overflow":"hidden","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)"}}>
              <MarketingChannel
                icon={<Mail className="size-4" />}
                title="Email"
                detail={email}
                checked={emailSubscribed}
                onCheckedChange={setEmailSubscribed}
              />
              <MarketingChannel
                icon={<MessageSquare className="size-4" />}
                title="SMS"
                detail={<span style={{"textDecorationLine":"underline","textDecorationStyle":"dotted"}}>Phone number not provided</span>}
                enabled={false}
                checked={false}
              />
              <MarketingChannel
                icon={<Smartphone className="size-4" />}
                title="WhatsApp"
                detail={<span style={{"textDecorationLine":"underline","textDecorationStyle":"dotted"}}>Phone number not provided</span>}
                enabled={false}
                checked={false}
              />
            </div>
          </div>
          <ModalFooter onCancel={() => onOpenChange(false)} saveDisabled={!emailSubscribed} />
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function CustomerActions({ email, name }: { email: string; name: string }) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [modal, setModal] = React.useState<ModalName>(null)

  const openModal = (nextModal: Exclude<ModalName, null>) => {
    setMenuOpen(false)
    setModal(nextModal)
  }

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <button type="button" aria-label="Customer options" style={{"borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.1)","padding":"0.375rem","color":"rgb(0,0,0)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}>
            <MoreHorizontal className="size-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={6} style={{"width":"210px","gap":"0px","borderRadius":"0.75rem","padding":"0.375rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0,0,0,0.1), 0 4px 6px -4px rgb(0,0,0,0.1)"}}>
          <div role="menu" aria-label="Customer actions">
            <button type="button" role="menuitem" onClick={() => openModal("customer")} style={{"display":"flex","height":"2rem","width":"100%","alignItems":"center","borderRadius":"0.5rem","paddingLeft":"0.625rem","paddingRight":"0.625rem","textAlign":"left","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.8)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.05)"}}>
              Edit contact information
            </button>
            <button type="button" role="menuitem" onClick={() => openModal("address")} style={{"display":"flex","height":"2rem","width":"100%","alignItems":"center","borderRadius":"0.5rem","paddingLeft":"0.625rem","paddingRight":"0.625rem","textAlign":"left","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.8)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.05)"}}>
              Add address
            </button>
            <button type="button" role="menuitem" onClick={() => openModal("marketing")} style={{"display":"flex","height":"2rem","width":"100%","alignItems":"center","borderRadius":"0.5rem","paddingLeft":"0.625rem","paddingRight":"0.625rem","textAlign":"left","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.8)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.05)"}}>
              Edit marketing settings
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <EditCustomerDialog open={modal === "customer"} onOpenChange={(open) => !open && setModal(null)} email={email} name={name} />
      <AddAddressDialog open={modal === "address"} onOpenChange={(open) => !open && setModal(null)} name={name} />
      <MarketingDialog open={modal === "marketing"} onOpenChange={(open) => !open && setModal(null)} email={email} />
    </>
  )
}



