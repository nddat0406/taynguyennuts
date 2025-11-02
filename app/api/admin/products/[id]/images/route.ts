import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { adminAuthMiddleware } from "@/utils/admin-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await adminAuthMiddleware(request);
    if (authError) return authError;

    const { id } = await params;
    const productId = Number.parseInt(id, 10);

    if (Number.isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { url, isMainImage = false } = body;

    if (!url) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    if (isMainImage) {
      await supabase
        .from("product_images")
        .update({ isMainImage: false })
        .eq("product_id", productId);
    }

    const { data, error } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        url,
        isMainImage,
      })
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Failed to add image" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await adminAuthMiddleware(request);
    if (authError) return authError;

    const { id } = await params;
    const imageId = Number.parseInt(id, 10);

    if (Number.isNaN(imageId)) {
      return NextResponse.json(
        { error: "Invalid image ID" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId)
      .eq("product_id", Number.parseInt(productId, 10));

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete image" },
        { status: 500 }
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await adminAuthMiddleware(request);
    if (authError) return authError;

    const { id } = await params;
    const imageId = Number.parseInt(id, 10);

    if (Number.isNaN(imageId)) {
      return NextResponse.json(
        { error: "Invalid image ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { isMainImage, productId } = body;

    if (isMainImage === undefined || !productId) {
      return NextResponse.json(
        { error: "isMainImage and productId are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    if (isMainImage) {
      await supabase
        .from("product_images")
        .update({ isMainImage: false })
        .eq("product_id", productId)
        .neq("id", imageId);
    }

    const { data, error } = await supabase
      .from("product_images")
      .update({ isMainImage })
      .eq("id", imageId)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Failed to update image" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
