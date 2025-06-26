import { useState } from 'react';
import axios from 'axios';
import { parseFestivalContent, Festival } from '../utils/parseFestivalContent';
import FestivalCard from '../components/FestivalCard';
import React from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/next';
import Footer from '../components/Footer'; 
import MarkdownViewer from '../components/MarkdownViewer';
import Loading from '../components/Loding';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'search' | 'recommend'>('search');
  const [selectedFestival, setSelectedFestival] = useState('');
  const todayStr = new Date().toISOString().slice(0, 10); // yyyy-mm-dd 형식
  const [startDate, setStartDate] = useState(todayStr);  const [endDate, setEndDate] = useState('');
  const [keyword, setKeyword] = useState<string>('');
  const [region, setRegion] = useState('');
  const [festivalList, setFestivalList] = useState<Festival[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [courseResult, setCourseResult] = useState('');
  const [isCourseLoading, setIsCourseLoading] = useState(false);
  const [tripType, setTripType] = useState('');
  const [isFallbackResult, setIsFallbackResult] = useState(false);
  const tripOptions = ['당일치기','1박 2일','2박 3일','3박 4일','4박 5일'];
  const allKeywords = ['가족', '음식', '자연', '포토존', '걷기', '예술', '역사', '책'];
  const allRegions = ['서울', '경기도', '대전', '대구', '광주', '부산','울산', '세종특별자치시', '강원특별자치도', '충청북도', '충청남도', '경상북도', '경상남도', '전북특별자치도', '전라남도', '제주도']; 
  const message =  keyword + ' ' + region + '조건으로 축제를 추천받고 있어요.';

  const selectTrip = (option: string) => {
    setTripType(option);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}년${(d.getMonth() + 1).toString().padStart(2, '0')}월${d.getDate().toString().padStart(2, '0')}일`;
  };

  const handleSearch = async () => {
    // 날짜 유효성 검사
    if (!validateFestaSearchInput()) {
      return;
    }

    setIsLoading(true); 

    let questionText = buildQuestionText();

    try {
      const response = await axios.post('/api/v1/festival', { question: questionText });
      console.log(response.data);

      const content = response.data.result.choices[0].message.content;
      const isFallback = content.includes("확인되지 않았습니다");
      const parsedList = parseFestivalContent(content);
      setIsFallbackResult(isFallback);
      setFestivalList(parsedList);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFestival = (name: string) => {
    setSelectedFestival(name);
    setActiveTab('recommend');
  };

  const handleCourseRecommend = async () => {
    if (!validateRecommendInput()) return;
    setIsCourseLoading(true);
    try {
      const questionText = selectedFestival + ' 관련해서 ' + tripType + ' 코스를 짜줘.';

      const response = await axios.post('/api/v1/course', { question: questionText });
      console.log(response.data);
      console.log(response.data.result.choices[0].message.content);
      setCourseResult(response.data.result.choices[0].message.content || '추천 결과가 없습니다.');
    } catch (err) {
      console.error(err);
      setCourseResult('추천 요청 중 오류가 발생했습니다.');
    } finally {
      setIsCourseLoading(false);
    }
  };

  const validateFestaSearchInput = (): boolean => {
    if (!startDate && !endDate && keyword.length == 0 && !region) {
      alert('조건을 선택해 주세요.');
      return false;
    }
    if (!startDate && endDate) {
      alert('시작일을 선택해 주세요.');
      return false;
    }
    // if (startDate && !endDate) {
    //   alert('종료일을 선택해 주세요.');
    //   return false;
    // }
    return true;
  };
  
  const validateRecommendInput = (): boolean => {
    if (!selectedFestival.trim()) {
      alert('축제명을 입력해 주세요.');
      return false;
    }
    if (!tripType) {
      alert('여행형태를 선택해 주세요.');
      return false;
    }
    return true;
  };

  const buildQuestionText = () : string => {
    let questionText = '';
  
    if (startDate && endDate) {
      questionText += `날짜: ${formatDate(startDate)}~${formatDate(endDate)}\n`;
    } else if (startDate && !endDate) {
      questionText += `날짜: ${formatDate(startDate)}~${formatDate(startDate)}\n`;
    }
  
    if (keyword) {
      questionText += `키워드: ${keyword}\n`;
    }
  
    if (region) {
      questionText += `지역: ${region}`;
    }
  
    return questionText;
  };


  return (
    <div className="container">
      <header>
        <div className="logo">
            <div className="logo-icon"></div>
            <div className="logo-text">FESTA WAY</div>
        </div>
        <div className="tagline">쉽고 빠른 나들이 계획, AI 축제·여행 플래너 Festa Way와 함께</div>
        <div className="tabs">
          <button onClick={() => setActiveTab('search')} className={`tab-btn ${activeTab === 'search' ? 'active-tab' : ''}`}>🔍 축제 찾기</button>
          <button onClick={() => setActiveTab('recommend')} className={`tab-btn ${activeTab === 'recommend' ? 'active-tab' : ''}`}>✏️ 코스 추천받기</button>
        </div>
      </header>

      {activeTab === 'search' && (
        <div className="search-tab">
          <div className={`filters space-y-6 transition-opacity duration-300 max-w-[720px] mx-auto
            ${isLoading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            {/* 날짜 조건 */}
            <div className="grid grid-cols-1 grid-cols-2 gap-4">
              <div>
              <label
                htmlFor="start-date"
                className="block text-base font-semibold text-gray-800 mb-1"
              >시작일</label>
                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4]"
                />
              </div>
              <div>
              <label
                htmlFor="start-date"
                className="block text-base font-semibold text-gray-800 mb-1"
              >종료일</label>
                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4ecdc4] focus:border-[#4ecdc4]"
                />

              </div>
            </div>
            <div className="grid grid-cols-1 grid-cols-2 gap-4">

            {/* <div className="flex flex-col sm:flex-row gap-4 items-center w-full"> */}
              {/* 지역 콤보박스 */}
              <div className="w-full">
                <label className="block text-base font-semibold text-gray-800 mb-2" htmlFor="region-select">지역</label>
                <select
                  id="region-select"
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#45b7d1] focus:border-[#45b7d1] min-h-[44px]"
                  disabled={isLoading}
                >
                  <option value="">전체</option>
                  {allRegions.map(rg => (
                    <option key={rg} value={rg}>{rg}</option>
                  ))}
                </select>
              </div>
              {/* 키워드 콤보박스 (단일 선택) */}
              <div className="w-full">
                <label className="block text-base font-semibold text-gray-800 mb-2" htmlFor="keyword-select">키워드</label>
                <select
                  id="keyword-select"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4ecdc4] focus:border-[#4ecdc4] min-h-[44px]"
                >
                  <option value="">전체</option>
                  {allKeywords.map(kw => (
                    <option key={kw} value={kw}>{kw}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">

            <button
              onClick={handleSearch}
              className="px-5 py-2 font-semibold text-white rounded-md bg-gradient-to-r from-[#ff6b6b] via-[#4ecdc4] to-[#45b7d1] bg-[length:200%_200%] animate-[gradientShift_4s_ease-in-out_infinite] shadow-md hover:shadow-lg cursor-pointer transition-all"
            >
              🎯 검색
            </button>              
            <button
              onClick={() => {
                const today = new Date().toISOString().slice(0, 10);
                setStartDate(today);
                setEndDate('');
                setKeyword('');
                setRegion('');
                setFestivalList([]);
              }}
              title="조건 초기화"
              className="flex items-center gap-1 px-3 py-2 bg-gray-200 hover:bg-red-100 text-gray-700 hover:text-red-600 rounded-md shadow-sm transition-all"
            >
              {/* 아이콘 (refresh) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 25 25"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M4 10a8.003 8.003 0 0114.32-4.906M20 14a8.003 8.003 0 01-14.32 4.906" />
              </svg>
            </button>
            </div>
          </div>
          {isLoading && (
            <Loading messages={['최고의 축제를 찾는 중...', '축제 정보를 불러오는 중...', '즐거운 경험을 준비하는 중...']} />
          )}
          {isFallbackResult && !isLoading && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-md shadow-sm mb-4 max-w-[720px] mx-auto">
              <div className="flex items-start gap-2">
                <svg
                  className="h-5 w-5 mt-1 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                  />
                </svg>
                <div>
                  <p className="font-semibold">조건에 맞는 축제를 찾을 수 없습니다.</p>
                  <p className="text-sm">대신 관련 축제를 추천해드릴게요! 아래 목록을 참고해보세요.</p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && festivalList.length > 0 && (
            <>
            <div className="festival-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {festivalList.map((fest, idx) => (
                <div key={idx} className="flex justify-center w-[350px]">
                  <div className="w-full h-full flex">
                    <FestivalCard key={idx} fest={fest} onSelect={handleSelectFestival} />
                  </div>
                </div>
              ))}
            </div> 
            <div className="mt-6 p-4  max-w-[740px] mx-auto text-yellow-800 rounded-md text-sm">
            ⚠️ 진행일정은 기상 상황 등으로 인해 변동될 수 있습니다.  
              방문 전에는 반드시 공식 홈페이지나 주최 측 공지사항을 확인해 주세요.
            </div>
            </>
          )}

        </div>
      )}
      {activeTab === 'recommend' && (
        <div className="recommend-tab">
          <div className={`filters space-y-6 transition-opacity duration-300 max-w-[720px] mx-auto
            ${isCourseLoading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
          <div>
            <label htmlFor="festival-input" className="block text-base font-semibold text-gray-800 mb-1">
              축제명 또는 지역명
            </label>
            <input
              id="festival-input"
              list="festival-region-list"
              type="text"
              value={selectedFestival}
              onChange={(e) => setSelectedFestival(e.target.value)}
              placeholder="예) 해운대 모래축제, 서울"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4ecdc4] focus:border-[#4ecdc4]"
            />
            <datalist id="festival-region-list">
              {/* 이미 불러온 축제 리스트가 있다면, 그 이름들도 추가 */}
              {festivalList.map((f) => (
                <option key={f.name} value={f.name} />
              ))}
              {/* region 옵션 */}
              {allRegions.map((rg) => (
                <option key={rg} value={rg} />
              ))}
            </datalist>
          </div>
          <div>
          {/* 여행 형태: 버튼 UI */}
            <span className="block text-base font-semibold text-gray-800 mb-2">여행 형태</span>
            <div className="flex flex-wrap gap-2">
              {tripOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectTrip(option)}
                  className={
                    `px-4 py-2 rounded-full text-sm font-medium border transition focus:outline-none ` +
                    (tripType === option
                      ? 'bg-[#4ecdc4] text-white border-[#4ecdc4]'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200')
                  }
                >
                  {option}
                </button>
              )
              )}
            </div>

          </div>
          <div className="flex items-center gap-4 mt-4">
            <button               
              className="px-5 py-2 font-semibold text-white rounded-md bg-gradient-to-r from-[#ff6b6b] via-[#4ecdc4] to-[#45b7d1] bg-[length:200%_200%] animate-[gradientShift_4s_ease-in-out_infinite] shadow-md hover:shadow-lg cursor-pointer transition-all"
              onClick={handleCourseRecommend}>🎯 코스 추천받기</button>
            <button
              onClick={() => {
                setSelectedFestival('');
                setTripType('');
                setCourseResult('');
              }}
              title="조건 초기화"
              className="flex items-center gap-1 px-3 py-2 bg-gray-200 hover:bg-red-100 text-gray-700 hover:text-red-600 rounded-md shadow-sm transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 25 25" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M4 10a8.003 8.003 0 0114.32-4.906M20 14a8.003 8.003 0 01-14.32 4.906" />
              </svg>
            </button>
          </div>
        </div>
        {isCourseLoading && (
            <Loading messages={['특별한 여정을 준비하는 중..', '추천 코스를 불러오는 중...', '즐거운 경험을 준비하는 중...']} />
        )}
        {!isCourseLoading && courseResult && (
          <div className="w-full mt-6 p-6 border border-gray-300 rounded-md bg-white text-gray-800 text-base max-w-[720px] mx-auto">
            <MarkdownViewer markdown={courseResult} />
          </div>
        )}
      </div>
      )}
      <SpeedInsights />
      <Analytics />
      <Footer />
    </div>
  );
}
