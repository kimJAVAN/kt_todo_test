import React, { useState, useEffect } from 'react';
import './Calendar.css';

const Calendar = ({ todos, onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day

  // 현재 월의 첫 번째 날과 마지막 날 계산
  const getMonthStart = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const getMonthEnd = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  // 주간 뷰를 위한 날짜들 생성
  const getWeekDays = (date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day); // 일요일로 이동
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      days.push({
        date: dayDate,
        isCurrentMonth: dayDate.getMonth() === date.getMonth(),
        isToday: dayDate.toDateString() === today.toDateString()
      });
    }
    
    return days;
  };

  // 일간 뷰를 위한 날짜 생성
  const getDayView = (date) => {
    const today = new Date();
    return [{
      date: date,
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString()
    }];
  };

  // 달력에 표시할 날짜들 생성
  const getCalendarDays = (date) => {
    if (viewMode === 'week') {
      return getWeekDays(date);
    } else if (viewMode === 'day') {
      return getDayView(date);
    }
    
    // 월간 뷰 (기존 로직)
    const start = getMonthStart(date);
    const end = getMonthEnd(date);
    const startDay = start.getDay(); // 0 = 일요일
    const daysInMonth = end.getDate();
    
    const days = [];
    
    // 이전 달의 마지막 날들
    const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 0);
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // 현재 달의 날들
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(date.getFullYear(), date.getMonth(), i);
      days.push({
        date: dayDate,
        isCurrentMonth: true,
        isToday: dayDate.toDateString() === today.toDateString()
      });
    }
    
    // 다음 달의 첫 날들 (42개 셀을 채우기 위해)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth() + 1, i),
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  };

  // 특정 날짜의 할 일 개수
  const getTodosForDate = (date) => {
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate);
      return todoDate.toDateString() === date.toDateString();
    });
  };

  // 특정 날짜의 완료된 할 일 개수
  const getCompletedTodosForDate = (date) => {
    return getTodosForDate(date).filter(todo => todo.completed);
  };

  // 날짜 변경 (뷰 모드에 따라)
  const changeDate = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewMode === 'week') {
        newDate.setDate(prev.getDate() + (direction * 7));
      } else if (viewMode === 'day') {
        newDate.setDate(prev.getDate() + direction);
      } else {
        newDate.setMonth(prev.getMonth() + direction);
      }
      return newDate;
    });
  };

  // 오늘로 이동
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 날짜 선택
  const handleDateClick = (date) => {
    onDateSelect(date);
  };

  const calendarDays = getCalendarDays(currentDate);
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="calendar">
      <div className="calendar-header">
        <div className="calendar-controls">
          <button onClick={() => changeDate(-1)} className="nav-btn">
            ←
          </button>
          <h3 className="month-year">
            {viewMode === 'day' 
              ? `${currentDate.getFullYear()}년 ${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}일`
              : viewMode === 'week'
              ? `${currentDate.getFullYear()}년 ${monthNames[currentDate.getMonth()]} ${Math.ceil(currentDate.getDate() / 7)}주차`
              : `${currentDate.getFullYear()}년 ${monthNames[currentDate.getMonth()]}`
            }
          </h3>
          <button onClick={() => changeDate(1)} className="nav-btn">
            →
          </button>
        </div>
        <div className="calendar-actions">
          <button onClick={goToToday} className="today-btn">
            오늘
          </button>
          <div className="view-mode">
            <button 
              className={viewMode === 'month' ? 'active' : ''}
              onClick={() => setViewMode('month')}
            >
              월
            </button>
            <button 
              className={viewMode === 'week' ? 'active' : ''}
              onClick={() => setViewMode('week')}
            >
              주
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-grid">
        {viewMode !== 'day' && (
          <div className="day-names">
            {dayNames.map(day => (
              <div key={day} className="day-name">
                {day}
              </div>
            ))}
          </div>
        )}
        
        <div className={`calendar-days ${viewMode === 'day' ? 'day-view' : viewMode === 'week' ? 'week-view' : 'month-view'}`}>
          {calendarDays.map((day, index) => {
            const dayTodos = getTodosForDate(day.date);
            const completedTodos = getCompletedTodosForDate(day.date);
            const isSelected = selectedDate && 
              day.date.toDateString() === selectedDate.toDateString();
            
            return (
              <div
                key={index}
                className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${
                  day.isToday ? 'today' : ''
                } ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDateClick(day.date)}
              >
                <div className="day-number">
                  {day.date.getDate()}
                </div>
                {dayTodos.length > 0 && (
                  <div className="day-todos">
                    <div className="todo-indicators">
                      {dayTodos.map((todo, todoIndex) => (
                        <div
                          key={todoIndex}
                          className={`todo-dot ${todo.completed ? 'completed' : 'pending'} ${
                            todo.priority || 'none'
                          }`}
                          title={todo.text}
                        />
                      ))}
                    </div>
                    <div className="todo-count">
                      {completedTodos.length}/{dayTodos.length}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-dot high"></div>
          <span>높은 우선순위</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot medium"></div>
          <span>보통 우선순위</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot low"></div>
          <span>낮은 우선순위</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot completed"></div>
          <span>완료됨</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
