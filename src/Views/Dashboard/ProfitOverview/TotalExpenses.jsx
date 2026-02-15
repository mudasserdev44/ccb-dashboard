import { CalendarDays } from 'lucide-react';
import React, { useState } from 'react';

const TotalExpenses = () => {
  const [field, setField] = useState('');
  const [expense, setExpense] = useState('$');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expensesList, setExpensesList] = useState([
    { label: 'Marketing', amount: '$1,000', percentage: '57.3%', color: '#E91E63' },
    { label: 'Ambassador Payouts', amount: '$1,000', percentage: '57.3%', color: '#4CAF50' },
    { label: 'Apple Dev Fee', amount: '$1,000', percentage: '57.3%', color: '#FFEB3B' },
    { label: 'Google Dev Fee', amount: '$1,000', percentage: '57.3%', color: '#2196F3' },
    { label: 'Backend Costs', amount: '$1,000', percentage: '57.3%', color: '#4CAF50' },
  ]);

  const handleAddEntry = () => {
    if (field && expense) {
      setExpensesList([
        ...expensesList,
        { label: field, amount: expense, percentage: '0%', color: '#8884d8' },
      ]);
      setField('');
      setExpense('');
    }
  };

  const handleFieldClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="text-white p-6 rounded-lg mx-auto shadow-lg w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Total Expenses</h2>
        <div className='flex gap-1'>
          <div className="flex items-center justify-between bg-[#121212] border border-gray-700 rounded-lg px-3 py-2">
            <input
              type="date"
              className="bg-transparent text-gray-400 text-sm outline-none w-full cursor-pointer"
              defaultValue="2025-05-02"
              style={{
                colorScheme: "dark",
              }}
            />
            <CalendarDays size={18} className="text-gray-400"  />
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </div>

      </div>

      <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#8884d8 transparent' }}>
        {expensesList.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-3"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-lg">{item.label}</span>
            </div>
            <div className="text-right">
              <div className="font-bold">{item.amount}</div>
              <div className="text-gray-400 text-sm">{item.percentage}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 w-full flex flex-col md:flex-row  gap-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Field"
            className="w-full bg-gray-800 text-white border-2 border-gray-700 rounded-lg py-2 px-4 focus:outline-none focus:border-green-500"
            value={field}
            onChange={(e) => setField(e.target.value)}
            onClick={handleFieldClick}
          />

        {isDropdownOpen && (
  <div className="absolute bottom-full mb-2 w-full bg-gray-800 text-white rounded-md shadow-lg z-10 max-h-40 overflow-y-auto" style={{scrollbarWidth:"thin"}}>
    {expensesList.map((item, idx) => (
      <div
        key={idx}
        className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
        onClick={() => {
          setField(item.label);
          setIsDropdownOpen(false);
        }}
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
      <style>
        {`
    /* Chrome, Safari, Edge */
    input[type="date"]::-webkit-calendar-picker-indicator {
      opacity: 0;
      display: none;
      -webkit-appearance: none;
    }

    /* Firefox */
    input[type="date"]::-moz-calendar-picker-indicator {
      opacity: 0;
      display: none;
    }
  `}
      </style>
    </div>
  );
};

export default TotalExpenses;
