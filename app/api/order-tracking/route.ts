import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderCode = searchParams.get("code");

    if (!orderCode) {
      return NextResponse.json(
        { error: "Mã đơn hàng không được để trống" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: order, error: orderError } = await supabase
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
      .eq("payment_code", orderCode)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng với mã này" },
        { status: 404 }
      );
    }

    const formattedOrder = {
      id: order.payment_code,
      order_status: mapOrderStatus(order.order_status),
      date: order.created_at,
      items: order.order_details?.map((detail: any) => ({
        name: detail.products?.name || "Sản phẩm không xác định",
        quantity: detail.quantity,
        price: Number(detail.products?.price || 0),
        image: detail.products?.product_images?.find((img: any) => img.isMainImage)?.url || null
      })) || [],
      total: order.total || 0,
      customerName: order.name || "Khách hàng",
      address: `${order.address}, ${order.ward}, ${order.province}`,
      phone: order.phone,
      email: order.email,
      note: order.note,
      paymentStatus: order.payment_status
    };

    return NextResponse.json({ order: formattedOrder });
  } catch (error) {
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi tra cứu đơn hàng" },
      { status: 500 }
    );
  }
}

function mapOrderStatus(dbStatus: string): "pending" | "confirmed" | "shipping" | "delivered" {
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
