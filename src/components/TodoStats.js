import React from 'react';
import './TodoStats.css';

const TodoStats = ({ todos }) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  // 우선순위별 통계
  const priorityStats = {
    high: todos.filter(todo => todo.priority === 'high').length,
    medium: todos.filter(todo => todo.priority === 'medium').length,
    low: todos.filter(todo => todo.priority === 'low').length,
    none: todos.filter(todo => !todo.priority).length
  };

  // 카테고리별 통계
  const categoryStats = todos.reduce((acc, todo) => {
    const category = todo.category || '기타';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // 마감일 지난 할 일
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueTodos = todos.filter(todo => 
    todo.dueDate && 
    !todo.completed && 
    new Date(todo.dueDate) < today
  ).length;

  // 오늘 마감인 할 일
  const todayTodos = todos.filter(todo => 
    todo.dueDate && 
    !todo.completed && 
    new Date(todo.dueDate).toDateString() === today.toDateString()
  ).length;

  const StatCard = ({ title, value, color, icon }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
      </div>
    </div>
  );

  const ProgressBar = ({ label, current, total, color }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    
    return (
      <div className="progress-item">
        <div className="progress-label">
          <span>{label}</span>
          <span>{current}/{total}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${percentage}%`, 
              backgroundColor: color 
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="todo-stats">
      <h3>📊 할 일 통계</h3>
      
      <div className="stats-grid">
        <StatCard 
          title="전체 할 일" 
          value={totalTodos} 
          color="#3498db" 
          icon="📝" 
        />
        <StatCard 
          title="완료된 할 일" 
          value={completedTodos} 
          color="#2ecc71" 
          icon="✅" 
        />
        <StatCard 
          title="진행중인 할 일" 
          value={activeTodos} 
          color="#f39c12" 
          icon="⏳" 
        />
        <StatCard 
          title="완료율" 
          value={`${completionRate}%`} 
          color="#9b59b6" 
          icon="📈" 
        />
      </div>

      <div className="stats-section">
        <h4>우선순위별 분포</h4>
        <div className="progress-container">
          <ProgressBar 
            label="높음" 
            current={priorityStats.high} 
            total={totalTodos} 
            color="#e74c3c" 
          />
          <ProgressBar 
            label="보통" 
            current={priorityStats.medium} 
            total={totalTodos} 
            color="#f39c12" 
          />
          <ProgressBar 
            label="낮음" 
            current={priorityStats.low} 
            total={totalTodos} 
            color="#2ecc71" 
          />
          <ProgressBar 
            label="없음" 
            current={priorityStats.none} 
            total={totalTodos} 
            color="#95a5a6" 
          />
        </div>
      </div>

      <div className="stats-section">
        <h4>카테고리별 분포</h4>
        <div className="category-stats">
          {Object.entries(categoryStats).map(([category, count]) => (
            <div key={category} className="category-item">
              <span className="category-name">{category}</span>
              <span className="category-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stats-section">
        <h4>마감일 알림</h4>
        <div className="deadline-stats">
          <div className="deadline-item overdue">
            <span className="deadline-icon">⚠️</span>
            <span className="deadline-text">마감일 지남: {overdueTodos}개</span>
          </div>
          <div className="deadline-item today">
            <span className="deadline-icon">📅</span>
            <span className="deadline-text">오늘 마감: {todayTodos}개</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoStats;
