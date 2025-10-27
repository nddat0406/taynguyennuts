import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { orderId, orderDetails } = await request.json();

    if (!orderId || !orderDetails || !Array.isArray(orderDetails)) {
      return NextResponse.json(
        { error: "Thiếu thông tin đơn hàng hoặc chi tiết đơn hàng" },
        { status: 400 }
      );
    }

    const { data: insertedDetails, error: detailError } = await supabase
      .from("order_details")
      .insert(orderDetails)
      .select();

    if (detailError) {
      return NextResponse.json(
        { error: "Có lỗi xảy ra khi tạo chi tiết đơn hàng" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      orderDetails: insertedDetails 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi tạo chi tiết đơn hàng" },
      { status: 500 }
    );
  }
}
