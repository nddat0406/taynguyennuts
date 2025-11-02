"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/utils/utils";
import { useAuth } from "@/contexts/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Plus,
  RefreshCcw,
  Trash2,
  Edit2,
  X,
  Star,
  Upload,
} from "lucide-react";
import { Category } from "@/types";
import { z } from "zod";
import { AdminNav } from "@/components/admin/admin-nav";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/utils/utils";

type ProductFormValues = {
  name: string;
  price: string;
  inStock: number;
  weight: number;
  category_id: number | null;
  description: string;
  benefits: string;
  ingredients: string;
  expiration: string;
  manufactured_at: string;
  packaged_at: string;
  storage_instructions: string;
  usage_instructions: string;
};

const formSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  price: z.string().refine((val) => {
    const num = Number.parseFloat(val);
    return !Number.isNaN(num) && num >= 0;
  }, "Giá phải là số hợp lệ"),
  inStock: z.number().int().min(0, "Số lượng tồn kho phải >= 0"),
  weight: z.number().min(0, "Trọng lượng phải >= 0"),
  category_id: z.number().int().positive().nullable(),
  description: z.string().optional(),
  benefits: z.string().optional(),
  ingredients: z.string().optional(),
  expiration: z.string().optional(),
  manufactured_at: z.string().optional(),
  packaged_at: z.string().optional(),
  storage_instructions: z.string().optional(),
  usage_instructions: z.string().optional(),
});

interface Product {
  id: number;
  name: string;
  price: string;
  inStock: number;
  weight: number;
  category: Category | null;
  category_id: number | null;
  description: string | null;
  benefits: string | null;
  ingredients: string | null;
  expiration: string | null;
  manufactured_at: string | null;
  packaged_at: string | null;
  storage_instructions: string | null;
  usage_instructions: string | null;
  created_at: string;
  product_images: Array<{ url: string; isMainImage: boolean }>;
}

interface ApiListResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const DEFAULT_LIMIT = 10;

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 1,
  });
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    mode: "create" | "edit";
    editingId?: number;
  }>({ open: false, mode: "create" });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [productImages, setProductImages] = useState<
    Array<{ id?: number; url: string; isMainImage: boolean }>
  >([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [originalImages, setOriginalImages] = useState<
    Array<{ id?: number; url: string; isMainImage: boolean }>
  >([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
      inStock: 0,
      weight: 0,
      category_id: null,
      description: "",
      benefits: "",
      ingredients: "",
      expiration: "",
      manufactured_at: "",
      packaged_at: "",
      storage_instructions: "",
      usage_instructions: "",
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, pagination.limit, categoryFilter, stockFilter, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (categoryFilter) params.set("category_id", categoryFilter);
      if (stockFilter) params.set("stock", stockFilter);
      if (search) params.set("search", search);

      const response = await fetch(`/api/admin/products?${params}`);
      const json: ApiListResponse<Product> = await response.json();

      if (!response.ok) {
        throw new Error(
          json?.data ? "" : (json as any)?.error || "Không thể tải sản phẩm"
        );
      }

      setProducts(json.data ?? []);

      if (json.pagination) {
        setPagination((prev) => ({
          ...prev,
          total: json.pagination?.total ?? 0,
          totalPages: json.pagination?.totalPages ?? 1,
        }));
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const supabase = await import("@/utils/supabase/client").then((m) =>
        m.createClient()
      );
      const { data, error } = await supabase
        .from("category")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setCategories(data ?? []);
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  };

  const resetForm = () => {
    form.reset({
      name: "",
      price: "",
      inStock: 0,
      weight: 0,
      category_id: null,
      description: "",
      benefits: "",
      ingredients: "",
      expiration: "",
      manufactured_at: "",
      packaged_at: "",
      storage_instructions: "",
      usage_instructions: "",
    });
    setProductImages([]);
    setOriginalImages([]);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogState({ open: true, mode: "create" });
  };

  const openEditDialog = (product: Product) => {
    form.reset({
      name: product.name,
      price: product.price || "",
      inStock: product.inStock,
      weight: product.weight,
      category_id: product.category_id,
      description: product.description || "",
      benefits: product.benefits || "",
      ingredients: product.ingredients || "",
      expiration: product.expiration || "",
      manufactured_at: product.manufactured_at || "",
      packaged_at: product.packaged_at || "",
      storage_instructions: product.storage_instructions || "",
      usage_instructions: product.usage_instructions || "",
    });
    const images = product.product_images.map((img: any) => ({
      id: img.id,
      url: img.url,
      isMainImage: img.isMainImage || false,
    }));
    setProductImages(images);
    setOriginalImages(images);
    setDialogState({ open: true, mode: "edit", editingId: product.id });
  };

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
    resetForm();
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/products/upload-image", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.error || "Không thể tải hình ảnh lên");
      }

      const newImage = {
        url: json.url,
        isMainImage: productImages.length === 0,
      };

      setProductImages((prev) => [...prev, newImage]);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(
        err instanceof Error ? err.message : "Không thể tải hình ảnh lên"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageDelete = async (index: number, imageId?: number) => {
    if (imageId && dialogState.editingId) {
      try {
        const response = await fetch(
          `/api/admin/products/${imageId}/images?productId=${dialogState.editingId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Không thể xóa hình ảnh");
        }

        setOriginalImages((prev) =>
          prev.filter((img) => img.id !== imageId)
        );
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Không thể xóa hình ảnh");
        return;
      }
    }

    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetMainImage = async (index: number, imageId?: number) => {
    if (imageId && dialogState.editingId) {
      try {
        const response = await fetch(`/api/admin/products/${imageId}/images`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isMainImage: true,
            productId: dialogState.editingId,
          }),
        });

        if (!response.ok) {
          throw new Error("Không thể đặt hình ảnh chính");
        }
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Không thể đặt hình ảnh chính"
        );
        return;
      }
    }

    setProductImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isMainImage: i === index,
      }))
    );
  };

  const handleSubmit = async (values: ProductFormValues) => {
    const payload = {
      ...values,
      category_id: values.category_id || null,
    };

    setSubmitting(true);
    try {
      const requestBody =
        dialogState.mode === "edit"
          ? {
              id: dialogState.editingId,
              ...payload,
              images: productImages.map((img) => ({
                id: img.id,
                url: img.url,
                isMainImage: img.isMainImage,
              })),
            }
          : payload;

      const response = await fetch(`/api/admin/products`, {
        method: dialogState.mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.error || "Không thể lưu sản phẩm");
      }

      if (dialogState.mode === "create" && productImages.length > 0) {
        const productId = json.data.id;
        for (const image of productImages) {
          await fetch(`/api/admin/products/${productId}/images`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: image.url,
              isMainImage: image.isMainImage,
            }),
          });
        }
      }

      if (dialogState.mode === "create") {
        setProducts((prev) => [json.data, ...prev]);
      } else {
        setProducts((prev) =>
          prev.map((item) => (item.id === json.data.id ? json.data : item))
        );
      }

      closeDialog();
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Không thể lưu sản phẩm");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json?.error || "Không thể xóa sản phẩm");
      }

      setProducts((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Không thể xóa sản phẩm");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="mt-4 text-gray-600">Đang tải danh sách sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="flex items-center justify-center pt-20">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Lỗi truy cập</CardTitle>
              <CardDescription className="text-center">{error}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={fetchProducts}>Thử lại</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <div className="space-x-2">
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4" />
              Thêm mới
            </Button>
            <Button
              variant="outline"
              onClick={fetchProducts}
              disabled={loading}
              size="icon"
            >
              <RefreshCcw
                className={cn("w-4 h-4", loading && "animate-spin")}
              />
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Tìm kiếm</Label>
              <Input
                id="search"
                type="text"
                placeholder="Tên sản phẩm"
                value={search}
                onChange={(e) => {
                  handleSearchChange(e.target.value);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-filter">Danh mục</Label>
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger id="category-filter" className="w-full">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock-filter">Tồn kho</Label>
              <Select
                value={stockFilter}
                onValueChange={(value) => {
                  setStockFilter(value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger id="stock-filter" className="w-full">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="in_stock">Còn hàng</SelectItem>
                    <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Hình ảnh</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead className="hidden sm:table-cell">Giá</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Tồn kho
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Danh mục
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Ngày tạo
                  </TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10 text-gray-500"
                    >
                      Không có sản phẩm nào
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => {
                    const mainImage =
                      product.product_images.find((img) => img.isMainImage) ||
                      product.product_images[0];

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          {mainImage ? (
                            <img
                              src={mainImage.url}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {product.name}
                          </div>
                          {product.inStock === 0 && (
                            <Badge
                              variant="destructive"
                              className="mt-1 text-xs"
                            >
                              Hết hàng
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="text-sm font-medium">
                            {formatPrice(Number(product.price || 0))}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm">{product.inStock}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {product.category?.name || "Chưa phân loại"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {format(new Date(product.created_at), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(product)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(product.id)}
                              disabled={deletingId === product.id}
                            >
                              {deletingId === product.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>

          {pagination.totalPages > 1 && (
            <CardContent className="border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  trong tổng số {pagination.total} sản phẩm
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      handlePageChange(Math.max(1, pagination.page - 1))
                    }
                    disabled={pagination.page === 1}
                  >
                    Trước
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.page >=
                          pagination.totalPages - 2
                        ) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={
                              pageNum === pagination.page
                                ? "default"
                                : "outline"
                            }
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() =>
                      handlePageChange(
                        Math.min(pagination.totalPages, pagination.page + 1)
                      )
                    }
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </CardContent>
          )}

          {products.length === 0 && !loading && (
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground text-4xl mb-4">📦</div>
              <CardTitle className="mb-2">Chưa có sản phẩm nào</CardTitle>
              <CardDescription>
                Tạo sản phẩm mới để bắt đầu quản lý.
              </CardDescription>
            </CardContent>
          )}
        </Card>
      </div>

      <Dialog
        open={dialogState.open}
        onOpenChange={(open) => (open ? undefined : closeDialog())}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogState.mode === "create"
                ? "Thêm sản phẩm"
                : "Chỉnh sửa sản phẩm"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="space-y-2">
                <Label>Hình ảnh sản phẩm</Label>
                <div className="border rounded-md p-4">
                  <div className="flex flex-wrap gap-4 mb-4">
                    {productImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group w-32 h-32 border rounded-md overflow-hidden"
                      >
                        <img
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {image.isMainImage && (
                          <div className="absolute top-1 left-1">
                            <Badge className="bg-amber-600 text-white text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Chính
                            </Badge>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-white hover:text-white hover:bg-white/20"
                            onClick={() => handleSetMainImage(index, image.id)}
                            disabled={image.isMainImage}
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-white/20"
                            onClick={() => handleImageDelete(index, image.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingImage ? "Đang tải..." : "Thêm hình ảnh"}
                    </Label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file);
                        }
                      }}
                      disabled={uploadingImage}
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên sản phẩm *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nhập tên sản phẩm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục</FormLabel>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) =>
                          field.onChange(value ? Number(value) : null)
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá (VND) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="1000"
                          {...field}
                          placeholder="0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="inStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng tồn kho *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trọng lượng (gram) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Mô tả sản phẩm"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lợi ích</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Lợi ích của sản phẩm"
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thành phần</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Thành phần sản phẩm"
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="expiration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hạn sử dụng</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="12 tháng" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="manufactured_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sản xuất tại</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Thác Đắk Bút So - Thôn 8 - Tuy Đức - Lâm Đồng - Việt Nam"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="packaged_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nơi đóng gói</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Hòa Lạc - Hà Nội - Việt Nam"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="storage_instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hướng dẫn bảo quản</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Hướng dẫn bảo quản sản phẩm"
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usage_instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hướng dẫn sử dụng</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Hướng dẫn sử dụng sản phẩm"
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                  disabled={submitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {dialogState.mode === "create"
                    ? "Tạo sản phẩm"
                    : "Lưu thay đổi"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
