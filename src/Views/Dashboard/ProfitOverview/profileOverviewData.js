// src/data/profitDashboardData.js

export const ageData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "June"],
  datasets: [
    { label: "Monthly", data: [70, 35, 50, 65, 20, 45], backgroundColor: "#c168cf", borderRadius: 10 },
    { label: "Quarterly", data: [55, 100, 80, 90, 70, 30], backgroundColor: "#548bcf", borderRadius: 10 },
    { label: "Annual", data: [85, 50, 40, 65, 25, 25], backgroundColor: "#2bb1a0", borderRadius: 10 },
  ],
};

export const ageOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: "bottom", 
      labels: { 
        color: "#ffffff",
        boxWidth: 10,  
        boxHeight: 10,
        font: { family: 'Montserrat, sans-serif', size: 12 } // legend font
      },
    },
  },
  scales: {
    x: { 
      stacked: false,
      ticks: { 
        color: "#ffffff",
        font: { family: 'Montserrat, sans-serif', size: 12 } // x-axis font
      }, 
      grid: { color: "rgba(255,255,255,0.1)" },
      categoryPercentage: 0.8, 
      barPercentage: 0.7,    
    },
    y: { 
      stacked: false,
      ticks: { 
        color: "#ffffff",
        stepSize: 25, 
        callback: function(value) { return value; }, 
        max: 100,
        font: { family: 'Montserrat, sans-serif', size: 12 } // y-axis font
      },
      min: 0, 
      grid: { color: "rgba(255,255,255,0.1)" } 
    },
  },
};



export const pieChartData = [
  { label: 'Gross Revenue ($)', value: 100, color: '#e879f9' },
  { label: 'Expenses ($)', value: 200, color: '#2dd4bf' },
  { label: 'DL Fees ($)', value: 300, color: '#3b82f6' },
];

export const profitData = {
  labels: ['Feb', 'Mar', 'Apr', 'May'],
  datasets: [
      {
        label: 'Net',
        data: [40, 70, 45, 35],
        backgroundColor: '#d595e0',
        borderColor: '#d595e0',
        borderWidth: 1,
        stack: 'profit',
        borderRadius: {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 20,
          bottomRight: 20,
        },
      },
      
      {
        label: 'Gross',
        data: [60, 30, 55, 65],
        backgroundColor: '#6b3e71',
        borderColor: '#6b3e71',
        borderWidth: 1,
        stack: 'profit',
        borderRadius: {
          topLeft: 15,
          topRight: 15,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
    ],
};

export const profitOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: { display: false },
    tooltip: {
      backgroundColor: '#374151',
      titleColor: '#a0aec0',
      bodyColor: '#ffffff',
      borderColor: '#4b5563',
      borderWidth: 1,
      cornerRadius: 8,
    },
    legend: {
      position: 'bottom',
      labels: {
        color: '#cbd5e0',
        boxWidth: 10,
        boxHeight: 10,
                font: { size: 12, family: 'Montserrat, sans-serif' },

        padding: 20,
        
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
        drawOnChartArea: true,
        drawTicks: false,
        borderDash: [2, 2],
        color: '#4b5563',
        borderColor: '#4b5563',
        family: 'Montserrat, sans-serif',
        
      },
       ticks: {
      color: '#cbd5e0',
      font: { family: 'Montserrat, sans-serif', size: 12 },
    },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      max: 100,
      grid: {
        color: '#4b5563',
        borderColor: '#4b5563',
        drawOnChartArea: true,
        drawTicks: false,
        borderDash: [2, 2],
      },
      ticks: {
      color: '#cbd5e0',
      font: { family: 'Montserrat, sans-serif', size: 12 },
      stepSize: 25,
      maxTicksLimit: 5,
      callback: function (value) { return value + '%'; },
    },
    },
  },
};

export const downloadSourceData = [
  { label: 'Natural', value: 27, color: '#e879f9' },
  { label: 'Ambassador Referral', value: 21, color: '#2dd4bf' },
];

export const lineChartInitialData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Temperature',
      data: [17.5, 14, 18, 19, 17, 18.5],
      borderWidth: 3,
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointBorderColor: 'rgba(255,255,255,0.8)',
      pointBorderWidth: 2,
    },
  ],
};

export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: { display: false },
    tooltip: {
      backgroundColor: '#374151',
      titleColor: '#a0aec0',
      bodyColor: '#ffffff',
      borderColor: '#4b5563',
      borderWidth: 1,
      cornerRadius: 8,
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || '';
          if (label) label += ': ';
          if (context.parsed.y !== null) label += context.parsed.y.toFixed(1) + '°';
          return label;
        }
      }
    },
    legend: { display: false },
  },
  scales: {
    x: {
      grid: {
        display: true,
        drawOnChartArea: true,
        drawTicks: false,
        color: 'rgba(75, 85, 99, 0.5)',
        borderColor: '#4b5563',
      },
      ticks: { color: '#cbd5e0' },
    },
    y: {
      beginAtZero: false,
      min: 8,
      max: 24,
      grid: {
        display: true,
        color: 'rgba(75, 85, 99, 0.5)',
        borderColor: '#4b5563',
      },
      ticks: {
        color: '#cbd5e0',
        stepSize: 4,
        callback: function (value) { return value; }
      },
    },
  },
};





export const Doughnutdata = {
   labels: ['Marketing', 'Apple Dev Fee', 'Google Dev Fee', 'Ambassador Payouts'],
  datasets: [{
    data: [882, 859, 183, 512],
    backgroundColor: ['#e879f9', '#fde047', '#c084fc', '#60a5fa'],
    borderColor: '#111111',
    borderWidth: 1,
  }],
};
export const Doughnutoptions = {
  cutout: '80%',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
};