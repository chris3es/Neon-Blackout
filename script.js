// Demo registry — swap with your own URLs
const demos = {
  demo1: "https://example.com/demo1",   // replace with your playable build
  demo2: "https://example.com/demo2",
  demo3: "https://example.com/demo3"
};

// Build list (can be replaced by /assets/data/builds.json)
const builds = [
  { label: "v0.3.2 — Route Optimizer", url: "https://example.com/build-032", tags: ["alpha", "speed"] },
  { label: "v0.3.1 — Stealth Patch", url: "https://example.com/build-031", tags: ["stealth", "fixes"] },
  { label: "v0.3.0 — Procedural Maps", url: "https://example.com/build-030", tags: ["feature", "maps"] }
];

// Changelog entries (can be replaced by /assets/data/changelog.json)
const changelog = [
  { date: "2025-11-25", title: "New procedural nodes", details: "Added dynamic routing and node risk levels for stealth paths." },
  { date: "2025-11-20", title: "HUD revamp", details: "Terminal overlay: packet trace, ping spikes, and inventory quickslots." },
  { date: "2025-11-12", title: "Anti-cheat baseline", details: "Validation hooks and role gating for dev commands (stubbed)." }
];

const demoFrame = document.getElementById("demoFrame");
const buildList = document.getElementById("buildList");
const changelogContainer = document.getElementById("changelog");
const yearEl = document.getElementById("year");
yearEl.textContent = new Date().getFullYear();

// Populate Build selector
builds.forEach((b) => {
  const item = document.createElement("div");
  item.className = "card";
  item.innerHTML = `
    <div class="row">
      <strong>${b.label}</strong>
      <div style="display:flex;gap:6px;">
        ${b.tags.map(t => `<span class="tag">${t}</span>`).join("")}
      </div>
    </div>
    <div class="buttons" style="margin-top:8px">
      <button class="btn" data-url="${b.url}">Load Build</button>
      <button class="btn" data-url="${b.url}" data-open="new">Open in New Tab</button>
    </div>
  `;
  buildList.appendChild(item);
});

// Populate Changelog
changelog.forEach(entry => {
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `
    <div class="row">
      <strong>${entry.title}</strong>
      <span class="tag">${entry.date}</span>
    </div>
    <p>${entry.details}</p>
  `;
  changelogContainer.appendChild(el);
});

// Demo control: buttons
document.querySelectorAll("button[data-demo]").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-demo");
    demoFrame.src = demos[key] || "about:blank";
    location.hash = "#play";
  });
});
document.querySelectorAll("button[data-url]").forEach(btn => {
  btn.addEventListener("click", () => {
    const url = btn.getAttribute("data-url");
    if (btn.getAttribute("data-open") === "new") {
      window.open(url, "_blank");
    } else {
      demoFrame.src = url;
      location.hash = "#play";
    }
  });
});

// Admin toggles (visual only)
document.getElementById("hudToggle").addEventListener("change", (e) => {
  document.body.style.outline = e.target.checked ? "2px dashed rgba(0,255,209,0.6)" : "none";
});
document.getElementById("fpsToggle").addEventListener("change", (e) => {
  if (e.target.checked) startFPS(); else stopFPS();
});
document.getElementById("scanToggle").addEventListener("change", (e) => {
  document.body.classList.toggle("scanlines", e.target.checked);
});

// Contact submit (stub)
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const status = document.getElementById("contactStatus");
  status.textContent = "Message staged. Hook up your backend to send.";
  status.style.color = "var(--accent)";
  console.log("Contact form data:", data);
});

// Minimal FPS counter
let fpsId = null, fpsEl = null, last = performance.now(), frames = 0;
function startFPS() {
  if (fpsId) return;
  fpsEl = document.createElement("div");
  fpsEl.style.cssText = "position:fixed;left:20px;bottom:20px;background:#0f131a;border:1px solid rgba(0,255,209,0.2);color:#00ffd1;padding:6px 8px;border-radius:8px;font:12px/1.4 Inter;z-index:60";
  fpsEl.textContent = "FPS: —";
  document.body.appendChild(fpsEl);
  function loop(ts) {
    frames++;
    if (ts - last >= 500) {
      const fps = Math.round((frames / (ts - last)) * 1000);
      fpsEl.textContent = "FPS: " + fps;
      last = ts; frames = 0;
    }
    fpsId = requestAnimationFrame(loop);
  }
  fpsId = requestAnimationFrame(loop);
}
function stopFPS() {
  if (fpsId) cancelAnimationFrame(fpsId);
  fpsId = null;
  if (fpsEl) fpsEl.remove();
  fpsEl = null;
  frames = 0;
}
