import { Festival } from '../utils/parseFestivalContent';
import React from 'react';

interface FestivalCardProps {
  fest: Festival;
  onSelect: (name: string) => void;
}

export default function FestivalCard({ fest, onSelect}: FestivalCardProps) {
  return (
    
    // <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
    //   <h3 className="text-xl font-bold mb-2">{fest.name}</h3>
    //   <p className="text-sm text-gray-600 mb-1">📅 {fest.date}{fest.time && ` (${fest.time})`}</p>
    //   <p className="text-sm text-gray-600 mb-1">📍 {fest.location}</p>
    //   <p className="text-sm text-gray-700 mb-2">{fest.description}</p>
    //   {fest.contact && <p className="text-sm text-blue-600">📞 {fest.contact}</p>}
    //   <button
    //     className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
    //     onClick={() => onSelect(fest.name)} 
    //   >
    //     이 축제로 코스 추천받기
    //   </button>    </div>
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out border border-gray-100">
        <h3 className="text-2xl font-extrabold text-gray-800 mb-3">{fest.name}</h3>
        <p className="text-sm text-gray-600 mb-1">
          📅 <span className="font-medium text-gray-700">{fest.date}</span>
          {fest.time && (
            <span className="ml-1 text-gray-500">({fest.time})</span>
          )}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          📍 <span className="text-gray-700">{fest.location}</span>
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mb-2">{fest.description}</p>
        {fest.contact && (
          <p className="text-sm text-blue-600 mb-2">📞 {fest.contact}</p>
        )}
        <button className="mt-2 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition"
          onClick={() => onSelect(fest.name)} >
          이 축제로 코스 추천받기
        </button>
      </div>

  );
}
