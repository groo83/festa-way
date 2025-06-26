import { useState } from 'react';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <footer className="fixed bottom-0 right-6 py-2 border-gray-200 text-center text-sm z-50">
    <button
  onClick={() => setIsModalOpen(true)}
  title="서비스 정보"
  className="fixed bottom-6 right-6 bg-gray-200 text-gray-700 rounded-full p-3 shadow-sm hover:bg-gray-300 transition-colors duration-200 z-50"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M12 20.5C6.753 20.5 2.5 16.247 2.5 11S6.753 1.5 12 1.5 21.5 5.753 21.5 11 17.247 20.5 12 20.5z"
    />
  </svg>
</button>



      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-gray-800 relative">
            <h3 className="text-lg font-semibold mb-4">서비스 정보 안내</h3>
            <p className="text-sm leading-relaxed">
                Festa Way는 날짜, 지역, 키워드 기준으로 전국의 <strong>행사·축제와 관련 관광지 코스를 똑똑하게 추천해주는 스마트 관광 도우미 서비스</strong>입니다.  
                <br />
                조건을 다양하게 조합하여 원하는 행사·축제 정보를 찾을 수 있으며, <strong>키워드와 지역 조건을 설정</strong>하면 보다 적합한 축제 정보를 얻을 수 있습니다.
            </p>
            <br />
            <p className="text-sm leading-relaxed">
              행사/축제의 기본적인 정보(명칭, 진행일정, 장소, 연락처)는
              <br />
              한국관광공사의 TourAPI로 부터 제공을 받아 처리하고 있습니다.
            </p>
            <p className="text-sm leading-relaxed">
              TourAPI 정보: <a href="https://api.visitkorea.or.kr" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">한국관광공사 TourAPI</a>

            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              aria-label="닫기"
            >
              ✕
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
    
  );
}
