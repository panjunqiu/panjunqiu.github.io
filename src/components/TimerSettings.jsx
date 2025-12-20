import React from "react";

const TimerSettings = ({
  showTimerSettings,
  startTimer,
  customTime,
  setCustomTime,
  handleCustomTimer,
}) => {
  if (!showTimerSettings) return null;

  return (
    <div className="mt-6 bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
        选择练习时长
      </h3>
      <div className="flex gap-4 justify-center flex-wrap mb-4">
        <button
          onClick={() => startTimer(10)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          10分钟
        </button>
        <button
          onClick={() => startTimer(20)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          20分钟
        </button>
        <button
          onClick={() => startTimer(30)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          30分钟
        </button>
      </div>
      <div className="flex gap-2 justify-center items-center">
        <input
          type="number"
          value={customTime}
          onChange={(e) => setCustomTime(e.target.value)}
          placeholder="自定义分钟数"
          min="1"
          max="120"
          className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none w-40"
        />
        <button
          onClick={handleCustomTimer}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          开始
        </button>
      </div>
    </div>
  );
};

export default TimerSettings;