addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  if (url.pathname === "/cdn-process") {
    const text = await request.text()
    const lines = text.split("\n").filter(l => l.includes("acct:"))
    const hashes = lines.map(line => {
      const hash = new TextEncoder().encode(line)
      return crypto.subtle.digest("SHA-256", hash).then(buf =>
        Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("")
      )
    })
    const resolved = await Promise.all(hashes)
    return new Response(JSON.stringify(resolved), { headers: { "Content-Type": "application/json" } })
  }
  return fetch(request)
}

