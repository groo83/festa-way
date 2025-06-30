import React from 'react';

interface RecommendationFiltersProps {
  selectedFestivalName: string;
  tripType: string;
  festivalList: { name: string; location: string }[];
  allRegions: string[];
  tripOptions: string[];
  onChangeFestivalName: (value: string) => void;
  onSelectTripType: (option: string) => void;
  onRecommend: () => void;
  onReset: () => void;
}

const RecommendationFilters: React.FC<RecommendationFiltersProps> = ({
  selectedFestivalName,
  tripType,
  festivalList,
  allRegions,
  tripOptions,
  onChangeFestivalName,
  onSelectTripType,
  onRecommend,
  onReset,
}) => {
  return (
    <div className="filters space-y-6 transition-opacity duration-300 max-w-[720px] mx-auto">
      <div>
        <label htmlFor="festival-input" className="block text-base font-semibold text-gray-800 mb-1">
          축제명 또는 지역명
        </label>
        <input
          id="festival-input"
          list="festival-region-list"
          type="text"
          value={selectedFestivalName}
          onChange={(e) => onChangeFestivalName(e.target.value)}
          placeholder="예) 해운대 모래축제, 서울"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4ecdc4] focus:border-[#4ecdc4]"
        />
        <datalist id="festival-region-list">
          {festivalList.map((f) => (
            <option key={`${f.name}-${f.location}`} value={f.name} />
          ))}
          {allRegions.map((rg) => (
            <option key={rg} value={rg} />
          ))}
        </datalist>
      </div>

      <div>
        <span className="block text-base font-semibold text-gray-800 mb-2">여행 형태</span>
        <div className="flex flex-wrap gap-2">
          {tripOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSelectTripType(option)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition focus:outline-none ${
                tripType === option
                  ? 'bg-[#4ecdc4] text-white border-[#4ecdc4]'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button
          className="px-5 py-2 font-semibold text-white rounded-md bg-gradient-to-r from-[#ff6b6b] via-[#4ecdc4] to-[#45b7d1] bg-[length:200%_200%] animate-[gradientShift_4s_ease-in-out_infinite] shadow-md hover:shadow-lg cursor-pointer transition-all"
          onClick={onRecommend}
        >
          🎯 코스 추천받기
        </button>
        <button
          onClick={onReset}
          title="조건 초기화"
          className="flex items-center gap-1 px-3 py-2 bg-gray-200 hover:bg-red-100 text-gray-700 hover:text-red-600 rounded-md shadow-sm transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 25 25" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M4 10a8.003 8.003 0 0114.32-4.906M20 14a8.003 8.003 0 01-14.32 4.906" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RecommendationFilters;
