import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from 'vnpay';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const body = req.body;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const vnpay = new VNPay({
      tmnCode: 'ORUGUY8A',
      secureSecret: 'E46QNSHKPUTXJKI26JUZQ8VR6SRRI1QJ',
      vnpayHost: 'https://sandbox.vnpayment.vn',
      testMode: true,
      hashAlgorithm: 'SHA512',
      loggerFn: ignoreLogger,
    });
    const transactionId = uuidv4().replace(/-/g, '').slice(0, 12); 
    const vnpayResponse = await vnpay.buildPaymentUrl({
      vnp_Amount: 36000,
      vnp_IpAddr: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
      vnp_TxnRef: transactionId, 
      vnp_OrderInfo: 'Thanh toan don hang #123456',
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: 'http://localhost:3000/api/check-payment-vnpay',
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow),
    });

    return res.status(201).json(vnpayResponse);
  } catch (err) {
    console.error('Lỗi tạo VNPay URL:', err);
    return res.status(500).json({ error: 'Tạo URL thanh toán thất bại' });
  }
}
