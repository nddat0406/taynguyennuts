import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { adminAuthMiddleware } from "@/utils/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const authError = await adminAuthMiddleware(request);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    const search = searchParams.get('search') || '';
    const orderStatus = searchParams.get('orderStatus') || '';
    const paymentStatus = searchParams.get('paymentStatus') || '';

    const supabase = await createClient();
    
    let countQuery = supabase
      .from("orders")
      .select("*", { count: 'exact', head: true });

    let ordersQuery = supabase
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
            product_images (url)
          )
        ),
        discount_codes (
          id,
          code,
          value
        )
      `)
      .order("created_at", { ascending: false });

    if (search) {
      const searchFilter = `or(payment_code.ilike.%${search}%,name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%)`;
      countQuery = countQuery.or(searchFilter);
      ordersQuery = ordersQuery.or(searchFilter);
    }

    if (orderStatus) {
      countQuery = countQuery.eq('order_status', orderStatus);
      ordersQuery = ordersQuery.eq('order_status', orderStatus);
    }

    if (paymentStatus) {
      countQuery = countQuery.eq('payment_status', paymentStatus);
      ordersQuery = ordersQuery.eq('payment_status', paymentStatus);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error("Error counting orders:", countError);
      return NextResponse.json(
        { error: "Failed to count orders" },
        { status: 500 }
      );
    }

    const { data: orders, error } = await ordersQuery.range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    const formattedOrders = orders?.map(order => {
      const subtotal = order.order_details?.reduce((sum: number, detail: any) => {
        return sum + (detail.products.price * detail.quantity);
      }, 0) || 0;
      
      const shippingFee = subtotal >= 500000 ? 0 : 30000;
      const discountAmount = order.discount_amount || 0;
      const originalTotal = order.original_total || (subtotal + shippingFee);
      const totalAmount = order.total || (originalTotal - discountAmount);

      const discountInfo = order.discount_code || order.discount_value ? {
        id: order.discount_code_id || '',
        code: order.discount_code || (order.discount_codes?.code) || 'N/A',
        value: order.discount_value || (order.discount_codes?.value) || 0
      } : (order.discount_codes ? {
        id: order.discount_codes.id,
        code: order.discount_codes.code,
        value: order.discount_codes.value
      } : null);

      return {
        id: order.id,
        payment_code: order.payment_code,
        customer_name: order.name,
        customer_phone: order.phone,
        customer_email: order.email,
        shipping_address: order.address,
        province: order.province,
        ward: order.ward,
        subtotal: subtotal,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        order_status: order.order_status,
        payment_status: order.payment_status,
        note: order.note,
        created_at: order.created_at,
        discount_code: discountInfo,
        discount_amount: discountAmount,
        original_total: discountAmount > 0 ? originalTotal : null,
        items: order.order_details?.map((detail: any) => ({
          id: detail.id,
          quantity: detail.quantity,
          product: {
            id: detail.products.id,
            name: detail.products.name,
            price: detail.products.price,
            image: detail.products.product_images?.[0]?.url || null
          }
        })) || []
      };
    }) || [];

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({ 
      orders: formattedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders: count || 0,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        search,
        orderStatus,
        paymentStatus
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
