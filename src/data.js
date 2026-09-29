
import Papa from 'papaparse';

const DATA_URL = import.meta.env.VITE_DATA_URL || 'https://eu.kobotoolbox.org/api/v2/assets/aaYJotxgaw6j3TzANYkCnN/export-settings/esDwByc2Q5Xc2iiSnctpFBF/data.csv';
const REFRESH_MS = Number(import.meta.env.VITE_REFRESH_MS || 60000);

const aliases = {
  lga: ['Local Government','LGA','local_government','lga_name'],
  category: ['Waste Category','Waste_Category','waste_category','Category'],
  lat: ['_Coordinates_latitude','Coordinates_latitude','latitude','Latitude','lat'],
  lon: ['_Coordinates_longitude','Coordinates_longitude','longitude','Longitude','lon'],
  picture: ['Picture_URL','Picture URL','picture_url','Image URL','image_url']
};

function find(row, names){
  const key = Object.keys(row).find(k => names.some(n => k.toLowerCase() === n.toLowerCase()));
  return key ? row[key] : '';
}

export function normalizeRows(rows){
  return rows.map((row, i) => {
    const lat = Number(find(row, aliases.lat));
    const lon = Number(find(row, aliases.lon));
    return {
      id: i + 1,
      lga: String(find(row, aliases.lga) || 'Unknown').trim(),
      category: String(find(row, aliases.category) || 'Unclassified').trim(),
      lat,
      lon,
      picture: String(find(row, aliases.picture) || '').trim()
    };
  }).filter(d => Number.isFinite(d.lat) && Number.isFinite(d.lon));
}

export async function loadData(){
  const res = await fetch(DATA_URL, {cache:'no-store'});
  if(!res.ok) throw new Error(`Data source returned ${res.status}`);
  return parse(await res.text());
}

function parse(csv){
  const result = Papa.parse(csv, {header:true, skipEmptyLines:true});
  return normalizeRows(result.data);
}

export { REFRESH_MS };
