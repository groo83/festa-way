import { useState } from 'react';
import axios from 'axios';
import { parseFestivalContent, Festival } from '../utils/parseFestivalContent';
import FestivalCard from '../components/FestivalCard';
import ReactMarkdown from 'react-markdown';
import React from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/next';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'search' | 'recommend'>('search');
  const [selectedFestival, setSelectedFestival] = useState('');
  //const [tripType, setTripType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [festivalList, setFestivalList] = useState<Festival[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [courseResult, setCourseResult] = useState('');
  const [isCourseLoading, setIsCourseLoading] = useState(false);
  const [tripType, setTripType] = useState('');

  const tripOptions = ['당일치기','1박 2일','2박 3일','3박 4일','4박 5일'];
  const allKeywords = ['아이', '체험', 'sns', '포토존', '꽃', '책'];
  const allRegions = ['서울', '경기도', '강원도', '경상도', '충청도', '전라도', '인천', '제주도'];

  const festivals = [
    { name: '정선 아리랑제', region: '강원도', date: '2025-08-12 ~ 2025-08-15' },
    { name: '서울 불꽃축제', region: '서울', date: '2025-10-03 ~ 2025-10-03' },
  ];

  const toggleKeyword = (word: string) => {
    setKeywords((prev) => prev.includes(word) ? prev.filter(k => k !== word) : [...prev, word]);
  };

  const toggleRegion = (area: string) => {
    setRegions((prev) => prev.includes(area) ? prev.filter(r => r !== area) : [...prev, area]);
  };

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
    if (!validateDateSelection()) {
      return;
    }

    setIsLoading(true); // 로딩 시작

    let questionText = buildQuestionText();

    try {
      const response = await axios.post('/api/v1/festival', { question: questionText });
      console.log(response.data);

      const content = response.data.result.choices[0].message.content;
      const parsedList = parseFestivalContent(content);
      setFestivalList(parsedList);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // 로딩 종료
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

      setCourseResult(response.data.result.choices[0].message.content || '추천 결과가 없습니다.');
    } catch (err) {
      console.error(err);
      setCourseResult('추천 요청 중 오류가 발생했습니다.');
    } finally {
      setIsCourseLoading(false);
    }
  };

  const validateDateSelection = (): boolean => {
    if (!startDate && endDate) {
      alert('시작일을 선택해 주세요.');
      return false;
    }
    if (startDate && !endDate) {
      alert('종료일을 선택해 주세요.');
      return false;
    }
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
    } 
  
    if (keywords.length > 0) {
      questionText += `키워드: ${keywords.join(', ')}\n`;
    }
  
    if (regions.length > 0) {
      questionText += `지역: ${regions.join(', ')}`;
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
        <div className="tagline">축제로 가는 길, 당신의 특별한 여정</div>
        <div className="tabs">
          <button onClick={() => setActiveTab('search')} className={activeTab === 'search' ? 'active' : ''}>🔍 조건으로 행사/축제 찾기</button>
          <button onClick={() => setActiveTab('recommend')} className={activeTab === 'recommend' ? 'active' : ''}>✏️ 코스 추천받기</button>
        </div>
      </header>

      {activeTab === 'search' && (
        <div className="search-tab">
          <div className="filters space-y-6">
            {/* 날짜 조건 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* 키워드 조건 */}
            <div>
              <span className="block text-base font-semibold text-gray-800 mb-2">키워드</span>
              <div className="flex flex-wrap gap-2">
                {allKeywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => toggleKeyword(kw)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition 
                      ${keywords.includes(kw)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>

            {/* 지역 조건 */}
            <div>
            <span className="block text-base font-semibold text-gray-800 mb-2">지역</span>
              <div className="flex flex-wrap gap-2">
                {allRegions.map((rg) => (
                  <button
                    key={rg}
                    onClick={() => toggleRegion(rg)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border transition 
                      ${regions.includes(rg)
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}`}
                  >
                    {rg}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">

              <button className="search-btn" onClick={handleSearch}>🎯 검색</button>
              <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setKeywords([]);
                setRegions([]);
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
            <div className="result-box">
              <p>🎯 
                <strong> {startDate && endDate
                ? `${formatDate(startDate)} ~ ${formatDate(endDate)}`
                : ''}</strong> {' '}
                <strong>{keywords.join(', ')}</strong> {' '}
                <strong>{regions.join(', ')}</strong> 조건으로 축제를 추천받고 있어요...</p>
            </div>
          )}
          {!isLoading && festivalList.length > 0 && (
            <div className="festival-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {/* {festivals.map((fest, idx) => (
                <div key={idx} className="card">
                  <h3>{fest.name}</h3>
                  <p>{fest.region}</p>
                  <p>{fest.date}</p>
                  <button onClick={() => handleSelectFestival(fest.name)}>이 축제로 코스 추천받기</button>
                </div>
              ))} */}
              {festivalList.map((fest, idx) => (
                <FestivalCard key={idx} fest={fest} onSelect={handleSelectFestival} />
              ))}

            </div> 
          )}

        </div>
      )}
      {activeTab === 'recommend' && (
        <div className="recommend-tab">
          <div className="filters space-y-6">
            <div>
              <label htmlFor="festival-name" className="block text-base font-semibold text-gray-800 mb-1">축제명</label>
              <input id="festival-name" type="text" value={selectedFestival} onChange={(e) => setSelectedFestival(e.target.value)} placeholder="축제명을 입력하세요" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

          <div>
            {/* <div className="flex gap-6">
              {['당일치기','1박 2일','2박 3일','3박 4일','4박 5일'].map((label) => (
                <label key={label} className="inline-flex items-center">
                  <input type="radio" name="trip" value={label} checked={tripType === label} onChange={(e) => setTripType(e.target.value)} className="mr-2" /> {label}
                </label>
              ))}
            </div> */}
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
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200')
                    }
                  >
                    {option}
                  </button>
                ))}
            </div>

          </div>
          <div className="flex items-center gap-4 mt-4">
            <button className="search-btn" onClick={handleCourseRecommend}>🎯 코스 추천받기</button>
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
          <div className="result-box">
            <p>🎯 <strong>{selectedFestival}</strong> 축제를 위한 <strong>{tripType}</strong> 코스를 추천받고 있어요...</p>
          </div>
        )}
        {courseResult && (
          <div className="w-full mt-6 p-6 border border-gray-300 rounded-md bg-white text-gray-800 text-base">
            <article className="prose prose-sm sm:prose lg:prose-lg max-w-none">
              <ReactMarkdown>{courseResult}</ReactMarkdown>
            </article>
          </div>
        )}
      </div>
      )}
      <SpeedInsights />
      <Analytics />

    </div>
  );
}
