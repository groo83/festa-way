import { Festival } from '../utils/parseFestivalContent';
import React from 'react';

interface FestivalCardProps {
  fest: Festival;
  onSelect: (fest: Festival) => void;
}

export default function FestivalCard({ fest, onSelect }: FestivalCardProps) {
  return (
    
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out border border-gray-100 h-full w-full flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-extrabold text-gray-800 mb-3">{fest.name}</h3>
        <p className="text-sm text-gray-600 mb-1">
          📅 <span className="font-medium text-gray-700">{fest.date}</span>
          {/* {fest.time && (
            <span className="ml-1 text-gray-500">({fest.time})</span>
          )} */}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          📍 <span className="text-gray-700">{fest.location}</span>
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mb-2">{fest.description}</p>
        {fest.contact && (
          <p className="text-sm text-blue-600 mb-2">📞 {fest.contact}</p>
        )}
      </div>
      <button
          className="mt-auto w-full px-5 py-2 font-semibold text-white rounded-lg bg-gradient-to-r from-[#ff6b6b] via-[#4ecdc4] to-[#45b7d1] bg-[length:200%_200%] animate-[gradientShift_4s_ease-in-out_infinite] shadow-md hover:shadow-lg cursor-pointer transition-all"
          onClick={() => onSelect(fest)}
      >
        이 축제로 코스 추천받기
      </button>
    </div>
  

  );
}
