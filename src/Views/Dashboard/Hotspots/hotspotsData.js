
export const downloadSourceData = [
  { label: 'Spicy', value: 52, color: '#e879f9' },
  { label: 'Romantic', value: 27, color: '#2dd4bf' },
  { label: 'Spicier', value: 21, color: '#3b82f6' },
];

export const socialMediaData = [
  { label: 'TikTok', value: 52, color: '#e879f9' },
  { label: 'Instagram', value: 12, color: '#3b82f6' },
  { label: 'Facebook', value: 13, color: '#7dd3fc' },
  { label: 'Whatsapp', value: 13, color: '#818cf8' },
  { label: 'Snapchat', value: 13, color: '#d8b4fe' },
  { label: 'X (Formerly Twitter)', value: 13, color: '#06b6d4' },
  { label: 'Youtube', value: 13, color: '#7dd3fc' },
  { label: 'Other', value: 13, color: '#2dd4bf' },
];


// Hotspots/hotspotsData.js  (update only canada.url)
export const geoData = {
  usa: {
    url: "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
    stateData: {
      "06": 5, 
      "48": 4, 
      "36": 3, 
      "12": 2, 
      "53": 4, 
      "17": 3,
      "40": 1,
    },
    total: 21908,
  },
  canada: {
    url: "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson",
    stateData: {
      "British Columbia": 5,
      "Alberta": 4,
      "Saskatchewan": 3,
      "Manitoba": 2,
      "Ontario": 5,
      "Quebec": 4,
      "New Brunswick": 3,
      "Nova Scotia": 2,
      "Prince Edward Island": 1,
      "Newfoundland and Labrador": 3,
      "Northwest Territories": 4,
      "Yukon": 2,
      "Nunavut": 1
    },
    total: 95,
  },
europe: {
  url: "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson",
  stateData: {
    "Germany": 5,
    "France": 4,
    "Spain": 3,
    "Italy": 2,
    "Poland": 4,
    "Netherlands": 3,
    "Belgium": 2,
    "Austria": 1,
    "Sweden": 4,
    "Norway": 2,
    "Denmark": 3,
    "Finland": 4,
    "Switzerland": 5,
    "Portugal": 2,
    "Czech Republic": 3,
    "Hungary": 2,
    "Greece": 4,
    "Ireland": 3,
    "United Kingdom": 5,
    "Romania": 3,
    "Bulgaria": 2,
    "Croatia": 3,
    "Serbia": 2,
    "Slovakia": 1,
    "Slovenia": 2,
  },
  total: 120,
},


  colorScale: {
    domain: [1, 5],
    range: ["#1e40af", "#3b82f6", "#1e40af", "#3b82f6", "#3b82f6"]
  }
};


export const { usa: geoDataUS, canada: geoDataCanada } = geoData;
