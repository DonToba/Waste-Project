# Nervs Waste Incident Intelligence Dashboard

A Vite + React + Leaflet proof-of-concept for Nervs' live waste data collection exercise.

## What is included

- Live-style Nigeria/Lagos web map with clickable observations.
- LGA and Waste Category filters.
- Search.
- KPI cards for total cases, LGAs covered, illegal dumpsites and overflowing bins.
- LGA case distribution bars.
- Waste category distribution donut.
- Map popups showing the submitted picture, LGA, category and coordinates.
- Automatic data refresh.
- Responsive layout suitable for a company subdomain.
- Bundled sample data from the supplied 125-record Kobo export.
- Nervs logo and dashboard concept image.

## Live data source — KoboToolbox

The project is now configured to use the **published KoboToolbox CSV directly**. The live source is:

```text
https://eu.kobotoolbox.org/api/v2/assets/aaYJotxgaw6j3TzANYkCnN/export-settings/esDwByc2Q5Xc2iiSnctpFBF/data.csv
```

No sample records are used by default. The dashboard fetches this URL on load and refreshes it every 60 seconds.

You can override the source in Vercel with:

```bash
VITE_DATA_URL=https://eu.kobotoolbox.org/api/v2/assets/aaYJotxgaw6j3TzANYkCnN/export-settings/esDwByc2Q5Xc2iiSnctpFBF/data.csv
VITE_REFRESH_MS=60000
```

The dashboard reads only these fields from the published CSV:
- `Local Government`
- `Waste Category`
- `_Coordinates_latitude`
- `_Coordinates_longitude`
- `Picture_URL`

All other Kobo fields remain hidden from the visualization.

### Alternative: Google Sheets or GitHub

If the data source is changed later, `VITE_DATA_URL` can point to a published Google Sheets CSV or a GitHub raw CSV without changing the dashboard code.

### Important note about Kobo picture URLs

The supplied workbook contains Kobo attachment URLs. Whether those URLs can be displayed directly in a browser depends on the Kobo asset permissions. If Kobo requires authentication, do not expose a Kobo API token in the React/browser code. Use a Vercel serverless proxy or move the images to an accessible object store/CDN.

## Local development

Requirements: Node.js 18+.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

To use the supplied sample data, leave `VITE_DATA_URL` blank.

## Vercel deployment

### Via GitHub

1. Create a GitHub repository.
2. Push this project.
3. Import the repository into Vercel.
4. Framework preset: **Vite**.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Add environment variable:

```text
VITE_DATA_URL = your published Google Sheet CSV URL
VITE_REFRESH_MS = 60000
```

8. Deploy.

### Custom company subdomain

After approval, in Vercel open the project → Domains → add something like:

`waste.nervs.com`

Then create the DNS record Vercel provides at the Nervs domain registrar/DNS provider.

## Recommended production architecture

KoboCollect → KoboToolbox → Google Sheet/automation or controlled API → Vercel dashboard → users.

For a stronger production version:

KoboCollect → KoboToolbox → Vercel API proxy → dashboard

The API proxy keeps Kobo credentials server-side, normalizes the response, and can cache the data. Images can also be proxied/cached if Kobo attachment URLs are private.

## Data governance

The dashboard intentionally uses only the fields requested for the public-facing visualization:

- Local Government
- Point / coordinates
- Waste Category
- Picture

Other Kobo fields such as collector identity, UUIDs, validation status and internal IDs are not rendered.

## Sample dataset

The original sample dataset may remain in the repository for reference, but **the application does not load it by default**. The configured source is the live published KoboToolbox CSV above.

## Suggested next-stage features

- Date/time range filter.
- Heatmap / density mode.
- LGA boundary overlay and LGA-level totals.
- Download filtered data.
- Role-based admin dashboard.
- Photo proxy/cache.
- Kobo API integration through a secure Vercel serverless function.
- Report verification workflow.
- Automated alerts for high-density or repeat dumping locations.
