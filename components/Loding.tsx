import React, { useEffect, useState } from 'react';

interface LoadingUIProps {
  /** 커스텀 로딩 메시지를 전달할 수 있습니다. 전달하지 않으면 기본 메시지를 사용합니다. */
  messages?: string[];
}

const defaultMessages = [
  '축제 정보를 불러오는 중...',
  '최고의 축제를 찾는 중...',
  '특별한 여정을 준비하는 중...',
  '즐거운 경험을 준비하는 중...'
];

const LoadingUI: React.FC<LoadingUIProps> = ({ messages = defaultMessages }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(msgInterval);
  }, [messages.length]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden backdrop-blur-sm pointer-events-none">
      {/* Circular Spinner Background Particles */}
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className={`absolute bg-white/60 rounded-full w-1 h-1 animate-loading-float loading-delay-${i}`}
          style={
            i === 1 ? { top: '20%', left: '10%' } :
            i === 2 ? { top: '60%', right: '15%' } :
            i === 3 ? { bottom: '30%', left: '20%' } :
                        { top: '40%', right: '25%' }
          }
        />
      ))}

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-16 shadow-xl text-center space-y-8">
        {/* Logo Section */}
        <div className="logo">
          <div className="logo-icon"></div>
          <div className="logo-text">FESTA WAY</div>
        </div>

        {/* Circular Loading Spinner */}
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Gradient-styled Message */}
        <div className="text-lg font-bold bg-gradient-to-r from-[#ff6b6b] via-[#4ecdc4] to-[#45b7d1] bg-clip-text text-transparent animate-loading-messageSlide">
          {messages[messageIndex]}
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading-float {
          0%,100% { transform: translateY(0) rotate(0deg); opacity:0.6; }
          33% { transform: translateY(-5px) rotate(120deg); opacity:1; }
          66% { transform: translateY(2px) rotate(240deg); opacity:0.8; }
        }
        .animate-loading-float { animation: loading-float 4s ease-in-out infinite; }
        .loading-delay-1 { animation-delay: 0.2s; }
        .loading-delay-2 { animation-delay: 0.4s; }
        .loading-delay-3 { animation-delay: 0.6s; }
        .loading-delay-4 { animation-delay: 0.8s; }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 10px;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
          background-size: 200% 200%;
          border-radius: 50% 20% 50% 20%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          animation: loading-gradientShift 3s ease-in-out infinite;
          box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
        }
        .logo-icon::before {
          content: '';
          position: absolute;
          width: 30px;
          height: 4px;
          background: white;
          border-radius: 2px;
          box-shadow: 0 8px 0 white, 0 16px 0 white;
          animation: loading-pulse 2s ease-in-out infinite;
          top: 35%;
          transform: translateY(-50%);
        }
        .logo-text {
          font-size: 40px;
          font-weight: 800;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: loading-textGradient 4s ease-in-out infinite;
          letter-spacing: -1px;
        }

        @keyframes loading-gradientShift {
          0%,100% { background-position:0% 50%; }
          50% { background-position:100% 50%; }
        }
        @keyframes loading-pulse {
          0%,100% { opacity:1; transform: scale(1); }
          50% { opacity:0.7; transform: scale(0.9); }
        }
        @keyframes loading-messageSlide {
          0%,100% { opacity:1; transform: translateY(0); }
          33% { opacity:0.7; transform: translateY(-3px); }
          66% { opacity:0.9; transform: translateY(1px); }
        }
        .animate-loading-messageSlide { animation: loading-messageSlide 3s ease-in-out infinite; }

        @keyframes loading-textGradient {
          0%,100% { background-position:0% 50%; }
          50% { background-position:100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default LoadingUI;
