import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/dal/auth";
import { createOrder } from "@/lib/server/controllers/orders.controller";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to place an order." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { items, total, shippingAddress, phone } = body;

    if (!items || !items.length) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    const orderInput = {
      userId: user.id,
      items: items.map((item: any) => ({
        productId: item.id || item.productId,
        quantity: item.quantity || 1,
        unitPrice: parseFloat(item.price.toString().replace(/[^0-9.]/g, "")),
      })),
      total,
      shippingAddress: shippingAddress || "Default Address",
      phone: phone || (user as any).phone || "",
    };

    const order = await createOrder(orderInput);

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong during checkout." },
      { status: 500 }
    );
  }
}
