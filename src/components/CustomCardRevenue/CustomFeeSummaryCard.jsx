import React from 'react';

const CustomFeeSummaryCard = ({ ambassadorFee, playstoreFee,className, profit, previousProfit, profitChangePercentage }) => {
  // Determine text color and arrow for profit change
  const isProfitIncrease = profitChangePercentage >= 0;
  const changeColor = isProfitIncrease ? 'text-green-400' : 'text-red-400';
  const arrow = isProfitIncrease ? '▲' : '▼';

  return (
    <div style={{padding:"24px"}} className={`bg-[#171717] rounded-lg shadow-lg h-full md:h-[310px] text-white w-full mx-auto ${className}`}>

      <div className="grid grid-cols-3 gap-4 text-start">
        <div>
          <p className="text-white text-[1rem] font-semibold mb-1">Ambassador</p>
          <p className="text-white text-[1rem] font-semibold mb-2">Fee</p>
          <p className="text-[#fef08a] text-2xl md:text-[3rem] font-bold">{ambassadorFee}</p>
        </div>

        <div>
          <p className="text-white text-[1rem] font-semibold mb-1">Playstore</p>
          <p className="text-white text-[1rem] font-semibold mb-2">Fee</p>
          <p className="text-[#fef08a] text-2xl md:text-[3rem] font-bold">{playstoreFee}</p>
        </div>

        <div>
          <p className="text-white text-[1rem] font-semibold mb-1">Profit</p>
          <p className="text-white text-[1rem] font-semibold mb-2">&nbsp;</p>
          <div className="flex items-center justify-center space-x-2">
            <p className="text-[#fef08a] text-2xl md:text-[3rem]  font-bold">{profit}</p>
          </div>
            <span className={`${changeColor} text-2xl flex items-end justify-end md:text-2xl font-bold`}>{arrow}</span>
        </div>
      </div>

      <hr className="border-gray-700 my-6" />

      <div className="grid grid-cols-3 gap-4 text-start text-white text-sm">
        <div>
          <p className='text-2xl'>Previous</p>
          <p className='text-xl text-[#fef08a]'>{previousProfit}</p>
        </div>

        <div></div>

        {/* Percentage Change for Profit */}
        <div>
          <p className='text-2xl'>% Change</p>
          <p className={`${changeColor} text-xl text-[#fef08a] font-semibold`}>
            {isProfitIncrease ? '+' : ''}{profitChangePercentage}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomFeeSummaryCard;