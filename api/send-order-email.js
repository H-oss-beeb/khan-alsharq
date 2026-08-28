import { Resend } from 'resend';
import { applyCors } from './lib/security.js';
import { generateOrderEmailHtml } from './lib/emailTemplate.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { orderId, customerName, customerEmail, items, totals, orderType } = req.body;

    if (!customerEmail || !orderId || !items) {
      return res.status(400).json({ success: false, error: 'Missing required order details' });
    }

    const host = req.headers.host || process.env.VERCEL_URL;
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const confirmUrl = `${protocol}://${host}/api/confirm-delivery?orderId=${orderId}`;

    const htmlContent = generateOrderEmailHtml({
      orderId,
      customerName,
      items,
      totals,
      confirmUrl,
      orderType
    });

    const data = await resend.emails.send({
      from: 'Khan Al-Sharq <onboarding@resend.dev>',
      to: customerEmail,
      subject: `تأكيد طلبك رقم #${orderId} - خان الشرق`,
      html: htmlContent
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error sending order email:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
