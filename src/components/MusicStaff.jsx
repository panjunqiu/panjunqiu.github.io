import React from 'react';

const MusicStaff = ({ note, showFeedback, isCorrect }) => {
  const staffHeight = 200;
  const staffWidth = 400;
  const lineSpacing = 20;
  const startY = 60;
  const leftMargin = 20;  // 更小的左边距
  const rightMargin = 20; // 保持右边距对称

  // 音符位置映射 (从下往上，五线谱从下到上是 E4-F5)
  const notePositions = {
    'C4': startY + lineSpacing * 5,    // 下加一线
    'D4': startY + lineSpacing * 4.5,  // 第一线下方间
    'E4': startY + lineSpacing * 4,    // 第一线 (最下面的线)
    'F4': startY + lineSpacing * 3.5,  // 第一间
    'G4': startY + lineSpacing * 3,    // 第二线
    'A4': startY + lineSpacing * 2.5,  // 第二间
    'B4': startY + lineSpacing * 2,    // 第三线 (中间线)
    'C5': startY + lineSpacing * 1.5,  // 第三间
    'D5': startY + lineSpacing * 1,    // 第四线
    'E5': startY + lineSpacing * 0.5,  // 第四间
    'F5': startY + lineSpacing * 0,    // 第五线 (最上面的线)
    'G5': startY - lineSpacing * 0.5,  // 第五线上方间
    'A5': startY - lineSpacing * 1,    // 上加一线
  };

  const noteY = notePositions[note];
  const noteX = staffWidth / 2;

  return (
    <div className="relative flex justify-center">
      <svg
        width={staffWidth}
        height={staffHeight}
        className="max-w-full h-auto"
        viewBox={`0 0 ${staffWidth} ${staffHeight}`}
      >
        {/* 五线谱 */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={leftMargin}
            y1={startY + i * lineSpacing}
            x2={staffWidth - rightMargin}
            y2={startY + i * lineSpacing}
            className="staff-line"
          />
        ))}

        {/* 高音谱号 (简化版) */}
        <text x={leftMargin + 8} y={startY + lineSpacing * 2 + 10} fontSize="48" fontFamily="serif">
          𝄞
        </text>

        {/* 下加一线 (C4) - 音符头上方的横线 */}
        {['C4'].includes(note) && (
          <line
            x1={noteX - 12}
            y1={noteY}
            x2={noteX + 12}
            y2={noteY}
            className="staff-line"
          />
        )}

        {/* 上加一线 (A5) */}
        {['A5'].includes(note) && (
          <line
            x1={noteX - 15}
            y1={startY - lineSpacing * 1}
            x2={noteX + 15}
            y2={startY - lineSpacing * 1}
            className="staff-line"
          />
        )}

        {/* 音符 */}
        <ellipse
          cx={noteX}
          cy={noteY}
          rx="10"
          ry="8"
          className="note-head"
          transform={`rotate(-20 ${noteX} ${noteY})`}
        />
        
        {/* 符干 */}
        <line
          x1={noteX + 9}
          y1={noteY}
          x2={noteX + 9}
          y2={noteY - 35}
          className="note-stem"
        />
      </svg>

      {/* 反馈提示 */}
      {showFeedback && (
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold ${
          isCorrect ? 'text-green-500' : 'text-red-500'
        }`}>
          {isCorrect ? '✓' : '✗'}
        </div>
      )}
    </div>
  );
};

export default MusicStaff;
