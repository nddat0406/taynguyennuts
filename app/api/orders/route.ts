import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    if (!userId && !email) {
      return NextResponse.json(
        { error: "User ID hoặc Email không được để trống" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    let query = supabase
      .from("orders")
      .select(`
        *,
        order_details (
          id,
          quantity,
          products (
            id,
            name,
            price,
            product_images (
              url,
              isMainImage
            )
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    } else if (email) {
      query = query.eq("email", email);
    }

    const { data: orders, error: ordersError } = await query;

    if (ordersError) {
      console.error("Orders fetch error:", ordersError);
      return NextResponse.json(
        { error: "Có lỗi xảy ra khi lấy danh sách đơn hàng" },
        { status: 500 }
      );
    }
    

    const formattedOrders = orders?.map((order) => ({
      id: order.payment_code || order.id.toString(),
      customerInfo: {
        fullName: order.name || "Khách hàng",
        email: order.email || "",
        phone: order.phone || "",
        address: order.address || "",
        city: order.province || "",
        ward: order.ward || "",
        notes: order.note || "",
      },
      items: order.order_details?.map((detail: any) => ({
        product: {
          id: detail.products?.id?.toString() || "",
          name: detail.products?.name || "Sản phẩm không xác định",
          price: Number(detail.products?.price || 0),
          image: detail.products?.product_images?.find((img: any) => img.isMainImage)?.url || null
        },
        quantity: detail.quantity || 0
      })) || [],
      total: order.total || 0,
      paymentMethod: order.payment_status === "cod" ? "cod" : "bank_transfer",
      order_status: mapOrderStatus(order.order_status),
      createdAt: order.created_at
    })) || [];

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi lấy danh sách đơn hàng" },
      { status: 500 }
    );
  }
}

function mapOrderStatus(dbStatus: string): "pending" | "confirmed" | "shipping" | "delivered" | "cancelled" {
  switch (dbStatus) {
    case "Chờ xác nhận":
      return "pending";
    case "Chờ lấy hàng":
      return "confirmed";
    case "Đang giao hàng":
      return "shipping";
    case "Đã giao hàng":
      return "delivered";
    default:
      return "pending";
  }
}
