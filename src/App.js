import React, { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getSelectedDateKey = () => {
    return formatDate(selectedDate);
  };

  const getCurrentTodos = () => {
    const dateKey = getSelectedDateKey();
    return todos[dateKey] || [];
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      const dateKey = getSelectedDateKey();
      const currentTodos = todos[dateKey] || [];
      const newTodo = { text: inputValue, completed: false, id: Date.now() };
      
      setTodos({
        ...todos,
        [dateKey]: [...currentTodos, newTodo]
      });
      setInputValue('');
    }
  };

  const handleDeleteTodo = (todoId) => {
    const dateKey = getSelectedDateKey();
    const currentTodos = todos[dateKey] || [];
    const updatedTodos = currentTodos.filter(todo => todo.id !== todoId);
    
    setTodos({
      ...todos,
      [dateKey]: updatedTodos
    });
  };

  const handleToggleTodo = (todoId) => {
    const dateKey = getSelectedDateKey();
    const currentTodos = todos[dateKey] || [];
    const updatedTodos = currentTodos.map(todo => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    
    setTodos({
      ...todos,
      [dateKey]: updatedTodos
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateKey = formatDate(date);
      const dayTodos = todos[dateKey] || [];
      const hasTodos = dayTodos.length > 0;
      const isToday = formatDate(date) === formatDate(today);
      const isSelected = formatDate(date) === formatDate(selectedDate);
      const isCurrentMonth = date.getMonth() === month;

      days.push(
        <div
          key={i}
          className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasTodos ? 'has-todos' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          <span className="day-number">{date.getDate()}</span>
          {hasTodos && <div className="todo-indicator"></div>}
        </div>
      );
    }

    return days;
  };

  const getMonthName = () => {
    return currentMonth.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="App">
      <h1>달력 Todo App</h1>
      
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={handlePrevMonth}>←</button>
          <h2>{getMonthName()}</h2>
          <button onClick={handleNextMonth}>→</button>
        </div>
        {/* 요일 */}
        <div className="calendar-weekdays">
          <div>일</div>
          <div>월</div>
          <div>화</div>
          <div>수</div>
          <div>목</div>
          <div>금</div>
          <div>토</div>
        </div>
        
        <div className="calendar-grid">
          {renderCalendar()}
        </div>
      </div>

      <div className="todo-section">
        <h3>{selectedDate.toLocaleDateString('ko-KR', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          weekday: 'long'
        })}</h3>
        
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="할 일을 입력하세요"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <button onClick={handleAddTodo}>추가</button>
        </div>
        
        <ul className="todo-list">
          {getCurrentTodos().map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <span onClick={() => handleToggleTodo(todo.id)}>{todo.text}</span>
              <button onClick={() => handleDeleteTodo(todo.id)}>삭제</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;