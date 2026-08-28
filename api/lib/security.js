export function applyCors(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Admin-Pin'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

export function verifyAdminPin(req, res) {
  const pin = req.headers['x-admin-pin'] || req.query.pin || req.body?.pin;
  const validPin = process.env.ADMIN_PIN || '91114';

  if (!pin || String(pin).trim() !== String(validPin).trim()) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid Admin Security PIN'
    });
    return false;
  }
  return true;
}
