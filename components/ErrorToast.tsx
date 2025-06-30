import React, { useEffect, useState } from 'react';

interface ErrorToastProps {
  message: string;
  duration?: number; // 밀리초 단위, 기본값 3000ms
  onClose?: () => void; // 닫기 콜백
}

const ErrorToast: React.FC<ErrorToastProps> = ({ message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // duration 경과 후 fade-out
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose?.(); // 부모가 상태 초기화할 수 있도록 콜백 호출
      }, 700); // fade-out 시간과 일치
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`mt-4 p-4 mb-4 bg-red-50 text-red-800 border border-red-300 rounded-md shadow-sm max-w-[720px] mx-auto transition-opacity duration-700 ease-in-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      ⚠️ {message}
    </div>
  );
};

export default ErrorToast;
