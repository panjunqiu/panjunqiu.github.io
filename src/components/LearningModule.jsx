import React from "react";

const LearningModule = ({ showLearning, notes, noteToSolfege, playNoteSound }) => {
  if (!showLearning) return null;

  return (
    <div className="mt-6 bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        音符学习
      </h3>
      <p className="text-gray-600 text-center mb-6">
        点击音符卡片可以听到对应的声音
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {notes.map((noteName) => {
          const noteLetter = noteName.slice(0, -1);
          const octave = noteName.slice(-1);
          const baseSolfege = noteToSolfege[noteLetter];
          const solfege =
            octave === "5" ? `${baseSolfege}₅` : baseSolfege;

          const notePositionMap = {
            C4: 66,
            D4: 62,
            E4: 58,
            F4: 54,
            G4: 50,
            A4: 46,
            B4: 42,
            C5: 38,
            D5: 34,
            E5: 30,
            F5: 26,
            G5: 22,
            A5: 18,
          };
          const noteY = notePositionMap[noteName];

          return (
            <button
              key={noteName}
              onClick={() => playNoteSound(noteName)}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-16 h-20" viewBox="0 0 60 80">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      x1="5"
                      y1={26 + i * 8}
                      x2="55"
                      y2={26 + i * 8}
                      stroke="#666"
                      strokeWidth="1"
                    />
                  ))}
                  {noteName === "C4" && (
                    <line
                      x1="20"
                      y1={66}
                      x2="40"
                      y2={66}
                      stroke="#666"
                      strokeWidth="1"
                    />
                  )}
                  {noteName === "A5" && (
                    <line
                      x1="20"
                      y1={18}
                      x2="40"
                      y2={18}
                      stroke="#666"
                      strokeWidth="1"
                    />
                  )}
                  <ellipse
                    cx="30"
                    cy={noteY}
                    rx="6"
                    ry="5"
                    fill="#333"
                    transform={`rotate(-20 30 ${noteY})`}
                  />
                  <line
                    x1="35.5"
                    y1={noteY}
                    x2="35.5"
                    y2={noteY - 25}
                    stroke="#333"
                    strokeWidth="1.5"
                  />
                </svg>

                <div className="text-center">
                  <div className="text-lg font-bold text-indigo-600">
                    {solfege}
                  </div>
                  <div className="text-xs text-gray-500">
                    ({noteName})
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-gray-700 mb-2">💡 学习提示</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 点击任意音符卡片可以听到对应的声音</li>
          <li>• 观察音符在五线谱上的位置</li>
          <li>• 记住唱名和音名的对应关系</li>
          <li>• 熟悉后可以开始练习模式</li>
        </ul>
      </div>
    </div>
  );
};

export default LearningModule;