A mobile-first prototype for the Tawi riverfront promenade in Jammu built using plain HTML, Tailwind CSS, JavaScript, and Leaflet.js. No backend, no build step: simply open `index.html` or drop the folder onto Netlify.

## The pitch, in one line
Three cost-effective zero-app features that improve the visitor experience and operational efficiency of the riverfront: a live status board, browser-based heritage viewer, and time-slotted ticket system to prevent dock overcrowding.

## What's in the prototype

| Feature | What it demos | Where |
|---|---|---|
| Interactive map & list | 5 riverfront points of interest (Promenade, Floating Dock, Heritage Handicrafts Stall, Cultural Stage, Sunset Point) on a single live Leaflet + CARTO/OpenStreetMap map (no API key, no account), synchronized with a scrollable list. Category filters and search narrow both at once. | `#explore` |
| Live riverfront weather | Real current temperature, wind speed and sky condition for Jammu, fetched client-side from the free, keyless Open-Meteo API and shown in a redesigned status card. | `#environment` |
| Time-Slotted Boat & Facility Booking | A ticket modal: pick an activity and a time slot, enter a name, and get a simulated digital ticket with a scannable QR code (generated via the goqr.me public API). No payment, no backend — just enough to demo the flow. | Ticket modal, triggered from any "Book activity" point |
| Zero-App WebAR Heritage Preview | A draggable 360-style panorama simulating a heritage overlay of the old ghats. In production this becomes a real WebXR camera overlay triggered by scanning a physical QR code on-site — no app install required. | `#ar`, and the "Explore in AR" points |
| Live Micro-Vendor & Stall Finder | A list of local artisans and food stalls with an open/closed toggle, category icons, and today's specials, plus a live "active stalls" count that feeds the hero status strip. | `#vendors` |
| Register your stall | Click "Register your stall," drop a pin on the same map above, fill in a name/category/hours, and the new stall appears instantly as a marker on the map and a row in the vendor list. | `#vendors`, register panel |

## Files

```tawi-riverfront-app/
├── index.html   # Structure: header, hero, map/list, AR gateway, vendor finder, modals
├── styles.css    # Design system (color tokens, type, layout) and component styling
├── app.js      # POI + vendor data, map logic, filters, ticket + QR generation, panorama drag
├── assets/     # Placeholder folder for real photos/icons before deployment
└── README.md
```

## Running it locally
Just open `index.html` in a browser — everything loads from CDNs (Tailwind, Leaflet, Google Fonts) and the QR API, so an internet connection is needed but no install is.

## Deploying for the demo
Drag the `tawi-riverfront-app` folder onto [netlify.com/drop](https://app.netlify.com/drop), or push it to a GitHub repo and enable GitHub Pages. Either gives a public URL in under a minute.

## What's simulated vs. real for a hackathon demo
- Real: the map, marker data, filtering, search, ticket/QR generation flow, live weather (Open-Meteo), the "register your stall" flow, responsive layout.
- Simulated for the demo: the AR panorama is an illustrated SVG scene you can drag around, standing in for a true WebXR camera overlay; seed vendor open/closed state is static sample data rather than pushed from a vendor-side app; newly-registered stalls live only in the current browser tab (nothing is persisted to a server, so a refresh resets them); "Riverfront status" in the hero is still hardcoded rather than sensor-fed.
- Next steps to make it real: a WebXR-based AR layer anchored to physical QR markers, a small backend (or even a shared spreadsheet) so registered stalls and open/closed toggles persist and sync across visitors, and a booking backend to actually cap dock capacity per slot.