import React, { useState, useRef, useEffect } from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ flexShrink: 0 }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(value.getFullYear());
  const [viewMonth, setViewMonth] = useState(value.getMonth());
  const ref = useRef(null);

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');
  const label = `${pad(value.getDate())}/${pad(value.getMonth() + 1)}/${value.getFullYear()}`;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const selectDay = (d) => {
    if (!d) return;
    onChange(new Date(viewYear, viewMonth, d));
    setOpen(false);
  };

  const isSelected = (d) => d && value.getDate() === d && value.getMonth() === viewMonth && value.getFullYear() === viewYear;
  const isToday = (d) => { const t = new Date(); return d && t.getDate() === d && t.getMonth() === viewMonth && t.getFullYear() === viewYear; };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 bg-[#121212] border border-gray-700 rounded-lg px-3 py-2 text-gray-400 text-sm cursor-pointer whitespace-nowrap"
      >
        {label}
        <CalendarIcon />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-[#1a1a1a] border border-gray-700 rounded-xl p-3 shadow-2xl" style={{ width: 224 }}>
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <button onClick={prevMonth} className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer text-lg px-1">‹</button>
            <span className="text-white text-sm font-medium">{MONTHS[viewMonth]} {viewYear}</span>
            <button onClick={nextMonth} className="text-gray-400 hover:text-white bg-transparent border-none cursor-pointer text-lg px-1">›</button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs text-gray-500 py-0.5">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((d, i) => (
              <button
                key={i}
                onClick={() => selectDay(d)}
                disabled={!d}
                className={`text-center text-xs py-1 rounded-md border-none cursor-pointer transition-colors
                  ${isSelected(d) ? 'bg-green-500 text-white font-medium' : ''}
                  ${isToday(d) && !isSelected(d) ? 'outline outline-1 outline-green-500 text-green-400' : ''}
                  ${d && !isSelected(d) ? 'text-gray-200 hover:bg-gray-700' : ''}
                  ${!d ? 'invisible' : ''}
                `}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const TotalExpenses = () => {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 4, 2));
  const [field, setField] = useState('');
  const [expense, setExpense] = useState('$');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expensesList, setExpensesList] = useState([
    { label: 'Marketing', amount: '$1,000', percentage: '57.3%', color: '#E91E63' },
    { label: 'Apple Dev Fee', amount: '$1,200', percentage: '57.3%', color: '#FFEB3B' },
    { label: 'Google Dev Fee', amount: '$100', percentage: '57.3%', color: '#2196F3' },
    { label: 'Ambassador Payouts', amount: '$400', percentage: '57.3%', color: '#4CAF50' },
    { label: 'Server and Tools', amount: '$500', percentage: '57.3%', color: '#5710e5' },
    { label: 'Miscellaneous', amount: '$150', percentage: '57.3%', color: '#f112d3' },
  ]);

  const handleAddEntry = () => {
    if (field && expense && expense !== '$') {
      setExpensesList([
        ...expensesList,
        { label: field, amount: expense, percentage: '0%', color: '#8884d8' },
      ]);
      setField('');
      setExpense('$');
    }
  };

  return (
    <div className="text-white p-6 rounded-lg mx-auto shadow-lg w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Total Expenses</h2>
        <div className="flex gap-1 items-center">
          <DatePicker value={selectedDate} onChange={setSelectedDate} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#8884d8 transparent' }}>
        {expensesList.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
              <span className="text-lg">{item.label}</span>
            </div>
            <div className="text-right">
              <div className="font-bold">{item.amount}</div>
              <div className="text-gray-400 text-sm">{item.percentage}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 w-full flex flex-col md:flex-row gap-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Field"
            className="w-full bg-gray-800 text-white border-2 border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-green-500"
            value={field}
            onChange={(e) => setField(e.target.value)}
            onClick={() => setIsDropdownOpen((o) => !o)}
          />
          {isDropdownOpen && (
            <div className="absolute bottom-full mb-2 w-full bg-gray-800 text-white rounded-md shadow-lg z-10 max-h-40 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              {expensesList.map((item, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => { setField(item.label); setIsDropdownOpen(false); }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="$Expense"
          className="w-full bg-gray-800 text-white border-2 border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-green-500"
          value={expense}
          onChange={(e) => setExpense(e.target.value)}
        />
      </div>

      <button
        onClick={handleAddEntry}
        className="w-full bg-green-500 text-white font-bold py-3 rounded-lg mt-2 hover:bg-green-600 transition-colors"
      >
        Add entry
      </button>
    </div>
  );
};

export default TotalExpenses;