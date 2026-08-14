"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Truck,
  User,
  AlertCircle,
  ExternalLink,
  Check,
} from "lucide-react";

import { AppSidebar } from "@/components/admin/navigation/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { formatINR } from "@/lib/format-price";

type OrderDetailItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  product?: {
    id: string;
    name: string;
    mainImage?: string;
    slug?: string;
    price?: number;
  };
};

type OrderDetailData = {
  id: string;
  total: number;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  shippingAddress?: string;
  paymentMethod?: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  items: OrderDetailItem[];
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const json = await res.json();

        if (isMounted) {
          if (res.ok && json.success && json.data) {
            setOrder(json.data);
          } else {
            setError(json.error || "Order not found");
          }
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load order details");
          setLoading(false);
        }
      }
    }

    fetchOrder();
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setOrder((prev) => (prev ? { ...prev, status: json.data.status } : null));
      } else {
        alert(json.error || "Failed to update order status");
      }
    } catch {
      alert("Network error while updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getFulfillmentBadge = (status: string) => {
    if (status === "DELIVERED") {
      return (
        <span style={{"display":"inline-flex","alignItems":"center","gap":"0.25rem","borderRadius":"0.375rem","backgroundColor":"rgb(209,250,229)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.25rem","paddingBottom":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(6,95,70)"}}>
          <CheckCircle2 className="size-3.5" /> FULFILLED
        </span>
      );
    }
    if (status === "SHIPPED") {
      return (
        <span style={{"display":"inline-flex","alignItems":"center","gap":"0.25rem","borderRadius":"0.375rem","backgroundColor":"rgb(219,234,254)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.25rem","paddingBottom":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(10,122,230)"}}>
          <Truck className="size-3.5" /> IN TRANSIT
        </span>
      );
    }
    if (status === "CANCELLED") {
      return (
        <span style={{"display":"inline-flex","alignItems":"center","gap":"0.25rem","borderRadius":"0.375rem","backgroundColor":"rgb(254,226,226)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.25rem","paddingBottom":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(153,27,27)"}}>
          <AlertCircle className="size-3.5" /> CANCELLED
        </span>
      );
    }
    return (
      <span style={{"display":"inline-flex","alignItems":"center","gap":"0.25rem","borderRadius":"0.375rem","backgroundColor":"rgb(254,243,199)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.25rem","paddingBottom":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(120,53,15)"}}>
        <Clock className="size-3.5" /> UNFULFILLED
      </span>
    );
  };

  if (loading) {
    return (
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <div style={{"display":"flex","minHeight":"70vh","alignItems":"center","justifyContent":"center","backgroundColor":"rgb(245,245,245)"}}>
            <div style={{"animation":"spin 1s linear infinite","borderRadius":"9999px","borderWidth":"4px","borderColor":"rgb(0,0,0)","borderTopColor":"transparent"}} />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error || !order) {
    return (
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <div style={{"display":"flex","minHeight":"70vh","flexDirection":"column","alignItems":"center","justifyContent":"center","backgroundColor":"rgb(245,245,245)","padding":"1.5rem","textAlign":"center"}}>
            <Package style={{"marginBottom":"0.75rem","color":"rgb(0,0,0,0.3)"}} />
            <h2 style={{"fontSize":"1.25rem","lineHeight":"1.75rem","fontWeight":"700","color":"rgb(0,0,0)"}}>Order Not Found</h2>
            <p style={{"marginTop":"0.25rem","fontSize":"0.875rem","lineHeight":"1.25rem","color":"rgb(0,0,0,0.6)"}}>{error || "The requested order could not be located."}</p>
            <Link
              href="/dashboard/orders"
              style={{"marginTop":"1.25rem","display":"inline-flex","alignItems":"center","gap":"0.5rem","borderRadius":"0.5rem","backgroundColor":"rgb(0,0,0,0.8)","paddingLeft":"1rem","paddingRight":"1rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(255,255,255)"}}
            >
              <ArrowLeft className="size-4" /> Back to Orders
            </Link>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const orderRef = `#XE-${order.id.slice(-8).toUpperCase()}`;
  const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const isFulfilled = order.status === "DELIVERED" || order.status === "SHIPPED";

  const rawAddress = order.shippingAddress || "";
  const paymentMatch = rawAddress.match(/\[Payment:\s*([A-Z_]+)\]/i);
  const displayPaymentMethod = order.paymentMethod || (paymentMatch ? paymentMatch[1].toUpperCase() : "CARD");
  const cleanAddress = rawAddress.replace(/\[Payment:\s*[A-Z_]+\]/gi, "").trim();

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case "UPI":
        return "UPI Instant Payment";
      case "COD":
        return "Cash on Delivery (COD)";
      case "NETBANKING":
        return "Net Banking";
      default:
        return "Credit / Debit Card (CARD)";
    }
  };

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-svh">
        <AppSidebar />
        <SidebarInset>
          <main style={{"minHeight":"100%","flex":"1 1 0%","backgroundColor":"rgb(245,245,245)","padding":"1rem","color":"rgb(0,0,0)"}}>
            {/* Top Navigation & Actions Bar */}
            <div style={{"marginBottom":"1.5rem","display":"flex","flexWrap":"wrap","alignItems":"center","justifyContent":"space-between","gap":"1rem","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingBottom":"1rem"}}>
              <div style={{"display":"flex","alignItems":"center","gap":"0.75rem"}}>
                <Link
                  href="/dashboard/orders"
                  style={{"display":"inline-flex","alignItems":"center","justifyContent":"center","borderRadius":"0.5rem","borderWidth":"1px","backgroundColor":"rgb(0,0,0,0.05)","color":"rgb(0,0,0)"}}
                >
                  <ArrowLeft className="size-4" />
                </Link>
                <div>
                  <div style={{"display":"flex","alignItems":"center","gap":"0.625rem"}}>
                    <h1 style={{"fontSize":"1.25rem","lineHeight":"1.75rem","fontWeight":"700","color":"rgb(0,0,0)"}}>{orderRef}</h1>
                    <span style={{"display":"inline-flex","alignItems":"center","gap":"0.25rem","borderRadius":"0.375rem","backgroundColor":"rgb(209,250,229)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","color":"rgb(6,95,70)"}}>
                      <Check className="size-3" /> PAID
                    </span>
                    {getFulfillmentBadge(order.status)}
                  </div>
                  <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>{formattedDate} from Online Store</p>
                </div>
              </div>

              {/* Status Selector & Fulfillment Buttons */}
              <div style={{"display":"flex","flexWrap":"wrap","alignItems":"center","gap":"0.5rem"}}>

                <div style={{"position":"relative","display":"inline-block"}}>
                  <select
                    value={order.status}
                    disabled={isUpdating}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    style={{"height":"2.25rem","borderRadius":"0.5rem","borderWidth":"1px","backgroundColor":"rgb(0,0,0,0.05)","paddingLeft":"0.75rem","paddingRight":"2rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0,0.8)","outline":"2px solid transparent","outlineOffset":"2px","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(2px + 0px) rgb(59,130,246,0.5), 0 0 #0000","opacity":"0.5"}}
                  >
                    <option value="PENDING">Status: Pending</option>
                    <option value="CONFIRMED">Status: Confirmed</option>
                    <option value="PROCESSING">Status: Processing</option>
                    <option value="SHIPPED">Status: Shipped</option>
                    <option value="DELIVERED">Status: Delivered</option>
                    <option value="CANCELLED">Status: Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2-Column Shopify Style Layout */}
            <div style={{"display":"grid","gridTemplateColumns":"repeat(1, minmax(0, 1fr))","gap":"1.5rem"}}>
              {/* LEFT COLUMN: Items & Payment Breakdown (70%) */}
              <div style={{"marginTop":"calc(1.5rem * calc(1 - 0))","marginBottom":"calc(1.5rem * 0)"}}>
                {/* Items Card */}
                <div style={{"overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
                  <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(0,0,0,0.02)","paddingLeft":"1.25rem","paddingRight":"1.25rem","paddingTop":"0.875rem","paddingBottom":"0.875rem"}}>
                    <div style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(0,0,0,0.75)"}}>
                      <Package style={{"color":"rgb(0,0,0,0.6)"}} />
                      <span>
                        {isFulfilled ? "Fulfilled Items" : "Unfulfilled Items"} ({totalItemsCount})
                      </span>
                    </div>
                    {getFulfillmentBadge(order.status)}
                  </div>

                  <div style={{"borderTopWidth":"calc(1px * calc(1 - 0))","borderBottomWidth":"calc(1px * 0)","borderColor":"rgb(0,0,0,0.1)"}}>
                    {order.items.map((item) => {
                      const image = item.product?.mainImage || "/category-smartphone.png";
                      const name = item.product?.name || "Favior Product";
                      const slug = item.product?.slug || item.product?.id;

                      return (
                        <div key={item.id} style={{"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"1rem","padding":"1rem"}}>
                          <div style={{"display":"flex","alignItems":"center","gap":"1rem"}}>
                            <div style={{"position":"relative","flexShrink":"0","overflow":"hidden","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"0.25rem"}}>
                              <Image
                                src={image}
                                alt={name}
                                fill
                                style={{"objectFit":"contain","padding":"0.25rem"}}
                                sizes="64px"
                              />
                            </div>
                            <div>
                              {slug ? (
                                <Link
                                  href={`/product/${slug}`}
                                  target="_blank"
                                  style={{"display":"inline-flex","alignItems":"center","gap":"0.25rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(10,122,230)"}}
                                >
                                  <span>{name}</span>
                                  <ExternalLink style={{"opacity":"1","transitionProperty":"opacity","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms"}} />
                                </Link>
                              ) : (
                                <p style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(0,0,0)"}}>{name}</p>
                              )}
                              <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem"}}>
                                {formatINR(item.unitPrice)} × {item.quantity}
                              </p>
                            </div>
                          </div>

                          <div style={{"textAlign":"right","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(0,0,0)"}}>
                            {formatINR(item.unitPrice * item.quantity)}
                          </div>
                        </div>
                      );
                    })}
                  </div>


                </div>

                {/* Payment Breakdown Card */}
                <div style={{"marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1.25rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
                  <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between","borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingBottom":"0.75rem"}}>
                    <div style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(0,0,0,0.75)"}}>
                      <CreditCard style={{"color":"rgb(0,0,0,0.6)"}} />
                      <span>Payment Details</span>
                    </div>
                    <span style={{"borderRadius":"0.375rem","backgroundColor":"rgb(209,250,229)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.125rem","paddingBottom":"0.125rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","color":"rgb(6,95,70)"}}>
                      Paid
                    </span>
                  </div>

                  <div style={{"marginTop":"calc(0.625rem * calc(1 - 0))","marginBottom":"calc(0.625rem * 0)","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.75)"}}>
                    <div style={{"display":"flex","justifyContent":"space-between","paddingTop":"0.125rem","paddingBottom":"0.125rem"}}>
                      <span style={{"color":"rgb(0,0,0,0.6)"}}>Payment Method:</span>
                      <span style={{"display":"flex","alignItems":"center","gap":"0.375rem","fontWeight":"600","color":"rgb(15,23,42)"}}>
                        <CreditCard style={{"color":"rgb(10,122,230)"}} />
                        {getPaymentLabel(displayPaymentMethod)}
                      </span>
                    </div>
                    <div style={{"display":"flex","justifyContent":"space-between","paddingTop":"0.125rem","paddingBottom":"0.125rem"}}>
                      <span style={{"color":"rgb(0,0,0,0.6)"}}>Subtotal ({totalItemsCount} items)</span>
                      <span>{formatINR(order.total)}</span>
                    </div>
                    <div style={{"display":"flex","justifyContent":"space-between","paddingTop":"0.125rem","paddingBottom":"0.125rem"}}>
                      <span style={{"color":"rgb(0,0,0,0.6)"}}>Shipping (Standard Free Delivery)</span>
                      <span>₹0.00</span>
                    </div>
                    <div style={{"display":"flex","justifyContent":"space-between","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingTop":"0.625rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"700","color":"rgb(0,0,0)"}}>
                      <span>Total Paid</span>
                      <span style={{"fontSize":"1rem","lineHeight":"1.5rem","color":"rgb(10,122,230)"}}>{formatINR(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Card */}
                <div style={{"overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1.25rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
                  <h3 style={{"marginBottom":"1rem","display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(0,0,0,0.75)"}}>
                    <Clock style={{"color":"rgb(0,0,0,0.6)"}} />
                    <span>Order Timeline</span>
                  </h3>
                  <div style={{"position":"absolute","marginTop":"calc(1rem * calc(1 - 0))","marginBottom":"calc(1rem * 0)","paddingLeft":"1.5rem","content":"undefined","bottom":"0.5rem","left":"0.5rem","top":"0.5rem","width":"0.125rem","backgroundColor":"rgb(0,0,0,0.1)"}}>
                    <div style={{"position":"relative"}}>
                      <span style={{"position":"absolute","left":"-1.5rem","top":"0.125rem","borderRadius":"9999px","backgroundColor":"rgb(16,185,129)","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(4px + 0px) rgb(59,130,246,0.5), 0 0 #0000"}} />
                      <p style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0)"}}>Order Placed Successfully</p>
                      <p style={{"fontSize":"11px"}}>{formattedDate}</p>
                    </div>
                    <div style={{"position":"relative"}}>
                      <span style={{"position":"absolute","left":"-1.5rem","top":"0.125rem","borderRadius":"9999px","backgroundColor":"rgb(59,130,246)","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(4px + 0px) rgb(59,130,246,0.5), 0 0 #0000"}} />
                      <p style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0)"}}>Confirmation email sent to {order.user.email}</p>
                    </div>
                    {isFulfilled && (
                      <div style={{"position":"relative"}}>
                        <span style={{"position":"absolute","left":"-1.5rem","top":"0.125rem","borderRadius":"9999px","backgroundColor":"rgb(5,150,105)","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(4px + 0px) rgb(59,130,246,0.5), 0 0 #0000"}} />
                        <p style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0)"}}>Order fulfilled and dispatched</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Customer & Shipping (30%) */}
              <div style={{"marginTop":"calc(1.5rem * calc(1 - 0))","marginBottom":"calc(1.5rem * 0)"}}>
                {/* Customer Details Card */}
                <div style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1.25rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
                  <h3 style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(0,0,0,0.75)"}}>
                    <User style={{"color":"rgb(0,0,0,0.6)"}} />
                    <span>Customer</span>
                  </h3>
                  <div>
                    <p style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"600","color":"rgb(0,0,0)"}}>{order.user.name}</p>
                    <p style={{"marginTop":"0.125rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"500"}}>1 order placed</p>
                  </div>
                  <div style={{"marginTop":"calc(0.375rem * calc(1 - 0))","marginBottom":"calc(0.375rem * 0)","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingTop":"0.75rem"}}>
                    <p style={{"marginBottom":"0.25rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"600","color":"rgb(0,0,0,0.75)"}}>Contact Information</p>
                    <a
                      href={`mailto:${order.user.email}`}
                      style={{"display":"flex","alignItems":"center","gap":"0.375rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(10,122,230)","textDecorationLine":"underline"}}
                    >
                      <Mail style={{"flexShrink":"0"}} />
                      <span style={{"overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap"}}>{order.user.email}</span>
                    </a>
                    {order.user.phone ? (
                      <a
                        href={`tel:${order.user.phone}`}
                        style={{"display":"flex","alignItems":"center","gap":"0.375rem","fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(10,122,230)"}}
                      >
                        <Phone style={{"flexShrink":"0","color":"rgb(0,0,0,0.6)"}} />
                        <span>{order.user.phone}</span>
                      </a>
                    ) : (
                      <div style={{"display":"flex","alignItems":"center","gap":"0.375rem","fontSize":"0.75rem","lineHeight":"1rem"}}>
                        <Phone style={{"flexShrink":"0"}} />
                        <span>No phone number</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Address Card */}
                <div style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1.25rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
                  <h3 style={{"display":"flex","alignItems":"center","gap":"0.5rem","fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(0,0,0,0.75)"}}>
                    <MapPin style={{"color":"rgb(0,0,0,0.6)"}} />
                    <span>Shipping Address</span>
                  </h3>
                  <div style={{"marginTop":"calc(0.25rem * calc(1 - 0))","marginBottom":"calc(0.25rem * 0)","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(0,0,0,0.02)","padding":"0.875rem","fontSize":"0.75rem","lineHeight":"1.625","fontWeight":"400","color":"rgb(0,0,0,0.8)"}}>
                    <p style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"700","color":"rgb(15,23,42)"}}>{order.user.name}</p>
                    <p style={{"fontWeight":"500","lineHeight":"1.5","color":"rgb(51,65,85)"}}>{cleanAddress || "No address provided"}</p>
                  </div>
                </div>

                {/* Billing Address Card */}
                <div style={{"marginTop":"calc(0.5rem * calc(1 - 0))","marginBottom":"calc(0.5rem * 0)","overflow":"hidden","borderRadius":"0.75rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","padding":"1.25rem","boxShadow":"0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0,0,0,0.05)"}}>
                  <h3 style={{"fontSize":"0.75rem","lineHeight":"1rem","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"rgb(0,0,0,0.75)"}}>Billing Address</h3>
                  <p style={{"fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(0,0,0,0.6)"}}>Same as shipping address</p>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
