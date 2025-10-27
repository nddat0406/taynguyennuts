import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

const validateSchema = z.object({
  code: z
    .string()
    .length(6)
    .regex(/^[A-Z0-9]+$/),
  productId: z.number().optional(),
});

function isActive(code: any) {
  if (!code) return false;
  const now = Date.now();
  return (
    code.is_active &&
    new Date(code.start_date).getTime() <= now &&
    new Date(code.end_date).getTime() >= now
  );
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("discount_codes")
      .select(`*, discount_code_products (product_id)`)
      .eq("is_active", true)
      .lte("start_date", now)
      .gte("end_date", now);

    if (error) {
      return NextResponse.json(
        {
          error: "server_error",
          message: "Không thể tải mã giảm giá",
        },
        { status: 500 }
      );
    }

    const discountCodes = (data || []).map((code: any) => ({
      id: code.id,
      code: code.code,
      value: Number(code.value),
      startDate: code.start_date,
      endDate: code.end_date,
      isActive: code.is_active,
      productIds: code.discount_code_products?.map((p: any) => p.product_id) ?? [],
    }));

    return NextResponse.json({ data: discountCodes });
  } catch (error) {
    return NextResponse.json(
      {
        error: "server_error",
        message: "Không thể tải mã giảm giá",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = validateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "invalid_payload",
          details: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { code, productId } = result.data;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("discount_codes")
      .select(
        `*, discount_code_products (product_id)`
      )
      .eq("code", code)
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          error: "not_found",
          message: "Mã giảm giá không tồn tại",
        },
        { status: 404 }
      );
    }

    if (!isActive(data)) {
      return NextResponse.json(
        {
          error: "inactive",
          message: "Mã giảm giá đã hết hạn hoặc bị khóa",
        },
        { status: 400 }
      );
    }

    const allowedProductIds = data.discount_code_products?.map((p: any) => p.product_id) ?? [];
    if (productId && allowedProductIds.length > 0 && !allowedProductIds.includes(productId)) {
      return NextResponse.json(
        {
          error: "product_not_allowed",
          message: "Mã giảm giá không áp dụng cho sản phẩm này",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      data: {
        id: data.id,
        code: data.code,
        value: Number(data.value),
        startDate: data.start_date,
        endDate: data.end_date,
        isActive: data.is_active,
        productIds: allowedProductIds,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "server_error",
        message: "Không thể kiểm tra mã giảm giá",
      },
      { status: 500 }
    );
  }
}
