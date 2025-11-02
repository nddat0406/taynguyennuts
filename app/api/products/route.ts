import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

function mapDbToProduct(row: any) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    inStock: row.inStock,
    weight: row.weight,
    category: row.category
      ? { id: row.category.id, name: row.category.name }
      : null,
    category_id: row.category_id,
    description: row.description,
    benefits: row.benefits,
    ingredients: row.ingredients,
    expiration: row.expiration,
    manufactured_at: row.manufactured_at,
    packaged_at: row.packaged_at,
    storage_instructions: row.storage_instructions,
    usage_instructions: row.usage_instructions,
    created_at: row.created_at,
    product_images: (row.product_images || []).map((img: any) => ({
      id: img.id,
      url: img.url,
      isMainImage: img.isMainImage || false,
    })),
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search");
    const categoryId = searchParams.get("category_id");

    let query = supabase
      .from("products")
      .select(
        `*, category:category_id (id, name), product_images (id, url, isMainImage)`
      )
      .neq("inStock", 0)
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (categoryId && categoryId !== "all") {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data?.map(mapDbToProduct) ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

