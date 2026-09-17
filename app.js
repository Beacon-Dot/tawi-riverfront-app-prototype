/* ============================================================
   Tawi Riverfront Experience Platform — app.js
   Map init, filters, ticket simulator, AR gateway, vendor finder
   ============================================================ */

/* ---------- DATA: Points of interest ---------- */
const POIS = [
  {
    id: "promenade",
    name: "Tawi Promenade",
    category: "AR Views",
    lat: 32.728,
    lng: 74.8577,
    icon: "walk",
    desc: "The main riverside walkway — start here for orientation and the first AR heritage marker.",
    action: "ar",
    activities: ["Self-guided promenade walk", "Guided heritage walk (30 min)"],
  },
  {
    id: "dock",
    name: "Floating Dock",
    category: "Boat Rides",
    lat: 32.7266,
    lng: 74.8595,
    icon: "boat",
    desc: "Departure point for short river rides. Slots are time-limited to keep the dock uncrowded.",
    action: "book",
    activities: ["30-Min Tawi Boat Ride", "Sunset Boat Ride (45 min)"],
  },
  {
    id: "handicrafts",
    name: "Heritage Handicrafts Stall",
    category: "Cultural Stalls",
    lat: 32.7291,
    lng: 74.856,
    icon: "craft",
    desc: "Basohli painting prints, Dogra woodcraft and pashmina samples from local artisans.",
    action: "book",
    activities: ["Artisan demo slot (20 min)", "Basohli painting workshop"],
  },
  {
    id: "stage",
    name: "Cultural Stage",
    category: "Cultural Stalls",
    lat: 32.7274,
    lng: 74.861,
    icon: "stage",
    desc: "Evening Dogri folk performances and open-mic slots on weekends.",
    action: "book",
    activities: ["Evening folk performance seat", "Open-mic entry slot"],
  },
  {
    id: "sunset",
    name: "Sunset Point",
    category: "AR Views",
    lat: 32.7255,
    lng: 74.857,
    icon: "sun",
    desc: "Best view of the river at dusk, and the second WebAR marker for the old bridge pier.",
    action: "ar",
    activities: ["Self-guided viewpoint visit"],
  },
];

/* ---------- DATA: Vendors ---------- */
const VENDORS = [
  {
    name: "Dogra Kulcha Corner",
    type: "Local Eats",
    open: true,
    special: "Amritsari kulcha, ₹60",
  },
  {
    name: "Riverside Chaat House",
    type: "Local Eats",
    open: true,
    special: "Tawi-special aloo tikki chaat",
  },
  {
    name: "Basohli Print Studio",
    type: "Cultural Stalls",
    open: true,
    special: "Free print demo, 5–7pm",
  },
  {
    name: "Dogra Woodcraft Co.",
    type: "Cultural Stalls",
    open: false,
    special: "Reopens tomorrow, 10am",
  },
  {
    name: "Pahari Tea Stall",
    type: "Local Eats",
    open: true,
    special: "Kahwa + roasted makhana",
  },
  {
    name: "Pashmina Corner",
    type: "Cultural Stalls",
    open: false,
    special: "Reopens 4pm",
  },
  {
    name: "Tawi Fresh Juice Cart",
    type: "Local Eats",
    open: true,
    special: "Sugarcane & kinnow juice",
  },
  {
    name: "Handloom Dupatta Stall",
    type: "Cultural Stalls",
    open: true,
    special: "New Kani weave arrivals",
  },
];

const ICONS = {
  walk: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="13" cy="4" r="2" stroke="currentColor" stroke-width="2"/><path d="M10 22l1.5-7L9 12l1-5 4-1 3 3 3 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.5 15l3 2 2 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  boat: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 15h18l-2 5H5l-2-5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M6 15l1-8h10l1 8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 7V3" stroke="currentColor" stroke-width="2"/></svg>',
  craft:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 20L15 9l1 1L5 21H4v-1z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 4l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="19" cy="5" r="2" stroke="currentColor" stroke-width="2"/></svg>',
  stage:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 19h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M6 19V9l6-4 6 4v10" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 19v-5h4v5" stroke="currentColor" stroke-width="2"/></svg>',
  sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="14" r="4" stroke="currentColor" stroke-width="2"/><path d="M12 3v3M4.2 9.2l2.1 2.1M2 17h3M19 17h3M17.7 11.3l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  food: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M6 3v7a2 2 0 0 0 2 2v9M6 3v6M9 3v6M4 3v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 3c-2 1.5-2.5 4-2.5 6 0 2 1 3 2.5 3v9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

const VENDOR_TYPE_ICON = { "Local Eats": "food", "Cultural Stalls": "craft" };

const CATEGORY_COLOR = {
  "AR Views": "#1C6E8C",
  "Boat Rides": "#E8A33D",
  "Local Eats": "#B15848",
  "Cultural Stalls": "#C99B6B",
};

/* ---------- MAP PROVIDER CONFIG ----------
   The map works out of the box on free, keyless CARTO/OpenStreetMap tiles —
   nothing to sign up for. If you'd rather use a keyed provider (e.g. Mapbox,
   for higher-detail tiles, custom styling, or usage analytics on your own
   account), paste a token below and initMap() will switch to it automatically.

   How to get a Mapbox token:
   1. Create a free account at https://account.mapbox.com/auth/signup/
   2. Open https://account.mapbox.com/access-tokens/ and copy your
      "Default public token" (or create a new one scoped to "styles:tiles").
   3. Paste it between the quotes below.
   4. Save and reload — no other code changes needed. Leave it blank to keep
      using the free tiles.
------------------------------------------------- */
const MAPBOX_TOKEN = "pk.eyJ1Ijoibm90c2NhbW0iLCJhIjoiY211NWxqenNrMDI3ejJ3c2JtMmp5am1vYSJ9.VvHSWWW1a75-3i0iOAX7rw"; 
let map,
  markers = {};
let tempMarker = null;
let activeFilter = "All";
let selectedSlotIndex = null;
let currentPOI = null;
let placementMode = false;
let lastAddedVendorName = null;

/* ---------- MAP INITIALIZATION ---------- */
function initMap() {
  // Single Leaflet Map Instance
  map = L.map("map", { scrollWheelZoom: false }).setView(
    [32.7273, 74.8583],
    15
  );
  
  if (MAPBOX_TOKEN) {
    // Keyed provider — used only if MAPBOX_TOKEN is set above
    L.tileLayer(
      `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`,
      {
        maxZoom: 19,
        tileSize: 512,
        zoomOffset: -1,
        attribution:
          '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map);
  } else {
    // Default — free, no key required
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        subdomains: "abcd",
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
      }
    ).addTo(map);
  }

  // Render POI Pins
  POIS.forEach((poi) => {
    const color = CATEGORY_COLOR[poi.category];
    const icon = L.divIcon({
      className: "",
      html: `<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,.3);border:2px solid #fff;"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
    const marker = L.marker([poi.lat, poi.lng], { icon }).addTo(map);
    marker.bindPopup(popupHtml(poi));
    marker.on("click", () => setActiveRow(poi.id));
    markers[poi.id] = marker;
  });

  // Drop a pin for a new stall — only while registration mode is active,
  // so browsing the map (panning, tapping POIs) never places a stray pin.
  map.on("click", function (e) {
    if (!placementMode) return;
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = lng;

    if (tempMarker) map.removeLayer(tempMarker);
    const pinIcon = L.divIcon({
      className: "",
      html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:var(--marigold,#E8A33D);transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.35);"></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 26],
    });
    tempMarker = L.marker([lat, lng], { icon: pinIcon })
      .addTo(map)
      .bindPopup("Your stall will appear here")
      .openPopup();

    const hint = document.getElementById("registerHint");
    if (hint) {
      hint.textContent = "Pin dropped — add your details below and you're set.";
      hint.classList.add("is-ready");
    }
  });

  // Recalculate size to ensure smooth tile loading
  setTimeout(() => {
    map.invalidateSize();
  }, 400);
}

function popupHtml(poi) {
  const btnLabel = poi.action === "ar" ? "Explore in AR" : "Book activity";
  return `
    <div class="map-popup">
      <div class="map-popup-thumb">${ICONS[poi.icon]}</div>
      <h4>${poi.name}</h4>
      <p>${poi.desc}</p>
      <button class="map-popup-btn" onclick="handlePoiAction('${poi.id}')">${btnLabel}</button>
    </div>`;
}

// exposed for popup inline onclick
window.handlePoiAction = function (id) {
  const poi = POIS.find((p) => p.id === id);
  if (!poi) return;
  if (poi.action === "ar") openArModal(poi);
  else openTicketModal(poi);
};

/* ---------- POI LIST ---------- */
function renderPoiList() {
  const list = document.getElementById("poiList");
  if (!list) return;
  list.innerHTML = "";
  POIS.forEach((poi) => {
    const row = document.createElement("div");
    row.className = "poi-row";
    row.dataset.id = poi.id;
    row.dataset.category = poi.category;
    row.innerHTML = `
      <div class="poi-icon" style="background:${hexToTint(CATEGORY_COLOR[poi.category])}; color:${CATEGORY_COLOR[poi.category]}">${ICONS[poi.icon]}</div>
      <div class="poi-body">
        <p class="poi-name">${poi.name}</p>
        <p class="poi-cat">${poi.category}</p>
        <p class="poi-desc">${poi.desc}</p>
      </div>`;
    row.addEventListener("click", () => {
      setActiveRow(poi.id);
      map.flyTo([poi.lat, poi.lng], 16, { duration: 0.6 });
      markers[poi.id].openPopup();
    });
    list.appendChild(row);
  });
}

function setActiveRow(id) {
  document
    .querySelectorAll(".poi-row")
    .forEach((r) => r.classList.toggle("is-active", r.dataset.id === id));
}

function hexToTint(hex) {
  return hex + "22";
}

/* ---------- FILTERS ---------- */
function applyFilter(cat) {
  activeFilter = cat;
  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.filter === cat);
  });
  document.querySelectorAll(".poi-row").forEach((row) => {
    const show = cat === "All" || row.dataset.category === cat;
    row.classList.toggle("poi-hidden", !show);
  });
  Object.entries(markers).forEach(([id, marker]) => {
    const poi = POIS.find((p) => p.id === id);
    const show = cat === "All" || poi.category === cat;
    const el = marker.getElement();
    if (el) el.style.display = show ? "" : "none";
  });
}

const filterBar = document.getElementById("filterBar");
if (filterBar) {
  filterBar.addEventListener("click", (e) => {
    const chip = e.target.closest(".filter-chip");
    if (chip) applyFilter(chip.dataset.filter);
  });
}

const menuToggle = document.getElementById("menuToggle");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    document.getElementById("filterBar").classList.toggle("is-open");
  });
}

/* ---------- SEARCH ---------- */
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll(".poi-row").forEach((row) => {
      const name = row.querySelector(".poi-name").textContent.toLowerCase();
      const matchesSearch = name.includes(q);
      const matchesFilter =
        activeFilter === "All" || row.dataset.category === activeFilter;
      row.classList.toggle("poi-hidden", !(matchesSearch && matchesFilter));
    });
  });
}

/* ---------- TICKET MODAL ---------- */
const TIME_SLOTS = [
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
];

function openTicketModal(poi) {
  currentPOI = poi;
  selectedSlotIndex = null;
  document.getElementById("ticketSiteName").textContent = poi.name;
  document.getElementById("ticketStepBook").classList.remove("hidden");
  document.getElementById("ticketStepResult").classList.add("hidden");

  const select = document.getElementById("activitySelect");
  select.innerHTML = poi.activities
    .map((a) => `<option>${a}</option>`)
    .join("");

  const slotGrid = document.getElementById("slotGrid");
  slotGrid.innerHTML = TIME_SLOTS.map(
    (slot, i) => `<button class="slot-btn" data-index="${i}">${slot}</button>`
  ).join("");
  slotGrid.querySelectorAll(".slot-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedSlotIndex = Number(btn.dataset.index);
      slotGrid
        .querySelectorAll(".slot-btn")
        .forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });

  document.getElementById("visitorName").value = "";
  document.getElementById("ticketModal").classList.add("is-open");
}

const generateTicket = document.getElementById("generateTicket");
if (generateTicket) {
  generateTicket.addEventListener("click", () => {
    if (selectedSlotIndex === null) {
      alert("Pick a time slot first.");
      return;
    }
    const activity = document.getElementById("activitySelect").value;
    const name = document.getElementById("visitorName").value.trim() || "Guest";
    const slot = TIME_SLOTS[selectedSlotIndex];
    const ticketId =
      "TAWI-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const qrPayload = encodeURIComponent(
      `${ticketId}|${activity}|${slot}|${dateStr}|${name}`
    );
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${qrPayload}`;

    document.getElementById("resultActivity").textContent = activity;
    document.getElementById("resultMeta").textContent = `${slot} · ${dateStr} · ${currentPOI.name}`;
    document.getElementById("resultName").textContent = `Ticket holder: ${name}`;
    document.getElementById("resultId").textContent = ticketId;
    document.getElementById("resultQr").src = qrUrl;

    document.getElementById("ticketStepBook").classList.add("hidden");
    document.getElementById("ticketStepResult").classList.remove("hidden");
  });
}

const ticketAnother = document.getElementById("ticketAnother");
if (ticketAnother) {
  ticketAnother.addEventListener("click", () => {
    if (currentPOI) openTicketModal(currentPOI);
  });
}

const ticketClose = document.getElementById("ticketClose");
if (ticketClose) {
  ticketClose.addEventListener("click", () => {
    document.getElementById("ticketModal").classList.remove("is-open");
  });
}

/* ---------- DATA: AR heritage history ---------- */
const AR_HISTORY = {
  promenade: {
    title: "The promenade & ghats",
    intro:
      "Long before the concrete flood walls went up, this stretch of the Tawi was lined with stone ghats where washerfolk worked at dawn and pilgrims gathered for Dogri festivals. The path you're walking traces roughly the same route as the old riverside lane.",
    timeline: [
      { year: "1846", text: "The riverside lane is laid out as part of the old city's approach to the Tawi, linking the ghats to the bazaar above." },
      { year: "1920s", text: "Stone steps are added at several points along the bank, making the ghats usable year-round for bathing and washing." },
      { year: "1978", text: "Flood-protection walls go up after a major monsoon rise, reshaping the profile of the bank you see today." },
    ],
  },
  sunset: {
    title: "The old bridge pier",
    intro:
      "Sunset Point sits near where a footbridge pier once stood, connecting the promenade side to the old town across the water before a wider road bridge was built downstream.",
    timeline: [
      { year: "1930s", text: "A pedestrian suspension bridge is built here — one of the first fixed river crossings in this part of the city." },
      { year: "1965", text: "Flood damage weakens the pier; the crossing is kept open to foot traffic only during low water." },
      { year: "1990s", text: "A new road bridge downstream takes over as the main crossing, leaving this pier as a quiet viewpoint." },
    ],
  },
  default: {
    title: "The riverfront, then and now",
    intro:
      "Heritage markers along the promenade point to a working riverfront — ghats, boats and a handicrafts trade — that predates the flood walls and paved walkways you see today.",
    timeline: [
      { year: "1800s", text: "The Tawi's banks serve as the city's main washing, bathing and boat-crossing point." },
      { year: "1970s", text: "Flood-control works reshape much of the natural bank into the walled profile seen today." },
      { year: "Today", text: "The promenade reopens the riverfront as a public walking and cultural space." },
    ],
  },
};

/* ---------- AR MODAL ---------- */
function openArModal(poi) {
  document.getElementById("arModal").classList.add("is-open");
  document.getElementById("arModalTitle").textContent =
    poi && poi.id === "sunset"
      ? "The old bridge pier, circa 1950"
      : "The promenade, circa 1960";
  buildPanorama();
  paintArHistory(poi);
}

const arLaunch = document.getElementById("arLaunch");
if (arLaunch) {
  arLaunch.addEventListener("click", () => openArModal());
}

const arClose = document.getElementById("arClose");
if (arClose) {
  arClose.addEventListener("click", () => {
    document.getElementById("arModal").classList.remove("is-open");
  });
}

/* ---------- READ HISTORY (inside the AR modal) ---------- */
function paintArHistory(poi) {
  const data = (poi && AR_HISTORY[poi.id]) || AR_HISTORY.default;

  const titleEl = document.getElementById("arHistoryTitle");
  const introEl = document.getElementById("arHistoryIntro");
  const listEl = document.getElementById("arHistoryList");
  const wrapEl = document.getElementById("arHistoryTimelineWrap");
  const toggleBtn = document.getElementById("arHistoryToggle");
  const toggleLabel = document.getElementById("arHistoryToggleLabel");
  if (!titleEl || !introEl || !listEl) return;

  titleEl.textContent = data.title;
  introEl.textContent = data.intro;
  listEl.innerHTML = data.timeline
    .map(
      (item) => `
      <li class="ar-history-item">
        <span class="ar-history-year">${item.year}</span>
        <p class="ar-history-text">${item.text}</p>
      </li>`
    )
    .join("");

  // Collapse the timeline each time a new marker's history is opened
  if (wrapEl) wrapEl.classList.remove("is-open");
  if (toggleBtn) {
    toggleBtn.classList.remove("is-open");
    toggleBtn.setAttribute("aria-expanded", "false");
  }
  if (toggleLabel) toggleLabel.textContent = "Read the full history";
}

const arHistoryToggle = document.getElementById("arHistoryToggle");
if (arHistoryToggle) {
  arHistoryToggle.addEventListener("click", () => {
    const wrapEl = document.getElementById("arHistoryTimelineWrap");
    const labelEl = document.getElementById("arHistoryToggleLabel");
    const isOpen = wrapEl.classList.toggle("is-open");
    arHistoryToggle.classList.toggle("is-open", isOpen);
    arHistoryToggle.setAttribute("aria-expanded", String(isOpen));
    if (labelEl) {
      labelEl.textContent = isOpen
        ? "Hide the full history"
        : "Read the full history";
    }
  });
}

function buildPanorama() {
  const strip = document.getElementById("panoramaStrip");
  if (!strip) return;
  if (strip.dataset.built) {
    strip.style.left = "-400px";
    return;
  }
  strip.dataset.built = "1";
  strip.innerHTML = `
    <svg width="1600" height="260" viewBox="0 0 1600 260" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#E8A33D" stop-opacity="0.55"/>
          <stop offset="1" stop-color="#1B4750" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="260" fill="url(#sky)"/>
      ${Array.from({ length: 8 })
        .map((_, i) => {
          const x = i * 210 + 20;
          return `<path d="M${x} 260 Q${x + 30} 150 ${x + 60} 170 Q${x + 90} 150 ${x + 110} 260 Z" fill="rgba(255,255,255,0.06)"/>`;
        })
        .join("")}
      <g fill="rgba(255,255,255,0.14)">
        <rect x="120" y="120" width="70" height="140" rx="4"/>
        <polygon points="155,80 120,120 190,120"/>
        <rect x="420" y="150" width="200" height="110"/>
        <rect x="440" y="170" width="24" height="40" fill="rgba(15,59,61,0.4)"/>
        <rect x="490" y="170" width="24" height="40" fill="rgba(15,59,61,0.4)"/>
        <rect x="900" y="100" width="90" height="160" rx="6"/>
        <polygon points="945,50 900,100 990,100"/>
        <rect x="1200" y="160" width="260" height="100"/>
      </g>
      <path d="M0 235 Q400 215 800 235 T1600 235 V260 H0 Z" fill="rgba(233,207,161,0.15)"/>
      <path d="M0 245 Q400 225 800 245 T1600 245 V260 H0 Z" fill="rgba(233,207,161,0.1)"/>
    </svg>`;
  strip.style.left = "-400px";
}

(function enablePanoramaDrag() {
  const frame = document.getElementById("panoramaFrame");
  const strip = document.getElementById("panoramaStrip");
  if (!frame || !strip) return;
  let dragging = false,
    startX = 0,
    startLeft = 0;

  function onDown(x) {
    dragging = true;
    startX = x;
    startLeft = parseInt(strip.style.left || "-400", 10);
  }
  function onMove(x) {
    if (!dragging) return;
    const delta = x - startX;
    let newLeft = startLeft + delta;
    newLeft = Math.max(-1200, Math.min(0, newLeft));
    strip.style.left = newLeft + "px";
  }
  function onUp() {
    dragging = false;
  }

  frame.addEventListener("mousedown", (e) => onDown(e.clientX));
  window.addEventListener("mousemove", (e) => onMove(e.clientX));
  window.addEventListener("mouseup", onUp);

  frame.addEventListener("touchstart", (e) => onDown(e.touches[0].clientX), {
    passive: true,
  });
  frame.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX), {
    passive: true,
  });
  frame.addEventListener("touchend", onUp);
})();

/* ---------- SHARED MODAL OVERLAY DISMISS ---------- */
document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("is-open");
  });
});

/* ---------- VENDOR FINDER LIST ---------- */
let vendorMode = "all";

function renderVendors() {
  const list = document.getElementById("vendorList");
  if (!list) return;
  const visible =
    vendorMode === "open" ? VENDORS.filter((v) => v.open) : VENDORS;
  list.innerHTML = visible
    .map((v) => {
      const color = CATEGORY_COLOR[v.type] || CATEGORY_COLOR["Local Eats"];
      const icon = ICONS[VENDOR_TYPE_ICON[v.type]] || ICONS.food;
      const isNew = v.name === lastAddedVendorName;
      return `
    <div class="vendor-row ${v.open ? "" : "is-closed"} ${isNew ? "is-new" : ""}">
      <span class="vendor-status-dot ${v.open ? "open" : "closed"}"></span>
      <span class="vendor-icon" style="background:${hexToTint(color)}; color:${color}">${icon}</span>
      <div>
        <p class="vendor-name">${v.name}</p>
        <p class="vendor-type">${v.type}</p>
      </div>
      <p class="vendor-special">${v.special}</p>
      <span class="vendor-state-label ${v.open ? "open" : "closed"}">${v.open ? "Open" : "Closed"}</span>
    </div>
  `;
    })
    .join("");
  lastAddedVendorName = null;

  const openCount = VENDORS.filter((v) => v.open).length;
  const vendorCountEl = document.getElementById("vendorCount");
  const activeStallCountEl = document.getElementById("activeStallCount");
  if (vendorCountEl) vendorCountEl.textContent = `${openCount} of ${VENDORS.length} stalls open`;
  if (activeStallCountEl) activeStallCountEl.textContent = openCount;
}

const vendorToggle = document.getElementById("vendorToggle");
if (vendorToggle) {
  vendorToggle.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    vendorMode = btn.dataset.open;
    document
      .querySelectorAll("#vendorToggle button")
      .forEach((b) => b.classList.toggle("is-active", b === btn));
    renderVendors();
  });
}

/* ---------- LIVE ENVIRONMENTAL WIDGET ---------- */
const WEATHER_CODES = {
  0: { label: "Clear skies over the ghats", icon: "sun" },
  1: { label: "Mostly clear", icon: "sun" },
  2: { label: "Partly cloudy", icon: "cloud" },
  3: { label: "Overcast", icon: "cloud" },
  45: { label: "Misty over the river", icon: "cloud" },
  48: { label: "Misty over the river", icon: "cloud" },
  51: { label: "Light drizzle", icon: "rain" },
  53: { label: "Drizzle", icon: "rain" },
  55: { label: "Steady drizzle", icon: "rain" },
  61: { label: "Light rain", icon: "rain" },
  63: { label: "Rain", icon: "rain" },
  65: { label: "Heavy rain", icon: "rain" },
  80: { label: "Rain showers", icon: "rain" },
  81: { label: "Rain showers", icon: "rain" },
  82: { label: "Heavy showers", icon: "rain" },
  95: { label: "Thunderstorms nearby", icon: "rain" },
};

const ENV_ICONS = {
  sun: ICONS.sun.replace('width="18" height="18"', 'width="30" height="30"'),
  cloud:
    '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 12.06 4 4 0 0 0 7 18z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  rain: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M7 15h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.06 4 4 0 0 0 7 15z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 18l-1 3M12 18l-1 3M16 18l-1 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
};

function paintEnvironment(temperature, wind, weathercode) {
  const tempEl = document.getElementById("temp");
  const windEl = document.getElementById("wind");
  const conditionEl = document.getElementById("envCondition");
  const iconEl = document.getElementById("envIcon");
  const updatedEl = document.getElementById("envUpdated");

  const condition = WEATHER_CODES[weathercode] || {
    label: "Calm over the riverfront",
    icon: "sun",
  };

  if (tempEl) tempEl.textContent = Math.round(temperature * 10) / 10;
  if (windEl) windEl.textContent = Math.round(wind);
  if (conditionEl) conditionEl.textContent = condition.label;
  if (iconEl) iconEl.innerHTML = ENV_ICONS[condition.icon];
  if (updatedEl) {
    updatedEl.textContent = new Date().toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
}

async function fetchLiveEnvironment() {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=32.7266&longitude=74.8570&current_weather=true"
    );
    const data = await res.json();
    if (data.current_weather) {
      paintEnvironment(
        data.current_weather.temperature,
        data.current_weather.windspeed,
        data.current_weather.weathercode
      );
    }
  } catch (err) {
    console.warn("Weather fetch warning:", err);
    paintEnvironment(31.2, 12.4, 0);
  }
}

/* ---------- VENDOR REGISTRATION (map placement + form) ---------- */
function enterPlacementMode() {
  placementMode = true;
  document.getElementById("mapFrame").classList.add("is-placing");
  document.getElementById("registerPanel").classList.add("is-open");
  document.getElementById("registerStallBtn").classList.add("is-active");
  document
    .getElementById("explore")
    .scrollIntoView({ behavior: "smooth", block: "start" });
}

function exitPlacementMode({ resetForm = true } = {}) {
  placementMode = false;
  document.getElementById("mapFrame").classList.remove("is-placing");
  document.getElementById("registerPanel").classList.remove("is-open");
  document.getElementById("registerStallBtn").classList.remove("is-active");
  if (tempMarker) {
    map.removeLayer(tempMarker);
    tempMarker = null;
  }
  const hint = document.getElementById("registerHint");
  if (hint) {
    hint.textContent =
      "Click anywhere on the map above to drop your pin, then fill in your details below.";
    hint.classList.remove("is-ready");
  }
  if (resetForm) {
    const form = document.getElementById("vendorForm");
    if (form) form.reset();
    document.getElementById("lat").value = "";
    document.getElementById("lng").value = "";
  }
}

const registerStallBtn = document.getElementById("registerStallBtn");
if (registerStallBtn) {
  registerStallBtn.addEventListener("click", () => {
    if (placementMode) exitPlacementMode();
    else enterPlacementMode();
  });
}

const registerCancel = document.getElementById("registerCancel");
if (registerCancel) {
  registerCancel.addEventListener("click", () => exitPlacementMode());
}

function initVendorForm() {
  const vendorForm = document.getElementById("vendorForm");
  if (!vendorForm) return;
  vendorForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("shopName").value.trim();
    const type = document.getElementById("stallType").value;
    const open = document.getElementById("openTime").value;
    const close = document.getElementById("closeTime").value;
    const lat = document.getElementById("lat").value;
    const lng = document.getElementById("lng").value;

    if (!lat || !lng) {
      alert("Click on the map above to choose your stall's position first.");
      return;
    }

    if (tempMarker) {
      tempMarker
        .setIcon(
          L.divIcon({
            className: "",
            html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:${CATEGORY_COLOR[type]};transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.35);"></div>`,
            iconSize: [26, 26],
            iconAnchor: [13, 26],
          })
        )
        .bindPopup(`<b>${name}</b><br>${type} &middot; ${open}&ndash;${close}`)
        .openPopup();
      tempMarker = null; // hand ownership to the permanent marker on the map
    }

    VENDORS.unshift({
      name,
      type,
      open: true,
      special: `Opens ${open} &middot; closes ${close}`,
    });
    lastAddedVendorName = name;
    renderVendors();

    exitPlacementMode({ resetForm: true });
  });
}

/* ---------- INIT EVERYTHING ON DOM LOAD ---------- */
document.addEventListener("DOMContentLoaded", function () {
  initMap();
  renderPoiList();
  renderVendors();
  fetchLiveEnvironment();
  initVendorForm();
});