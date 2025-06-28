export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    source,
    dest,
    sourceCurrency,
    destCurrency,
    sourceAmount,
    destAmount,
    autoConfirm = true,
    amountIncludesFees = false,
    message,
    customId,
    notifyUrl,
    preview = false
  } = req.body;

  const transfer = {
    id: `TR-${Date.now()}`,
    source,
    dest,
    sourceCurrency,
    destCurrency,
    sourceAmount,
    destAmount,
    autoConfirm,
    amountIncludesFees,
    message,
    customId,
    notifyUrl,
    preview,
    status: preview ? 'PREVIEW' : 'PENDING',
    createdAt: new Date().toISOString()
  };

  // Save to Supabase or simulate logic
  await insertTransfer(transfer);

  // Optionally send webhook if notifyUrl is provided
  if (notifyUrl && !preview) {
    fetch(notifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'TRANSFER_CREATED', data: transfer })
    }).catch(console.error);
  }

  res.status(200).json(transfer);
}

