import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { adminAuthMiddleware } from "@/utils/admin-auth";

const discountCodeSchema = z.object({
  code: z
    .string()
    .length(6)
    .regex(/^[A-Z0-9]+$/),
  value: z
    .number()
    .gt(0, { message: "Discount must be greater than 0" })
    .max(100, { message: "Discount cannot exceed 100%" }),
  startDate: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
    message: "Invalid end date",
  }),
  isActive: z.boolean().optional(),
  productIds: z.array(z.number().int().positive()).optional(),
}).refine(
  (data) =>
    Date.parse(data.endDate) >= Date.parse(data.startDate),
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

const updateDiscountCodeSchema = z.object({
  code: z
    .string()
    .length(6)
    .regex(/^[A-Z0-9]+$/)
    .optional(),
  value: z
    .number()
    .gt(0, { message: "Discount must be greater than 0" })
    .max(100, { message: "Discount cannot exceed 100%" })
    .optional(),
  startDate: z
    .string()
    .refine((date) => !Number.isNaN(Date.parse(date)), {
      message: "Invalid start date",
    })
    .optional(),
  endDate: z
    .string()
    .refine((date) => !Number.isNaN(Date.parse(date)), {
      message: "Invalid end date",
    })
    .optional(),
  isActive: z.boolean().optional(),
  productIds: z.array(z.number().int().positive()).optional(),
}).refine(
  (data: any) =>
    !data.startDate ||
    !data.endDate ||
    Date.parse(data.endDate) >= Date.parse(data.startDate),
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

async function withAdminAuth(request: NextRequest) {
  const authError = await adminAuthMiddleware(request);
  if (authError) {
    return { response: authError, supabase: null };
  }

  const supabase = await createClient();
  return { response: null, supabase };
}

function mapDbToDiscountCode(row: any) {
  return {
    id: row.id,
    code: row.code,
    value: Number(row.value),
    startDate: row.start_date,
    endDate: row.end_date,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    productIds: row.discount_code_products?.map((item: any) => item.product_id) ?? [],
  };
}

export async function GET(request: NextRequest) {
  try {
    const { response, supabase } = await withAdminAuth(request);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const page = Math.max(Number.parseInt(searchParams.get("page") ?? "1", 10), 1);
    const limit = Math.min(
      Math.max(Number.parseInt(searchParams.get("limit") ?? "20", 10), 1),
      100
    );
    const offset = (page - 1) * limit;

    const statusFilter = searchParams.get("status");
    const activeFilter =
      statusFilter === "active"
        ? true
        : statusFilter === "inactive"
          ? false
          : undefined;

    let query = supabase
      .from("discount_codes")
      .select(
        `*, discount_code_products (product_id)`
      )
      .order("created_at", { ascending: false });

    if (activeFilter !== undefined) {
      query = query.eq("is_active", activeFilter);
    }

    const search = searchParams.get("search");
    if (search) {
      query = query.ilike("code", `%${search}%`);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);
    if (error) {
      return NextResponse.json({ error: "Failed to fetch discount codes" }, { status: 500 });
    }

    let countQuery = supabase
      .from("discount_codes")
      .select("id", { head: true, count: "exact" });

    if (activeFilter !== undefined) {
      countQuery = countQuery.eq("is_active", activeFilter);
    }

    if (search) {
      countQuery = countQuery.ilike("code", `%${search}%`);
    }

    const { count } = await countQuery;

    return NextResponse.json({
      data: data?.map(mapDbToDiscountCode) ?? [],
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { response, supabase } = await withAdminAuth(request);
    if (response) return response;

    const body = await request.json();
    const result = discountCodeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        error: "Validation failed",
        details: result.error.flatten(),
      }, { status: 400 });
    }

    const { code, value, startDate, endDate, isActive = true, productIds = [] } = result.data;

    const existingCode = await supabase
      .from("discount_codes")
      .select("id")
      .eq("code", code)
      .maybeSingle();

    if (existingCode.data) {
      return NextResponse.json({ error: "Discount code already exists" }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("discount_codes")
      .insert({
        code,
        value,
        start_date: startDate,
        end_date: endDate,
        is_active: isActive,
      })
      .select("*, discount_code_products (product_id)")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Failed to create discount code" }, { status: 500 });
    }

    if (productIds.length > 0) {
      const { error: linkError } = await supabase
        .from("discount_code_products")
        .insert(productIds.map((productId) => ({
          discount_code_id: data.id,
          product_id: productId,
        })));

      if (linkError) {
        await supabase.from("discount_codes").delete().eq("id", data.id);
        return NextResponse.json({ error: "Failed to link products" }, { status: 500 });
      }
    }

    const { data: created } = await supabase
      .from("discount_codes")
      .select("*, discount_code_products (product_id)")
      .eq("id", data.id)
      .single();

    return NextResponse.json({ data: mapDbToDiscountCode(created) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { response, supabase } = await withAdminAuth(request);
    if (response) return response;

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Discount code id is required" }, { status: 400 });
    }

    const result = updateDiscountCodeSchema.safeParse(updates);

    if (!result.success) {
      return NextResponse.json({
        error: "Validation failed",
        details: result.error.flatten(),
      }, { status: 400 });
    }

    const record = await supabase
      .from("discount_codes")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!record.data) {
      return NextResponse.json({ error: "Discount code not found" }, { status: 404 });
    }

    const payload: Record<string, unknown> = {};
    if (result.data.code !== undefined) payload.code = result.data.code;
    if (result.data.value !== undefined) payload.value = result.data.value;
    if (result.data.startDate !== undefined) payload.start_date = result.data.startDate;
    if (result.data.endDate !== undefined) payload.end_date = result.data.endDate;
    if (result.data.isActive !== undefined) payload.is_active = result.data.isActive;
    payload.updated_at = new Date().toISOString();

    if (Object.keys(payload).length > 1 || payload.code) {
      const { error } = await supabase
        .from("discount_codes")
        .update(payload)
        .eq("id", id);

      if (error) {
        return NextResponse.json({ error: "Failed to update discount code" }, { status: 500 });
      }
    }

    if (result.data.productIds) {
      const { error: deleteError } = await supabase
        .from("discount_code_products")
        .delete()
        .eq("discount_code_id", id);

      if (deleteError) {
        return NextResponse.json({ error: "Failed to update linked products" }, { status: 500 });
      }

      if (result.data.productIds.length > 0) {
        const { error: insertError } = await supabase
          .from("discount_code_products")
          .insert(result.data.productIds.map((productId) => ({
            discount_code_id: id,
            product_id: productId,
          })));

        if (insertError) {
          return NextResponse.json({ error: "Failed to update linked products" }, { status: 500 });
        }
      }
    }

    const { data: updated, error: fetchError } = await supabase
      .from("discount_codes")
      .select("*, discount_code_products (product_id)")
      .eq("id", id)
      .single();

    if (fetchError || !updated) {
      return NextResponse.json({ error: "Failed to fetch updated discount code" }, { status: 500 });
    }

    return NextResponse.json({ data: mapDbToDiscountCode(updated) });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { response, supabase } = await withAdminAuth(request);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Discount code id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("discount_codes")
      .delete()
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to delete discount code" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Discount code not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

