import { useState, useEffect } from 'react';
import axios from 'axios';
import { parseFestivalContent, Festival } from '../utils/parseFestivalContent';
import FestivalCard from '../components/FestivalCard';
import React from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/next';
import Footer from '../components/Footer'; 
import MarkdownViewer from '../components/MarkdownViewer';
import Loading from '../components/Loding';
import ErrorToast from '../components/ErrorToast';
import SearchFilters from '../components/SearchFilters';
import RecommendationFilters from '../components/RecommendationFilters';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'search' | 'recommend'>('search');
  const [selectedFestivalName, setSelectedFestivalName] = useState('');
  const [selectedFestivalLocation, setSelectedFestivalLocation] = useState('');
  const todayStr = new Date().toISOString().slice(0, 10); 
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
  const [errorMessage, setErrorMessage] = useState('');

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
      const result = await postToAPI('/api/v1/course', questionText);

      const isFallback = result.includes("확인되지 않았습니다");
      const parsedList = parseFestivalContent(result);
      setIsFallbackResult(isFallback);
      setFestivalList(parsedList);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setErrorMessage(msg);
      setFestivalList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFestival = (fest: Festival) => {
    setSelectedFestivalName(fest.name);
    setSelectedFestivalLocation(fest.location)
    setActiveTab('recommend');
  };

  const handleCourseRecommend = async () => {
    if (!validateRecommendInput()) return;
    setIsCourseLoading(true);
    try {
      const locationText = selectedFestivalLocation ? `(${selectedFestivalLocation}) 에서 진행하는 ` : '';
      const questionText = locationText + selectedFestivalName + ' 관련해서 ' + tripType + ' 코스를 짜줘.';

      const result = await postToAPI('/api/v1/course', questionText);
      setCourseResult(result ?? '추천 결과가 없습니다.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setErrorMessage(msg);
      setCourseResult('');
    } finally {
      setIsCourseLoading(false);
    }
  };

  const validateFestaSearchInput = (): boolean => {
    if (!startDate && !endDate && !keyword && !region) {
      alert('조건을 선택해 주세요.');
      return false;
    }
    if (!startDate && endDate) {
      alert('시작일을 선택해 주세요.');
      return false;
    }
    
    return true;
  };
  
  const validateRecommendInput = (): boolean => {
    if (!selectedFestivalName.trim()) {
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

  const postToAPI = async (endpoint: string, question: string): Promise<string> => {
    try {
      const response = await axios.post(endpoint, { question });
      return response.data.result.choices[0].message.content;
    } catch (error) {
      console.error(error);
      throw new Error('통신 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };
  
  const resetSearchFilters = () => {
    const today = new Date().toISOString().slice(0, 10);
    setStartDate(today);
    setEndDate('');
    setKeyword('');
    setRegion('');
    setFestivalList([]);
  };
  
  const resetRecommendation = () => {
    setSelectedFestivalName('');
    setSelectedFestivalLocation('');
    setTripType('');
    setCourseResult('');
  };
  
  useEffect(() => {
    const matched = festivalList.find(f => f.name === selectedFestivalName);
    setSelectedFestivalLocation(matched?.location || '');
  }, [selectedFestivalName, festivalList]);

  return (
    <div className="container">
      <header>
        <div className="logo">
            <div className="logo-icon"></div>
            <div className="logo-text">FESTA WAY</div>
        </div>
        <div className="tagline">쉽고 빠른 나들이 계획, AI 축제·여행 플래너</div>
        <div className="tabs">
          <button onClick={() => setActiveTab('search')} className={`tab-btn ${activeTab === 'search' ? 'active-tab' : ''}`}>🔍 축제 찾기</button>
          <button onClick={() => setActiveTab('recommend')} className={`tab-btn ${activeTab === 'recommend' ? 'active-tab' : ''}`}>✏️ 코스 추천받기</button>
        </div>
      </header>

      {errorMessage && (
        <ErrorToast
          message={errorMessage}
          onClose={() => setErrorMessage('')}
        />
      )}

      {activeTab === 'search' && (
        <div className="search-tab">
          <SearchFilters
            startDate={startDate}
            endDate={endDate}
            region={region}
            keyword={keyword}
            isLoading={isLoading}
            allRegions={allRegions}
            allKeywords={allKeywords}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
            onChangeRegion={setRegion}
            onChangeKeyword={setKeyword}
            onSearch={handleSearch}
            onReset={resetSearchFilters}
          />

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
          <RecommendationFilters
            selectedFestivalName={selectedFestivalName}
            tripType={tripType}
            festivalList={festivalList}
            allRegions={allRegions}
            tripOptions={tripOptions}
            onChangeFestivalName={setSelectedFestivalName}
            onSelectTripType={selectTrip}
            onRecommend={handleCourseRecommend}
            onReset={resetRecommendation}
          />
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
