import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const {
    source,
    dest,
    sourceCurrency,
    destCurrency,
    sourceAmount,
    destAmount,
    autoConfirm = true,
    amountIncludesFees = false,
    notifyUrl
  } = req.body;

  try {
    const response = await axios.post(
      'https://api.testwyre.com/v3/transfers',
      {
        source,
        dest,
        sourceCurrency,
        destCurrency,
        sourceAmount,
        destAmount,
        autoConfirm,
        amountIncludesFees,
        notifyUrl
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WYRE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.response?.data || error.message });
  }
}

