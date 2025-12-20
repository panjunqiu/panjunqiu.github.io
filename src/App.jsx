import React, { useState, useEffect } from "react";
import MusicStaff from "./components/MusicStaff";
import Piano from "./components/Piano";
import ScoreBoard from "./components/ScoreBoard";
import ControlButtons from "./components/ControlButtons";
import TimerSettings from "./components/TimerSettings";
import LearningModule from "./components/LearningModule";
import StatisticsPanel from "./components/StatisticsPanel";
import KeyboardShortcuts from "./components/KeyboardShortcuts";

const App = () => {
  const notes = [
    "C4",
    "D4",
    "E4",
    "F4",
    "G4",
    "A4",
    "B4",
    "C5",
    "D5",
    "E5",
    "F5",
    "G5",
    "A5",
  ];

  // 音名到唱名的映射
  const noteToSolfege = {
    C: "do",
    D: "re",
    E: "mi",
    F: "fa",
    G: "sol",
    A: "la",
    B: "si",
  };

  const [currentNote, setCurrentNote] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0, streak: 0 });
  const [disabled, setDisabled] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [waitingConfirm, setWaitingConfirm] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [timerDuration, setTimerDuration] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  const [customTime, setCustomTime] = useState("");
  const [statsView, setStatsView] = useState("current"); // 'current' 或 'total'
  const [practiceRecords, setPracticeRecords] = useState([]); // 练习记录列表
  const [showRecords, setShowRecords] = useState(false);
  const [statsViewMode, setStatsViewMode] = useState("card"); // 'card' 或 'table'
  const [sortBy, setSortBy] = useState("note"); // 排序字段
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' 或 'desc'
  const [showLearning, setShowLearning] = useState(false); // 学习模块显示状态
  const [showAnswerButton, setShowAnswerButton] = useState(true); // 显示答案按钮状态

  // 当前练习的统计数据
  const [currentStats, setCurrentStats] = useState({
    do: { correct: 0, total: 0, totalTime: 0 },
    re: { correct: 0, total: 0, totalTime: 0 },
    mi: { correct: 0, total: 0, totalTime: 0 },
    fa: { correct: 0, total: 0, totalTime: 0 },
    sol: { correct: 0, total: 0, totalTime: 0 },
    la: { correct: 0, total: 0, totalTime: 0 },
    si: { correct: 0, total: 0, totalTime: 0 },
    do5: { correct: 0, total: 0, totalTime: 0 },
    re5: { correct: 0, total: 0, totalTime: 0 },
    mi5: { correct: 0, total: 0, totalTime: 0 },
    fa5: { correct: 0, total: 0, totalTime: 0 },
    sol5: { correct: 0, total: 0, totalTime: 0 },
    la5: { correct: 0, total: 0, totalTime: 0 },
  });

  // 汇总统计数据
  const [noteStats, setNoteStats] = useState({
    do: { correct: 0, total: 0, totalTime: 0 },
    re: { correct: 0, total: 0, totalTime: 0 },
    mi: { correct: 0, total: 0, totalTime: 0 },
    fa: { correct: 0, total: 0, totalTime: 0 },
    sol: { correct: 0, total: 0, totalTime: 0 },
    la: { correct: 0, total: 0, totalTime: 0 },
    si: { correct: 0, total: 0, totalTime: 0 },
    do5: { correct: 0, total: 0, totalTime: 0 },
    re5: { correct: 0, total: 0, totalTime: 0 },
    mi5: { correct: 0, total: 0, totalTime: 0 },
    fa5: { correct: 0, total: 0, totalTime: 0 },
    sol5: { correct: 0, total: 0, totalTime: 0 },
    la5: { correct: 0, total: 0, totalTime: 0 },
  });

  useEffect(() => {
    generateNewNote();
  }, []);

  // 定时器效果
  useEffect(() => {
    if (isTimerActive && remainingTime !== null && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            setDisabled(true);
            // 定时结束，自动保存练习记录
            if (score.total > 0) {
              const record = {
                id: Date.now(),
                date: new Date().toLocaleString("zh-CN"),
                score: score,
                stats: { ...currentStats },
                duration: timerDuration,
              };
              setPracticeRecords((prev) => [record, ...prev]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTimerActive, remainingTime, score, currentStats, timerDuration]);

  const generateNewNote = () => {
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    setCurrentNote(randomNote);
    setShowFeedback(false);
    setDisabled(false);
    setShowAnswer(false);
    setWaitingConfirm(false);
    setShowAnswerButton(true);
    setStartTime(Date.now());
  };

  const handleKeyPress = (pressedNote) => {
    if (disabled) return;

    const correct = pressedNote === currentNote;
    const reactionTime = Date.now() - startTime;

    // 播放按下的音符声音
    playNoteSound(pressedNote);

    // 获取当前音符的唱名
    const noteLetter = currentNote.slice(0, -1);
    const octave = currentNote.slice(-1);
    const baseSolfege = noteToSolfege[noteLetter];
    const solfege = octave === "5" ? `${baseSolfege}5` : baseSolfege;

    // 更新当前练习统计
    setCurrentStats((prev) => ({
      ...prev,
      [solfege]: {
        correct: prev[solfege].correct + (correct ? 1 : 0),
        total: prev[solfege].total + 1,
        totalTime: prev[solfege].totalTime + reactionTime,
      },
    }));

    // 更新汇总统计
    setNoteStats((prev) => ({
      ...prev,
      [solfege]: {
        correct: prev[solfege].correct + (correct ? 1 : 0),
        total: prev[solfege].total + 1,
        totalTime: prev[solfege].totalTime + reactionTime,
      },
    }));

    setIsCorrect(correct);
    setShowFeedback(true);
    setDisabled(true);

    // 如果答错，显示正确答案并等待确认
    if (!correct) {
      setShowAnswer(true);
      setWaitingConfirm(true);
    } else {
      // 如果答对，0.5秒后自动进入下一题
      setTimeout(() => {
        generateNewNote();
      }, 500);
    }

    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
      streak: correct ? prev.streak + 1 : 0,
    }));
  };

  const handleConfirm = () => {
    generateNewNote();
  };

  const handleReset = () => {
    // 保存当前练习记录
    if (score.total > 0) {
      const record = {
        id: Date.now(),
        date: new Date().toLocaleString("zh-CN"),
        score: score,
        stats: { ...currentStats },
        duration: timerDuration ? timerDuration - (remainingTime || 0) : null,
      };
      setPracticeRecords((prev) => [record, ...prev]);
    }

    setScore({ correct: 0, total: 0, streak: 0 });
    setCurrentStats({
      do: { correct: 0, total: 0, totalTime: 0 },
      re: { correct: 0, total: 0, totalTime: 0 },
      mi: { correct: 0, total: 0, totalTime: 0 },
      fa: { correct: 0, total: 0, totalTime: 0 },
      sol: { correct: 0, total: 0, totalTime: 0 },
      la: { correct: 0, total: 0, totalTime: 0 },
      si: { correct: 0, total: 0, totalTime: 0 },
      do5: { correct: 0, total: 0, totalTime: 0 },
      re5: { correct: 0, total: 0, totalTime: 0 },
      mi5: { correct: 0, total: 0, totalTime: 0 },
      fa5: { correct: 0, total: 0, totalTime: 0 },
      sol5: { correct: 0, total: 0, totalTime: 0 },
      la5: { correct: 0, total: 0, totalTime: 0 },
    });
    setTimerDuration(null);
    setRemainingTime(null);
    setIsTimerActive(false);
    generateNewNote();
  };

  const startTimer = (minutes) => {
    const seconds = minutes * 60;
    setTimerDuration(seconds);
    setRemainingTime(seconds);
    setIsTimerActive(true);
    setShowTimerSettings(false);
    generateNewNote();
  };

  const handleCustomTimer = () => {
    const minutes = parseInt(customTime);
    if (minutes > 0 && minutes <= 120) {
      startTimer(minutes);
      setCustomTime("");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // 获取音符的唱名显示
  const getNoteLabel = (noteName) => {
    const noteLetter = noteName.slice(0, -1);
    const octave = noteName.slice(-1);
    const solfege = noteToSolfege[noteLetter];
    return octave === "5" ? `${solfege}₅` : solfege;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // 播放音符声音
  const playNoteSound = (noteName) => {
    // 音符频率映射（Hz）
    const frequencies = {
      C4: 261.63,
      D4: 293.66,
      E4: 329.63,
      F4: 349.23,
      G4: 392.0,
      A4: 440.0,
      B4: 493.88,
      C5: 523.25,
      D5: 587.33,
      E5: 659.25,
      F5: 698.46,
      G5: 783.99,
      A5: 880.0,
    };

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequencies[noteName];
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
  };

  // 显示答案并播放声音
  const handleShowAnswer = () => {
    setShowAnswer(true);
    setShowAnswerButton(false);
    playNoteSound(currentNote);
  };

  return (
    <div className="h-screen sm:min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-2 sm:py-8 px-0 sm:px-4 overflow-y-auto">
      <div className="sm:max-w-4xl mx-auto px-1 sm:px-0 h-full sm:h-auto flex flex-col sm:block">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            五线谱识谱练习
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            <span className="sm:hidden">点击琴键识别音符</span>
            <span className="hidden sm:inline">
              点击琴键或使用键盘快捷键识别音符
            </span>
          </p>
        </div>

        <ScoreBoard
          correct={score.correct}
          total={score.total}
          streak={score.streak}
        />

        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 mb-4 sm:mb-6">
          <div className="mb-2 sm:mb-4 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
              识别这个音符
            </h2>
          </div>

          <div className="relative">
            <MusicStaff
              note={currentNote}
              showFeedback={showFeedback}
              isCorrect={isCorrect}
            />

            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 flex gap-2 sm:gap-4 items-center">
              {showAnswerButton && !showAnswer && (
                <button
                  onClick={handleShowAnswer}
                  className="px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
                >
                  显示答案
                </button>
              )}
              {showAnswer && (
                <>
                  {waitingConfirm ||
                    (showAnswer && (
                      <button
                        onClick={handleConfirm}
                        className="px-4 sm:px-6 py-1 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
                      >
                        下一题
                      </button>
                    ))}
                  <button
                    onClick={() => playNoteSound(currentNote)}
                    className="inline-block bg-blue-100 border-2 border-blue-500 rounded-lg px-2 sm:px-4 py-1 sm:py-2 hover:bg-blue-200 hover:border-blue-600 transition-all duration-200 cursor-pointer transform hover:scale-105 text-sm sm:text-base"
                  >
                    <span className="text-gray-600 text-xs">正确答案：</span>
                    <span className="text-blue-600 text-sm sm:text-lg font-bold ml-1">
                      {getNoteLabel(currentNote)}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <Piano onKeyPress={handleKeyPress} disabled={disabled} />

        <ControlButtons
          isTimerActive={isTimerActive}
          showTimerSettings={showTimerSettings}
          setShowTimerSettings={setShowTimerSettings}
          setShowStats={setShowStats}
          setShowLearning={setShowLearning}
          showStats={showStats}
          showLearning={showLearning}
          handleReset={handleReset}
          remainingTime={remainingTime}
          formatTime={formatTime}
        />

        <LearningModule
          showLearning={showLearning}
          notes={notes}
          noteToSolfege={noteToSolfege}
          playNoteSound={playNoteSound}
        />

        <TimerSettings
          showTimerSettings={showTimerSettings}
          startTimer={startTimer}
          customTime={customTime}
          setCustomTime={setCustomTime}
          handleCustomTimer={handleCustomTimer}
        />

        <StatisticsPanel
          showStats={showStats}
          statsView={statsView}
          setStatsView={setStatsView}
          practiceRecords={practiceRecords}
          setPracticeRecords={setPracticeRecords}
          currentStats={currentStats}
          noteStats={noteStats}
          statsViewMode={statsViewMode}
          setStatsViewMode={setStatsViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          handleSort={handleSort}
        />

        <KeyboardShortcuts />
      </div>
    </div>
  );
};

export default App;
