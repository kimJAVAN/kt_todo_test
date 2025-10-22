import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import TodoFilter from './components/TodoFilter';
import TodoStats from './components/TodoStats';
import useLocalStorage from './hooks/useLocalStorage';
import { filterTodos, sortTodos, exportTodos, exportTodosAsText, importTodos } from './utils/todoUtils';
import './AdvancedTodoApp.css';

const AdvancedTodoApp = () => {
  const [todos, setTodos] = useLocalStorage('advanced-todos', []);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created');
  const [showStats, setShowStats] = useState(true);

  // 필터링 및 정렬된 할 일 목록
  const filteredAndSortedTodos = sortTodos(filterTodos(todos, filter, searchTerm), sortBy);

  // 할 일 추가
  const handleAddTodo = (todoData) => {
    const newTodo = {
      ...todoData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  // 할 일 수정
  const handleUpdateTodo = (index, updatedTodo) => {
    setTodos(prev => prev.map((todo, i) => 
      i === index ? { ...todo, ...updatedTodo } : todo
    ));
    setEditingTodo(null);
  };

  // 할 일 삭제
  const handleDeleteTodo = (index) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
  };

  // 할 일 완료 토글
  const handleToggleTodo = (index) => {
    setTodos(prev => prev.map((todo, i) => 
      i === index ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 우선순위 변경
  const handlePriorityChange = (index, priority) => {
    setTodos(prev => prev.map((todo, i) => 
      i === index ? { ...todo, priority: priority === 'none' ? null : priority } : todo
    ));
  };

  // 할 일 편집 시작
  const handleEditTodo = (index) => {
    setEditingTodo({ ...todos[index], index });
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  // 모든 할 일 삭제
  const handleClearAll = () => {
    if (window.confirm('모든 할 일을 삭제하시겠습니까?')) {
      setTodos([]);
    }
  };

  // 완료된 할 일 삭제
  const handleClearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  // 할 일 내보내기
  const handleExport = () => {
    exportTodos(todos);
  };

  // 할 일 텍스트로 내보내기
  const handleExportAsText = () => {
    exportTodosAsText(todos);
  };

  // 할 일 가져오기
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      importTodos(file)
        .then(importedTodos => {
          if (window.confirm(`${importedTodos.length}개의 할 일을 가져오시겠습니까?`)) {
            setTodos(prev => [...importedTodos, ...prev]);
          }
        })
        .catch(error => {
          alert(error.message);
        });
      event.target.value = ''; // 파일 입력 초기화
    }
  };

  return (
    <div className="advanced-todo-app">
      <header className="app-header">
        <h1>🚀 고급 할 일 관리</h1>
        <p>우선순위, 카테고리, 마감일로 체계적으로 관리하세요</p>
      </header>

      <div className="app-controls">
        <div className="control-group">
          <button 
            onClick={() => setShowStats(!showStats)}
            className={`toggle-btn ${showStats ? 'active' : ''}`}
          >
            📊 통계 {showStats ? '숨기기' : '보기'}
          </button>
        </div>

        <div className="control-group">
          <button onClick={handleExport} className="action-btn">
            📤 JSON 내보내기
          </button>
          <button onClick={handleExportAsText} className="action-btn">
            📄 텍스트 내보내기
          </button>
          <label className="import-btn">
            📥 가져오기
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div className="control-group">
          <button onClick={handleClearCompleted} className="danger-btn">
            🗑️ 완료된 할 일 삭제
          </button>
          <button onClick={handleClearAll} className="danger-btn">
            ⚠️ 전체 삭제
          </button>
        </div>
      </div>

      {showStats && <TodoStats todos={todos} />}

      <TodoForm
        onAddTodo={handleAddTodo}
        editingTodo={editingTodo}
        onUpdateTodo={handleUpdateTodo}
        onCancelEdit={handleCancelEdit}
      />

      <TodoFilter
        filter={filter}
        onFilterChange={setFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="todo-list-container">
        <div className="todo-list-header">
          <h3>
            할 일 목록 
            <span className="todo-count">
              ({filteredAndSortedTodos.length}개)
            </span>
          </h3>
        </div>

        {filteredAndSortedTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h4>할 일이 없습니다</h4>
            <p>
              {searchTerm || filter !== 'all' 
                ? '검색 조건에 맞는 할 일이 없습니다.' 
                : '새로운 할 일을 추가해보세요!'
              }
            </p>
          </div>
        ) : (
          <ul className="todo-list">
            {filteredAndSortedTodos.map((todo, index) => (
              <TodoItem
                key={todo.id || index}
                todo={todo}
                index={index}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onEdit={handleEditTodo}
                onPriorityChange={handlePriorityChange}
              />
            ))}
          </ul>
        )}
      </div>

      <footer className="app-footer">
        <p>💡 팁: 우선순위를 설정하고 카테고리로 분류하여 효율적으로 관리하세요!</p>
      </footer>
    </div>
  );
};

export default AdvancedTodoApp;
