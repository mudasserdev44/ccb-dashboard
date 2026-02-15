// src/data/dashboardData.js

export const kpiData = [
  { title: "DLs", value: 70, color: "#1e1e2f" },
  { title: "Re-buys", value: 20, color: "#1e1e2f" },
  { title: "Repeats", value: 40, color: "#1e1e2f" },
  { title: "Registered Users", value: 130, color: "#1e1e2f" },
  { title: "Sessions", value: 90, color: "#1e1e2f" },
  { title: "Growth", value: 1, color: "#1e1e2f", suffix: "%" },
  { title: "DLs", value: "", color: "#e93d82" },
];

export const monthlyData = [
   {
      label: "Feb",
      values: [60, 40, 25],
      colors: ["#36A2EB", "#FF6384", "#4BC0C0"],
    },
    {
      label: "March",
      values: [70, 50, 30],
      colors: ["#36A2EB", "#FF6384", "#4BC0C0"],
    },
    {
      label: "April",
      values: [50, 40, 65],
      colors: ["#36A2EB", "#FF6384", "#4BC0C0"],
    },
    {
      label: "May",
      values: [80, 60, 40],
      colors: ["#36A2EB", "#FF6384", "#4BC0C0"],
    },
    {
      label: "June",
      values: [40, 70, 50],
      colors: ["#36A2EB", "#FF6384", "#4BC0C0"],
    },
    {
      label: "July",
      values: [60, 40, 80],
      colors: ["#36A2EB", "#FF6384", "#4BC0C0"],
    },
    {
      label: "Aug",
      values: [75, 55, 45],
      colors: ["#36A2EB", "#FF6384", "#4BC0C0"],
    },
    {
      label: "Sept",
      values: [45, 65, 75],
      colors: ["#36A2EB", "#FF6384", "#4BC0C0"],
    },
];

// export const ageSegmentsData = [
//    { label: "18-24", values: [60, 40], colors: ["#36A2EB", "#FF6384"] },
//     { label: "25-34", values: [80, 50], colors: ["#36A2EB", "#FF6384"] },
//     { label: "35-44", values: [65, 70], colors: ["#36A2EB", "#FF6384"] },
//     { label: "45-54", values: [45, 30], colors: ["#36A2EB", "#FF6384"] },
//     { label: "55-64", values: [35, 60], colors: ["#36A2EB", "#FF6384"] },
//     { label: "65+", values: [25, 20], colors: ["#36A2EB", "#FF6384"] },
// ];
    export const ageSegmentsData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "18-30",
        data: [1500, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 5000, 2000],
        backgroundColor: "#548bcf", // blue
              barPercentage: 0.8,
      },
      {
        label: "31-50",
        data: [ 8000, 9000, 7000, 5000, 2000, 5000, 6000, 7000, 8000, 1500, 2000, 3000, 4000,],
        backgroundColor: "#c168cf", // purple
              barPercentage: 0.8,

      },
      {
        label: "50+",
        data: [5000, 6000, 7000, 8000, 9000, 6000, 7000, 8000, 9000, 10000, 5000, 2000],
        backgroundColor: "#2bb1a0", // cyan
              barPercentage: 0.8,

      },
    ],
  };

export const ageSegmentsDataoption = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "white",
        font: { size: 12, family: 'Montserrat, sans-serif' },
        boxWidth: 10,   // ✅ width 4px
        boxHeight: 10,  // ✅ height 4px
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "white",
         font: {
            family: "Montserrat, sans-serif",
            size: 12,
            weight: "500",
          },
      },
      grid: {
        color: "#333333",
      },
      offset: true, // ✅ zyda gap create karega
    },
    y: {
      min: 0,
      max: 10000,
       font: {
            family: "Montserrat, sans-serif",
            size: 12,
            weight: "500",
          },
    
      ticks: {
        color: "white",
        callback: function (value) {
          if (value === 0) return "0";
          if (value === 1000) return "1k";
          if (value === 2000) return "2k";
          if (value === 5000) return "5k";
          if (value === 10000) return "10k";
          return "";
        },
      },
      grid: { color: "#333333" },
    },
  },
  // ✅ ye niche se bar ki width / spacing aur zyada control karega
  datasets: {
    bar: {
      barPercentage: 0.9,      // chhoti bar
      categoryPercentage: 0.5, // zyda space
    },
  },
};


export const couponData = [
 { label: "Jan", values: [65], colors: ["#9C27B0"] },
    { label: "Feb", values: [45], colors: ["#9C27B0"] },
    { label: "Mar", values: [75], colors: ["#9C27B0"] },
    { label: "Apr", values: [55], colors: ["#9C27B0"] },
    { label: "May", values: [80], colors: ["#9C27B0"] },
    { label: "Jun", values: [60], colors: ["#9C27B0"] },
    { label: "Jul", values: [70], colors: ["#9C27B0"] },
    { label: "Aug", values: [50], colors: ["#9C27B0"] },
];

export const platformData = [
  { label: 'iOS', value: 41.3, color: '#60a5fa' },
  { label: 'Android', value: 50.95, color: '#e879f9' },
];

export const chartData = {
  platform: {
    labels: ['iOS', 'Android'],
    datasets: [
      {
        data: [41.3, 50.95],
        backgroundColor: ['#8A82F7', '#FF9690'],
        borderWidth: 0,
        font: { fontFamily: 'Montserrat, sans-serif'},
      },
    ],
  },
  age: {
    labels: ["0", "10", "20", "30", "40", "50", "60", "70"],
    datasets: [
      {
        label: "2025 Q1",
        data: [70, 35, 50, 65, 20, 45, 30, 50],
        backgroundColor: "#9370DB",
        borderRadius: {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0
        },
        borderSkipped: false,
        barThickness: 5,
      },
      {
        label: "2025 Q2",
        data: [55, 100, 80, 90, 70, 30, 25, 20],
        backgroundColor: "#F08080",
        borderRadius: {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0
        },
        borderSkipped: false,
        barThickness: 5,
      },
      {
        label: "2025 Q3",
        data: [85, 50, 40, 65, 25, 25, 50, 50],
        backgroundColor: "#40E0D0",
        borderRadius: {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0
        },
        borderSkipped: false,
        barThickness: 5,
      },
    ],
  },

  // for total coupon created
  
};

export const chartcoupon = {
coupon: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Coupons",        
        data: [34, 25, 44, 65, 20, 100, 50],
        backgroundColor: "#e879f9",
        borderRadius: {
          topLeft: 10,
          topRight: 10,
          bottomLeft: 0,
          bottomRight: 0
        },
         plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
          boxWidth: 4,   // width of box
          boxHeight: 4,  // height of box
           font: {
            family: "Montserrat, sans-serif",
            size: 12,
            weight: "500",
          },
          
        }
      }
    },
        borderSkipped: false,
        barThickness: window.innerWidth < 640 ? 20 : 20,
      },
    ],
  },
};

export const chartOptions = {
  coupon: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
          boxWidth: 10,   // box ka width
          boxHeight: 10,  // box ka height
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
           font: {
            family: "Montserrat, sans-serif",
            size: 10,
            weight: "500",
          },
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
      },
      y: {
        ticks: {
          color: "#ffffff",
          stepSize: 25,
          max: 100,
          min: 0,
           font: {
            family: "Montserrat, sans-serif",
            size: 12,
            weight: "500",
          },
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
      },
    },
    barPercentage: 0.2,
    categoryPercentage: 0.6,
    maintainAspectRatio: false,
  },
};

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