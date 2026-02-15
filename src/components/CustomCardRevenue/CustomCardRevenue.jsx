import React from 'react';
import { useLocation } from 'react-router-dom';

const CustomCardRevenue = ({ title, totalRevenue, description, previousRevenue, percentageChange, classname, titleclassname ,showCurrency = false}) => {
    const location = useLocation();
    const isPositive = percentageChange > 0;
    const isNegative = percentageChange < 0;

    const arrowClass = isPositive
        ? 'border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-[#4ade80]'
        : isNegative
            ? 'border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-red-500'
            : '';

    const percentColorClass = isPositive
        ? 'text-[#fef08a]'
        : isNegative
            ? 'text-red-500'
            : 'text-gray-400';

    const formattedPercentageChange = `${isPositive ? '+' : ''}${percentageChange}`;

    return (
        <div
            className={`bg-[#171717] text-white shadow-lg font-inter w-full  ${classname}`}
            style={{
                padding: '1.5rem',
                margin: '0',
                fontFamily: 'Montserrat, sans-serif'
            }}
        >
            <h2 style={{ fontSize: location.pathname == "/ambassador-overview" ? "1rem" : "2rem", fontWeight: '600', marginBottom: '0.5rem', color: "#CFCFCF" }} className={`${titleclassname}`}>
                {title}
                {description &&
                    <h2 style={{ fontSize: '12px', fontWeight: '400', }}>
                        {description}
                    </h2>
                }
            </h2>

            <div
                className="flex items-center justify-between"
                style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <span style={{ fontSize: '3rem', fontWeight: '700', color: '#fef08a' }}>
                    {showCurrency
                        ? `$${Number(totalRevenue).toLocaleString()}`
                        : Number(totalRevenue).toLocaleString()}
                </span>

                {percentageChange !== 0 && (
                    <div className={`w-0 h-0 ${arrowClass}`} />
                )}
            </div>

            <div
                className="flex justify-between text-base text-gray-400"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1rem',
                    color: '#9ca3af'
                }}
            >
                <div className='text-[18px] text-[#CFCFCF] font-semibold'>
                    Previous Month<br />
                    <span style={{ color: '#fef08a', fontWeight: "600" }}>{previousRevenue}</span>
                </div>
                <div style={{ textAlign: 'right', color: '#CFCFCF', fontWeight: "600" }}>
                    % Change<br />
                    <span className={percentColorClass}>{formattedPercentageChange}</span>
                </div>
            </div>
        </div>
    );
};

export default CustomCardRevenue;
