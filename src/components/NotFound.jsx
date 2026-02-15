import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGoHome = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl transition-all duration-300 ease-out"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
          }}
        />
        <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-yellow-400/5 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* 404 Text with animation */}
        <div className="mb-8">
          <h1 className="text-[180px] md:text-[220px] font-bold leading-none mb-4 relative">
            <span 
              className="absolute inset-0 text-yellow-400 blur-sm opacity-50"
              style={{
                transform: `translate(${(mousePosition.x - window.innerWidth / 2) / 50}px, ${(mousePosition.y - window.innerHeight / 2) / 50}px)`
              }}
            >
              404
            </span>
            <span className="relative bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              404
            </span>
          </h1>
        </div>

        {/* Error message */}
        <div className="space-y-4 mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Oops! Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even the best explorers get lost sometimes.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoHome}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="group relative px-8 py-4 bg-yellow-400 text-gray-900 font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/50"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg 
                className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </span>
            <div className="absolute inset-0 bg-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </button>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-transparent border-2 border-yellow-400 text-yellow-400 font-semibold rounded-lg transition-all duration-300 hover:bg-yellow-400 hover:text-gray-900 hover:scale-105"
          >
            Go Back
          </button>
        </div>

        {/* Decorative elements */}
        <div className="mt-16 flex justify-center gap-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50" />
    </div>
  );
}