"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Loader2, Edit2 } from "lucide-react";
import {
  ORDER_STATUS_OPTIONS,
  OrderStatus,
  orderStatusMap,
  PAYMENT_STATUS_OPTIONS,
  PaymentStatus,
  paymentStatusMap,
} from "@/utils/constants";
import { AdminNav } from "@/components/admin/admin-nav";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";

interface OrderItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string | null;
  };
}

interface Order {
  id: number;
  payment_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  province: string;
  ward: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  order_status: string;
  payment_status: string;
  note: string | null;
  created_at: string;
  items: OrderItem[];
  discount_code: {
    id: string;
    code: string;
    value: number;
  } | null;
  discount_amount: number;
  original_total: number | null;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    orderId: number | null;
    type: "status" | "payment" | null;
    currentStatus: string;
  }>({
    isOpen: false,
    orderId: null,
    type: null,
    currentStatus: "",
  });
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    fetchOrders();
  }, [pagination.currentPage, search, orderStatusFilter, paymentStatusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(orderStatusFilter && { order_status: orderStatusFilter }),
        ...(paymentStatusFilter && { payment_status: paymentStatusFilter }),
      });

      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch orders");
      }

      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleOrderStatusFilter = (status: string) => {
    setOrderStatusFilter(status);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePaymentStatusFilter = (status: string) => {
    setPaymentStatusFilter(status);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setSearch("");
    setOrderStatusFilter("");
    setPaymentStatusFilter("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const isFinalOrderStatus = (status: string) => {
    return status === "delivered" || status === "cancelled";
  };

  const isFinalPaymentStatus = (status: string) => {
    return status === "paid" || status === "failed";
  };

  const openEditModal = (
    orderId: number,
    type: "status" | "payment",
    currentStatus: string
  ) => {
    setEditModal({
      isOpen: true,
      orderId,
      type,
      currentStatus,
    });
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      orderId: null,
      type: null,
      currentStatus: "",
    });
  };

  const updateOrderStatus = async (
    orderId: number,
    status: string,
    paymentStatus?: string
  ) => {
    try {
      setUpdating(orderId);

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status,
          paymentStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update order");
      }

      // Update local state with data from API response
      if (data.order) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  order_status: data.order.order_status,
                  payment_status: data.order.payment_status,
                  shipping_fee: data.order.shipping_fee,
                  total: data.order.total,
                }
              : order
          )
        );
      }

      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      closeEditModal();
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update order"
      );
    } finally {
      setUpdating(null);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  const goToNextPage = () => {
    if (pagination.hasNextPage) {
      goToPage(pagination.currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (pagination.hasPrevPage) {
      goToPage(pagination.currentPage - 1);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case PaymentStatus.PAID:
        return "bg-violet-100 text-violet-800";
      case OrderStatus.SHIPPING:
        return "bg-purple-100 text-purple-800";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="mt-4 text-gray-600">Đang tải danh sách đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
              <Button onClick={fetchOrders}>Thử lại</Button>
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
        <h1 className="mb-3 text-xl font-bold text-gray-900">
          Quản lý đơn hàng
        </h1>
        <Card>
          <CardHeader className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Tìm kiếm</Label>
              <Input
                id="search"
                type="text"
                placeholder="Mã đơn hàng, tên, SĐT, email..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-status">Trạng thái đơn hàng</Label>
              <Select
                value={orderStatusFilter}
                onValueChange={handleOrderStatusFilter}
              >
                <SelectTrigger id="order-status" className="w-full">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {ORDER_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {orderStatusMap[status]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-status">Trạng thái thanh toán</Label>
              <Select
                value={paymentStatusFilter}
                onValueChange={handlePaymentStatusFilter}
              >
                <SelectTrigger id="payment-status" className="w-full">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {PAYMENT_STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {paymentStatusMap[status]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Địa chỉ
                  </TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Mã giảm giá</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {order.payment_code}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{order.customer_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer_phone}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer_email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm max-w-[200px]">
                        <div className="font-medium">Địa chỉ giao hàng:</div>
                        <div className="text-muted-foreground">
                          {order.shipping_address}
                        </div>
                        {order.province && (
                          <div className="text-muted-foreground text-xs">
                            {order.province}
                            {order.ward && `, ${order.ward}`}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.length} sản phẩm
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.items
                          .map((item) => item.product.name)
                          .join(", ")}
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.discount_code ? (
                        <div>
                          <div className="text-sm font-medium text-green-600">
                            {order.discount_code.code}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Giảm {order.discount_code.value}%
                          </div>
                          {order.discount_amount > 0 && (
                            <div className="text-xs text-red-600">
                              -{formatCurrency(order.discount_amount)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Không có
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {formatCurrency(order.total)}
                      </div>
                      {order.original_total &&
                        order.original_total > order.total && (
                          <div className="text-xs text-muted-foreground line-through">
                            {formatCurrency(order.original_total)}
                          </div>
                        )}
                      <div className="text-xs text-muted-foreground">
                        Phí ship: {formatCurrency(order.shipping_fee ?? 0)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getStatusColor(order.order_status)}
                        >
                          {orderStatusMap[order.order_status] ||
                            order.order_status}
                        </Badge>
                        {!isFinalOrderStatus(order.order_status) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              openEditModal(
                                order.id,
                                "status",
                                order.order_status
                              )
                            }
                            className="h-6 w-6"
                            title="Chỉnh sửa trạng thái"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={getPaymentStatusColor(
                            order.payment_status
                          )}
                        >
                          {order.payment_status === "paid"
                            ? "Đã thanh toán"
                            : order.payment_status === "pending"
                            ? "Chờ thanh toán"
                            : order.payment_status === "failed"
                            ? "Thanh toán thất bại"
                            : order.payment_status === "cod"
                            ? "COD"
                            : order.payment_status === "success"
                            ? "Thanh toán thành công"
                            : order.payment_status}
                        </Badge>
                        {!isFinalPaymentStatus(order.payment_status) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              openEditModal(
                                order.id,
                                "payment",
                                order.payment_status
                              )
                            }
                            className="h-6 w-6"
                            title="Chỉnh sửa trạng thái thanh toán"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(order.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>

          {pagination.totalPages > 1 && (
            <CardContent className="border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {(pagination.currentPage - 1) * pagination.limit + 1}{" "}
                  -{" "}
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.totalOrders
                  )}{" "}
                  trong tổng số {pagination.totalOrders} đơn hàng
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={goToPrevPage}
                    disabled={!pagination.hasPrevPage}
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
                        } else if (pagination.currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (
                          pagination.currentPage >=
                          pagination.totalPages - 2
                        ) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={
                              pageNum === pagination.currentPage
                                ? "default"
                                : "outline"
                            }
                            onClick={() => goToPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={goToNextPage}
                    disabled={!pagination.hasNextPage}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </CardContent>
          )}

          {orders.length === 0 && !loading && (
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground text-4xl mb-4">📦</div>
              <CardTitle className="mb-2">Chưa có đơn hàng nào</CardTitle>
              <CardDescription>
                Các đơn hàng sẽ xuất hiện ở đây khi khách hàng đặt hàng.
              </CardDescription>
            </CardContent>
          )}
        </Card>
      </div>
      <Dialog
        open={editModal.isOpen}
        onOpenChange={(open) => !open && closeEditModal()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Chỉnh sửa{" "}
              {editModal.type === "status"
                ? "trạng thái đơn hàng"
                : "trạng thái thanh toán"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                {editModal.type === "status"
                  ? "Trạng thái đơn hàng"
                  : "Trạng thái thanh toán"}
              </Label>
              <Select
                value={editModal.currentStatus}
                onValueChange={(value) =>
                  setEditModal((prev) => ({ ...prev, currentStatus: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {editModal.type === "status"
                    ? Object.entries(orderStatusMap).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))
                    : Object.entries(paymentStatusMap).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeEditModal}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                if (editModal.type === "status") {
                  updateOrderStatus(
                    editModal.orderId!,
                    editModal.currentStatus
                  );
                } else {
                  updateOrderStatus(
                    editModal.orderId!,
                    "",
                    editModal.currentStatus
                  );
                }
              }}
              disabled={updating === editModal.orderId}
            >
              {updating === editModal.orderId ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
