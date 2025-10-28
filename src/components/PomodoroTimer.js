import React, { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css';

const PomodoroTimer = ({ selectedTodo, onCompleteSession }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25분
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
  const [sessionCount, setSessionCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const modes = {
    work: { duration: 25 * 60, label: '집중 시간', color: '#e74c3c' },
    shortBreak: { duration: 5 * 60, label: '짧은 휴식', color: '#2ecc71' },
    longBreak: { duration: 15 * 60, label: '긴 휴식', color: '#3498db' }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    playNotificationSound();
    showNotification();
    
    if (mode === 'work') {
      setSessionCount(prev => prev + 1);
      if (sessionCount + 1 >= 4) {
        setCycles(prev => prev + 1);
        setSessionCount(0);
        setMode('longBreak');
        setTimeLeft(modes.longBreak.duration);
      } else {
        setMode('shortBreak');
        setTimeLeft(modes.shortBreak.duration);
      }
    } else {
      setMode('work');
      setTimeLeft(modes.work.duration);
    }

    if (onCompleteSession && mode === 'work') {
      onCompleteSession();
    }
  };

  const showNotification = () => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        const title = mode === 'work' ? '집중 시간 완료!' : '휴식 시간 완료!';
        const body = mode === 'work' 
          ? '잠시 휴식을 취하세요. 5분 후 다시 집중해보세요!' 
          : '휴식이 끝났습니다. 다시 집중해보세요!';
        
        new Notification(title, {
          body: body,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            showNotification();
          }
        });
      }
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(modes[mode].duration);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100;

  return (
    <div className="pomodoro-timer">
      <div className="timer-header">
        <h3>🍅 뽀모도로 타이머</h3>
        <div className="session-info">
          <span>세션: {sessionCount}/4</span>
          <span>사이클: {cycles}</span>
        </div>
      </div>

      {selectedTodo && (
        <div className="current-task">
          <strong>현재 작업:</strong> {selectedTodo.text}
        </div>
      )}

      <div className="mode-selector">
        {Object.entries(modes).map(([key, value]) => (
          <button
            key={key}
            className={`mode-btn ${mode === key ? 'active' : ''}`}
            onClick={() => switchMode(key)}
            style={{ backgroundColor: mode === key ? value.color : '#f8f9fa' }}
          >
            {value.label}
          </button>
        ))}
      </div>

      <div className="timer-display">
        <div className="timer-circle">
          <svg className="timer-svg" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e1e8ed"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={modes[mode].color}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              className="progress-circle"
            />
          </svg>
          <div className="timer-text">
            <div className="time">{formatTime(timeLeft)}</div>
            <div className="mode-label">{modes[mode].label}</div>
          </div>
        </div>
      </div>

      <div className="timer-controls">
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className={`control-btn ${isRunning ? 'pause' : 'start'}`}
        >
          {isRunning ? '⏸️ 일시정지' : '▶️ 시작'}
        </button>
        <button onClick={resetTimer} className="control-btn reset">
          🔄 리셋
        </button>
      </div>

      <div className="timer-tips">
        <h4>💡 뽀모도로 기법 팁</h4>
        <ul>
          <li>25분 집중 → 5분 휴식 (4회 반복)</li>
          <li>4번째 휴식은 15-30분으로 연장</li>
          <li>휴식 시간에는 스마트폰을 멀리하세요</li>
          <li>방해받지 않는 환경을 만드세요</li>
        </ul>
        
        {Notification.permission === 'default' && (
          <div className="notification-permission">
            <p>🔔 알림을 받으려면 권한을 허용해주세요</p>
            <button 
              onClick={requestNotificationPermission}
              className="permission-btn"
            >
              알림 권한 허용
            </button>
          </div>
        )}
        
        {Notification.permission === 'granted' && (
          <div className="notification-enabled">
            <p>✅ 알림이 활성화되었습니다</p>
          </div>
        )}
      </div>

      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" type="audio/wav" />
      </audio>
    </div>
  );
};

export default PomodoroTimer;
