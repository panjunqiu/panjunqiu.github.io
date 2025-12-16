import React, { useState, useEffect } from 'react';
import MusicStaff from './components/MusicStaff';
import Piano from './components/Piano';
import ScoreBoard from './components/ScoreBoard';

const App = () => {
  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5'];
  
  // 音名到唱名的映射
  const noteToSolfege = {
    'C': 'do',
    'D': 're',
    'E': 'mi',
    'F': 'fa',
    'G': 'sol',
    'A': 'la',
    'B': 'si'
  };
  
  const [currentNote, setCurrentNote] = useState('');
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
  const [customTime, setCustomTime] = useState('');
  const [statsView, setStatsView] = useState('current'); // 'current' 或 'total'
  const [practiceRecords, setPracticeRecords] = useState([]); // 练习记录列表
  const [showRecords, setShowRecords] = useState(false);
  const [statsViewMode, setStatsViewMode] = useState('card'); // 'card' 或 'table'
  const [sortBy, setSortBy] = useState('note'); // 排序字段
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' 或 'desc'
  const [showLearning, setShowLearning] = useState(false); // 学习模块显示状态
  const [showAnswerButton, setShowAnswerButton] = useState(true); // 显示答案按钮状态
  
  // 当前练习的统计数据
  const [currentStats, setCurrentStats] = useState({
    'do': { correct: 0, total: 0, totalTime: 0 },
    're': { correct: 0, total: 0, totalTime: 0 },
    'mi': { correct: 0, total: 0, totalTime: 0 },
    'fa': { correct: 0, total: 0, totalTime: 0 },
    'sol': { correct: 0, total: 0, totalTime: 0 },
    'la': { correct: 0, total: 0, totalTime: 0 },
    'si': { correct: 0, total: 0, totalTime: 0 },
    'do5': { correct: 0, total: 0, totalTime: 0 },
    're5': { correct: 0, total: 0, totalTime: 0 },
    'mi5': { correct: 0, total: 0, totalTime: 0 },
    'fa5': { correct: 0, total: 0, totalTime: 0 },
    'sol5': { correct: 0, total: 0, totalTime: 0 },
    'la5': { correct: 0, total: 0, totalTime: 0 },
  });
  
  // 汇总统计数据
  const [noteStats, setNoteStats] = useState({
    'do': { correct: 0, total: 0, totalTime: 0 },
    're': { correct: 0, total: 0, totalTime: 0 },
    'mi': { correct: 0, total: 0, totalTime: 0 },
    'fa': { correct: 0, total: 0, totalTime: 0 },
    'sol': { correct: 0, total: 0, totalTime: 0 },
    'la': { correct: 0, total: 0, totalTime: 0 },
    'si': { correct: 0, total: 0, totalTime: 0 },
    'do5': { correct: 0, total: 0, totalTime: 0 },
    're5': { correct: 0, total: 0, totalTime: 0 },
    'mi5': { correct: 0, total: 0, totalTime: 0 },
    'fa5': { correct: 0, total: 0, totalTime: 0 },
    'sol5': { correct: 0, total: 0, totalTime: 0 },
    'la5': { correct: 0, total: 0, totalTime: 0 },
  });

  useEffect(() => {
    generateNewNote();
  }, []);

  // 定时器效果
  useEffect(() => {
    if (isTimerActive && remainingTime !== null && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            setDisabled(true);
            // 定时结束，自动保存练习记录
            if (score.total > 0) {
              const record = {
                id: Date.now(),
                date: new Date().toLocaleString('zh-CN'),
                score: score,
                stats: { ...currentStats },
                duration: timerDuration
              };
              setPracticeRecords(prev => [record, ...prev]);
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
    const solfege = octave === '5' ? `${baseSolfege}5` : baseSolfege;
    
    // 更新当前练习统计
    setCurrentStats(prev => ({
      ...prev,
      [solfege]: {
        correct: prev[solfege].correct + (correct ? 1 : 0),
        total: prev[solfege].total + 1,
        totalTime: prev[solfege].totalTime + reactionTime
      }
    }));
    
    // 更新汇总统计
    setNoteStats(prev => ({
      ...prev,
      [solfege]: {
        correct: prev[solfege].correct + (correct ? 1 : 0),
        total: prev[solfege].total + 1,
        totalTime: prev[solfege].totalTime + reactionTime
      }
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

    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
      streak: correct ? prev.streak + 1 : 0
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
        date: new Date().toLocaleString('zh-CN'),
        score: score,
        stats: { ...currentStats },
        duration: timerDuration ? timerDuration - (remainingTime || 0) : null
      };
      setPracticeRecords(prev => [record, ...prev]);
    }
    
    setScore({ correct: 0, total: 0, streak: 0 });
    setCurrentStats({
      'do': { correct: 0, total: 0, totalTime: 0 },
      're': { correct: 0, total: 0, totalTime: 0 },
      'mi': { correct: 0, total: 0, totalTime: 0 },
      'fa': { correct: 0, total: 0, totalTime: 0 },
      'sol': { correct: 0, total: 0, totalTime: 0 },
      'la': { correct: 0, total: 0, totalTime: 0 },
      'si': { correct: 0, total: 0, totalTime: 0 },
      'do5': { correct: 0, total: 0, totalTime: 0 },
      're5': { correct: 0, total: 0, totalTime: 0 },
      'mi5': { correct: 0, total: 0, totalTime: 0 },
      'fa5': { correct: 0, total: 0, totalTime: 0 },
      'sol5': { correct: 0, total: 0, totalTime: 0 },
      'la5': { correct: 0, total: 0, totalTime: 0 },
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
      setCustomTime('');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 获取音符的唱名显示
  const getNoteLabel = (noteName) => {
    const noteLetter = noteName.slice(0, -1);
    const octave = noteName.slice(-1);
    const solfege = noteToSolfege[noteLetter];
    return octave === '5' ? `${solfege}₅` : solfege;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // 播放音符声音
  const playNoteSound = (noteName) => {
    // 音符频率映射（Hz）
    const frequencies = {
      'C4': 261.63,
      'D4': 293.66,
      'E4': 329.63,
      'F4': 349.23,
      'G4': 392.00,
      'A4': 440.00,
      'B4': 493.88,
      'C5': 523.25,
      'D5': 587.33,
      'E5': 659.25,
      'F5': 698.46,
      'G5': 783.99,
      'A5': 880.00
    };

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequencies[noteName];
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            五线谱识谱练习
          </h1>
          <p className="text-gray-600">点击琴键或使用键盘快捷键识别音符</p>
        </div>

        <ScoreBoard 
          correct={score.correct} 
          total={score.total} 
          streak={score.streak}
        />

        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">识别这个音符</h2>
          </div>
          
          <MusicStaff 
            note={currentNote} 
            showFeedback={showFeedback}
            isCorrect={isCorrect}
          />
          
          {showAnswer && (
            <div className="mt-4 text-center">
              <button
                onClick={() => playNoteSound(currentNote)}
                className="inline-block bg-blue-100 border-2 border-blue-500 rounded-lg px-6 py-3 hover:bg-blue-200 hover:border-blue-600 transition-all duration-200 cursor-pointer transform hover:scale-105"
              >
                <span className="text-gray-600 text-sm">正确答案：</span>
                <span className="text-blue-600 text-2xl font-bold ml-2">
                  {getNoteLabel(currentNote)}
                </span>
              </button>
            </div>
          )}
        </div>

        <Piano onKeyPress={handleKeyPress} disabled={disabled} />

        {waitingConfirm && (
          <div className="text-center mt-6">
            <button
              onClick={handleConfirm}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              确定，下一题
            </button>
          </div>
        )}

        <div className="text-center mt-6 flex gap-4 justify-center flex-wrap">
          {!isTimerActive && (
            <button
              onClick={() => setShowTimerSettings(!showTimerSettings)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              定时练习
            </button>
          )}
          {isTimerActive && (
            <div className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full shadow-lg">
              剩余时间：{formatTime(remainingTime)}
            </div>
          )}
          <button
            onClick={handleReset}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            重新开始
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {showStats ? '隐藏数据' : '数据统计'}
          </button>
          <button
            onClick={() => setShowLearning(!showLearning)}
            className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {showLearning ? '隐藏学习' : '学习模块'}
          </button>
          {showAnswerButton && !showAnswer && (
            <button
              onClick={handleShowAnswer}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              显示答案
            </button>
          )}
        </div>

        {showLearning && (
          <div className="mt-6 bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">音符学习</h3>
            <p className="text-gray-600 text-center mb-6">点击音符卡片可以听到对应的声音</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {notes.map((noteName) => {
                const noteLetter = noteName.slice(0, -1);
                const octave = noteName.slice(-1);
                const baseSolfege = noteToSolfege[noteLetter];
                const solfege = octave === '5' ? `${baseSolfege}₅` : baseSolfege;
                
                const notePositionMap = {
                  'C4': 66,
                  'D4': 62,
                  'E4': 58,
                  'F4': 54,
                  'G4': 50,
                  'A4': 46,
                  'B4': 42,
                  'C5': 38,
                  'D5': 34,
                  'E5': 30,
                  'F5': 26,
                  'G5': 22,
                  'A5': 18
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
                        {noteName === 'C4' && (
                          <line
                            x1="20"
                            y1={66}
                            x2="40"
                            y2={66}
                            stroke="#666"
                            strokeWidth="1"
                          />
                        )}
                        {noteName === 'A5' && (
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
                        <div className="text-lg font-bold text-indigo-600">{solfege}</div>
                        <div className="text-xs text-gray-500">({noteName})</div>
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
        )}

        {showTimerSettings && (
          <div className="mt-6 bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">选择练习时长</h3>
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
        )}

        {showStats && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h3 className="text-xl font-bold text-gray-800">数据统计</h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setStatsView('current')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    statsView === 'current'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  本次练习
                </button>
                <button
                  onClick={() => setStatsView('total')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    statsView === 'total'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  汇总统计
                </button>
                <button
                  onClick={() => setStatsView('records')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    statsView === 'records'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  练习记录
                </button>
              </div>
            </div>
            {statsView === 'records' ? (
              <div>
                <div className="flex justify-end mb-4">
                  {practiceRecords.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('确定要清空所有练习记录吗？')) {
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
                      const accuracy = Math.round((record.score.correct / record.score.total) * 100);
                      const durationText = record.duration 
                        ? `${Math.floor(record.duration / 60)}分${record.duration % 60}秒`
                        : '自由练习';
                      
                      return (
                        <div key={record.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="text-sm text-gray-600">{record.date}</div>
                              <div className="text-xs text-gray-500 mt-1">{durationText}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
                              <div className="text-xs text-gray-600">
                                {record.score.correct}/{record.score.total}题
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2 text-xs">
                            <div className="bg-white rounded p-2 text-center">
                              <div className="text-gray-600">总题数</div>
                              <div className="font-bold text-blue-600">{record.score.total}</div>
                            </div>
                            <div className="bg-white rounded p-2 text-center">
                              <div className="text-gray-600">正确数</div>
                              <div className="font-bold text-green-600">{record.score.correct}</div>
                            </div>
                            <div className="bg-white rounded p-2 text-center">
                              <div className="text-gray-600">错误数</div>
                              <div className="font-bold text-red-600">{record.score.total - record.score.correct}</div>
                            </div>
                            <div className="bg-white rounded p-2 text-center">
                              <div className="text-gray-600">最高连对</div>
                              <div className="font-bold text-orange-600">{record.score.streak}</div>
                            </div>
                          </div>
                          
                          <details className="mt-3">
                            <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-semibold">
                              查看详细统计
                            </summary>
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                              {Object.entries(record.stats).map(([solfege, stats]) => {
                                if (stats.total === 0) return null;
                                const noteAccuracy = Math.round((stats.correct / stats.total) * 100);
                                return (
                                  <div key={solfege} className="bg-white rounded p-2 text-xs">
                                    <div className="font-semibold text-indigo-600">{solfege}</div>
                                    <div className="text-gray-600">
                                      {stats.correct}/{stats.total} ({noteAccuracy}%)
                                    </div>
                                  </div>
                                );
                              })}
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
                    onClick={() => setStatsViewMode('card')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      statsViewMode === 'card'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    卡片模式
                  </button>
                  <button
                    onClick={() => setStatsViewMode('table')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      statsViewMode === 'table'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    表格模式
                  </button>
                </div>

                {statsViewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(statsView === 'current' ? currentStats : noteStats)
                  .sort((a, b) => {
                    if (sortBy === 'accuracy') {
                      const accA = a[1].total > 0 ? (a[1].correct / a[1].total) : 0;
                      const accB = b[1].total > 0 ? (b[1].correct / b[1].total) : 0;
                      return sortOrder === 'asc' ? accA - accB : accB - accA;
                    } else if (sortBy === 'total') {
                      return sortOrder === 'asc' ? a[1].total - b[1].total : b[1].total - a[1].total;
                    } else if (sortBy === 'avgTime') {
                      const timeA = a[1].total > 0 ? (a[1].totalTime / a[1].total) : 0;
                      const timeB = b[1].total > 0 ? (b[1].totalTime / b[1].total) : 0;
                      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
                    }
                    return 0;
                  })
                  .map(([solfege, stats]) => {
                const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                const avgTime = stats.total > 0 ? (stats.totalTime / stats.total / 1000).toFixed(2) : 0;
                
                // 获取对应的音名
                const noteNameMap = {
                  'do': 'C4',
                  're': 'D4',
                  'mi': 'E4',
                  'fa': 'F4',
                  'sol': 'G4',
                  'la': 'A4',
                  'si': 'B4',
                  'do5': 'C5',
                  're5': 'D5',
                  'mi5': 'E5',
                  'fa5': 'F5',
                  'sol5': 'G5',
                  'la5': 'A5'
                };
                const noteName = noteNameMap[solfege];
                
                // 音符在五线谱上的Y坐标（基于五线谱规则）
                // 五线谱从下到上：第一线(E4)、第二线(G4)、第三线(B4)、第四线(D5)、第五线(F5)
                const notePositionMap = {
                  'do': 66,   // C4 - 下加一线
                  're': 62,   // D4 - 第一线下方间
                  'mi': 58,   // E4 - 第一线
                  'fa': 54,   // F4 - 第一间
                  'sol': 50,  // G4 - 第二线
                  'la': 46,   // A4 - 第二间
                  'si': 42,   // B4 - 第三线
                  'do5': 38,  // C5 - 第三间
                  're5': 34,  // D5 - 第四线
                  'mi5': 30,  // E5 - 第四间
                  'fa5': 26,  // F5 - 第五线
                  'sol5': 22, // G5 - 第五线上方间
                  'la5': 18   // A5 - 上加一线
                };
                const noteY = notePositionMap[solfege];
                
                return (
                  <div key={solfege} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
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
                          {solfege === 'do' && (
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
                          {solfege === 'la5' && (
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
                          <div className="text-xl font-bold text-indigo-600">{solfege}</div>
                          <div className="text-xs text-gray-500">({noteName})</div>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">答题数：</span>
                            <span className="font-semibold text-gray-800">{stats.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">正确数：</span>
                            <span className="font-semibold text-green-600">{stats.correct}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">正确率：</span>
                            <span className={`font-semibold ${accuracy >= 80 ? 'text-green-600' : accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {accuracy}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">平均时间：</span>
                            <span className="font-semibold text-blue-600">{avgTime}秒</span>
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
                          onClick={() => handleSort('note')}
                          className="flex items-center gap-1 font-semibold text-gray-700 hover:text-indigo-600"
                        >
                          唱名
                          {sortBy === 'note' && (
                            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </button>
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center">音符</th>
                      <th className="border border-gray-300 px-4 py-3 text-center">
                        <button
                          onClick={() => handleSort('total')}
                          className="flex items-center gap-1 font-semibold text-gray-700 hover:text-indigo-600 mx-auto"
                        >
                          答题数
                          {sortBy === 'total' && (
                            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </button>
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center">正确数</th>
                      <th className="border border-gray-300 px-4 py-3 text-center">
                        <button
                          onClick={() => handleSort('accuracy')}
                          className="flex items-center gap-1 font-semibold text-gray-700 hover:text-indigo-600 mx-auto"
                        >
                          正确率
                          {sortBy === 'accuracy' && (
                            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </button>
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-center">
                        <button
                          onClick={() => handleSort('avgTime')}
                          className="flex items-center gap-1 font-semibold text-gray-700 hover:text-indigo-600 mx-auto"
                        >
                          平均时间
                          {sortBy === 'avgTime' && (
                            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(statsView === 'current' ? currentStats : noteStats)
                      .sort((a, b) => {
                        if (sortBy === 'accuracy') {
                          const accA = a[1].total > 0 ? (a[1].correct / a[1].total) : 0;
                          const accB = b[1].total > 0 ? (b[1].correct / b[1].total) : 0;
                          return sortOrder === 'asc' ? accA - accB : accB - accA;
                        } else if (sortBy === 'total') {
                          return sortOrder === 'asc' ? a[1].total - b[1].total : b[1].total - a[1].total;
                        } else if (sortBy === 'avgTime') {
                          const timeA = a[1].total > 0 ? (a[1].totalTime / a[1].total) : 0;
                          const timeB = b[1].total > 0 ? (b[1].totalTime / b[1].total) : 0;
                          return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
                        }
                        return 0;
                      })
                      .map(([solfege, stats]) => {
                        const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                        const avgTime = stats.total > 0 ? (stats.totalTime / stats.total / 1000).toFixed(2) : 0;
                        
                        const noteNameMap = {
                          'do': 'C4',
                          're': 'D4',
                          'mi': 'E4',
                          'fa': 'F4',
                          'sol': 'G4',
                          'la': 'A4',
                          'si': 'B4',
                          'do5': 'C5',
                          're5': 'D5',
                          'mi5': 'E5',
                          'fa5': 'F5',
                          'sol5': 'G5',
                          'la5': 'A5'
                        };
                        const noteName = noteNameMap[solfege];
                        
                        const notePositionMap = {
                          'do': 66,
                          're': 62,
                          'mi': 58,
                          'fa': 54,
                          'sol': 50,
                          'la': 46,
                          'si': 42,
                          'do5': 38,
                          're5': 34,
                          'mi5': 30,
                          'fa5': 26,
                          'sol5': 22,
                          'la5': 18
                        };
                        const noteY = notePositionMap[solfege];
                        
                        return (
                          <tr key={solfege} className="hover:bg-blue-50 transition-colors">
                            <td className="border border-gray-300 px-4 py-3">
                              <div className="font-bold text-indigo-600">{solfege}</div>
                              <div className="text-xs text-gray-500">({noteName})</div>
                            </td>
                            <td className="border border-gray-300 px-4 py-3">
                              <div className="flex justify-center">
                                <svg className="w-12 h-16" viewBox="0 0 60 80">
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
                                  {solfege === 'do' && (
                                    <line
                                      x1="20"
                                      y1={66}
                                      x2="40"
                                      y2={66}
                                      stroke="#666"
                                      strokeWidth="1"
                                    />
                                  )}
                                  {solfege === 'la5' && (
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
                              <span className={`font-semibold ${
                                accuracy >= 80 ? 'text-green-600' : 
                                accuracy >= 60 ? 'text-yellow-600' : 
                                'text-red-600'
                              }`}>
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
    )}

        <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">键盘快捷键</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">A</kbd> = do</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">S</kbd> = re</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">D</kbd> = mi</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">F</kbd> = fa</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">G</kbd> = sol</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">H</kbd> = la</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">J</kbd> = si</div>
            <div><kbd className="px-2 py-1 bg-gray-100 rounded">K</kbd> = do₅</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
