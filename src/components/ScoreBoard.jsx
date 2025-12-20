import React from 'react';

const ScoreBoard = ({ correct, total, streak }) => {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-4 mb-4 sm:mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 sm:p-4 text-white shadow-lg">
        <div className="text-xs opacity-90">总题数</div>
        <div className="text-lg sm:text-3xl font-bold">{total}</div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-2 sm:p-4 text-white shadow-lg">
        <div className="text-xs opacity-90">正确数</div>
        <div className="text-lg sm:text-3xl font-bold">{correct}</div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-2 sm:p-4 text-white shadow-lg">
        <div className="text-xs opacity-90">正确率</div>
        <div className="text-lg sm:text-3xl font-bold">{accuracy}%</div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-2 sm:p-4 text-white shadow-lg">
        <div className="text-xs opacity-90">连对</div>
        <div className="text-lg sm:text-3xl font-bold">{streak}</div>
      </div>
    </div>
  );
};

export default ScoreBoard;
