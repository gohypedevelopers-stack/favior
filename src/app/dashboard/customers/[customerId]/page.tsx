import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  MoreHorizontal,
  PackageOpen,
  Phone,
  User,
  UserRound,
} from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCustomerForDashboard } from "@/lib/server/controllers/dashboard.controller";

export const metadata: Metadata = {
  title: "Customer Detail | Favior Admin",
  description: "Review Favior customer profile and order history.",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  hour: "numeric",
  minute: "2-digit",
});

function orderReference(id: string) {
  return `#${id.slice(-8).toUpperCase()}`;
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  const customer = await getCustomerForDashboard(customerId);
  if (!customer) notFound();

  const latestOrder = customer.orders[0];
  const lastShippingAddress = customer.orders.find((o: { shippingAddress: string | null }) => o.shippingAddress)?.shippingAddress;
  const cleanAddress = (lastShippingAddress || "").replace(/\[Payment:\s*[A-Z_]+\]/gi, "").trim();

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main style={{"minHeight":"100%","flex":"1 1 0%","backgroundColor":"rgb(241,241,241)","padding":"1rem","color":"rgb(0,0,0)"}}>
            <div style={{"marginLeft":"auto","marginRight":"auto","maxWidth":"72rem","marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)"}}>
              {/* Top Navigation & Action Header */}
              <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                <Link
                  href="/dashboard/customers"
                  style={{"display":"inline-flex","alignItems":"center","justifyContent":"center","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(0,0,0,0.05)","color":"rgb(0,0,0,0.7)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}
                  title="Back to customers"
                >
                  <ArrowLeft className="size-4" />
                </Link>
                <div>
                  <h1 style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"1.25rem","lineHeight":"1.75rem","fontWeight":"700","color":"rgb(15,23,42)"}}>
                    <UserRound style={{"color":"rgb(71,85,105)"}} />
                    {customer.name}
                  </h1>
                  <p style={{"fontSize":"0.75rem","lineHeight":"1rem"}}>
                    Customer since {dateFormatter.format(new Date(customer.createdAt))}
                  </p>
                </div>
              </div>

              {/* Metric Banner Card */}
              <section style={{"overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)"}}>
                <div style={{"display":"grid","gridTemplateColumns":"repeat(1, minmax(0, 1fr))","borderTopWidth":"calc(1px * calc(1 - 0))","borderBottomWidth":"calc(1px * 0)","borderColor":"rgb(0,0,0,0.1)"}}>
                  <div style={{"padding":"1rem"}}>
                    <p style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(0,0,0,0.6)"}}>Amount spent</p>
                    <p style={{"marginTop":"0.25rem","fontSize":"1rem","lineHeight":"1.5rem","fontWeight":"700","color":"rgb(15,23,42)"}}>
                      {currencyFormatter.format(customer.amountSpent)}
                    </p>
                  </div>
                  <div style={{"padding":"1rem"}}>
                    <p style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(0,0,0,0.6)"}}>Orders</p>
                    <p style={{"marginTop":"0.25rem","fontSize":"1rem","lineHeight":"1.5rem","fontWeight":"700","color":"rgb(15,23,42)"}}>{customer.orders.length}</p>
                  </div>
                  <div style={{"padding":"1rem"}}>
                    <p style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500","color":"rgb(0,0,0,0.6)"}}>Customer since</p>
                    <p style={{"marginTop":"0.25rem","fontSize":"1rem","lineHeight":"1.5rem","fontWeight":"700","color":"rgb(15,23,42)"}}>
                      {dateFormatter.format(new Date(customer.createdAt))}
                    </p>
                  </div>
                </div>
              </section>

              {/* Main Content Layout (2-Column) */}
              <div style={{"display":"grid","gridTemplateColumns":"repeat(1, minmax(0, 1fr))","alignItems":"flex-start","gap":"1.25rem"}}>
                {/* LEFT COLUMN: Last Order, Timeline (65%) */}
                <div style={{"marginTop":"calc(1.25rem * calc(1 - 0))","marginBottom":"calc(1.25rem * 0)"}}>
                  {/* Last Order Placed Card */}
                  {latestOrder && (
                    <section style={{"overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)"}}>
                      <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1.25rem","paddingRight":"1.25rem","paddingTop":"0.875rem","paddingBottom":"0.875rem"}}>
                        <h2 style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(0,0,0,0.75)"}}>
                          Last order placed
                        </h2>
                      </div>

                      <div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)","padding":"1.25rem"}}>
                        {/* Order Header Summary */}
                        <div style={{"display":"flex","flexWrap":"wrap","alignItems":"flex-start","justifyContent":"space-between","gap":"0.5rem"}}>
                          <div style={{"marginTop":"calc(0.25rem * calc(1 - 0))","marginBottom":"calc(0.25rem * 0)"}}>
                            <div style={{"display":"flex","alignItems":"center","gap":"0.5rem"}}>
                              <Link
                                href={`/dashboard/orders/${latestOrder.id}`}
                                style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"700","color":"rgb(0,91,211)","textDecorationLine":"underline"}}
                              >
                                {orderReference(latestOrder.id)}
                              </Link>
                              {latestOrder.status === "CANCELLED" ? (
                                <span style={{"borderRadius":"0.375rem","backgroundColor":"rgb(254,226,226)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"11px","fontWeight":"600","color":"rgb(127,29,29)"}}>
                                  Cancelled
                                </span>
                              ) : (
                                <span style={{"borderRadius":"0.375rem","backgroundColor":"rgb(209,250,229)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"11px","fontWeight":"600","color":"rgb(6,78,59)"}}>
                                  Paid
                                </span>
                              )}
                              {latestOrder.status === "DELIVERED" || latestOrder.status === "SHIPPED" ? (
                                <span style={{"borderRadius":"0.375rem","backgroundColor":"rgb(209,250,229)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"11px","fontWeight":"600","color":"rgb(6,78,59)"}}>
                                  Fulfilled
                                </span>
                              ) : (
                                <span style={{"borderRadius":"0.375rem","backgroundColor":"rgb(254,243,199)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"11px","fontWeight":"600","color":"rgb(120,53,15)"}}>
                                  Unfulfilled
                                </span>
                              )}
                            </div>
                            <p style={{"fontSize":"0.75rem","lineHeight":"1rem"}}>
                              {dateFormatter.format(new Date(latestOrder.createdAt))} at{" "}
                              {timeFormatter.format(new Date(latestOrder.createdAt))} from Online Store
                            </p>
                          </div>
                          <p style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"700","color":"rgb(15,23,42)"}}>
                            {currencyFormatter.format(latestOrder.total)}
                          </p>
                        </div>

                        {/* Order Items List */}
                        {latestOrder.items && latestOrder.items.length > 0 && (
                          <div style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)","borderTopWidth":"calc(1px * calc(1 - 0))","borderBottomWidth":"calc(1px * 0)","borderColor":"rgb(0,0,0,0.1)","borderRadius":"0.5rem","borderWidth":"1px","backgroundColor":"rgb(0,0,0,0.01)","padding":"0.75rem"}}>
                            {latestOrder.items.map((item: any) => (
                              <div
                                key={item.id}
                                style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"0.75rem","paddingTop":"0px"}}
                              >
                                <div style={{"display":"flex","alignItems":"center","gap":"0.75rem"}}>
                                  <div style={{"position":"relative","flexShrink":"0","overflow":"hidden","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"0.25rem"}}>
                                    <Image
                                      src={item.product?.mainImage || "/category-smartphone.png"}
                                      alt={item.product?.name || "Product"}
                                      fill
                                      style={{"objectFit":"contain"}}
                                    />
                                  </div>
                                  <div>
                                    <p style={{"overflow":"hidden","display":"-webkit-box","WebkitBoxOrient":"vertical","WebkitLineClamp":"1","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","color":"rgb(15,23,42)"}}>
                                      {item.product?.name || "Product Item"}
                                    </p>
                                    <span style={{"borderRadius":"0.375rem","backgroundColor":"rgb(0,0,0,0.05)","paddingLeft":"0.375rem","paddingRight":"0.375rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"10px","fontWeight":"500","color":"rgb(0,0,0,0.6)"}}>
                                      Qty: {item.quantity}
                                    </span>
                                  </div>
                                </div>
                                <span style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(15,23,42)"}}>
                                  {currencyFormatter.format((item.unitPrice || 0) * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Order Actions */}
                        <div style={{"display":"flex","alignItems":"center","justifyContent":"flex-end","paddingTop":"0.5rem"}}>
                          <Link
                            href="/dashboard/orders"
                            style={{"display":"inline-flex","height":"2rem","alignItems":"center","borderRadius":"0.5rem","borderWidth":"1px","backgroundColor":"rgb(0,0,0,0.05)","paddingLeft":"0.75rem","paddingRight":"0.75rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0,0.8)","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}}
                          >
                            View all orders
                          </Link>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* All Orders Table Card */}
                  <section style={{"overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)"}}>
                    <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"1.25rem","paddingRight":"1.25rem","paddingTop":"0.875rem","paddingBottom":"0.875rem"}}>
                      <h2 style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(0,0,0,0.75)"}}>
                        Order history ({customer.orders.length})
                      </h2>
                    </div>
                    {customer.orders.length === 0 ? (
                      <div style={{"display":"flex","alignItems":"center","gap":"0.75rem","paddingLeft":"1.25rem","paddingRight":"1.25rem","paddingTop":"2rem","paddingBottom":"2rem","fontSize":"0.75rem","lineHeight":"1rem"}}>
                        <PackageOpen className="size-4" /> This customer has not placed any orders yet.
                      </div>
                    ) : (
                      <div style={{"borderTopWidth":"calc(1px * calc(1 - 0))","borderBottomWidth":"calc(1px * 0)","borderColor":"rgb(0,0,0,0.1)","fontSize":"0.75rem","lineHeight":"1rem"}}>
                        {customer.orders.map((order: any) => (
                          <Link
                            key={order.id}
                            href={`/dashboard/orders/${order.id}`}
                            style={{"display":"flex","cursor":"pointer","alignItems":"center","justifyContent":"space-between","gap":"0.75rem","paddingLeft":"1.25rem","paddingRight":"1.25rem","paddingTop":"0.75rem","paddingBottom":"0.75rem","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.04)"}}
                          >
                            <span style={{"fontWeight":"700","color":"rgb(0,0,0)","textDecorationLine":"underline"}}>
                              {orderReference(order.id)}
                            </span>
                            <span className="text-black/55">
                              {dateFormatter.format(new Date(order.createdAt))} ·{" "}
                              <span style={{"fontWeight":"600","color":"rgb(30,41,59)"}}>{order.status}</span>
                            </span>
                            <span style={{"fontWeight":"600","color":"rgb(15,23,42)"}}>
                              {currencyFormatter.format(order.total)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </section>


                </div>

                {/* RIGHT COLUMN: Customer Details (35%) */}
                <div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)"}}>
                  {/* Customer Info Card */}
                  <section style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1.25rem"}}>
                    <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingBottom":"0.75rem"}}>
                      <h2 style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(0,0,0,0.75)"}}>
                        <User style={{"color":"rgb(0,0,0,0.6)"}} /> Customer
                      </h2>
                      <button type="button" style={{"color":"rgb(0,0,0)"}}>
                        <MoreHorizontal className="size-4" />
                      </button>
                    </div>

                    {/* Contact Information */}
                    <div style={{"marginTop":"calc(0.375rem * calc(1 - 0))","marginBottom":"calc(0.375rem * 0)"}}>
                      <p style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","color":"rgb(0,0,0,0.75)"}}>Contact information</p>
                      <a
                        href={`mailto:${customer.email}`}
                        style={{"display":"flex","alignItems":"center","gap":"0.375rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,91,211)","textDecorationLine":"underline"}}
                      >
                        <Mail style={{"flexShrink":"0"}} />
                        <span style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap"}}>{customer.email}</span>
                      </a>
                      {customer.phone ? (
                        <a
                          href={`tel:${customer.phone}`}
                          style={{"display":"flex","alignItems":"center","gap":"0.375rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,91,211)"}}
                        >
                          <Phone style={{"flexShrink":"0","color":"rgb(0,0,0,0.6)"}} />
                          <span>{customer.phone}</span>
                        </a>
                      ) : (
                        <p style={{"fontSize":"0.75rem","lineHeight":"1rem"}}>No phone number provided</p>
                      )}
                    </div>

                    <hr style={{"borderColor":"rgb(0,0,0,0.1)"}} />

                    {/* Default Address */}
                    <div style={{"marginTop":"calc(0.375rem * calc(1 - 0))","marginBottom":"calc(0.375rem * 0)"}}>
                      <p style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","color":"rgb(0,0,0,0.75)"}}>Default address</p>
                      <div style={{"marginTop":"calc(0.125rem * calc(1 - 0))","marginBottom":"calc(0.125rem * 0)","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.8)"}}>
                        <p style={{"fontWeight":"600","color":"rgb(15,23,42)"}}>{customer.name}</p>
                        <p style={{"lineHeight":"1.625"}}>
                          {cleanAddress || "No default address saved"}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
