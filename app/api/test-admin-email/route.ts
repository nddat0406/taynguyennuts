import { NextResponse } from "next/server";

export async function POST() {
  try {
    const adminEmail = process.env.NEXT_PUBLIC_MAIL_ADMIN;
    
    if (!adminEmail) {
      return NextResponse.json(
        { error: "Admin email not configured. Please set NEXT_PUBLIC_MAIL_ADMIN environment variable." },
        { status: 500 }
      );
    }

    const testOrder = {
      payment_code: "TEST123456",
      name: "Nguyễn Văn Test",
      email: "test@example.com",
      phone: "0123456789",
      address: "123 Đường Test",
      ward: "Phường Test",
      province: "TP. Hồ Chí Minh",
      note: "Đây là email test",
      order_status: "Chờ xác nhận",
      payment_status: "cod",
      total: 500000,
      created_at: new Date().toISOString()
    };

    const testCartItems = [
      {
        product: {
          name: "Hạt điều rang muối",
          price: 250000
        },
        quantity: 2
      }
    ];

    const productRows = testCartItems
      .map(
        (item) => `
          <tr>
            <td style="padding:8px;border:1px solid #ddd;">${item.product.name}</td>
            <td style="padding:8px;border:1px solid #ddd;">${item.quantity}</td>
            <td style="padding:8px;border:1px solid #ddd;">
              ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(item.product.price || 0))}
            </td>
            <td style="padding:8px;border:1px solid #ddd;">
              ${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(item.product.price * item.quantity || 0))}
            </td>
          </tr>
        `
      )
      .join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #B45309;">🧪 TEST - Đơn hàng mới từ Tây Nguyên Nuts</h2>
        <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0; color: #92400E;">Thông tin đơn hàng</h3>
          <p style="margin: 5px 0;"><strong>Mã đơn hàng:</strong> ${testOrder.payment_code}</p>
          <p style="margin: 5px 0;"><strong>Ngày đặt:</strong> ${new Date(testOrder.created_at).toLocaleString("vi-VN")}</p>
          <p style="margin: 5px 0;"><strong>Trạng thái:</strong> ${testOrder.order_status}</p>
          <p style="margin: 5px 0;"><strong>Phương thức thanh toán:</strong> ${testOrder.payment_status === "cod" ? "COD" : "Chuyển khoản"}</p>
        </div>
        
        <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #374151;">Thông tin khách hàng</h3>
          <p style="margin: 5px 0;"><strong>Tên:</strong> ${testOrder.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${testOrder.email}</p>
          <p style="margin: 5px 0;"><strong>Số điện thoại:</strong> ${testOrder.phone}</p>
          <p style="margin: 5px 0;"><strong>Địa chỉ:</strong> ${testOrder.address}, ${testOrder.ward}, ${testOrder.province}</p>
          ${testOrder.note ? `<p style="margin: 5px 0;"><strong>Ghi chú:</strong> ${testOrder.note}</p>` : ''}
        </div>

        <h3 style="color: #374151;">Chi tiết sản phẩm:</h3>
        <table style="width:100%;border-collapse:collapse;margin: 20px 0;">
          <tr style="background:#F3F4F6;">
            <th style="padding:12px;border:1px solid #ddd;text-align:left;">Sản phẩm</th>
            <th style="padding:12px;border:1px solid #ddd;text-align:center;">Số lượng</th>
            <th style="padding:12px;border:1px solid #ddd;text-align:right;">Đơn giá</th>
            <th style="padding:12px;border:1px solid #ddd;text-align:right;">Thành tiền</th>
          </tr>
          ${productRows}
        </table>
        
        <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; text-align: right;">
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #92400E;">
            Tổng cộng: ${new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(testOrder.total || 0)}
          </p>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #FEF2F2; border-radius: 8px;">
          <p style="margin: 0; color: #991B1B; font-weight: bold;">
            🧪 Đây là email test để kiểm tra chức năng thông báo admin!
          </p>
        </div>
      </div>
    `;

    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: adminEmail,
        subject: `🧪 TEST - Đơn hàng mới ${testOrder.payment_code} - ${testOrder.name}`,
        html: htmlContent,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      return NextResponse.json(
        { error: "Failed to send test email", details: errorData },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `Test email sent successfully to ${adminEmail}`,
      adminEmail: adminEmail
    });

  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: "Failed to send test email", details: error },
      { status: 500 }
    );
  }
}
