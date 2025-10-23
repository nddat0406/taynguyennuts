import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { adminAuthMiddleware } from "@/utils/admin-auth";
import { orderStatusMap } from "@/utils/constants";

export async function PUT(request: NextRequest) {
  try {
    const authError = await adminAuthMiddleware(request);
    if (authError) return authError;

    const { orderId, status, paymentStatus, recalculateShipping } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { data: existingOrders, error: fetchError } = await supabase
      .from("orders")
      .select("id, payment_code")
      .eq("id", orderId);

    if (fetchError) {
      return NextResponse.json(
        { error: "Error checking order" },
        { status: 500 }
      );
    }

    if (!existingOrders || existingOrders.length === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }
    
    const updateData: any = {};
    if (status) {
      const vietnameseStatus = orderStatusMap[status] || status;
      updateData.order_status = vietnameseStatus;
    }
    if (paymentStatus !== undefined) updateData.payment_status = paymentStatus;

    if (recalculateShipping) {
      const { data: orderDetails, error: detailsError } = await supabase
        .from("orders")
        .select(`
          order_details (
            quantity,
            products (price)
          )
        `)
        .eq("id", orderId)
        .single();

      if (detailsError) {
        return NextResponse.json(
          { error: "Failed to fetch order details" },
          { status: 500 }
        );
      }

      const subtotal = orderDetails.order_details?.reduce((sum: number, detail: any) => {
        return sum + (detail.products.price * detail.quantity);
      }, 0) || 0;
      
      const shippingFee = subtotal >= 500000 ? 0 : 30000;
      const totalAmount = subtotal + shippingFee;

      updateData.shipping_fee = shippingFee;
      updateData.total_amount = totalAmount;
    }

    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (error) {
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    const { data: updatedOrder, error: fetchUpdatedError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();
      
      

    return NextResponse.json({ 
      success: true, 
      order: updatedOrder 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
