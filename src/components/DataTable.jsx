"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';

const DataTable = ({
  data,
  columns,
  actions,
  loading = false,
  emptyMessage = "No data found.",
  className = ""
}) => {
  if (loading) {
    return (
      <div className="text-center py-8 text-[#104D2E]">
        Loading...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full text-sm border-separate border-spacing-y-3">
        <thead className="text-gray-500 text-left">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key} 
                className="pb-2 font-medium"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
            {actions && <th className="pb-2 font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr 
              key={item.id || index} 
              className="bg-white hover:bg-gray-50 rounded-xl transition"
            >
              {columns.map((column) => (
                <td key={column.key} className="py-4">
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
              
              {actions && (
                <td className="py-4">
                  <div className="relative">
                    <button className="flex items-center justify-between gap-1 bg-[#104D2E] text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#0d3f27] transition whitespace-nowrap">
                      Take Action <ChevronDown size={14} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;