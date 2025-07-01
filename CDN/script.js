async function loadText() {
  const res = await fetch("/text");
  const data = await res.json();
  document.getElementById("editor").value = data.text;
  displayHashes(data.hashes);
}

async function saveText() {
  const text = document.getElementById("editor").value;
  const res = await fetch("/text", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  const data = await res.json();
  displayHashes(data.hashes);
}

function displayHashes(hashes) {
  const out = hashes.map(h => `${h.line}\n→ ${h.hash}`).join("\n\n");
  document.getElementById("hashes").textContent = out;
}

loadText();

