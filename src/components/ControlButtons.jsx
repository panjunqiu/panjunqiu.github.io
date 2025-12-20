import React from "react";

const ControlButtons = ({
  isTimerActive,
  showTimerSettings,
  setShowTimerSettings,
  setShowStats,
  setShowLearning,
  showStats,
  setStatsView,
  showLearning,
  handleReset,
  remainingTime,
  formatTime,
}) => {
  return (
    <div className="text-center mt-4 sm:mt-6 flex gap-2 sm:gap-4 justify-center flex-wrap">
      {!isTimerActive && (
        <button
          onClick={() => {
            setShowTimerSettings(!showTimerSettings);
            if (!showTimerSettings) {
              setShowStats(false);
              setShowLearning(false);
            }
          }}
          className="px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
        >
          定时练习
        </button>
      )}
      {isTimerActive && (
        <div className="px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full shadow-lg text-sm sm:text-base">
          剩余时间：{formatTime(remainingTime)}
        </div>
      )}
      <button
        onClick={handleReset}
        className="px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
      >
        重新开始
      </button>

      <button
        onClick={() => {
          setShowStats(!showStats);
          if (!showStats) {
            setShowTimerSettings(false);
            setShowLearning(false);
          }
        }}
        className="px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
      >
        {showStats ? "隐藏数据" : "数据统计"}
      </button>
      <button
        onClick={() => {
          setShowLearning(!showLearning);
          if (!showLearning) {
            setShowStats(false);
            setShowTimerSettings(false);
          }
        }}
        className="px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
      >
        {showLearning ? "隐藏学习" : "学习模块"}
      </button>
    </div>
  );
};

export default ControlButtons;