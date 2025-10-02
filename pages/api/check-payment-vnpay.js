import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const query = req.query;
  const secureSecret = 'E46QNSHKPUTXJKI26JUZQ8VR6SRRI1QJ';

  const isValid = verifyVnpSignature(query, secureSecret);

  if (!isValid) {
    return res.status(400).json({ message: 'Invalid signature' });
  }

  const isSuccess =
    query.vnp_ResponseCode === '00' && query.vnp_TransactionStatus === '00';

  if (isSuccess) {
    return res.status(200).json({ message: 'Thanh toán thành công', data: query });
  }

  return res.status(400).json({ message: 'Thanh toán thất bại', data: query });
}

function verifyVnpSignature(query, secureSecret) {
  const { vnp_SecureHash, vnp_SecureHashType, ...rest } = query;

  const sortedParams = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(rest[key]).replace(/%20/g, '+')}`)
    .join('&');

  const hash = crypto
    .createHmac('sha512', secureSecret)
    .update(sortedParams, 'utf8')
    .digest('hex');

  return hash === vnp_SecureHash;
}

