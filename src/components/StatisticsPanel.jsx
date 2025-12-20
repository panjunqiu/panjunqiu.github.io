import React from "react";

const StatisticsPanel = ({
  showStats,
  statsView,
  setStatsView,
  practiceRecords,
  setPracticeRecords,
  currentStats,
  noteStats,
  statsViewMode,
  setStatsViewMode,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  handleSort,
}) => {
  if (!showStats) return null;

  return (
    <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h3 className="text-xl font-bold text-gray-800">数据统计</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatsView("current")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statsView === "current"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            本次练习
          </button>
          <button
            onClick={() => setStatsView("total")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statsView === "total"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            汇总统计
          </button>
          <button
            onClick={() => setStatsView("records")}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statsView === "records"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            练习记录
          </button>
        </div>
      </div>
      {statsView === "records" ? (
        <div>
          <div className="flex justify-end mb-4">
            {practiceRecords.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("确定要清空所有练习记录吗？")) {
                    setPracticeRecords([]);
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                清空记录
              </button>
            )}
          </div>

          {practiceRecords.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              暂无练习记录
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {practiceRecords.map((record) => {
                const accuracy = Math.round(
                  (record.score.correct / record.score.total) * 100
                );
                const durationText = record.duration
                  ? `${Math.floor(record.duration / 60)}分${
                      record.duration % 60
                    }秒`
                  : "自由练习";

                return (
                  <div
                    key={record.id}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-sm text-gray-600">
                          {record.date}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {durationText}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {accuracy}%
                        </div>
                        <div className="text-xs text-gray-600">
                          {record.score.correct}/{record.score.total}题
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-gray-600">总题数</div>
                        <div className="font-bold text-blue-600">
                          {record.score.total}
                        </div>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-gray-600">正确数</div>
                        <div className="font-bold text-green-600">
                          {record.score.correct}
                        </div>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-gray-600">错误数</div>
                        <div className="font-bold text-red-600">
                          {record.score.total - record.score.correct}
                        </div>
                      </div>
                      <div className="bg-white rounded p-2 text-center">
                        <div className="text-gray-600">最高连对</div>
                        <div className="font-bold text-orange-600">
                          {record.score.streak}
                        </div>
                      </div>
                    </div>

                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-semibold">
                        查看详细统计
                      </summary>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(record.stats).map(
                          ([solfege, stats]) => {
                            if (stats.total === 0) return null;
                            const noteAccuracy = Math.round(
                              (stats.correct / stats.total) * 100
                            );
                            return (
                              <div
                                key={solfege}
                                className="bg-white rounded p-2 text-xs"
                              >
                                <div className="font-semibold text-indigo-600">
                                  {solfege}
                                </div>
                                <div className="text-gray-600">
                                  {stats.correct}/{stats.total} (
                                  {noteAccuracy}%)
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </details>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex gap-2 justify-end">
            <button
              onClick={() => setStatsViewMode("card")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statsViewMode === "card"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              卡片模式
            </button>
            <button
              onClick={() => setStatsViewMode("table")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statsViewMode === "table"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              表格模式
            </button>
          </div>

          {statsViewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(
                statsView === "current" ? currentStats : noteStats
              )
                .sort((a, b) => {
                  if (sortBy === "accuracy") {
                    const accA =
                      a[1].total > 0 ? a[1].correct / a[1].total : 0;
                    const accB =
                      b[1].total > 0 ? b[1].correct / b[1].total : 0;
                    return sortOrder === "asc"
                      ? accA - accB
                      : accB - accA;
                  } else if (sortBy === "total") {
                    return sortOrder === "asc"
                      ? a[1].total - b[1].total
                      : b[1].total - a[1].total;
                  } else if (sortBy === "avgTime") {
                    const timeA =
                      a[1].total > 0 ? a[1].totalTime / a[1].total : 0;
                    const timeB =
                      b[1].total > 0 ? b[1].totalTime / b[1].total : 0;
                    return sortOrder === "asc"
                      ? timeA - timeB
                      : timeB - timeA;
                  }
                  return 0;
                })
                .map(([solfege, stats]) => {
                  const accuracy =
                    stats.total > 0
                      ? Math.round((stats.correct / stats.total) * 100)
                      : 0;
                  const avgTime =
                    stats.total > 0
                      ? (stats.totalTime / stats.total / 1000).toFixed(2)
                      : 0;

                  // 获取对应的音名
                  const noteNameMap = {
                    do: "C4",
                    re: "D4",
                    mi: "E4",
                    fa: "F4",
                    sol: "G4",
                    la: "A4",
                    si: "B4",
                    do5: "C5",
                    re5: "D5",
                    mi5: "E5",
                    fa5: "F5",
                    sol5: "G5",
                    la5: "A5",
                  };
                  const noteName = noteNameMap[solfege];

                  // 音符在五线谱上的Y坐标（基于五线谱规则）
                  // 五线谱从下到上：第一线(E4)、第二线(G4)、第三线(B4)、第四线(D5)、第五线(F5)
                  const notePositionMap = {
                    do: 66, // C4 - 下加一线
                    re: 62, // D4 - 第一线下方间
                    mi: 58, // E4 - 第一线
                    fa: 54, // F4 - 第一间
                    sol: 50, // G4 - 第二线
                    la: 46, // A4 - 第二间
                    si: 42, // B4 - 第三线
                    do5: 38, // C5 - 第三间
                    re5: 34, // D5 - 第四线
                    mi5: 30, // E5 - 第四间
                    fa5: 26, // F5 - 第五线
                    sol5: 22, // G5 - 第五线上方间
                    la5: 18, // A5 - 上加一线
                  };
                  const noteY = notePositionMap[solfege];

                  return (
                    <div
                      key={solfege}
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200"
                    >
                      <div className="flex items-start gap-3">
                        {/* 音符图像 */}
                        <div className="flex-shrink-0">
                          <svg className="w-16 h-20" viewBox="0 0 60 80">
                            {/* 五线谱 - 从上到下：F5(26), D5(34), B4(42), G4(50), E4(58) */}
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
                            {/* 下加一线 (C4/do) */}
                            {solfege === "do" && (
                              <line
                                x1="20"
                                y1={66}
                                x2="40"
                                y2={66}
                                stroke="#666"
                                strokeWidth="1"
                              />
                            )}
                            {/* 上加一线 (A5/la5) */}
                            {solfege === "la5" && (
                              <line
                                x1="20"
                                y1={18}
                                x2="40"
                                y2={18}
                                stroke="#666"
                                strokeWidth="1"
                              />
                            )}
                            {/* 音符 */}
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
                        </div>

                        {/* 统计信息 */}
                        <div className="flex-1">
                          <div className="mb-2">
                            <div className="text-xl font-bold text-indigo-600">
                              {solfege}
                            </div>
                            <div className="text-xs text-gray-500">
                              ({noteName})
                            </div>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                答题数：
                              </span>
                              <span className="font-semibold text-gray-800">
                                {stats.total}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                正确数：
                              </span>
                              <span className="font-semibold text-green-600">
                                {stats.correct}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                正确率：
                              </span>
                              <span
                                className={`font-semibold ${
                                  accuracy >= 80
                                    ? "text-green-600"
                                    : accuracy >= 60
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {accuracy}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                平均时间：
                              </span>
                              <span className="font-semibold text-blue-600">
                                {avgTime}秒
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-100 to-purple-100">
                    <th className="border border-gray-300 px-4 py-3 text-left">
                      <button
                        onClick={() => handleSort("note")}
                        className="flex items-center gap-1 font-semibold text-gray-700 hover:text-indigo-600"
                      >
                        唱名
                        {sortBy === "note" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center">
                      音符
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center">
                      <button
                        onClick={() => handleSort("total")}
                        className="flex items-center gap-1 font-semibold text-gray-700 hover:text-indigo-600 mx-auto"
                      >
                        答题数
                        {sortBy === "total" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center">
                      正确数
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center">
                      <button
                        onClick={() => handleSort("accuracy")}
                        className="flex items-center gap-1 font-semibold text-gray-700 hover:text-indigo-600 mx-auto"
                      >
                        正确率
                        {sortBy === "accuracy" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="border border-gray-300 px-4 py-3 text-center">
                      <button
                        onClick={() => handleSort("avgTime")}
                        className="flex items-center gap-1 font-semibold text-gray-700 hover:text-indigo-600 mx-auto"
                      >
                        平均时间
                        {sortBy === "avgTime" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    statsView === "current" ? currentStats : noteStats
                  )
                    .sort((a, b) => {
                      if (sortBy === "accuracy") {
                        const accA =
                          a[1].total > 0 ? a[1].correct / a[1].total : 0;
                        const accB =
                          b[1].total > 0 ? b[1].correct / b[1].total : 0;
                        return sortOrder === "asc"
                          ? accA - accB
                          : accB - accA;
                      } else if (sortBy === "total") {
                        return sortOrder === "asc"
                          ? a[1].total - b[1].total
                          : b[1].total - a[1].total;
                      } else if (sortBy === "avgTime") {
                        const timeA =
                          a[1].total > 0
                            ? a[1].totalTime / a[1].total
                            : 0;
                        const timeB =
                          b[1].total > 0
                            ? b[1].totalTime / b[1].total
                            : 0;
                        return sortOrder === "asc"
                          ? timeA - timeB
                          : timeB - timeA;
                      }
                      return 0;
                    })
                    .map(([solfege, stats]) => {
                      const accuracy =
                        stats.total > 0
                          ? Math.round(
                              (stats.correct / stats.total) * 100
                            )
                          : 0;
                      const avgTime =
                        stats.total > 0
                          ? (
                              stats.totalTime /
                              stats.total /
                              1000
                            ).toFixed(2)
                          : 0;

                      const noteNameMap = {
                        do: "C4",
                        re: "D4",
                        mi: "E4",
                        fa: "F4",
                        sol: "G4",
                        la: "A4",
                        si: "B4",
                        do5: "C5",
                        re5: "D5",
                        mi5: "E5",
                        fa5: "F5",
                        sol5: "G5",
                        la5: "A5",
                      };
                      const noteName = noteNameMap[solfege];

                      const notePositionMap = {
                        do: 66,
                        re: 62,
                        mi: 58,
                        fa: 54,
                        sol: 50,
                        la: 46,
                        si: 42,
                        do5: 38,
                        re5: 34,
                        mi5: 30,
                        fa5: 26,
                        sol5: 22,
                        la5: 18,
                      };
                      const noteY = notePositionMap[solfege];

                      return (
                        <tr
                          key={solfege}
                          className="hover:bg-blue-50 transition-colors"
                        >
                          <td className="border border-gray-300 px-4 py-3">
                            <div className="font-bold text-indigo-600">
                              {solfege}
                            </div>
                            <div className="text-xs text-gray-500">
                              ({noteName})
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-3">
                            <div className="flex justify-center">
                              <svg
                                className="w-12 h-16"
                                viewBox="0 0 60 80"
                              >
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
                                {solfege === "do" && (
                                  <line
                                    x1="20"
                                    y1={66}
                                    x2="40"
                                    y2={66}
                                    stroke="#666"
                                    strokeWidth="1"
                                  />
                                )}
                                {solfege === "la5" && (
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
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-800">
                            {stats.total}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">
                            {stats.correct}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            <span
                              className={`font-semibold ${
                                accuracy >= 80
                                  ? "text-green-600"
                                  : accuracy >= 60
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {accuracy}%
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-blue-600">
                            {avgTime}秒
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StatisticsPanel;