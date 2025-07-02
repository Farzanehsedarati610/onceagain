const fs = require("fs");
const path = require("path");

// Load ledger
const ledgerPath = path.join(__dirname, "ledger.json");
let ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf-8"));

// Load all transfer functions
const functionsDir = path.join(__dirname, "functions");
const files = fs.readdirSync(functionsDir).filter(f => f.endsWith(".js"));

files.forEach((file, index) => {
  const transfer = require(path.join(functionsDir, file))();
  console.log(`Executing ${file}: ${transfer.from} → ${transfer.to} | $${transfer.amount}`);

  if (!ledger[transfer.from] || ledger[transfer.from] < transfer.amount) {
    console.log(`❌ Insufficient funds in ${transfer.from}`);
    return;
  }

  ledger[transfer.from] -= transfer.amount;
  ledger[transfer.to] = (ledger[transfer.to] || 0) + transfer.amount;
});

// Save updated ledger
fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
console.log("✅ Ledger updated.");

