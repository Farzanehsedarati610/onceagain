const API_BASE = "http://localhost:8000";
let timeout = null;

async function loadText() {
  try {
    const res = await fetch(`${API_BASE}/text`);
    if (!res.ok) throw new Error("Failed to load text");
    const data = await res.json();
    document.getElementById("editor").value = data.text || "";
    displayHashes(data.hashes || []);
  } catch (err) {
    console.error("Error loading text:", err);
  }
}

function autoSave() {
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    const text = document.getElementById("editor").value;
    try {
      const res = await fetch(`${API_BASE}/text`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error("Failed to save text");
      const data = await res.json();
      displayHashes(data.hashes || []);
    } catch (err) {
      console.error("Error saving text:", err);
    }
  }, 500); // Save 500ms after last keystroke
}

function displayHashes(hashes) {
  const out = hashes.map(h => `${h.line}\n→ ${h.hash}`).join("\n\n");
  document.getElementById("hashes").textContent = out;
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Script loaded!");
  document.getElementById("editor").addEventListener("input", autoSave);
  loadText();
});

