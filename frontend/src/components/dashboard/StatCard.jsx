import React from 'react';

const StatCard = ({ icon, label, value, trend, trendValue }) => {
  return (
    <div className="bg-card rounded-2xl p-8 hover:bg-opacity-80 transition-all duration-300 luxury-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 bg-gold bg-opacity-10 rounded-2xl flex items-center justify-center text-gold">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <h3 className="text-secondary text-sm mb-2 font-semibold">{label}</h3>
      <p className="text-white text-3xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;
