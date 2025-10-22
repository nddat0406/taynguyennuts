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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/utils/utils";
import { useAuth } from "@/contexts/auth-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Plus,
  RefreshCcw,
  Trash2,
  Sparkles,
  Search,
} from "lucide-react";
import { DiscountCode } from "@/types";
import { z } from "zod";
import { AdminNav } from "@/components/admin/admin-nav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

function generateDiscountCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

type DiscountCodeFormValues = {
  code: string;
  value: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  productIds: number[];
};

const formSchema = z
  .object({
    code: z
      .string()
      .length(6, "Mã gồm 6 ký tự")
      .regex(/^[A-Z0-9]+$/, "Chỉ dùng chữ hoa và số"),
    value: z
      .number({ invalid_type_error: "Nhập % giảm giá" })
      .gt(0, "Giảm giá phải lớn hơn 0")
      .max(100, "Giảm giá tối đa 100%"),
    startDate: z.date({ required_error: "Chọn ngày bắt đầu" }),
    endDate: z.date({ required_error: "Chọn ngày kết thúc" }),
    isActive: z.boolean(),
    productIds: z.array(z.number()),
  })
  .refine((values) => values.endDate >= values.startDate, {
    message: "Ngày kết thúc phải sau ngày bắt đầu",
    path: ["endDate"],
  });

interface ProductOption {
  id: number;
  name: string;
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

export default function DiscountCodesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 1,
  });
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    mode: "create" | "edit";
    editingId?: string;
  }>({ open: false, mode: "create" });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const form = useForm<DiscountCodeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      value: 10,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      productIds: [],
    },
  });

  const formattedCodes = useMemo(
    () =>
      codes.map((code) => ({
        ...code,
        remainingDays:
          Math.ceil(
            (new Date(code.endDate).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24)
          ) || 0,
      })),
    [codes]
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, statusFilter]);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("search", search);

      const response = await fetch(`/api/admin/discount-codes?${params}`);
      const json: ApiListResponse<DiscountCode> = await response.json();

      if (!response.ok) {
        throw new Error(
          json?.data ? "" : (json as any)?.error || "Không thể tải mã giảm giá"
        );
      }

      setCodes(json.data ?? []);

      if (json.pagination) {
        setPagination((prev) => ({
          ...prev,
          total: json.pagination?.total ?? 0,
          totalPages: json.pagination?.totalPages ?? 1,
        }));
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Không thể tải mã giảm giá"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products`);
      const json: ApiListResponse<ProductOption> = await response.json();

      if (!response.ok) {
        throw new Error(
          json?.data ? "" : (json as any)?.error || "Không thể tải sản phẩm"
        );
      }

      setProducts(json.data ?? []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  };

  const resetForm = () => {
    form.reset({
      code: generateDiscountCode(),
      value: 10,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      productIds: [],
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogState({ open: true, mode: "create" });
  };

  const regenerateCode = () => {
    form.setValue("code", generateDiscountCode());
  };

  const openEditDialog = (code: DiscountCode) => {
    const start = new Date(code.startDate);
    const end = new Date(code.endDate);
    form.reset({
      code: code.code,
      value: code.value,
      startDate: start,
      endDate: end,
      isActive: code.isActive,
      productIds: code.productIds,
    });
    setDialogState({ open: true, mode: "edit", editingId: code.id });
  };

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
    resetForm();
  };

  const handleSubmit = async (values: DiscountCodeFormValues) => {
    const payload = {
      code: values.code,
      value: values.value,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      isActive: values.isActive,
      productIds: values.productIds,
    };

    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/admin/discount-codes${dialogState.mode === "edit" ? "" : ""}`,
        {
          method: dialogState.mode === "edit" ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            dialogState.mode === "edit"
              ? { id: dialogState.editingId, ...payload }
              : payload
          ),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.error || "Không thể lưu mã giảm giá");
      }

      if (dialogState.mode === "create") {
        setCodes((prev) => [json.data, ...prev]);
      } else {
        setCodes((prev) =>
          prev.map((item) => (item.id === json.data.id ? json.data : item))
        );
      }

      closeDialog();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Không thể lưu mã giảm giá"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa mã giảm giá này?")) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/discount-codes?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const json = await response.json();
        throw new Error(json?.error || "Không thể xóa mã giảm giá");
      }

      setCodes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Không thể xóa mã giảm giá"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatusFilter = (value: string) => {
    setStatusFilter((prev) => (prev === value ? "" : value));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const applySearch = () => {
    fetchCodes();
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const selectedProductNames = (ids: number[]) => {
    if (ids.length === 0) {
      return "Tất cả sản phẩm";
    }
    return (
      ids
        .map((id) => products.find((p) => p.id === id)?.name)
        .filter(Boolean)
        .join(", ") || "Tất cả sản phẩm"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Quản lý mã giảm giá
              </CardTitle>
              <CardDescription className="text-gray-600">
                Xin chào {user?.email}.
              </CardDescription>
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  onClick={fetchCodes}
                  disabled={loading}
                >
                  <RefreshCcw
                    className={cn("w-4 h-4", loading && "animate-spin")}
                  />
                </Button>
                <Button onClick={openCreateDialog}>
                  <Plus className="w-4 h-4" />
                  Thêm mới
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="w-[240px]">
                  <Label htmlFor="search">Tìm kiếm mã</Label>
                  <Input
                    id="search"
                    placeholder="Nhập mã giảm giá"
                    value={search}
                    onChange={(e) => {
                      handleSearchChange(e.target.value.toUpperCase());
                      fetchCodes();
                    }}
                    className="mt-2"
                    maxLength={6}
                  />
                </div>
                <div>
                  <Label>Trạng thái</Label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value)}
                  >
                    <SelectTrigger className="w-[200px] mt-2">
                      <SelectValue placeholder="Tất cả" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Đang hoạt động</SelectItem>
                      <SelectItem value="inactive">Đã tắt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="border rounded-lg overflow-hidden bg-white">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã giảm giá</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Phần trăm
                      </TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Sản phẩm áp dụng
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Ngày tạo
                      </TableHead>
                      <TableHead>Trạng thái</TableHead>
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
                    ) : codes.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-10 text-gray-500"
                        >
                          Không có mã giảm giá nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      formattedCodes.map((code) => (
                        <TableRow key={code.id}>
                          <TableCell>
                            <div className="font-semibold text-gray-900">
                              {code.code}
                            </div>
                            <div className="text-xs text-gray-500">
                              Còn {code.remainingDays} ngày
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className="font-medium text-gray-900">
                              {code.value}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs text-gray-600">
                              {format(new Date(code.startDate), "dd/MM/yyyy", {
                                locale: vi,
                              })}{" "}
                              -
                              <br />
                              {format(new Date(code.endDate), "dd/MM/yyyy", {
                                locale: vi,
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell max-w-[200px] whitespace-normal text-xs text-gray-600">
                            {selectedProductNames(code.productIds)}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-xs text-gray-600">
                            {format(
                              new Date(code.createdAt),
                              "dd/MM/yyyy HH:mm",
                              { locale: vi }
                            )}
                          </TableCell>
                          <TableCell>
                            <div
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                                code.isActive
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-gray-100 text-gray-600"
                              )}
                            >
                              {code.isActive ? "Đang hoạt động" : "Đã tắt"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(code)}
                              >
                                Sửa
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleDelete(code.id)}
                                disabled={deletingId === code.id}
                              >
                                {deletingId === code.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    trên {pagination.total}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(Math.max(1, pagination.page - 1))
                      }
                      disabled={pagination.page === 1}
                    >
                      Trước
                    </Button>
                    <div className="flex items-center gap-1">
                      <span>Trang</span>
                      <strong>{pagination.page}</strong>
                      <span>/ {pagination.totalPages}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={dialogState.open}
        onOpenChange={(open) => (open ? undefined : closeDialog())}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogState.mode === "create"
                ? "Thêm mã giảm giá"
                : "Chỉnh sửa mã giảm giá"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã giảm giá</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value.toUpperCase()}
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                            placeholder="VD: SAVE10"
                            maxLength={6}
                            disabled={dialogState.mode === "edit"}
                          />
                        </FormControl>
                        {dialogState.mode === "create" && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={regenerateCode}
                            title="Tạo mã mới"
                          >
                            <Sparkles className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>% giảm giá</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          step="0.5"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              type="button"
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", {
                                  locale: vi,
                                })
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) =>
                              field.onChange(date ?? new Date())
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày kết thúc</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              type="button"
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", {
                                  locale: vi,
                                })
                              ) : (
                                <span>Chọn ngày</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) =>
                              field.onChange(date ?? new Date())
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="productIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Áp dụng cho sản phẩm (tùy chọn)</FormLabel>
                    <p className="text-xs text-gray-500 mb-2">
                      Không chọn sản phẩm nào = áp dụng cho tất cả sản phẩm
                    </p>
                    <div className="grid gap-2 max-h-48 overflow-y-auto rounded-md border p-3">
                      {products.length === 0 && (
                        <div className="text-sm text-gray-500">
                          Không có sản phẩm nào.
                        </div>
                      )}
                      {products.map((product) => {
                        const checked = field.value.includes(product.id);
                        return (
                          <label
                            key={product.id}
                            className="flex items-center gap-3 rounded-md border border-transparent px-2 py-1 text-sm hover:bg-gray-50"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, product.id]);
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (id) => id !== product.id
                                    )
                                  );
                                }
                              }}
                            />
                            <span>{product.name}</span>
                          </label>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Trạng thái hoạt động
                      </FormLabel>
                      <p className="text-sm text-gray-500">
                        Bỏ chọn để tạm thời vô hiệu hóa mã giảm giá
                      </p>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(Boolean(checked))
                        }
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
                  {dialogState.mode === "create" ? "Tạo mã" : "Lưu thay đổi"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
