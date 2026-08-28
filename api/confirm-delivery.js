import { db } from './lib/firebaseAdmin.js';
import { applyCors } from './lib/security.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  const { orderId } = req.query;

  if (!orderId) {
    return res.status(400).send(`
      <div style="text-align:center; padding:50px; font-family:sans-serif; background:#020617; color:#ef4444;">
        <h2>خطأ: رقم الطلب مفقود ❌</h2>
      </div>
    `);
  }

  try {
    const orderRef = db.collection('orders').doc(orderId);
    const doc = await orderRef.get();

    if (!doc.exists) {
      return res.status(404).send(`
        <div style="text-align:center; padding:50px; font-family:sans-serif; background:#020617; color:#ef4444;">
          <h2>عذراً، الطلب غير موجود في النظام ❌</h2>
        </div>
      `);
    }

    await orderRef.update({
      status: 'delivered',
      deliveredAt: new Date().toISOString()
    });

    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تم تأكيد الاستلام - خان الشرق</title>
      </head>
      <body style="margin:0; padding:0; background-color:#020617; font-family:-apple-system, sans-serif; color:#f8fafc; display:flex; align-items:center; justify-content:center; min-height:100vh; text-align:center;">
        <div style="background:#0f172a; padding:40px 20px; border-radius:20px; border:1px solid rgba(16, 185, 129, 0.3); max-width:400px; width:90%; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
          <div style="font-size:60px; margin-bottom:15px;">✅</div>
          <h1 style="color:#10b981; font-size:22px; margin-bottom:10px;">تم تأكيد استلام الطلب بنجاح!</h1>
          <p style="color:#94a3b8; font-size:14px; line-height:1.6;">شكراً لك، نتمنى لك وجبة شهية من <strong>خان الشرق</strong> ☕✨</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error confirming delivery:', error);
    return res.status(500).send(`
      <div style="text-align:center; padding:50px; font-family:sans-serif; background:#020617; color:#ef4444;">
        <h2>حدث خطأ أثناء تأكيد الاستلام ⚠️</h2>
        <p style="color:#94a3b8;">${error.message}</p>
      </div>
    `);
  }
}
