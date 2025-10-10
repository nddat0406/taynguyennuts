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

    const existingOrder = existingOrders[0];
    
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

    const { data: updatedOrders, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .select();


    if (!updatedOrders || updatedOrders.length === 0) {
      const { data: altUpdatedOrders, error: altError } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId)
        .eq("payment_code", existingOrder.payment_code)
        .select();
      
      if (altUpdatedOrders && altUpdatedOrders.length > 0) {
        const updatedOrder = altUpdatedOrders[0];
        return NextResponse.json({ 
          success: true, 
          order: updatedOrder 
        });
      }
      
      const { data: sqlResult, error: sqlError } = await supabase.rpc('update_order_status', {
        order_id: orderId,
        new_status: updateData.order_status,
        new_payment_status: updateData.payment_status
      });
      
      if (sqlError) {
        const { data: directUpdate, error: directError } = await supabase
          .from("orders")
          .update(updateData)
          .eq("id", orderId)
          .select("*");
        
        if (directUpdate && directUpdate.length > 0) {
          return NextResponse.json({ 
            success: true, 
            order: directUpdate[0] 
          });
        }
      }
    }

    if (error) {
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    if (!updatedOrders || updatedOrders.length === 0) {
      const { data: checkOrder } = await supabase
        .from("orders")
        .select("id, payment_code, order_status, payment_status")
        .eq("id", orderId);
      
      return NextResponse.json(
        { error: "No rows were updated" },
        { status: 404 }
      );
    }

    const updatedOrder = updatedOrders[0];

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
