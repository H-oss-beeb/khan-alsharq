export function generateOrderEmailHtml({ orderId, customerName, items, totals, confirmUrl, orderType }) {
  const isDelivery = orderType === 'delivery';

  const itemsRows = items.map(item => `
    <tr>
      <td style="padding: 12px 10px; border-bottom: 1px solid rgba(255,255,255,0.08); color: #f8fafc; font-size: 14px; text-align: right;">
        <strong>${item.nameAr || item.name}</strong> × ${item.qty || item.quantity}
      </td>
      <td style="padding: 12px 10px; border-bottom: 1px solid rgba(255,255,255,0.08); color: #f59e0b; font-size: 14px; text-align: left; font-weight: bold;">
        ${((item.price) * (item.qty || item.quantity)).toLocaleString()} د.ع
      </td>
    </tr>
  `).join('');

  return `
  <!DOCTYPE html>
  <html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فاتورة طلبك من خان الشرق</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Cairo', sans-serif; color: #f8fafc; direction: rtl; text-align: right;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #020617; padding: 30px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width: 580px; background-color: #0f172a; border: 1px solid rgba(217, 119, 6, 0.3); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%); padding: 35px 25px; text-align: center; border-bottom: 1px solid rgba(217, 119, 6, 0.2);">
                <div style="display: inline-block; width: 55px; height: 55px; background: #c2410c; border-radius: 50%; line-height: 55px; font-size: 26px; margin-bottom: 12px; box-shadow: 0 0 20px rgba(194, 65, 12, 0.5);">☕</div>
                <h1 style="margin: 0; color: #f59e0b; font-size: 28px; font-weight: 800; letter-spacing: 0.5px;">خان الشرق</h1>
                <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">الضيافة الشرقية الأصيلة</p>
              </td>
            </tr>

            <!-- Greeting & Info -->
            <tr>
              <td style="padding: 25px 25px 15px 25px;">
                <h2 style="margin: 0 0 10px 0; color: #ffffff; font-size: 18px;">أهلاً بك، ${customerName || 'عزيزنا العميل'} ✨</h2>
                <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                  تم استلام طلبك بنجاح وجاري تحضيره في المطبخ بكل حب وعناية.
                </p>
                <div style="margin-top: 18px; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 14px 18px; display: table; width: 100%; box-sizing: border-box;">
                  <span style="color: #94a3b8; font-size: 13px;">رقم الطلب: </span>
                  <strong style="color: #f59e0b; font-size: 16px; font-family: monospace;">${orderId}</strong>
                  <span style="display: inline-block; margin-right: 15px; color: #38bdf8; font-size: 12px; background: rgba(56, 189, 248, 0.1); padding: 3px 8px; border-radius: 6px;">
                    ${isDelivery ? 'توصيل خارجي 🛵' : 'داخل الصالة 🍽️'}
                  </span>
                </div>
              </td>
            </tr>

            <!-- Items Table -->
            <tr>
              <td style="padding: 10px 25px;">
                <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                  <thead>
                    <tr style="border-bottom: 2px solid rgba(217, 119, 6, 0.3);">
                      <th style="padding: 10px; color: #f59e0b; font-size: 13px; text-align: right;">الطبق / الكمية</th>
                      <th style="padding: 10px; color: #f59e0b; font-size: 13px; text-align: left;">المجموع</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsRows}
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- Totals -->
            <tr>
              <td style="padding: 15px 25px;">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="color: #94a3b8; font-size: 13px; padding: 4px 0;">المجموع الفرعي:</td>
                    <td style="color: #f8fafc; font-size: 13px; text-align: left; padding: 4px 0;">${(totals.subtotal || 0).toLocaleString()} د.ع</td>
                  </tr>
                  ${totals.discount > 0 ? `
                  <tr>
                    <td style="color: #34d399; font-size: 13px; padding: 4px 0;">قيمة الخصم:</td>
                    <td style="color: #34d399; font-size: 13px; text-align: left; padding: 4px 0;">-${(totals.discount).toLocaleString()} د.ع</td>
                  </tr>` : ''}
                  ${isDelivery ? `
                  <tr>
                    <td style="color: #94a3b8; font-size: 13px; padding: 4px 0;">أجور التوصيل:</td>
                    <td style="color: #f8fafc; font-size: 13px; text-align: left; padding: 4px 0;">${(totals.deliveryFee || 5000).toLocaleString()} د.ع</td>
                  </tr>` : ''}
                  <tr>
                    <td style="color: #ffffff; font-size: 16px; font-weight: bold; padding: 12px 0 0 0; border-top: 1px solid rgba(255,255,255,0.1);">المجموع الكلي:</td>
                    <td style="color: #f59e0b; font-size: 18px; font-weight: bold; text-align: left; padding: 12px 0 0 0; border-top: 1px solid rgba(255,255,255,0.1);">${(totals.total || 0).toLocaleString()} د.ع</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ACTION BUTTON: "تم الاستلام" -->
            <tr>
              <td style="padding: 25px; text-align: center; background: rgba(15, 23, 42, 0.6); border-top: 1px solid rgba(255,255,255,0.05);">
                <p style="margin: 0 0 16px 0; color: #94a3b8; font-size: 13px;">
                  عند وصول المندوب واستلام وجبتك، اضغط على الزر أدناه لتأكيد الاستلام:
                </p>
                <a href="${confirmUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; font-size: 16px; font-weight: bold; border-radius: 12px; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4); text-align: center; min-width: 180px;">
                  تم الاستلام ✅
                </a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 20px; text-align: center; color: #64748b; font-size: 11px; border-top: 1px solid rgba(255,255,255,0.05);">
                خان الشرق للضيافة والمأكولات الشرقية • بغداد، العراق<br>
                هذا البريد تم إرساله آلياً لتأكيد طلبك.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
