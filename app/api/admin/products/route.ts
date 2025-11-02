import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { adminAuthMiddleware } from "@/utils/admin-auth";

const productSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  price: z.string().refine((val) => {
    const num = Number.parseFloat(val);
    return !Number.isNaN(num) && num >= 0;
  }, "Giá phải là số hợp lệ"),
  inStock: z.number().int().min(0, "Số lượng tồn kho phải >= 0"),
  weight: z.number().min(0, "Trọng lượng phải >= 0"),
  category_id: z.number().int().positive().nullable().optional(),
  description: z.string().nullable().optional(),
  benefits: z.string().nullable().optional(),
  ingredients: z.string().nullable().optional(),
  expiration: z.string().nullable().optional(),
  manufactured_at: z.string().nullable().optional(),
  packaged_at: z.string().nullable().optional(),
  storage_instructions: z.string().nullable().optional(),
  usage_instructions: z.string().nullable().optional(),
});

const updateProductSchema = productSchema.partial();

async function withAdminAuth(request: NextRequest) {
  const authError = await adminAuthMiddleware(request);
  if (authError) {
    return { response: authError, supabase: null };
  }

  const supabase = await createClient();
  return { response: null, supabase };
}

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
    const { response, supabase } = await withAdminAuth(request);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const page = Math.max(Number.parseInt(searchParams.get("page") ?? "1", 10), 1);
    const limit = Math.min(
      Math.max(Number.parseInt(searchParams.get("limit") ?? "10", 10), 1),
      100
    );
    const offset = (page - 1) * limit;

    const search = searchParams.get("search");
    const categoryFilter = searchParams.get("category_id");
    const stockFilter = searchParams.get("stock");

    let query = supabase
      .from("products")
      .select(
        `*, category:category_id (id, name), product_images (id, url, isMainImage)`
      )
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (categoryFilter) {
      query = query.eq("category_id", categoryFilter);
    }

    if (stockFilter === "in_stock") {
      query = query.gt("inStock", 0);
    } else if (stockFilter === "out_of_stock") {
      query = query.eq("inStock", 0);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    let countQuery = supabase
      .from("products")
      .select("id", { head: true, count: "exact" });

    if (search) {
      countQuery = countQuery.ilike("name", `%${search}%`);
    }

    if (categoryFilter) {
      countQuery = countQuery.eq("category_id", categoryFilter);
    }

    if (stockFilter === "in_stock") {
      countQuery = countQuery.gt("inStock", 0);
    } else if (stockFilter === "out_of_stock") {
      countQuery = countQuery.eq("inStock", 0);
    }

    const { count } = await countQuery;

    return NextResponse.json({
      data: data?.map(mapDbToProduct) ?? [],
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { response, supabase } = await withAdminAuth(request);
    if (response) return response;

    const body = await request.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      name,
      price,
      inStock,
      weight,
      category_id,
      description,
      benefits,
      ingredients,
      expiration,
      manufactured_at,
      packaged_at,
      storage_instructions,
      usage_instructions,
    } = result.data;

    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        price,
        inStock,
        weight,
        category_id,
        description,
        benefits,
        ingredients,
        expiration,
        manufactured_at,
        packaged_at,
        storage_instructions,
        usage_instructions,
      })
      .select(
        `*, category:category_id (id, name), product_images (id, url, isMainImage)`
      )
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: mapDbToProduct(data) },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { response, supabase } = await withAdminAuth(request);
    if (response) return response;

    const body = await request.json();
    const { id, images, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product id is required" },
        { status: 400 }
      );
    }

    const result = updateProductSchema.safeParse(updates);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const existing = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!existing.data) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const payload: Record<string, unknown> = {};
    if (result.data.name !== undefined) payload.name = result.data.name;
    if (result.data.price !== undefined) payload.price = result.data.price;
    if (result.data.inStock !== undefined) payload.inStock = result.data.inStock;
    if (result.data.weight !== undefined) payload.weight = result.data.weight;
    if (result.data.category_id !== undefined)
      payload.category_id = result.data.category_id;
    if (result.data.description !== undefined)
      payload.description = result.data.description;
    if (result.data.benefits !== undefined)
      payload.benefits = result.data.benefits;
    if (result.data.ingredients !== undefined)
      payload.ingredients = result.data.ingredients;
    if (result.data.expiration !== undefined)
      payload.expiration = result.data.expiration;
    if (result.data.manufactured_at !== undefined)
      payload.manufactured_at = result.data.manufactured_at;
    if (result.data.packaged_at !== undefined)
      payload.packaged_at = result.data.packaged_at;
    if (result.data.storage_instructions !== undefined)
      payload.storage_instructions = result.data.storage_instructions;
    if (result.data.usage_instructions !== undefined)
      payload.usage_instructions = result.data.usage_instructions;

    if (Object.keys(payload).length === 0 && !images) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    if (Object.keys(payload).length > 0) {
      const { error: updateError } = await supabase
        .from("products")
        .update(payload)
        .eq("id", id);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update product" },
          { status: 500 }
        );
      }
    }

    if (images && Array.isArray(images)) {
      const { data: currentImages } = await supabase
        .from("product_images")
        .select("id")
        .eq("product_id", id);

      const currentImageIds = new Set(
        (currentImages || []).map((img) => img.id)
      );
      const newImageIds = new Set(
        images
          .filter((img: any) => img.id)
          .map((img: any) => img.id)
      );

      const imagesToDelete = (currentImages || []).filter(
        (img) => !newImageIds.has(img.id)
      );

      for (const imageToDelete of imagesToDelete) {
        await supabase
          .from("product_images")
          .delete()
          .eq("id", imageToDelete.id)
          .eq("product_id", id);
      }

      for (const image of images) {
        if (image.id && currentImageIds.has(image.id)) {
          const { error: updateError } = await supabase
            .from("product_images")
            .update({ isMainImage: image.isMainImage || false })
            .eq("id", image.id)
            .eq("product_id", id);

          if (updateError) {
            console.error("Error updating image:", updateError);
          }

          if (image.isMainImage) {
            await supabase
              .from("product_images")
              .update({ isMainImage: false })
              .eq("product_id", id)
              .neq("id", image.id);
          }
        } else if (!image.id && image.url) {
          if (image.isMainImage) {
            await supabase
              .from("product_images")
              .update({ isMainImage: false })
              .eq("product_id", id);
          }

          await supabase.from("product_images").insert({
            product_id: id,
            url: image.url,
            isMainImage: image.isMainImage || false,
          });
        }
      }
    }

    const { data: updated, error: fetchError } = await supabase
      .from("products")
      .select(
        `*, category:category_id (id, name), product_images (id, url, isMainImage)`
      )
      .eq("id", id)
      .single();

    if (fetchError || !updated) {
      return NextResponse.json(
        { error: "Failed to fetch updated product" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: mapDbToProduct(updated) });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { response, supabase } = await withAdminAuth(request);
    if (response) return response;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product id is required" },
        { status: 400 }
      );
    }

    const productId = Number.parseInt(id, 10);

    if (Number.isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product id" },
        { status: 400 }
      );
    }

    const { error: deleteImagesError } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", productId);

    if (deleteImagesError) {
      return NextResponse.json(
        { error: "Failed to delete product images" },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId)
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete product" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
