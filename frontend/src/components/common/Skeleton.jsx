import React from 'react';

const Skeleton = ({ 
  className = '', 
  variant = 'default',
  width = 'w-full',
  height = 'h-4',
  animation = true 
}) => {
  const variants = {
    default: 'h-4 bg-neutral-800 rounded',
    text: 'h-4 bg-neutral-800 rounded',
    title: 'h-6 bg-neutral-800 rounded',
    circle: 'rounded-full bg-neutral-800',
    rect: 'bg-neutral-800 rounded',
    card: 'h-64 bg-neutral-800 rounded-lg'
  };

  const animationClass = animation ? 'animate-shimmer skeleton' : 'animate-pulse';

  return (
    <div 
      className={`${animationClass} ${variants[variant]} ${width} ${height} ${className} gpu-accelerated`}
      style={{
        background: animation 
          ? 'linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)'
          : '#1a1a1a',
        backgroundSize: animation ? '200% 100%' : 'auto'
      }}
    />
  );
};

export const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="bg-neutral-900 rounded-lg overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-800">
            <tr>
              {[...Array(columns)].map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <Skeleton className="h-4 w-24" animation={true} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {[...Array(rows)].map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-fade-in" style={{ animationDelay: `${rowIndex * 0.1}s` }}>
                {[...Array(columns)].map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <Skeleton className="h-4 w-full" animation={true} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-neutral-900 rounded-lg p-6 space-y-4 animate-fade-in hover-lift">
      <Skeleton variant="title" className="w-1/2" animation={true} />
      <Skeleton className="w-full" animation={true} />
      <Skeleton className="w-3/4" animation={true} />
      <Skeleton className="w-1/2" animation={true} />
    </div>
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="bg-neutral-900 rounded-lg p-6 animate-fade-in hover-lift">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="circle" className="w-12 h-12" animation={true} />
        <Skeleton className="w-16 h-4" animation={true} />
      </div>
      <Skeleton variant="title" className="w-24 mb-2" animation={true} />
      <Skeleton className="w-32" animation={true} />
    </div>
  );
};

// Product Card Skeleton with smooth animations
export const ProductCardSkeleton = () => (
  <div className="bg-card rounded-2xl p-6 luxury-shadow animate-fade-in hover-lift">
    <Skeleton variant="card" height="h-48" className="mb-4" animation={true} />
    <Skeleton variant="text" height="h-6" width="w-3/4" className="mb-2" animation={true} />
    <Skeleton variant="text" height="h-4" width="w-1/2" className="mb-4" animation={true} />
    <div className="flex justify-between items-center">
      <Skeleton variant="text" height="h-6" width="w-1/3" animation={true} />
      <Skeleton variant="rect" height="h-10" width="w-24" animation={true} />
    </div>
  </div>
);

// Page Loading Skeleton with staggered animations
export const PageLoadingSkeleton = () => (
  <div className="animate-fade-in space-y-6">
    <Skeleton variant="title" height="h-12" width="w-1/3" className="mb-8" animation={true} />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div 
          key={index} 
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
