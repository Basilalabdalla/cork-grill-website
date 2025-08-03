import React from 'react';

const OpeningHours = ({ hours }) => {
  if (!hours) return null;
  return (
    <div className="container mx-auto px-4">
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-8 rounded-r-lg" role="alert">
        <p className="font-bold">Opening Hours</p>
        <p>Weekdays: {hours.weekdays}</p>
        <p>Weekends: {hours.weekends}</p>
        </div>
    </div>
  );
};

export default OpeningHours;