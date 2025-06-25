import { useState } from 'react';

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <footer className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-3 text-center text-sm shadow-md z-50">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-gray-600 hover:underline font-medium"
        >
          서비스 정보
        </button>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-gray-800 relative">
            <h3 className="text-lg font-semibold mb-4">서비스 정보 안내</h3>
            <p className="text-sm leading-relaxed">
              행사/축제의 기본적인 정보(명칭, 진행일정, 장소, 연락처)는
              <br />
              <span className="font-medium text-blue-600">한국관광공사의 TourAPI</span>로 제공을 받아 처리하고 있습니다.
            </p>
            <p className="text-sm leading-relaxed">
              TourAPI 정보: <a href="https://api.visitkorea.or.kr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">한국관광공사 TourAPI</a>

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
