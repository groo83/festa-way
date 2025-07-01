import React from 'react';

interface SearchFiltersProps {
  startDate: string;
  endDate: string;
  region: string;
  keyword: string;
  isLoading: boolean;
  allRegions: string[];
  allKeywords: string[];
  onChangeStartDate: (value: string) => void;
  onChangeEndDate: (value: string) => void;
  onChangeRegion: (value: string) => void;
  onChangeKeyword: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  startDate,
  endDate,
  region,
  keyword,
  isLoading,
  allRegions,
  allKeywords,
  onChangeStartDate,
  onChangeEndDate,
  onChangeRegion,
  onChangeKeyword,
  onSearch,
  onReset
}) => {
  return (
    <div className={`filters space-y-6 transition-opacity duration-300 max-w-[720px] mx-auto ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
      {/* 날짜 조건 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-date" className="block text-base font-semibold text-gray-800 mb-1">시작일</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            max={endDate}
            onChange={(e) => onChangeStartDate(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4]"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-base font-semibold text-gray-800 mb-1">종료일</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => onChangeEndDate(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4]"
          />
        </div>
      </div>

      {/* 지역 & 키워드 조건 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="w-full">
          <label htmlFor="region-select" className="block text-base font-semibold text-gray-800 mb-2">지역</label>
          <select
            id="region-select"
            value={region}
            onChange={(e) => onChangeRegion(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#45b7d1] focus:border-[#45b7d1] min-h-[44px]"
            disabled={isLoading}
          >
            <option value="">전체</option>
            {allRegions.map(rg => (
              <option key={rg} value={rg}>{rg}</option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label htmlFor="keyword-select" className="block text-base font-semibold text-gray-800 mb-2">키워드</label>
          <select
            id="keyword-select"
            value={keyword}
            onChange={(e) => onChangeKeyword(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#45b7d1] focus:border-[#45b7d1] min-h-[44px]"
          >
            <option value="">전체</option>
            {allKeywords.map(kw => (
              <option key={kw} value={kw}>{kw}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={onSearch}
          className="px-5 py-2 font-semibold text-white rounded-md bg-gradient-to-r from-[#ff6b6b] via-[#4ecdc4] to-[#45b7d1] bg-[length:200%_200%] animate-[gradientShift_4s_ease-in-out_infinite] shadow-md hover:shadow-lg cursor-pointer transition-all"
        >
          🎯 검색
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

export default SearchFilters;