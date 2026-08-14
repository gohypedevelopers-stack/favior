"use client";

import { useRouter } from "next/navigation";

export type DashboardCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  orderCount: number;
  amountSpent: number;
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

export function CustomerTableRows({ customers }: { customers: DashboardCustomer[] }) {
  const router = useRouter();

  return (
    <>
      {customers.map((customer) => (
        <tr
          key={customer.id}
          role="link"
          tabIndex={0}
          onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              router.push(`/dashboard/customers/${customer.id}`);
            }
          }}
          style={{"cursor":"pointer","outline":"2px solid transparent","outlineOffset":"2px","transitionProperty":"color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter","transitionTimingFunction":"cubic-bezier(0.4, 0, 0.2, 1)","transitionDuration":"150ms","backgroundColor":"rgb(0,0,0,0.04)"}}
        >
          <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem"}}><input type="checkbox" aria-label={`Select ${customer.name}`} onClick={(event) => event.stopPropagation()} /></td>
          <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem"}}><span style={{"fontWeight":"500"}}>{customer.name}</span></td>
          <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem"}}>{customer.email}</td>
          <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem"}}>{customer.phone || "—"}</td>
          <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","textAlign":"right"}}>{customer.orderCount}</td>
          <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem","textAlign":"right"}}>{currencyFormatter.format(customer.amountSpent)}</td>
          <td style={{"borderBottomWidth":"1px","borderColor":"rgb(0,0,0,0.1)","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.5rem","paddingBottom":"0.5rem"}}>{dateFormatter.format(new Date(customer.createdAt))}</td>
        </tr>
      ))}
    </>
  );
}
