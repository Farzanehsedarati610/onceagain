const WebSocket = require('ws');
const http = require('http');
const crypto = require('crypto');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const routing = "283977688";
const account = "0000339715";
let counter = 0;

function fma(x, y, z) {
  return (x * y) + z;
}

function modf(x) {
  const intPart = Math.trunc(x);
  const fracPart = x - intPart;
  return { intPart, fracPart };
}

function extractUSD(hash) {
  const base = parseInt(hash.slice(0, 32), 16);
  return (base % 1_000_000_000_000) / 100;
}

function generateHash(seed) {
  return crypto.createHash('sha256').update(seed).digest('hex');
}

function generateBlock(counter) {
  const seed = `${Date.now()}-${Math.random()}-${counter}`;
  const hash = generateHash(seed);
  const usd = extractUSD(hash);
  const adjusted = fma(usd, Math.pow(1.01, counter), 1000);
  const { intPart, fracPart } = modf(adjusted);

  return {
    label: `sym${counter}`,
    hash,
    usd: adjusted,
    routing,
    account,
    integerUSD: intPart,
    fractionalUSD: fracPart.toFixed(2),
    timestamp: new Date().toISOString()
  };
}

wss.on('connection', ws => {
  console.log("Client connected");
});

setInterval(() => {
  const block = generateBlock(counter);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(block));
    }
  });
  counter++;
}, 100);

server.listen(3000, () => {
  console.log("Symbolic server running on port 3000");
});

