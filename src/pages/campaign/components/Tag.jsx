// components/Tag.js
import React from 'react';

const Tag = ({ label }) => {
  return (
    <span className="inline-block bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2">
      {label}
    </span>
  );
};

export default Tag;
