import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  CircleHelp,
  Plus,
  Target,
} from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAnalyticsData } from "@/lib/server/controllers/dashboard.controller";

export const metadata: Metadata = {
  title: "Analytics | Favior Admin",
  description: "Review sales and store performance analytics.",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <section style={{"borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1rem"}}>
      <p style={{"width":"fit-content","borderBottomWidth":"1px","borderStyle":"dotted","borderColor":"rgb(0,0,0,0.4)","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(0,0,0,0.75)"}}>
        {title}
      </p>
      <p style={{"marginTop":"0.5rem","fontSize":"1.25rem","lineHeight":"1.75rem","fontWeight":"600","color":"rgb(26,26,26)"}}>
        {value}
      </p>
      <div style={{"marginTop":"0.75rem","height":"2px","width":"3rem","backgroundColor":"rgb(58,191,248)"}} />
    </section>
  );
}

function Panel({
  title,
  children,
  className = "",
  style = {},
}: {
  title: string;
  children: React.ReactNode;
  className?: string; style?: React.CSSProperties;
}) {
  return (
    <section style={{ ...style, overflow: "hidden", borderRadius: "0.75rem", borderWidth: "1px", borderColor: "rgba(0,0,0,0.1)", backgroundColor: "white", padding: "1.25rem", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)", position: "relative" }}>
      <h2 style={{"width":"fit-content","borderBottomWidth":"1px","borderStyle":"dotted","borderColor":"rgb(0,0,0,0.4)","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(26,26,26)"}}>
        {title}
      </h2>
      <div style={{"marginTop":"0.75rem"}}>{children}</div>
    </section>
  );
}

function SalesChart({ title, value }: { title: string; value: string }) {
  return (
    <Panel title={title} style={{"minHeight":"350px"}}>
      <p style={{"fontSize":"1.25rem","lineHeight":"1.75rem","fontWeight":"600","color":"rgb(26,26,26)"}}>{value}</p>
      <div style={{"position":"relative","marginTop":"1rem","height":"220px"}}>
        <div style={{"position":"absolute","left":"0px","right":"0px","top":"0px","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)"}} />
        <div style={{"position":"absolute","left":"0px","right":"0px","top":"50%","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)"}} />
        <div style={{"position":"absolute","left":"0px","right":"0px","bottom":"1.75rem","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)"}} />
        <span style={{"position":"absolute","left":"0px","top":"-10px","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"400"}}>High</span>
        <span style={{"position":"absolute","left":"0px","top":"calc(50% - 10px)","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"400"}}>Mid</span>
        <span style={{"position":"absolute","bottom":"20px","left":"0px","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"400"}}>₹0</span>
        <svg
          viewBox="0 0 1000 220"
          preserveAspectRatio="none"
          style={{"position":"absolute","left":"3rem","right":"3rem","bottom":"1.75rem","height":"170px","width":"calc(100% - 6rem)"}}
          aria-label="Sales chart graph"
          role="img"
        >
          <path d="M0 219 H560 L750 80 L1000 30" fill="none" stroke="#18a8ef" strokeWidth="2.5" />
          <path d="M0 219 H1000" fill="none" stroke="#8ed5f6" strokeDasharray="4 4" strokeWidth="2" />
        </svg>
        <div style={{"position":"absolute","left":"2rem","right":"2rem","bottom":"0px","display":"flex","justifyContent":"space-between","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"400"}}>
          <span>12 AM</span>
          <span>4 AM</span>
          <span>8 AM</span>
          <span>12 PM</span>
          <span>4 PM</span>
          <span>8 PM</span>
          <span>10 PM</span>
        </div>
      </div>
      <div style={{"marginTop":"0.75rem","display":"flex","alignItems":"center","justifyContent":"center","gap":"1.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"400","color":"rgb(0,0,0,0.6)"}}>
        <span style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
          <span style={{"borderRadius":"9999px","backgroundColor":"rgb(24,168,239)"}} /> Active Period
        </span>
      </div>
    </Panel>
  );
}

function ConversionBreakdownPanel({ returningRate }: { returningRate: number }) {
  return (
    <Panel title="Conversion rate breakdown" style={{"minHeight":"350px"}}>
      <p style={{"fontSize":"1.25rem","lineHeight":"1.75rem","fontWeight":"600","color":"rgb(0,0,0,0.75)"}}>
        {returningRate}% <span style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"400","color":"rgb(0,0,0,0.5)"}}>returning rate</span>
      </p>
      <div style={{"marginTop":"1rem","display":"grid","gridTemplateColumns":"repeat(4, minmax(0, 1fr))","borderRightWidth":"calc(1px * 0)","borderLeftWidth":"calc(1px * calc(1 - 0))","borderColor":"rgb(0,0,0,0.1)"}}>
        {[
          { label: "Sessions", val: "100%" },
          { label: "Added to cart", val: "85%" },
          { label: "Reached checkout", val: "70%" },
          { label: "Completed checkout", val: "100%" },
        ].map((item) => (
          <div key={item.label} style={{"minWidth":"0px","paddingLeft":"0px","paddingRight":"0px"}}>
            <p style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.75)"}}>{item.label}</p>
            <p style={{"marginTop":"0.25rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>{item.val}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams?: Promise<{ range?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const selectedRange = resolvedSearchParams.range || "all";
  const analytics = await getAnalyticsData(selectedRange);
  const todayStr = dateFormatter.format(new Date());

  const rangeButtons = [
    { label: "All time", value: "all" },
    { label: "Today", value: "today" },
    { label: "Last 7 days", value: "last7" },
    { label: "Last 30 days", value: "last30" },
  ];

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main style={{"minHeight":"100%","flex":"1 1 0%","backgroundColor":"rgb(245,245,245)","padding":"1rem","color":"rgb(0,0,0)"}}>
            <header style={{"display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"0.75rem"}}>
              <h1 style={{"display":"flex","alignItems":"center","gap":"0.625rem","fontSize":"1.25rem","lineHeight":"1.75rem","fontWeight":"500","color":"rgb(26,26,26)"}}>
                <BarChart3 className="size-5" />
                Analytics
              </h1>

              <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                <Link
                  href="/dashboard/orders/create-order"
                  style={{"display":"inline-flex","height":"2rem","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(255,255,255)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}
                >
                  <Plus className="size-3.5" />
                  New order
                </Link>
              </div>
            </header>

            {/* Interactive Date Range Filter Buttons */}
            <div style={{"marginTop":"0.75rem","display":"flex","flexWrap":"wrap","alignItems":"center","gap":"0.5rem"}}>
              <div style={{"display":"inline-flex","alignItems":"center","gap":"0.25rem","borderRadius":"0.5rem","borderWidth":"1px","backgroundColor":"rgb(255,255,255)","padding":"0.25rem"}}>
                {rangeButtons.map((btn) => {
                  const isActive = selectedRange === btn.value;
                  return (
                    <Link
                      key={btn.value}
                      href={`/dashboard/analytics?range=${btn.value}`}
                      style={{"display":"inline-flex","alignItems":"center","borderRadius":"0.375rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","padding":"0.25rem","fontSize":"0.875rem","lineHeight":"1.25rem"}} className={` ${
                        isActive
                          ? "bg-black text-white"
                          : "text-slate-700 hover:bg-black/5"
                      }`}
                    >
                      <CalendarDays className="size-3.5" />
                      {btn.label}
                    </Link>
                  );
                })}
              </div>



              <span style={{"marginLeft":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.5)"}}>
                Showing data for: <strong style={{"fontWeight":"600","color":"rgb(0,0,0,0.8)"}}>{selectedRange === "today" ? `Today (${todayStr})` : selectedRange === "last7" ? "Last 7 Days" : selectedRange === "last30" ? "Last 30 Days" : "All Time"}</strong>
              </span>
            </div>

            {/* Top Metric Cards */}
            <div style={{"marginTop":"1rem","display":"grid","gridTemplateColumns":"repeat(auto-fit, minmax(250px, 1fr))","gap":"1rem"}}>
              <MetricCard
                title="Gross sales"
                value={currencyFormatter.format(analytics.grossSales)}
              />
              <MetricCard
                title="Returning customer rate"
                value={`${analytics.returningCustomerRate}%`}
              />
              <MetricCard
                title="Orders fulfilled"
                value={analytics.ordersFulfilled.toString()}
              />
              <MetricCard
                title="Orders"
                value={analytics.totalOrders.toString()}
              />
            </div>

            {/* Main Sales Charts & Breakdown */}
            <div style={{"marginTop":"1rem","display":"grid","gridTemplateColumns":"repeat(auto-fit, minmax(250px, 1fr))","gap":"1rem"}}>
              <SalesChart
                title="Total sales over time"
                value={currencyFormatter.format(analytics.grossSales)}
              />

              {/* Total sales breakdown */}
              <Panel title="Total sales breakdown" style={{"minHeight":"350px"}}>
                <div style={{"marginTop":"calc(0.125rem * calc(1 - 0))","marginBottom":"calc(0.125rem * 0)","fontSize":"0.75rem","lineHeight":"1rem"}}>
                  {[
                    { label: "Gross sales", val: currencyFormatter.format(analytics.grossSales) },
                    { label: "Discounts", val: "₹0" },
                    { label: "Sales reversals", val: "₹0" },
                    { label: "Net sales", val: currencyFormatter.format(analytics.grossSales) },
                    { label: "Shipping charges", val: "₹0" },
                    { label: "Return fees", val: "₹0" },
                    { label: "Taxes (GST Included)", val: "Included" },
                    { label: "Total sales", val: currencyFormatter.format(analytics.grossSales) },
                  ].map((row, index) => (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between rounded-lg px-2.5 py-2 ${
                        index % 2 === 1 ? "bg-black/[0.03]" : ""
                      }`}
                    >
                      <span
                        className={
                          row.label === "Total sales"
                            ? "font-bold text-[#1a1a1a]"
                            : "font-medium text-slate-700"
                        }
                      >
                        {row.label}
                      </span>
                      <span
                        className={
                          row.label === "Total sales"
                            ? "font-bold text-[#005BD3]"
                            : "font-semibold text-[#1a1a1a]"
                        }
                      >
                        {row.val}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            {/* Middle Section: Channel Sales & Product Sales */}
            <div style={{"marginTop":"1rem","display":"grid","gridTemplateColumns":"repeat(auto-fit, minmax(250px, 1fr))","gap":"1rem"}}>
              {/* Sales channel */}
              <Panel title="Total sales by sales channel" style={{"minHeight":"260px"}}>
                <div style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)","paddingTop":"0.5rem"}}>
                  <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem"}}>
                    <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                      <span style={{"borderRadius":"9999px","backgroundColor":"rgb(10,122,230)"}} />
                      <span style={{"fontWeight":"600","color":"rgb(15,23,42)"}}>Online Store</span>
                    </div>
                    <span style={{"fontWeight":"700","color":"rgb(15,23,42)"}}>
                      {currencyFormatter.format(analytics.grossSales)}
                    </span>
                  </div>
                  <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","paddingLeft":"0.25rem","paddingRight":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>
                    <span>Active channel: 1</span>
                    <span>100% of sales</span>
                  </div>
                </div>
              </Panel>

              {/* Average order value */}
              <SalesChart
                title="Average order value over time"
                value={currencyFormatter.format(analytics.averageOrderValue)}
              />

              {/* Total sales by product */}
              <Panel title="Total sales by product" style={{"minHeight":"260px"}}>
                {analytics.salesByProduct.length === 0 ? (
                  <div style={{"display":"flex","minHeight":"180px","alignItems":"center","justifyContent":"center","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.5)"}}>
                    No product sales for this range
                  </div>
                ) : (
                  <div style={{"marginTop":"calc(0.5rem * calc(1 - 0))","marginBottom":"calc(0.5rem * 0)","borderTopWidth":"calc(1px * calc(1 - 0))","borderBottomWidth":"calc(1px * 0)","borderColor":"rgb(0,0,0,0.1)","paddingTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>
                    {analytics.salesByProduct.map((p) => (
                      <div
                        key={p.id}
                        style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.75rem","paddingTop":"0px"}}
                      >
                        <div style={{"minWidth":"0px","flex":"1 1 0%"}}>
                          <p style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontWeight":"700","color":"rgb(15,23,42)"}}>{p.name}</p>
                          <p style={{"fontSize":"11px"}}>{p.quantity} sold</p>
                        </div>
                        <span style={{"flexShrink":"0","fontWeight":"600","color":"rgb(15,23,42)"}}>
                          {currencyFormatter.format(p.totalSales)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>

            {/* Bottom Conversion & Activity Section */}
            <div style={{"marginTop":"1rem","display":"grid","gridTemplateColumns":"repeat(auto-fit, minmax(250px, 1fr))","gap":"1rem"}}>
              <ConversionBreakdownPanel returningRate={analytics.returningCustomerRate} />
              <Panel title="Top selling summary" style={{"minHeight":"260px"}}>
                <div style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)","paddingTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>
                  <div style={{"display":"flex","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingBottom":"0.5rem"}}>
                    <span style={{"color":"rgb(0,0,0,0.6)"}}>Total orders</span>
                    <span style={{"fontWeight":"700","color":"rgb(15,23,42)"}}>{analytics.totalOrders}</span>
                  </div>
                  <div style={{"display":"flex","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingBottom":"0.5rem"}}>
                    <span style={{"color":"rgb(0,0,0,0.6)"}}>Orders fulfilled</span>
                    <span style={{"fontWeight":"700","color":"rgb(15,23,42)"}}>{analytics.ordersFulfilled}</span>
                  </div>
                  <div style={{"display":"flex","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingBottom":"0.5rem"}}>
                    <span style={{"color":"rgb(0,0,0,0.6)"}}>Average order value</span>
                    <span style={{"fontWeight":"700","color":"rgb(15,23,42)"}}>
                      {currencyFormatter.format(analytics.averageOrderValue)}
                    </span>
                  </div>
                </div>
              </Panel>
            </div>

            <div style={{"marginTop":"1.5rem","display":"flex","alignItems":"center","justifyContent":"center","gap":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.5)"}}>
              <Target className="size-3.5" />
              Analytics updates dynamically as your store receives activity
              <CircleHelp className="size-3.5" />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
