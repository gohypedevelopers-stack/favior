"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { CalendarDays, ChevronDown, ChevronUp, Loader2 } from "lucide-react"

type DashboardData = {
  rangeLabel?: string
  rangeKey?: string
  totalSales: number
  periodSales: number
  orderCount: number
  periodOrderCount: number
  productCount: number
  customerCount: number
  itemsOrdered: number
  fulfilledOrders: number
  deliveredOrders: number
  pendingOrders: number
  lowStockCount: number
  outOfStockCount: number
  currentPeriodLabel: string
  previousPeriodLabel: string
  chartData: { date: string; current: number; previous: number }[]
  recentOrders: { id: string; status: string; total: number; customerName: string; itemCount: number }[]
  topProducts: { name: string; quantity: number }[]
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
})

function formatOrderReference(id: string) {
  return `#${id.slice(-8).toUpperCase()}`
}

function formatOrderStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

export function AdminOverview({ data }: { data: DashboardData }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [currentData, setCurrentData] = useState<DashboardData>(data)
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState("Total sales")

  const [customNum, setCustomNum] = useState("30")
  const [customUnit, setCustomUnit] = useState("Days")

  const rangeLabel = currentData.rangeLabel || "Last 30 days"

  useEffect(() => {
    setCurrentData(data)
  }, [data])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"
  const metrics = [
    { label: "Sessions", value: "—", change: "No data" },
    { label: "Total sales", value: currencyFormatter.format(currentData.periodSales), change: rangeLabel },
    { label: "Orders", value: currentData.periodOrderCount.toLocaleString("en-IN"), change: rangeLabel },
    { label: "Conversion rate", value: "—", change: "No data" },
  ]
  const chartMaximum = Math.max(10, ...currentData.chartData.flatMap((point) => [point.current, point.previous]))
  const today = new Date()
  const calendarMonths = [-1, 0].map((offset) => {
    const month = new Date(today.getFullYear(), today.getMonth() + offset, 1)
    return {
      label: month.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      firstDay: month.getDay(),
      dayCount: new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(),
    }
  })

  async function applyRangeKey(rangeKey: string) {
    setIsLoading(true)
    setIsDatePickerOpen(false)

    router.push(`/dashboard?range=${rangeKey}`, { scroll: false })

    try {
      const res = await fetch(`/api/admin/dashboard-overview?range=${rangeKey}`)
      if (res.ok) {
        const updated = await res.json()
        setCurrentData(updated)
      }
    } catch (err) {
      console.error("Failed to fetch dashboard overview data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  function handleOptionClick(option: string) {
    let key = "last30"
    if (option === "Today") key = "today"
    else if (option === "Yesterday") key = "yesterday"
    else if (option === "Last 7 days") key = "last7"
    else if (option === "Last 30 days") key = "last30"
    else if (option === "Quarter to date") key = "quarter"
    else if (option === "Custom range") return

    applyRangeKey(key)
  }

  function handleApplyCustom() {
    const count = parseInt(customNum, 10) || 30
    let totalDays = count
    if (customUnit === "Weeks") totalDays = count * 7
    if (customUnit === "Months") totalDays = count * 30

    applyRangeKey(`days_${totalDays}`)
  }

  return (
    <section style={{"position":"relative","display":"flex","minWidth":"0px","flex":"1 1 0%","flexDirection":"column","gap":"1rem","backgroundColor":"#f5f5f5","padding":"1rem","paddingTop":"1.5rem","transitionProperty":"opacity","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms", ...(isLoading ? { opacity: 0.7, pointerEvents: "none" } : { opacity: 1 })}}>
      <div style={{"position":"relative","display":"flex","minWidth":"0px","alignItems":"center","justifyContent":"space-between","gap":"1rem"}}>
        <div style={{"minWidth":"0px"}}>
          <h1 style={{"marginTop":"0.25rem","overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"1.125rem","lineHeight":"1.75rem","fontWeight":"600","letterSpacing":"-0.025em","color":"rgb(0,0,0)"}}>
            {greeting}, Admin
          </h1>
          <p style={{"marginTop":"0.125rem","overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"0.75rem","lineHeight":"1rem"}}>
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <button
          type="button"
          aria-expanded={isDatePickerOpen}
          onClick={() => setIsDatePickerOpen((open) => !open)}
          style={{"display":"inline-flex","height":"2rem","flexShrink":"0","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.25)","backgroundColor":"rgb(0,0,0,0.03)","paddingLeft":"0.625rem","paddingRight":"0.625rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(0,0,0,0.75)","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(2px + 0px) rgb(59,130,246,0.5), 0 0 #0000","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","outline":"2px solid transparent","outlineOffset":"2px"}}
        >
          {isLoading ? <Loader2 style={{"animation":"spin 1s linear infinite"}} /> : <CalendarDays style={{"width":"0.875rem","height":"0.875rem","color":"rgb(0,0,0,0.65)"}} />}
          {rangeLabel}
          <ChevronDown style={{"width":"0.875rem","height":"0.875rem","color":"rgb(0,0,0,0.55)"}} />
        </button>

        {isDatePickerOpen ? (
          <div style={{"position":"absolute","right":"0px","top":"2.5rem","zIndex":"30","display":"flex","width":"min(680px,calc(100vw - 2rem))","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 20px 25px -5px rgb(0,0,0,0.1), 0 8px 10px -6px rgb(0,0,0,0.1)"}}>
            <div style={{"display":"none","width":"10rem","flexShrink":"0","borderRightWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(250,250,250)","padding":"0.5rem"}}>
              {["Today", "Yesterday", "Last 7 days", "Last 30 days", "Quarter to date", "Custom range"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleOptionClick(option)}
                  style={{"width":"100%","borderRadius":"0.375rem","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","textAlign":"left","fontSize":"0.75rem","lineHeight":"1rem","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms", ...(option === rangeLabel ? { backgroundColor: "rgb(0,0,0,0.1)", fontWeight: 500, color: "rgb(0,0,0)" } : { color: "rgb(0,0,0,0.7)" })}}
                >
                  {option}
                </button>
              ))}
            </div>
            <div style={{"minWidth":"0px","flex":"1 1 0%","padding":"1rem"}}>
              <div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","gap":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem"}}>
                <span style={{"color":"rgb(0,0,0,0.7)"}}>Last</span>
                <input
                  aria-label="Number of days"
                  value={customNum}
                  onChange={(e) => setCustomNum(e.target.value)}
                  style={{"height":"2rem","width":"5rem","borderRadius":"0.375rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.5)","paddingLeft":"0.5rem","paddingRight":"0.5rem","outline":"2px solid transparent","outlineOffset":"2px"}}
                />
                <select
                  aria-label="Date unit"
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value)}
                  style={{"height":"2rem","borderRadius":"0.375rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.5)","backgroundColor":"rgb(255,255,255)","paddingLeft":"0.5rem","paddingRight":"0.5rem","outline":"2px solid transparent","outlineOffset":"2px"}}
                >
                  <option>Days</option>
                  <option>Weeks</option>
                  <option>Months</option>
                </select>
                <label style={{"display":"inline-flex","alignItems":"center","gap":"0.375rem","color":"rgb(0,0,0,0.7)"}}>
                  <input type="checkbox" defaultChecked style={{"accentColor":"#000"}} /> Include today
                </label>
              </div>
              <div style={{"marginTop":"1.25rem","display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","gap":"1.5rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.75)"}}>
                {calendarMonths.map((month) => (
                  <div key={month.label}>
                    <p style={{"marginBottom":"0.75rem","textAlign":"center","fontWeight":"600"}}>{month.label}</p>
                    <div style={{"display":"grid","gridTemplateColumns":"repeat(7, minmax(0, 1fr))","rowGap":"0.5rem","textAlign":"center","color":"rgb(0,0,0,0.6)"}}>
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => <span key={day} style={{"fontSize":"10px"}}>{day}</span>)}
                      {Array.from({ length: month.firstDay + month.dayCount }, (_, index) => {
                        const day = index - month.firstDay + 1
                        return <span key={index} style={{"paddingLeft":"0.25rem","paddingRight":"0.25rem","paddingTop":"0.125rem","paddingBottom":"0.125rem"}}>{day > 0 ? day : ""}</span>
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{"marginTop":"1.25rem","display":"flex","justifyContent":"flex-end","gap":"0.5rem","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingTop":"0.75rem"}}>
                <button type="button" onClick={() => setIsDatePickerOpen(false)} style={{"borderRadius":"0.375rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.2)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.375rem","paddingBottom":"0.375rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Cancel</button>
                <button type="button" onClick={handleApplyCustom} style={{"borderRadius":"0.375rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.375rem","paddingBottom":"0.375rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(255,255,255)"}}>Apply</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div style={{"position":"relative","minWidth":"0px","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"0.5rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
        <button
          type="button"
          aria-label={isExpanded ? "Collapse overview" : "Expand overview"}
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          style={{"position":"absolute","right":"0.75rem","top":"0.75rem","zIndex":"10","display":"inline-flex","alignItems":"center","justifyContent":"center","borderRadius":"0.375rem","color":"rgb(0,0,0)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.05)","outline":"2px solid transparent","outlineOffset":"2px","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(2px + 0px) rgb(59,130,246,0.5), 0 0 #0000"}}
        >
          {isExpanded ? <ChevronUp style={{"width":"1rem","height":"1rem"}} /> : <ChevronDown style={{"width":"1rem","height":"1rem"}} />}
        </button>

        <div style={{"display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","gap":"0.5rem","paddingRight":"2rem"}}>
          {metrics.map((metric) => (
            <button
              type="button"
              key={metric.label}
              aria-pressed={selectedMetric === metric.label}
              onClick={() => setSelectedMetric(metric.label)}
              style={{"position":"relative","minWidth":"0px","minHeight":"3.5rem","borderRadius":"0.5rem","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","textAlign":"left","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms", "outline":"2px solid transparent","outlineOffset":"2px", ...(selectedMetric === metric.label ? { backgroundColor: "#f0f0f0" } : { backgroundColor: "rgb(255,255,255)" })}}
            >
              <div style={{"display":"flex","minWidth":"0px","alignItems":"center","justifyContent":"space-between","gap":"0.5rem"}}>
                <p style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>{metric.label}</p>
                {selectedMetric === metric.label ? <span style={{"flexShrink":"0","fontSize":"0.875rem","lineHeight":"1.25rem"}}>↗</span> : null}
              </div>
              <p style={{"marginTop":"0.25rem","overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(0,0,0)"}}>
                {metric.value} <span style={{"fontWeight":"400"}}>{metric.change}</span>
              </p>
            </button>
          ))}
        </div>

        {isExpanded ? <div style={{"marginTop":"1rem","height":"220px","width":"100%","minWidth":"0px"}}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentData.chartData} margin={{ top: 8, right: 12, left: 10, bottom: 0 }}>
              <CartesianGrid stroke="#e5e5e5" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#737373", fontSize: 11 }}
                dy={8}
              />
              <YAxis
                domain={[0, chartMaximum]}
                tickCount={3}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#737373", fontSize: 11 }}
                width={60}
                tickFormatter={(value: number) => {
                  if (value === 0) return "0"
                  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`
                  if (value >= 100000) {
                    const lakh = value / 100000
                    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)}L`
                  }
                  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`
                  return `₹${value}`
                }}
              />
              <Tooltip
                cursor={{ stroke: "#d4d4d4", strokeDasharray: "3 3" }}
                formatter={(val: unknown) => [
                  currencyFormatter.format(Number(val || 0)),
                  "Sales",
                ]}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #e5e5e5",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#8bd4f5"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#08a7f5"
                strokeWidth={1.8}
                dot={false}
                activeDot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div> : null}

        {isExpanded ? <div style={{"display":"flex","justifyContent":"center","gap":"1.25rem","paddingTop":"0.5rem","fontSize":"11px"}}>
          <span style={{"display":"inline-flex","alignItems":"center","gap":"0.5rem"}}>
            <span style={{"borderRadius":"9999px","backgroundColor":"rgb(8,167,245)"}} /> {currentData.currentPeriodLabel}
          </span>
          <span style={{"display":"inline-flex","alignItems":"center","gap":"0.5rem"}}>
            <span style={{"borderRadius":"9999px","backgroundColor":"rgb(139,212,245)"}} /> {currentData.previousPeriodLabel}
          </span>
        </div> : null}
      </div>

      <div style={{"display":"grid","gap":"0.5rem"}}>
        <div style={{"display":"flex","minWidth":"0px","alignItems":"center","gap":"0.5rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
          <span aria-hidden>▣</span> {currentData.pendingOrders} {currentData.pendingOrders === 1 ? "order" : "orders"} to fulfil
        </div>
        <div style={{"display":"flex","minWidth":"0px","alignItems":"center","gap":"0.5rem","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500"}}>
          <span aria-hidden>▱</span> Payment capture data unavailable
        </div>
      </div>

      <div style={{"display":"grid","gap":"1rem"}}>
        <section style={{"minWidth":"0px","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
          <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between"}}>
            <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Recent orders</h2>
            <Link href="/dashboard/orders" style={{"fontSize":"0.75rem","lineHeight":"1rem","textDecorationLine":"underline","textUnderlineOffset":"2px","color":"rgb(0,0,0)"}}>
              View all
            </Link>
          </div>
          {currentData.recentOrders.length === 0 ? (
            <p style={{"marginTop":"0.75rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","textAlign":"center","fontSize":"0.75rem","lineHeight":"1rem"}}>No orders have been placed yet.</p>
          ) : (
            <div style={{"marginTop":"0.75rem","borderTopWidth":"calc(1px * calc(1 - 0))","borderBottomWidth":"calc(1px * 0)","borderColor":"rgb(0,0,0,0.1)"}}>
              {currentData.recentOrders.map((order) => (
                <Link key={order.id} href="/dashboard/orders" style={{"display":"flex","minWidth":"0px","alignItems":"center","justifyContent":"space-between","gap":"0.75rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","backgroundColor":"rgb(0,0,0,0.02)"}}>
                  <span style={{"flexShrink":"0","fontWeight":"500"}}>{formatOrderReference(order.id)}</span>
                  <span style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap"}}>{formatOrderStatus(order.status)}</span>
                  <span style={{"flexShrink":"0","fontWeight":"500"}}>{currencyFormatter.format(order.total)}</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section style={{"minWidth":"0px","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
          <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Top products</h2>
          {currentData.topProducts.length === 0 ? (
            <p style={{"marginTop":"0.75rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Top products will appear after an order is placed in this period.</p>
          ) : (
            <div style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)"}}>
              {currentData.topProducts.map((product) => (
                <div key={product.name} style={{"display":"flex","minWidth":"0px","alignItems":"center","justifyContent":"space-between","gap":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem"}}>
                  <span style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","color":"rgb(0,0,0,0.7)"}} title={product.name}>{product.name}</span>
                  <span style={{"flexShrink":"0","fontWeight":"500"}}>{product.quantity} sold</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={{"minWidth":"0px","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
          <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Quick actions</h2>
          <div style={{"marginTop":"0.75rem","display":"grid","gap":"0.5rem"}}>
            <Link href="/dashboard/products/new" style={{"borderRadius":"0.375rem","borderWidth":"1px","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","textAlign":"left","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0)","color":"rgb(255,255,255)"}}>Add product</Link>
            <Link href="/dashboard/customers" style={{"borderRadius":"0.375rem","borderWidth":"1px","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","textAlign":"left","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0)","color":"rgb(255,255,255)"}}>View customers</Link>
          </div>
        </section>
      </div>

      <div style={{"display":"grid","gap":"1rem"}}>
        <section style={{"minWidth":"0px","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
          <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between"}}>
            <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Store health</h2>
            <span style={{"borderRadius":"9999px","backgroundColor":"rgb(0,0,0,0.25)"}} />
          </div>
          <p style={{"marginTop":"0.75rem","fontSize":"1.5rem","lineHeight":"2rem","fontWeight":"600"}}>—</p>
          <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Health monitoring is not configured</p>
          <div style={{"marginTop":"0.75rem","height":"0.375rem","overflow":"hidden","borderRadius":"9999px","backgroundColor":"rgb(0,0,0,0.1)"}}>
            <div style={{"height":"100%","width":"0px","borderRadius":"9999px","backgroundColor":"rgb(16,185,129)"}} />
          </div>
        </section>

        <section style={{"minWidth":"0px","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
          <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Traffic sources</h2>
          <p style={{"marginTop":"0.75rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem"}}>No traffic data has been collected yet.</p>
        </section>

        <section style={{"minWidth":"0px","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
          <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Inventory alerts</h2>
          <div style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)","fontSize":"0.75rem","lineHeight":"1rem"}}>
            <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between"}}><span style={{"color":"rgb(0,0,0,0.7)"}}>Low stock</span><span style={{"borderRadius":"9999px","backgroundColor":"rgb(254,243,199)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.25rem","paddingBottom":"0.25rem","fontWeight":"500","color":"rgb(146,64,14)"}}>{currentData.lowStockCount} items</span></div>
            <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between"}}><span style={{"color":"rgb(0,0,0,0.7)"}}>Out of stock</span><span style={{"borderRadius":"9999px","backgroundColor":"rgb(254,226,226)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.25rem","paddingBottom":"0.25rem","fontWeight":"500","color":"rgb(153,27,27)"}}>{currentData.outOfStockCount} items</span></div>
            <Link href="/dashboard/products" style={{"display":"inline-block","paddingTop":"0.25rem","textDecorationLine":"underline","textUnderlineOffset":"2px","color":"rgb(0,0,0)"}}>Review inventory</Link>
          </div>
        </section>

        <section style={{"minWidth":"0px","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
          <h2 style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600"}}>Customer snapshot</h2>
          <p style={{"marginTop":"0.75rem","fontSize":"1.5rem","lineHeight":"2rem","fontWeight":"600"}}>{currentData.customerCount.toLocaleString("en-IN")}</p>
          <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>Total customers</p>
          <p style={{"marginTop":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}>No comparison data yet</p>
        </section>
      </div>

    </section>
  )
}
